export type ImageLibraryFolder = 'hero' | 'logo' | 'team' | 'portfolio'

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

/** Fix legacy Supabase URLs that used the old `images` bucket id. */
export function normalizeStoragePublicUrl(url: string | null | undefined): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  return trimmed.replace(
    /\/storage\/v1\/object\/public\/images\/(team|hero|logo|portfolio)\//gi,
    (_, folder: string) => {
      const f = folder.toLowerCase()
      return `/storage/v1/object/public/${storageBucketForFolder(f)}/${f}/`
    }
  )
}
