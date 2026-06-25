'use server'

import { createAdminClient } from '@/lib/supabase/admin'

const REQUIRED_BUCKETS = ['hero-images', 'logos', 'team-photos', 'portfolio', 'images'] as const

export type EnsureBucketsResult = {
  ok: boolean
  created: string[]
  existing: string[]
  message: string
}

export async function ensureStorageBuckets(): Promise<EnsureBucketsResult> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return {
      ok: false,
      created: [],
      existing: [],
      message:
        'SUPABASE_SERVICE_ROLE_KEY is not set. Run supabase/fix_storage_buckets.sql in the Supabase SQL Editor instead.',
    }
  }

  const supabase = createAdminClient()
  const { data: listed, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    return {
      ok: false,
      created: [],
      existing: [],
      message: `Could not list buckets: ${listError.message}`,
    }
  }

  const existingIds = new Set((listed ?? []).map((b) => b.id))
  const created: string[] = []
  const existing: string[] = []

  for (const id of REQUIRED_BUCKETS) {
    if (existingIds.has(id)) {
      existing.push(id)
      continue
    }
    const { error } = await supabase.storage.createBucket(id, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
    })
    if (error) {
      if (/already exists/i.test(error.message)) {
        existing.push(id)
        continue
      }
      return {
        ok: false,
        created,
        existing: [...existing],
        message: `Failed to create bucket "${id}": ${error.message}. Run supabase/fix_storage_buckets.sql in Supabase SQL Editor.`,
      }
    }
    created.push(id)
  }

  return {
    ok: true,
    created,
    existing,
    message:
      created.length > 0
        ? `Created buckets: ${created.join(', ')}. If public images still 404, run supabase/fix_storage_buckets.sql for read policies.`
        : 'All storage buckets exist. If images still 404, run supabase/fix_storage_buckets.sql in Supabase SQL Editor.',
  }
}
