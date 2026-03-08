'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import grapesjs, { type Editor } from 'grapesjs'
import GjsEditor, { Canvas } from '@grapesjs/react'
import gjsBlocksBasic from 'grapesjs-blocks-basic'
import gjsPresetWebpage from 'grapesjs-preset-webpage'
import gjsPluginForms from 'grapesjs-plugin-forms'
import gjsCustomCode from 'grapesjs-custom-code'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/components/admin/Toast'
import diggBlocksPlugin from '@/lib/grapesjs/blocks'
import { sectionsToHtml } from '@/lib/grapesjs/sections-to-html'
import { GOOGLE_FONT_OPTIONS, googleFontsUrl } from '@/lib/google-fonts'
import type { Page, PageSection } from '@/lib/types/database'

interface GrapesjsEditorProps {
  page?: Page
}

export default function GrapesjsEditor({ page }: GrapesjsEditorProps) {
  const router = useRouter()
  const supabase = createClient()
  const editorRef = useRef<Editor | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const themeInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState(page?.title || 'Untitled page')
  const [slug, setSlug] = useState(page?.slug || '')
  const [published, setPublished] = useState(page?.published ?? true)
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [importCode, setImportCode] = useState('')
  const [metaTitle, setMetaTitle] = useState(page?.meta_title || '')
  const [metaDescription, setMetaDescription] = useState(page?.meta_description || '')
  const [metaOgImage, setMetaOgImage] = useState(page?.meta_og_image || '')
  const [siteTheme, setSiteTheme] = useState({ headingFont: 'Montserrat', bodyFont: 'Lato' })
  const [allPages, setAllPages] = useState<{ id: string; title: string; slug: string }[]>([])
  const [pageSwitcherOpen, setPageSwitcherOpen] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['heading_font', 'body_font'])
      .then(({ data }) => {
        if (!data) return
        const map: Record<string, string> = {}
        for (const row of data) {
          map[row.key] = typeof row.value === 'string' ? row.value : String(row.value ?? '')
        }
        setSiteTheme({
          headingFont: map.heading_font || 'Montserrat',
          bodyFont: map.body_font || 'Lato',
        })
      })
  }, [supabase])

  useEffect(() => {
    supabase
      .from('pages')
      .select('id, title, slug')
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        if (data) setAllPages(data)
      })
  }, [supabase])

  const handleDeviceChange = useCallback((device: 'desktop' | 'tablet' | 'mobile') => {
    setActiveDevice(device)
    if (editorRef.current) {
      editorRef.current.setDevice(device)
    }
  }, [])

  const handleSave = useCallback(async () => {
    if (!slug.trim()) {
      showToast('Set a page slug in Settings before saving.', 'error')
      setSettingsOpen(true)
      return
    }
    const editor = editorRef.current
    if (!editor) return

    setSaving(true)
    try {
      const gjsData = editor.getProjectData()
      const contentHtml = editor.getHtml()
      const contentCss = editor.getCss()

      const payload = {
        slug,
        title,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        meta_og_image: metaOgImage || null,
        published,
        editor_type: 'grapesjs' as const,
        gjs_data: gjsData,
        content_html: contentHtml,
        content_css: contentCss,
        content: { sections: [] },
        updated_at: new Date().toISOString(),
      }

      if (page) {
        const { error } = await supabase.from('pages').update(payload).eq('id', page.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('pages').insert([payload])
        if (error) throw error
      }

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
  }, [slug, title, metaTitle, metaDescription, metaOgImage, published, page, supabase, router])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    globalThis.addEventListener('keydown', handler)
    return () => globalThis.removeEventListener('keydown', handler)
  }, [handleSave])

  const uploadSingleFile = useCallback(async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `grapesjs/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error } = await supabase.storage
      .from('hero-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (error) {
      showToast(`Upload failed: ${error.message}`, 'error')
      return null
    }

    const { data: publicData } = supabase.storage
      .from('hero-images')
      .getPublicUrl(path)
    return publicData.publicUrl
  }, [supabase])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    const canvasDoc = editor.Canvas.getDocument()
    if (!canvasDoc) return
    let styleEl = canvasDoc.getElementById('digg-theme-vars')
    if (!styleEl) {
      styleEl = canvasDoc.createElement('style')
      styleEl.id = 'digg-theme-vars'
      canvasDoc.head.appendChild(styleEl)
    }
    styleEl.textContent = `
      :root {
        --font-heading: "${siteTheme.headingFont}", system-ui, sans-serif;
        --font-body: "${siteTheme.bodyFont}", system-ui, sans-serif;
        --color-navy: #1B2A6B;
        --color-orange: #F7941D;
        --color-light-blue: #5BC8E8;
      }
      body { font-family: var(--font-body); color: #333; }
      h1 { font-family: var(--font-heading); font-weight: 700; }
      h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
    `
  }, [siteTheme])

  const onEditor = useCallback((editor: Editor) => {
    editorRef.current = editor

    if (page?.gjs_data && typeof page.gjs_data === 'object' && Object.keys(page.gjs_data).length > 0) {
      editor.loadProjectData(page.gjs_data as Parameters<Editor['loadProjectData']>[0])
    } else if (page?.content) {
      const content = page.content as { sections?: PageSection[] }
      const sections = content?.sections ?? []
      if (sections.length > 0) {
        const html = sectionsToHtml(sections)
        editor.setComponents(html)
      }
    }

    // Auto-switch sidebar to Style Manager when an element is selected
    editor.on('component:selected', () => {
      const smBtn = editor.Panels.getButton('views', 'open-sm')
      if (smBtn && !smBtn.get('active')) {
        smBtn.set('active', true)
      }
    })

    // Switch back to Blocks panel when nothing is selected
    editor.on('component:deselected', () => {
      if (!editor.getSelected()) {
        const blkBtn = editor.Panels.getButton('views', 'open-blocks')
        if (blkBtn && !blkBtn.get('active')) {
          blkBtn.set('active', true)
        }
      }
    })

    // Track undo/redo availability
    const updateUndoState = () => {
      const um = editor.UndoManager
      setCanUndo(um.hasUndo())
      setCanRedo(um.hasRedo())
    }
    editor.on('change:changesCount', updateUndoState)

    const canvasDoc = editor.Canvas.getDocument()
    const canvasBody = editor.Canvas.getBody()
    if (canvasDoc && canvasBody) {
      const prevent = (e: Event) => { e.preventDefault(); e.stopPropagation() }
      canvasDoc.addEventListener('dragover', prevent)
      canvasDoc.addEventListener('dragenter', prevent)
      canvasDoc.addEventListener('drop', async (e: Event) => {
        const de = e as DragEvent
        de.preventDefault()
        de.stopPropagation()
        const files = de.dataTransfer?.files
        if (!files || files.length === 0) return

        const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
        if (imageFiles.length === 0) return

        showToast(`Uploading ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''}...`, 'info')

        for (const file of imageFiles) {
          const url = await uploadSingleFile(file)
          if (url) {
            editor.AssetManager.add([{ src: url, type: 'image' as const }])
            const selected = editor.getSelected()
            if (selected && selected.get('type') === 'image') {
              selected.addAttributes({ src: url })
            } else {
              editor.addComponents({
                type: 'image',
                attributes: { src: url },
                style: {
                  width: '100%',
                  'max-width': '800px',
                  height: 'auto',
                  display: 'block',
                  margin: '1rem auto',
                  'border-radius': '0.75rem',
                },
              })
            }
          }
        }

        showToast('Images uploaded!', 'info')
      })
    }
  }, [page, uploadSingleFile])

  const uploadFile = useCallback(async (e: DragEvent | Event) => {
    const files = (e as DragEvent).dataTransfer
      ? (e as DragEvent).dataTransfer!.files
      : ((e as Event).target as HTMLInputElement).files
    if (!files) return

    const urls: string[] = []
    for (const file of Array.from(files)) {
      const url = await uploadSingleFile(file)
      if (url) urls.push(url)
    }

    if (editorRef.current && urls.length) {
      editorRef.current.AssetManager.add(urls.map(u => ({ src: u, type: 'image' as const })))
    }
  }, [uploadSingleFile])

  const handleUploadImage = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    showToast('Uploading...', 'info')
    for (const file of Array.from(files)) {
      const url = await uploadSingleFile(file)
      if (url && editorRef.current) {
        editorRef.current.AssetManager.add([{ src: url, type: 'image' as const }])
        editorRef.current.addComponents({
          type: 'image',
          attributes: { src: url },
          style: {
            width: '100%',
            'max-width': '800px',
            height: 'auto',
            display: 'block',
            margin: '1rem auto',
            'border-radius': '0.75rem',
          },
        })
      }
    }
    showToast('Image added to page!')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [uploadSingleFile])

  const handleUndo = useCallback(() => {
    editorRef.current?.UndoManager.undo()
  }, [])

  const handleRedo = useCallback(() => {
    editorRef.current?.UndoManager.redo()
  }, [])

  const handleImportCode = useCallback(() => {
    if (!importCode.trim() || !editorRef.current) return
    editorRef.current.setComponents(importCode)
    setImportOpen(false)
    setImportCode('')
    showToast('Code imported!')
  }, [importCode])

  const handleThemeUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editorRef.current) return

    const text = await file.text()
    editorRef.current.setComponents(text)
    showToast('Theme applied! Edit it to make it yours.')
    if (themeInputRef.current) themeInputRef.current.value = ''
  }, [])

  useEffect(() => {
    if (!pageSwitcherOpen) return
    const close = () => setPageSwitcherOpen(false)
    const timer = setTimeout(() => document.addEventListener('click', close), 0)
    return () => { clearTimeout(timer); document.removeEventListener('click', close) }
  }, [pageSwitcherOpen])

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gray-100">
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelected} />
      <input ref={themeInputRef} type="file" accept=".html,.htm" className="hidden" onChange={handleThemeUpload} />

      {/* Top bar */}
      <div className="h-14 bg-[#1B2A6B] flex items-center px-3 gap-2 shrink-0 shadow-lg z-50">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="text-white/70 hover:text-white transition-colors p-1"
          title="Back to admin"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
        </button>

        <div className="h-6 w-px bg-white/20" />

        {/* Page switcher */}
        <div className="relative">
          <button
            onClick={() => setPageSwitcherOpen(!pageSwitcherOpen)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            <span className="text-white text-sm font-medium max-w-[120px] truncate">{title || 'Select page'}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>

          {pageSwitcherOpen && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[70]">
              <div className="p-2 border-b border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-2 py-1">Your Pages</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {allPages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPageSwitcherOpen(false)
                      if (p.id !== page?.id) router.push(`/admin/pages/${p.id}`)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      p.id === page?.id ? 'bg-blue-50 text-[#1B2A6B] font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span className="truncate">{p.title}</span>
                    <span className="text-[10px] text-gray-400 ml-2 shrink-0">/{p.slug === 'home' ? '' : p.slug}</span>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={() => { setPageSwitcherOpen(false); router.push('/admin/pages/new') }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#F7941D] font-semibold hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Page
                </button>
              </div>
            </div>
          )}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Page title"
          placeholder="Page title"
          className="bg-transparent text-white/60 text-xs border-none outline-none focus:text-white focus:ring-1 focus:ring-[#5BC8E8] rounded px-2 py-1 w-28"
        />

        <div className="h-6 w-px bg-white/20" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:text-white/20 disabled:hover:bg-transparent transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a5 5 0 015 5v2"/><polyline points="3 10 7 6"/><polyline points="3 10 7 14"/></svg>
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:text-white/20 disabled:hover:bg-transparent transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H11a5 5 0 00-5 5v2"/><polyline points="21 10 17 6"/><polyline points="21 10 17 14"/></svg>
          </button>
        </div>

        <div className="h-6 w-px bg-white/20" />

        {/* Quick action buttons */}
        <button
          onClick={handleUploadImage}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 text-white text-xs font-medium transition-colors"
          title="Upload an image to the page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          Add Image
        </button>

        <button
          onClick={() => setImportOpen(true)}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 text-white text-xs font-medium transition-colors"
          title="Paste HTML or code to build the page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Import Code
        </button>

        <button
          onClick={() => themeInputRef.current?.click()}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 text-white text-xs font-medium transition-colors"
          title="Upload an HTML template file"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload Theme
        </button>

        <div className="flex-1" />

        {/* Device toggles */}
        <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5">
          {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
            <button
              key={d}
              onClick={() => handleDeviceChange(d)}
              title={`Preview on ${d}`}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                activeDevice === d ? 'bg-white text-[#1B2A6B]' : 'text-white/70 hover:text-white'
              }`}
            >
              {d === 'desktop' ? '\uD83D\uDDA5' : d === 'tablet' ? '\uD83D\uDCF1' : '\uD83D\uDCF2'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="text-white/70 hover:text-white transition-colors p-1"
          title="Page settings (slug, SEO)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>

        <button
          onClick={() => setPublished(!published)}
          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
            published ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
          }`}
        >
          {published ? 'Live' : 'Draft'}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#F7941D] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#e6850a] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Import Code Modal */}
      {importOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setImportOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1B2A6B]">Import HTML / Code</h3>
              <button onClick={() => setImportOpen(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Paste any HTML code below. This will replace the current page content. You can paste a full template, a section, or code from any website builder.
            </p>
            <textarea
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              placeholder={'<section>\n  <h1>My Page</h1>\n  <p>Paste your HTML here...</p>\n</section>'}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleImportCode}
                disabled={!importCode.trim()}
                className="bg-[#F7941D] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#e6850a] disabled:opacity-40 transition-colors"
              >
                Import & Replace
              </button>
              <button
                onClick={() => {
                  if (!importCode.trim() || !editorRef.current) return
                  editorRef.current.addComponents(importCode)
                  setImportOpen(false)
                  setImportCode('')
                  showToast('Code added to page!')
                }}
                disabled={!importCode.trim()}
                className="bg-[#1B2A6B] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#152155] disabled:opacity-40 transition-colors"
              >
                Add Below Existing
              </button>
              <button onClick={() => setImportOpen(false)} className="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings drawer */}
      {settingsOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setSettingsOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1B2A6B]">Page Settings</h3>
              <button onClick={() => setSettingsOpen(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close settings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">URL Slug</span>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
              <span className="text-xs text-gray-400 mt-1 block">yoursite.com/{slug || 'page-url'}</span>
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Meta Title (SEO)</span>
              <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Meta Description (SEO)</span>
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} placeholder="Describe this page for search engines..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Social Share Image URL</span>
              <input type="text" value={metaOgImage} onChange={(e) => setMetaOgImage(e.target.value)} placeholder="https://..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
            </label>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Tip: Click the gear icon on the right sidebar of the editor to style any selected element.</p>
            </div>
          </div>
        </div>
      )}

      {/* GrapesJS editor area */}
      <div className="flex-1 overflow-hidden">
        <GjsEditor
          grapesjs={grapesjs}
          grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
          options={{
            height: '100%',
            storageManager: false,
            undoManager: { trackSelection: false },
            canvas: {
              styles: [
                googleFontsUrl(GOOGLE_FONT_OPTIONS),
              ],
            },
            deviceManager: {
              devices: [
                { name: 'desktop', width: '' },
                { name: 'tablet', width: '768px', widthMedia: '992px' },
                { name: 'mobile', width: '375px', widthMedia: '480px' },
              ],
            },
            styleManager: {
              sectors: [
                {
                  name: 'Typography',
                  open: true,
                  properties: [
                    {
                      property: 'font-family',
                      type: 'select',
                      defaults: `"${siteTheme.headingFont}", sans-serif`,
                      options: [
                        { id: 'Arial, Helvetica, sans-serif', label: 'Arial' },
                        { id: 'Georgia, serif', label: 'Georgia' },
                        { id: 'Times New Roman, serif', label: 'Times New Roman' },
                        { id: 'Courier New, monospace', label: 'Courier New' },
                        ...GOOGLE_FONT_OPTIONS.map(f => ({
                          id: `"${f}", sans-serif`,
                          label: f,
                        })),
                      ],
                    },
                    'font-size', 'font-weight', 'letter-spacing',
                    'color', 'line-height', 'text-align', 'text-decoration',
                    'text-transform', 'text-shadow',
                  ],
                },
                {
                  name: 'Layout',
                  open: false,
                  properties: [
                    'display', 'float', 'position',
                    'top', 'right', 'bottom', 'left',
                  ],
                },
                {
                  name: 'Size & Spacing',
                  open: false,
                  properties: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                },
                {
                  name: 'Appearance',
                  open: false,
                  properties: [
                    'opacity', 'border-radius', 'border', 'box-shadow',
                    'background', 'background-color',
                  ],
                },
                {
                  name: 'Effects',
                  open: false,
                  properties: ['transition', 'perspective', 'transform'],
                },
              ],
            },
            plugins: [
              diggBlocksPlugin,
              gjsBlocksBasic,
              gjsPresetWebpage,
              gjsPluginForms,
              gjsCustomCode,
            ],
            pluginsOpts: {
              [gjsBlocksBasic as unknown as string]: { flexGrid: true },
              [gjsPresetWebpage as unknown as string]: {
                modalImportTitle: 'Import HTML',
                modalImportButton: 'Import',
              },
              [gjsPluginForms as unknown as string]: {
                blocks: ['form', 'input', 'textarea', 'select', 'button', 'label', 'checkbox', 'radio'],
              },
            },
            assetManager: {
              uploadFile,
              assets: [],
            },
          }}
          onEditor={onEditor}
        >
          <div className="flex h-full">
            <div className="flex-1 overflow-hidden">
              <Canvas />
            </div>
          </div>
        </GjsEditor>
      </div>
    </div>
  )
}
