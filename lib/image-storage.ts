export type ImageLibraryFolder = 'hero' | 'logo' | 'team' | 'portfolio'

const STORAGE_PUBLIC_PATH = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/i
const LEGACY_FOLDER_PREFIX = /\/storage\/v1\/object\/public\/images\/(team|hero|logo|portfolio)\//gi

/** Supabase Storage bucket ids (see supabase/migrations/008_storage_buckets.sql) */
export function storageBucketForFolder(folder: string): string {
  switch (folder) {
    case 'hero':
      return 'hero-images'
    case 'logo':
      return 'logos'
    case 'team':
      return 'team-photos'
    case 'portfolio':
      return 'portfolio'
    default:
      // services, grid, pillars, uploads, etc.
      return 'portfolio'
  }
}

/** Folder value stored in the `images` table (CHECK constraint allows these four). */
export function libraryFolderForPath(folder: string): ImageLibraryFolder {
  if (folder === 'hero') return 'hero'
  if (folder === 'logo') return 'logo'
  if (folder === 'team') return 'team'
  return 'portfolio'
}

export function resolveStorageBucket(bucket: string | undefined, folder: string): string {
  if (bucket && bucket !== 'images') return bucket
  return storageBucketForFolder(folder)
}

function withStorageBucket(url: string, bucket: string): string {
  return url.replace(/\/storage\/v1\/object\/public\/[^/]+/i, `/storage/v1/object/public/${bucket}`)
}

/** Fix legacy Supabase URLs that used the old `images` bucket id. */
export function normalizeStoragePublicUrl(url: string | null | undefined): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  return trimmed.replace(LEGACY_FOLDER_PREFIX, (_, folder: string) => {
    const f = folder.toLowerCase()
    return `/storage/v1/object/public/${storageBucketForFolder(f)}/${f}/`
  })
}

/**
 * Ordered URL candidates for a stored image — tries the saved URL, normalized paths,
 * and legacy `images` bucket locations so uploads survive bucket migrations.
 */
export function storageUrlCandidates(url: string | null | undefined): string[] {
  if (!url?.trim()) return []

  const seen = new Set<string>()
  const out: string[] = []
  const add = (candidate: string) => {
    const trimmed = candidate.trim()
    if (!trimmed || seen.has(trimmed)) return
    seen.add(trimmed)
    out.push(trimmed)
  }

  const original = url.trim()
  add(original)
  add(normalizeStoragePublicUrl(original))

  for (const candidate of [...out]) {
    const match = candidate.match(STORAGE_PUBLIC_PATH)
    if (!match) continue

    const [, bucket, objectPath] = match
    const folder = objectPath.split('/')[0]?.toLowerCase()
    const folderBucket =
      folder && ['team', 'hero', 'logo', 'portfolio'].includes(folder)
        ? storageBucketForFolder(folder)
        : null

    add(withStorageBucket(candidate, 'images'))

    if (folderBucket) {
      add(withStorageBucket(candidate, folderBucket))
      if (folderBucket !== bucket) {
        add(withStorageBucket(candidate, folderBucket).replace(
          `/public/${folderBucket}/${folder}/`,
          `/public/images/${folder}/`
        ))
      }
    }

    if (bucket !== 'images' && folder && objectPath.startsWith(`${folder}/`)) {
      const flatPath = objectPath.slice(folder.length + 1)
      if (flatPath) {
        add(withStorageBucket(candidate, bucket).replace(objectPath, flatPath))
        add(withStorageBucket(candidate, 'images').replace(objectPath, `${folder}/${flatPath}`))
      }
    }
  }

  return out
}

export function resolvePortraitImageUrl(data: Record<string, unknown>): string | undefined {
  const raw = data.portraitImageUrl ?? data.portrait_image_url ?? data.portrait ?? ''
  const value = String(raw).trim()
  return value || undefined
}

export function resolveMemberPhotoUrl(member: Record<string, unknown>): string | undefined {
  const raw = member.photoUrl ?? member.photo_url ?? member.imageUrl ?? member.image_url ?? ''
  const value = String(raw).trim()
  return value || undefined
}
