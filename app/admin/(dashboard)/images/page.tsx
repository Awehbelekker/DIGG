'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Image } from '@/lib/types/database'
import ImageUpload from '@/components/admin/ImageUpload'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import { showToast } from '@/components/admin/Toast'
import AdminSafeLink from '@/components/admin/AdminSafeLink'
import { useRegisterAdminNavUnsaved } from '@/components/admin/AdminUnsavedProvider'
import { useUnsavedChangesAlert } from '@/lib/hooks/useUnsavedChangesAlert'

const FOLDERS = ['hero', 'logo', 'team', 'portfolio'] as const
type Folder = (typeof FOLDERS)[number]

export default function AdminImagesPage() {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<'idle' | 'delete' | 'folder' | 'alt'>('idle')
  const [bulkFolder, setBulkFolder] = useState<Folder>('portfolio')
  const [bulkAlt, setBulkAlt] = useState('')
  const supabase = createClient()

  const bulkFormDirty = useMemo(
    () => selectedIds.size > 0 && (bulkAction === 'folder' || bulkAction === 'alt' || bulkAlt.trim() !== ''),
    [selectedIds, bulkAction, bulkAlt]
  )
  useRegisterAdminNavUnsaved(bulkFormDirty)
  useUnsavedChangesAlert(
    bulkFormDirty,
    'You have a bulk action in progress or alt text not applied. Leave without finishing?'
  )

  const loadImages = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('images').select('*').order('created_at', { ascending: false })
    if (selectedFolder !== 'all') query = query.eq('folder', selectedFolder)
    const { data, error } = await query
    if (error) console.error('Error loading images:', error)
    else setImages((data as Image[]) || [])
    setLoading(false)
  }, [selectedFolder, supabase])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selectedIds.size === images.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(images.map((i) => i.id)))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    const { error } = await supabase.from('images').delete().eq('id', id)
    if (error) showToast('Error deleting image: ' + error.message, 'error')
    else loadImages()
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Delete ${selectedIds.size} image(s)? This cannot be undone.`)) return
    const ids = Array.from(selectedIds)
    const { error } = await supabase.from('images').delete().in('id', ids)
    if (error) showToast('Error: ' + error.message, 'error')
    else {
      setSelectedIds(new Set())
      loadImages()
    }
  }

  const handleBulkSetFolder = async () => {
    if (selectedIds.size === 0) return
    const ids = Array.from(selectedIds)
    const { error } = await supabase.from('images').update({ folder: bulkFolder }).in('id', ids)
    if (error) showToast('Error: ' + error.message, 'error')
    else {
      setSelectedIds(new Set())
      setBulkAction('idle')
      loadImages()
    }
  }

  const handleBulkSetAlt = async () => {
    if (selectedIds.size === 0) return
    const ids = Array.from(selectedIds)
    const { error } = await supabase.from('images').update({ alt_text: bulkAlt || null }).in('id', ids)
    if (error) showToast('Error: ' + error.message, 'error')
    else {
      setSelectedIds(new Set())
      setBulkAction('idle')
      setBulkAlt('')
      loadImages()
    }
  }

  const folders = ['all', ...FOLDERS]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading className="mb-8" subtitle="Upload and manage hero, logo, team, and portfolio images.">
        <span className="inline-flex items-center gap-2 flex-wrap">
          Image Management
          {bulkFormDirty && (
            <span className="text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
              Unfinished bulk action
            </span>
          )}
        </span>
      </AdminPageHeading>

      <div className="mb-6 flex flex-wrap gap-2">
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedFolder === folder ? 'bg-[#F7941D] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {folder.charAt(0).toUpperCase() + folder.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <ImageUpload onUpload={loadImages} />
      </div>

      {images.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={selectedIds.size === images.length && images.length > 0} onChange={selectAll} className="rounded border-gray-300" />
            <span className="text-sm font-medium">Select all</span>
          </label>
          {selectedIds.size > 0 && (
            <>
              <span className="text-sm text-gray-500">{selectedIds.size} selected</span>
              <button type="button" onClick={handleBulkDelete} className="text-sm px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700">
                Bulk delete
              </button>
              <button type="button" onClick={() => setBulkAction(bulkAction === 'folder' ? 'idle' : 'folder')} className="text-sm px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50">
                Set folder
              </button>
              <button type="button" onClick={() => setBulkAction(bulkAction === 'alt' ? 'idle' : 'alt')} className="text-sm px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50">
                Set alt text
              </button>
            </>
          )}
          {bulkAction === 'folder' && selectedIds.size > 0 && (
            <span className="flex items-center gap-2">
              <select value={bulkFolder} onChange={(e) => setBulkFolder(e.target.value as Folder)} className="text-sm border border-gray-300 rounded px-2 py-1">
                {FOLDERS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <button type="button" onClick={handleBulkSetFolder} className="text-sm px-3 py-1.5 rounded bg-[#F7941D] text-white hover:bg-[#e6850a]">Apply</button>
            </span>
          )}
          {bulkAction === 'alt' && selectedIds.size > 0 && (
            <span className="flex items-center gap-2">
              <input type="text" placeholder="Alt text" value={bulkAlt} onChange={(e) => setBulkAlt(e.target.value)} className="text-sm border border-gray-300 rounded px-2 py-1 min-w-[160px]" />
              <button type="button" onClick={handleBulkSetAlt} className="text-sm px-3 py-1.5 rounded bg-[#F7941D] text-white hover:bg-[#e6850a]">Apply</button>
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading images...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img src={image.url} alt={image.alt_text || image.filename} className="w-full h-48 object-cover" />
                <label className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/95 rounded px-2 py-1 shadow cursor-pointer">
                  <input type="checkbox" checked={selectedIds.has(image.id)} onChange={() => toggleSelect(image.id)} className="rounded border-gray-300" />
                  <span className="text-xs font-medium text-gray-700">Select</span>
                </label>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900 truncate">{image.filename}</p>
                <p className="text-xs text-gray-500 mt-1">{image.folder}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AdminSafeLink href={image.url} openInNewTab className="flex-1 min-w-0 text-center text-xs bg-[#5BC8E8] text-[#1B2A6B] px-3 py-1.5 rounded-lg hover:bg-[#4ab8d8] transition-colors">View</AdminSafeLink>
                  <button type="button" onClick={() => { navigator.clipboard.writeText(image.url); showToast('URL copied!'); }} className="flex-1 min-w-0 text-center text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">Copy URL</button>
                  <button onClick={() => handleDelete(image.id)} className="flex-1 min-w-0 text-center text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">No images found</p>
        </div>
      )}
    </div>
  )
}
