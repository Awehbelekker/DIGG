'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/components/admin/Toast'
import type { Page, PageSection } from '@/lib/types/database'
import useHistory from '@/hooks/useHistory'
import EditorTopBar, { type DeviceMode } from './EditorTopBar'
import SettingsDrawer from './SettingsDrawer'
import LivePreview from './LivePreview'

interface PageEditorProps {
  page?: Page
}

export default function PageEditor({ page }: PageEditorProps) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [device, setDevice] = useState<DeviceMode>('desktop')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [title, setTitle] = useState(page?.title || 'Untitled page')
  const [slug, setSlug] = useState(page?.slug || '')
  const [metaTitle, setMetaTitle] = useState(page?.meta_title || '')
  const [metaDescription, setMetaDescription] = useState(page?.meta_description || '')
  const [metaOgImage, setMetaOgImage] = useState(page?.meta_og_image || '')
  const [published, setPublished] = useState(page?.published ?? true)

  const initialSections = (page?.content?.sections as PageSection[]) ?? []
  const history = useHistory<PageSection[]>(initialSections)
  const lastSavedRef = useRef(JSON.stringify(initialSections))

  const hasUnsaved = JSON.stringify(history.state) !== lastSavedRef.current
    || title !== (page?.title || 'Untitled page')
    || slug !== (page?.slug || '')

  const pushSections = useCallback((sections: PageSection[]) => {
    history.push(sections)
  }, [history])

  const handleUpdateSection = useCallback((index: number, data: Record<string, unknown>) => {
    const next = [...history.state]
    next[index] = { ...next[index], data }
    pushSections(next)
  }, [history.state, pushSections])

  const handleInsertSection = useCallback((index: number, section: PageSection) => {
    const next = [...history.state]
    next.splice(index, 0, section)
    pushSections(next)
  }, [history.state, pushSections])

  const handleInsertMultipleSections = useCallback((index: number, sections: PageSection[]) => {
    const next = [...history.state]
    next.splice(index, 0, ...sections)
    pushSections(next)
  }, [history.state, pushSections])

  const handleMoveSection = useCallback((from: number, to: number) => {
    if (to < 0 || to >= history.state.length) return
    const next = [...history.state]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    pushSections(next)
  }, [history.state, pushSections])

  const handleDuplicateSection = useCallback((index: number) => {
    const next = [...history.state]
    const clone = JSON.parse(JSON.stringify(next[index]))
    next.splice(index + 1, 0, clone)
    pushSections(next)
  }, [history.state, pushSections])

  const handleDeleteSection = useCallback((index: number) => {
    const next = history.state.filter((_, i) => i !== index)
    pushSections(next)
  }, [history.state, pushSections])

  const handleSave = useCallback(async () => {
    if (!slug.trim()) {
      showToast('Please set a page slug in Settings before saving.', 'error')
      setSettingsOpen(true)
      return
    }
    setSaving(true)
    try {
      const payload = {
        slug,
        title,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        meta_og_image: metaOgImage || null,
        published,
        content: { sections: history.state },
        updated_at: new Date().toISOString(),
      }
      if (page) {
        const { error } = await supabase.from('pages').update(payload).eq('id', page.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('pages').insert([payload])
        if (error) throw error
      }
      lastSavedRef.current = JSON.stringify(history.state)
      showToast('Page saved!')
      if (!page) {
        router.push('/admin/pages')
        router.refresh()
      }
    } catch (err) {
      showToast('Error: ' + (err instanceof Error ? err.message : String(err)), 'error')
    } finally {
      setSaving(false)
    }
  }, [slug, title, metaTitle, metaDescription, metaOgImage, published, history.state, page, supabase, router])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave])

  const canvasWidth = device === 'tablet' ? '768px' : device === 'mobile' ? '375px' : '100%'

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gray-100">
      <EditorTopBar
        title={title}
        onTitleChange={setTitle}
        device={device}
        onDeviceChange={setDevice}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
        published={published}
        onPublishedChange={setPublished}
        saving={saving}
        onSave={handleSave}
        onOpenSettings={() => setSettingsOpen(true)}
        hasUnsaved={hasUnsaved}
      />

      {/* Canvas */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="mx-auto transition-all duration-300 min-h-full"
          style={{
            maxWidth: canvasWidth,
            ...(device !== 'desktop' ? { boxShadow: '0 0 40px rgba(0,0,0,0.1)', background: 'white' } : {}),
          }}
        >
          <LivePreview
            sections={history.state}
            onUpdateSection={handleUpdateSection}
            onInsertSection={handleInsertSection}
            onInsertMultipleSections={handleInsertMultipleSections}
            onMoveSection={handleMoveSection}
            onDuplicateSection={handleDuplicateSection}
            onDeleteSection={handleDeleteSection}
          />
        </div>
      </div>

      {/* Settings Drawer */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        slug={slug}
        onSlugChange={setSlug}
        metaTitle={metaTitle}
        onMetaTitleChange={setMetaTitle}
        metaDescription={metaDescription}
        onMetaDescriptionChange={setMetaDescription}
        metaOgImage={metaOgImage}
        onMetaOgImageChange={setMetaOgImage}
      />
    </div>
  )
}
