'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import grapesjs, { type Editor } from 'grapesjs'
import GjsEditor from '@grapesjs/react'
import gjsBlocksBasic from 'grapesjs-blocks-basic'
import gjsPresetWebpage from 'grapesjs-preset-webpage'
import gjsPluginForms from 'grapesjs-plugin-forms'
import gjsCustomCode from 'grapesjs-custom-code'
import gjsNavbar from 'grapesjs-navbar'
import gjsCountdown from 'grapesjs-component-countdown'
import gjsStyleBg from 'grapesjs-style-bg'
import gjsTabs from 'grapesjs-tabs'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/components/admin/Toast'
import diggBlocksPlugin from '@/lib/grapesjs/blocks'
import { applyResizePolicyToEntireTree, registerDiggComponentResizeBehavior } from '@/lib/grapesjs/component-defaults'
import { registerFloatingCommands } from '@/lib/grapesjs/floating-controls'
import { registerMobileResponsiveCommands } from '@/lib/grapesjs/mobile-responsive-commands'
import { registerImageFocalOverlay } from '@/lib/grapesjs/image-focal-overlay'
import { diggAlignmentSector } from '@/lib/grapesjs/alignment-sector'
import { diggImageFramingSector, diggNewImageStyle } from '@/lib/grapesjs/image-framing-sector'
import {
  applyFlexibleWidthToComponent,
  getMobileLayoutHintsForComponent,
  getPreviewDeviceCategory,
} from '@/lib/grapesjs/mobile-hints'
import { PAGE_STARTERS } from '@/lib/grapesjs/page-starters'
import { sectionsToHtml } from '@/lib/grapesjs/sections-to-html'
import { GOOGLE_FONT_OPTIONS, googleFontsUrl } from '@/lib/google-fonts'
import type { BuilderSnippet, Page, PageSection } from '@/lib/types/database'
import { useUnsavedChangesAlert } from '@/lib/hooks/useUnsavedChangesAlert'

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
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [importCode, setImportCode] = useState('')
  const [metaTitle, setMetaTitle] = useState(page?.meta_title || '')
  const [metaDescription, setMetaDescription] = useState(page?.meta_description || '')
  const [metaOgImage, setMetaOgImage] = useState(page?.meta_og_image || '')
  const [siteTheme, setSiteTheme] = useState({ headingFont: 'Montserrat', bodyFont: 'Lato' })
  const [allPages, setAllPages] = useState<{ id: string; title: string; slug: string }[]>([])
  const [pageSwitcherOpen, setPageSwitcherOpen] = useState(false)
  const [mobilePanelsOpen, setMobilePanelsOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [startersOpen, setStartersOpen] = useState(false)
  const [snippetsOpen, setSnippetsOpen] = useState(false)
  const [snippetSaveTitle, setSnippetSaveTitle] = useState('')
  const [snippets, setSnippets] = useState<BuilderSnippet[]>([])
  const [snippetsLoading, setSnippetsLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [previewDeviceName, setPreviewDeviceName] = useState('desktop')
  const [selectionMobileHints, setSelectionMobileHints] = useState<string[]>([])
  const saveRef = useRef<() => void>(() => {})
  const ignoreDirtyRef = useRef(true)
  const markDirtyRef = useRef<() => void>(() => {})
  const setPreviewDeviceNameRef = useRef(setPreviewDeviceName)
  const setSelectionMobileHintsRef = useRef(setSelectionMobileHints)
  useEffect(() => {
    setPreviewDeviceNameRef.current = setPreviewDeviceName
    setSelectionMobileHintsRef.current = setSelectionMobileHints
  })

  useEffect(() => {
    markDirtyRef.current = () => {
      if (ignoreDirtyRef.current) return
      setDirty(true)
    }
  })

  const { confirmLeave } = useUnsavedChangesAlert(
    dirty,
    'You have unsaved changes on this page. Leave without saving?'
  )

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

  const handleSave = useCallback(async () => {
    if (!slug.trim()) {
      showToast('Set a page slug in Settings before saving.', 'error')
      setSettingsOpen(true)
      return
    }
    const editor = editorRef.current
    if (!editor) {
      showToast('Editor not ready yet — please wait a moment and try again.', 'error')
      return
    }

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
        const { data, error } = await supabase
          .from('pages')
          .update(payload)
          .eq('id', page.id)
          .select('id')
        if (error) throw error
        if (!data || data.length === 0) {
          throw new Error('Save blocked — your session may have expired. Please log in again.')
        }
      } else {
        const { data, error } = await supabase
          .from('pages')
          .insert([payload])
          .select('id')
        if (error) throw error
        if (!data || data.length === 0) {
          throw new Error('Insert blocked — your session may have expired. Please log in again.')
        }
      }

      showToast('Page saved!')
      setDirty(false)
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

  const touchPageFieldsDirty = useCallback(() => {
    setDirty(true)
  }, [])

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (!el) return
      const tag = el.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) return
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setShortcutsOpen(true)
      }
      if (e.key === 'Escape' && shortcutsOpen) setShortcutsOpen(false)
    }
    globalThis.addEventListener('keydown', handler)
    return () => globalThis.removeEventListener('keydown', handler)
  }, [shortcutsOpen])

  const openPreview = useCallback(() => {
    if (!page?.id) {
      showToast('Save the page once to open preview (needs a page ID).', 'error')
      return
    }
    window.open(`/preview/${page.id}`, '_blank', 'noopener,noreferrer')
  }, [page?.id])

  const openLiveSite = useCallback(() => {
    if (!published) {
      showToast('Turn the page Live and save to view it on the public site.', 'error')
      return
    }
    const s = slug.trim()
    if (!s) {
      showToast('Set a URL slug in Settings first.', 'error')
      setSettingsOpen(true)
      return
    }
    const path = s === 'home' ? '/' : `/${s}`
    window.open(`${window.location.origin}${path}`, '_blank', 'noopener,noreferrer')
  }, [published, slug])

  const applyPageStarter = useCallback((html: string) => {
    const ed = editorRef.current
    if (!ed) return
    const wrapper = ed.getWrapper()
    if (!wrapper) return
    const count = wrapper.components().length
    if (count > 0 && !globalThis.confirm('Replace everything on the page with this starter?')) return
    ed.setComponents(html)
    setStartersOpen(false)
    showToast('Starter applied — customize and Save when ready.')
  }, [])

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
    const publicUrl = publicData.publicUrl

    await supabase.from('images').insert({
      filename: file.name,
      url: publicUrl,
      folder: 'editor',
      alt_text: '',
    })

    return publicUrl
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

  useEffect(() => { saveRef.current = handleSave }, [handleSave])

  useEffect(() => {
    const nav = document.querySelector('nav.bg-\\[\\#1B2A6B\\]') as HTMLElement | null
    const main = document.querySelector('main') as HTMLElement | null
    const wrapper = main?.parentElement as HTMLElement | null

    if (nav) nav.style.display = 'none'
    if (main) { main.style.padding = '0'; main.style.margin = '0' }
    if (wrapper) wrapper.style.background = 'transparent'
    document.body.style.overflow = 'hidden'

    return () => {
      if (nav) nav.style.display = ''
      if (main) { main.style.padding = ''; main.style.margin = '' }
      if (wrapper) wrapper.style.background = ''
      document.body.style.overflow = ''
    }
  }, [])

  const onEditor = useCallback((editor: Editor) => {
    editorRef.current = editor
    ignoreDirtyRef.current = true

    registerDiggComponentResizeBehavior(editor)
    registerFloatingCommands(editor)
    registerMobileResponsiveCommands(editor)
    registerImageFocalOverlay(editor)

    editor.on('command:run', (opts: { id?: string }) => {
      const id = opts?.id ?? ''
      if (id.startsWith('digg:mobile-')) markDirtyRef.current()
    })

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

    queueMicrotask(() => applyResizePolicyToEntireTree(editor))

    const refreshMobileHints = () => {
      const dev = editor.DeviceManager.getSelected()
      const name = String(dev?.get('name') || 'desktop')
      setPreviewDeviceNameRef.current(name)
      const sel = editor.getSelected()
      setSelectionMobileHintsRef.current(sel ? getMobileLayoutHintsForComponent(sel) : [])
    }

    editor.on('device:select', refreshMobileHints)
    queueMicrotask(refreshMobileHints)

    const mark = () => markDirtyRef.current()
    editor.on('component:add', mark)
    editor.on('component:remove', mark)
    editor.on('component:update', mark)
    editor.on('component:styleUpdate', () => {
      mark()
      refreshMobileHints()
    })

    // End initial load guard after project + canvas settle (avoids false “dirty” from hydration)
    window.setTimeout(() => {
      ignoreDirtyRef.current = false
    }, 1000)

    // ---- Custom commands for panel buttons ----
    editor.Commands.add('digg:save', { run: () => saveRef.current() })
    editor.Commands.add('digg:upload-image', { run: () => fileInputRef.current?.click() })
    editor.Commands.add('digg:import-code', { run: () => setImportOpen(true) })
    editor.Commands.add('digg:upload-theme', { run: () => themeInputRef.current?.click() })
    editor.Commands.add('digg:settings', { run: () => setSettingsOpen(true) })
    editor.Commands.add('digg:blocks', {
      run: (ed: Editor) => {
        ed.select()
        const btn = ed.Panels.getButton('views', 'open-blocks')
        if (btn) btn.set('active', true)
      },
    })

    // ---- Pre-load images from media library into AssetManager ----
    supabase
      .from('images')
      .select('url, filename, alt_text')
      .then(({ data }) => {
        if (data && data.length > 0) {
          editor.AssetManager.add(
            data.map((img) => ({ src: img.url, name: img.filename || '' }))
          )
        }
      })

    // Auto-switch sidebar to Style Manager when an element is selected
    editor.on('component:selected', (component) => {
      const smBtn = editor.Panels.getButton('views', 'open-sm')
      if (smBtn && !smBtn.get('active')) smBtn.set('active', true)

      const isImg = component.get('type') === 'image' || (component.get('tagName') || '').toLowerCase() === 'img'
      if (isImg) {
        const sector = editor.StyleManager.getSector('image-framing', { warn: false })
        sector?.set('open', true)
      }
      refreshMobileHints()
    })

    editor.on('component:deselected', () => {
      refreshMobileHints()
      if (!editor.getSelected()) {
        const blkBtn = editor.Panels.getButton('views', 'open-blocks')
        if (blkBtn && !blkBtn.get('active')) blkBtn.set('active', true)
      }
    })

    const canvasDoc = editor.Canvas.getDocument()
    const canvasBody = editor.Canvas.getBody()
    if (canvasDoc && canvasBody) {
      canvasDoc.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement
        const link = target.closest('a')
        if (link) { e.preventDefault(); e.stopPropagation() }
      }, true)

      canvasDoc.addEventListener('submit', (e: Event) => {
        e.preventDefault(); e.stopPropagation()
      }, true)

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

        showToast(`Uploading ${imageFiles.length} image(s)...`, 'info')
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
                style: { ...diggNewImageStyle },
              })
            }
          }
        }
        showToast('Images uploaded — click Save so this page and image placements sync everywhere.', 'info')
      })
    }
  }, [page, uploadSingleFile, supabase])

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
          style: { ...diggNewImageStyle },
        })
      }
    }
    showToast('Image added — click Save to keep layout and links on every device.')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [uploadSingleFile])

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

  const handleClearCanvas = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return
    if (!globalThis.confirm('Clear all content on this page? You can Undo to get it back.')) return
    editor.DomComponents.clear()
    showToast('Canvas cleared')
  }, [])

  const loadSnippets = useCallback(async () => {
    setSnippetsLoading(true)
    try {
      const { data, error } = await supabase
        .from('builder_snippets')
        .select('id, title, component, created_at')
        .order('created_at', { ascending: false })
      if (error) throw error
      setSnippets((data as BuilderSnippet[]) ?? [])
    } catch {
      showToast(
        'Could not load saved blocks. Run the latest Supabase migration (011_builder_snippets) if this is a new feature.',
        'error'
      )
      setSnippets([])
    } finally {
      setSnippetsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (snippetsOpen) void loadSnippets()
  }, [snippetsOpen, loadSnippets])

  const saveSelectionAsSnippet = useCallback(async () => {
    const editor = editorRef.current
    const sel = editor?.getSelected()
    if (!editor || !sel) {
      showToast('Select a section or block on the canvas first.', 'info')
      return
    }
    if (sel.is('wrapper')) {
      showToast('Select a section or block — not the whole page.', 'info')
      return
    }
    const name = snippetSaveTitle.trim()
    if (!name) {
      showToast('Enter a name for this saved block.', 'info')
      return
    }
    const componentJson = sel.toJSON() as Record<string, unknown>
    const { error } = await supabase.from('builder_snippets').insert({
      title: name,
      component: componentJson,
    })
    if (error) {
      showToast(error.message || 'Could not save block.', 'error')
      return
    }
    showToast(`Saved “${name}” to My blocks.`)
    setSnippetSaveTitle('')
    void loadSnippets()
  }, [snippetSaveTitle, supabase, loadSnippets])

  const insertSnippet = useCallback((row: BuilderSnippet) => {
    const editor = editorRef.current
    if (!editor) return
    try {
      const def = JSON.parse(JSON.stringify(row.component)) as Record<string, unknown>
      editor.addComponents(def)
      queueMicrotask(() => applyResizePolicyToEntireTree(editor))
      setDirty(true)
      showToast(`Inserted “${row.title}”.`)
      setSnippetsOpen(false)
    } catch {
      showToast('Could not insert this block.', 'error')
    }
  }, [])

  const deleteSnippet = useCallback(
    async (id: string, title: string) => {
      if (!globalThis.confirm(`Delete saved block “${title}”?`)) return
      const { error } = await supabase.from('builder_snippets').delete().eq('id', id)
      if (error) {
        showToast(error.message || 'Delete failed.', 'error')
        return
      }
      showToast('Block removed.')
      void loadSnippets()
    },
    [supabase, loadSnippets]
  )

  const handleFlexibleWidthQuickFix = useCallback(() => {
    const editor = editorRef.current
    const selected = editor?.getSelected()
    if (!editor || !selected) {
      showToast('Select a block on the canvas first.', 'info')
      return
    }
    applyFlexibleWidthToComponent(selected)
    showToast('Applied max-width: 100% and box-sizing: border-box on the selection.')
  }, [])

  useEffect(() => {
    if (!pageSwitcherOpen) return
    const close = () => setPageSwitcherOpen(false)
    const timer = setTimeout(() => document.addEventListener('click', close), 0)
    return () => { clearTimeout(timer); document.removeEventListener('click', close) }
  }, [pageSwitcherOpen])

  useEffect(() => {
    const views = document.querySelector('.gjs-pn-views')
    const container = document.querySelector('.gjs-pn-views-container')
    if (views) views.classList.toggle('mobile-panels-open', mobilePanelsOpen)
    if (container) container.classList.toggle('mobile-panels-open', mobilePanelsOpen)
  }, [mobilePanelsOpen])

  const previewDeviceCategory = getPreviewDeviceCategory(previewDeviceName)

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelected}
        aria-label="Upload images to the page"
        title="Upload images to the page"
      />
      <input
        ref={themeInputRef}
        type="file"
        accept=".html,.htm"
        className="hidden"
        onChange={handleThemeUpload}
        aria-label="Upload HTML theme file"
        title="Upload HTML theme file"
      />

      {/* Single full-viewport editor shell: nav + tools + canvas */}
      <div
        className="flex flex-col"
        style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#1B2A6B' }}
      >
        {/* Row 1: Navigation bar (36px) */}
        <div className="bg-[#1B2A6B] flex items-center px-2 gap-1.5 shrink-0" style={{ height: 36 }}>
        <button type="button" onClick={() => confirmLeave(() => router.push('/admin/dashboard'))} className="text-white/70 hover:text-white p-1" title="Back to admin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
        </button>

        <div className="relative">
          <button onClick={() => setPageSwitcherOpen(!pageSwitcherOpen)} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded px-2 py-0.5 text-white text-[11px] font-medium max-w-[160px]">
            <span className="truncate">{title || 'Select page'}</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="shrink-0"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {pageSwitcherOpen && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden" style={{ zIndex: 100001 }}>
              <div className="p-2 border-b border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-2 py-1">Your Pages</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {allPages.map((p) => (
                  <button key={p.id} type="button" onClick={() => {
                    if (p.id === page?.id) { setPageSwitcherOpen(false); return }
                    confirmLeave(() => { setPageSwitcherOpen(false); window.location.href = `/admin/pages/${p.id}` })
                  }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${p.id === page?.id ? 'bg-blue-50 text-[#1B2A6B] font-semibold' : 'text-gray-700'}`}>
                    <span className="truncate">{p.title}</span>
                    <span className="text-[10px] text-gray-400 ml-2 shrink-0">/{p.slug === 'home' ? '' : p.slug}</span>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-gray-100">
                <button type="button" onClick={() => confirmLeave(() => { setPageSwitcherOpen(false); router.push('/admin/pages/new') })} className="w-full text-left px-4 py-2.5 text-sm text-[#F7941D] font-semibold hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Page
                </button>
              </div>
            </div>
          )}
        </div>

        <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); touchPageFieldsDirty() }} aria-label="Page title" placeholder="Page title"
          className="bg-transparent text-white/50 text-[10px] border-none outline-none focus:text-white rounded px-1 py-0.5 w-20 hidden sm:block" />

        <div className="flex-1" />

        {dirty && (
          <span className="text-[10px] font-semibold text-amber-200 whitespace-nowrap hidden sm:inline" title="Save to sync across devices">
            Unsaved
          </span>
        )}

        <button
          type="button"
          onClick={openPreview}
          disabled={!page?.id}
          className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-white/90 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none"
          title={page?.id ? 'Open saved preview in a new tab' : 'Save the page first'}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={openLiveSite}
          disabled={!published || !slug.trim()}
          className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-white/90 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none"
          title={published ? 'Open public page' : 'Publish and save to open the live URL'}
        >
          Site
        </button>
        <button type="button" onClick={() => { setPublished(p => !p); touchPageFieldsDirty() }} className={`px-2 py-0.5 rounded text-[10px] font-semibold ${published ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}`}>
          {published ? 'Live' : 'Draft'}
        </button>
        <button onClick={handleSave} disabled={saving} className="bg-[#F7941D] text-white px-3 py-0.5 rounded text-[11px] font-semibold hover:bg-[#e6850a] disabled:opacity-50">
          {saving ? '...' : 'Save'}
        </button>
        <button onClick={() => setMobilePanelsOpen(!mobilePanelsOpen)} className="sm:hidden text-white/70 hover:text-white p-1" title="Toggle panels">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobilePanelsOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </div>

        {/* Row 2: Editing tools (36px) */}
        <div className="bg-[#353535] flex items-center px-2 gap-1 border-t border-white/10 shrink-0" style={{ height: 36 }}>
        <button onClick={() => editorRef.current?.UndoManager.undo()} className="flex items-center gap-1 px-1 py-1 text-white/60 hover:text-white rounded" title="Undo last change on the canvas (Ctrl+Z)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a5 5 0 015 5v2"/><polyline points="3 10 7 6"/><polyline points="3 10 7 14"/></svg>
          <span className="hidden lg:inline text-[10px] font-medium">Undo</span>
        </button>
        <button onClick={() => editorRef.current?.UndoManager.redo()} className="flex items-center gap-1 px-1 py-1 text-white/60 hover:text-white rounded" title="Redo (Ctrl+Shift+Z)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H11a5 5 0 00-5 5v2"/><polyline points="21 10 17 6"/><polyline points="21 10 17 14"/></svg>
          <span className="hidden lg:inline text-[10px] font-medium">Redo</span>
        </button>

        <div className="w-px h-5 bg-white/20" />

        <button onClick={() => { const e = editorRef.current; if (e) { e.select(); const b = e.Panels.getButton('views','open-blocks'); if (b) b.set('active',true) } }}
          className="flex items-center gap-1 bg-[#5BC8E8]/20 hover:bg-[#5BC8E8]/30 rounded px-2 py-1 text-[#5BC8E8] text-[11px] font-semibold" title="Show blocks">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Blocks
        </button>

        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-white text-[11px] font-medium" title="Upload image">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          Image
        </button>

        <button
          type="button"
          onClick={() => {
            const ed = editorRef.current
            const c = ed?.getSelected()
            if (!ed || !c) {
              showToast('Select a link or button on the canvas first.', 'info')
              return
            }
            const tag = (c.get('tagName') || '').toLowerCase()
            if (tag !== 'a' && tag !== 'button' && c.get('type') !== 'link') {
              showToast('Pick a button or a link — then use Float to place it freely.', 'info')
              return
            }
            ed.runCommand('digg:float')
          }}
          className="hidden sm:flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-white text-[11px] font-medium"
          title="Float the selected link or button — drag with the move handle, resize corners"
        >
          Float
        </button>
        <button
          type="button"
          onClick={() => {
            const ed = editorRef.current
            if (!ed?.getSelected()) {
              showToast('Select a floated link or button first.', 'info')
              return
            }
            ed.runCommand('digg:unfloat')
          }}
          className="hidden sm:flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-white text-[11px] font-medium"
          title="Remove floating — back to normal flow"
        >
          Unfloat
        </button>

        <button onClick={() => setImportOpen(true)} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-white text-[11px] font-medium" title="Import HTML">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Code
        </button>

        <button onClick={() => themeInputRef.current?.click()} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-white text-[11px] font-medium" title="Upload HTML template">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Theme
        </button>

        <button
          type="button"
          onClick={() => setStartersOpen(true)}
          className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-white text-[11px] font-medium"
          title="Insert a ready-made page layout"
        >
          Starters
        </button>

        <button
          type="button"
          onClick={() => setSnippetsOpen(true)}
          className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-white text-[11px] font-medium"
          title="Your saved blocks — insert on any page"
        >
          My blocks
        </button>

        <div className="w-px h-5 bg-white/20 hidden lg:block" />

        <button
          type="button"
          onClick={() => editorRef.current?.runCommand('digg:mobile-stack')}
          className="hidden lg:flex items-center gap-1 bg-emerald-900/40 hover:bg-emerald-800/50 rounded px-2 py-1 text-emerald-100 text-[11px] font-medium"
          title="Mobile (≤767px): stack flex children in a column"
        >
          M stack
        </button>
        <button
          type="button"
          onClick={() => editorRef.current?.runCommand('digg:mobile-full')}
          className="hidden lg:flex items-center gap-1 bg-emerald-900/40 hover:bg-emerald-800/50 rounded px-2 py-1 text-emerald-100 text-[11px] font-medium"
          title="Mobile (≤767px): full width in the frame"
        >
          M full
        </button>
        <button
          type="button"
          onClick={() => editorRef.current?.runCommand('digg:mobile-text')}
          className="hidden lg:flex items-center gap-1 bg-emerald-900/40 hover:bg-emerald-800/50 rounded px-2 py-1 text-emerald-100 text-[11px] font-medium"
          title="Mobile (≤767px): smaller, readable text"
        >
          M text
        </button>

        <button
          type="button"
          onClick={() => setShortcutsOpen(true)}
          className="p-1 text-white/60 hover:text-white"
          title="Keyboard shortcuts (?)"
        >
          <span className="text-[11px] font-semibold px-1">?</span>
        </button>

        <div className="flex-1" />

        <button onClick={() => setSettingsOpen(!settingsOpen)} className="p-1 text-white/60 hover:text-white" title="Page settings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>
        </div>

      {shortcutsOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 100000 }} onClick={() => setShortcutsOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1B2A6B]">Keyboard shortcuts</h3>
              <button type="button" onClick={() => setShortcutsOpen(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-700">?</kbd> anytime (when not typing in a field) to open this panel.</p>
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
              <dt className="text-gray-600">Save</dt><dd className="text-gray-900 font-mono text-right">Ctrl / ⌘ + S</dd>
              <dt className="text-gray-600">Undo / Redo</dt><dd className="text-gray-900 text-right">Toolbar or Ctrl+Z / Ctrl+Shift+Z — full canvas layout</dd>
              <dt className="text-gray-600">My blocks</dt><dd className="text-gray-900 text-right">Save a selected section and reuse it on any page</dd>
              <dt className="text-gray-600">M stack / full / text</dt><dd className="text-gray-900 text-right">Adds mobile-only CSS (≤767px) for the selection — check with device preview</dd>
              <dt className="text-gray-600">Delete selection</dt><dd className="text-gray-900 font-mono text-right">Delete / Backspace</dd>
              <dt className="text-gray-600">Deselect</dt><dd className="text-gray-900 font-mono text-right">Escape</dd>
              <dt className="text-gray-600">Device preview</dt><dd className="text-gray-900 text-right">Desktop / tablet / mobile in the canvas toolbar</dd>
              <dt className="text-gray-600">Resize on canvas</dt><dd className="text-gray-900 text-right">Select a block — drag corner handles to resize; images keep aspect ratio</dd>
              <dt className="text-gray-600">Image in frame</dt><dd className="text-gray-900 text-right">Select image — drag overlay for focal, wheel to zoom inside the box, corners resize the frame; headings/paragraphs use corner handles to size text box</dd>
              <dt className="text-gray-600">Float button / link</dt><dd className="text-gray-900 text-right">Select a link or button → Float — then use the move handle and corners (Unfloat to reset)</dd>
              <dt className="text-gray-600">Drag blocks</dt><dd className="text-gray-900 text-right">Drag the move handle or drag the block in the tree to reorder</dd>
              <dt className="text-gray-600">Style panel sync</dt><dd className="text-gray-900 text-right">Typography, Alignment & width, and Layout update with the selection</dd>
              <dt className="text-gray-600">Mobile / tablet</dt><dd className="text-gray-900 text-right">Use device icons above the canvas; yellow bar shows layout tips for small screens</dd>
              <dt className="text-gray-600">Blocks & styles</dt><dd className="text-gray-900 text-right">Right panels</dd>
            </dl>
            <p className="text-xs text-gray-500 mt-4">Preview shows the <strong>last saved</strong> version. Save, then open Preview.</p>
            <p className="text-xs text-gray-500 mt-2">Closing the tab or leaving the builder prompts you if there are unsaved changes. Images upload to the library immediately, but the page layout is saved when you click Save.</p>
          </div>
        </div>
      )}

      {startersOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 100000 }} onClick={() => setStartersOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1B2A6B]">Page starters</h3>
              <button type="button" onClick={() => setStartersOpen(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Replace the canvas with a ready-made layout. You can edit every block afterward.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAGE_STARTERS.map((starter) => (
                <button
                  key={starter.id}
                  type="button"
                  onClick={() => applyPageStarter(starter.html)}
                  className="text-left p-4 rounded-xl border border-gray-200 hover:border-[#F7941D] hover:bg-orange-50/50 transition-colors"
                >
                  <span className="font-semibold text-[#1B2A6B] block">{starter.title}</span>
                  <span className="text-xs text-gray-500 mt-1 block">{starter.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {snippetsOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 100000 }} onClick={() => setSnippetsOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1B2A6B]">My blocks</h3>
              <button type="button" onClick={() => setSnippetsOpen(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Save blocks you reuse on other pages. Select a section on the canvas, name it, and save — then insert here anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={snippetSaveTitle}
                onChange={(e) => setSnippetSaveTitle(e.target.value)}
                placeholder="Name for saved block"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => void saveSelectionAsSnippet()}
                className="px-4 py-2 rounded-lg bg-[#F7941D] text-white text-sm font-semibold hover:bg-[#e6850a] shrink-0"
              >
                Save selection
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Saved</p>
              {snippetsLoading ? (
                <p className="text-sm text-gray-400">Loading…</p>
              ) : snippets.length === 0 ? (
                <p className="text-sm text-gray-400">No saved blocks yet.</p>
              ) : (
                <ul className="space-y-2">
                  {snippets.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2 hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-800 truncate">{s.title}</span>
                      <span className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => insertSnippet(s)}
                          className="text-xs font-semibold text-[#1B2A6B] hover:underline"
                        >
                          Insert
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteSnippet(s.id, s.title)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {importOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 100000 }} onClick={() => setImportOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1B2A6B]">Import HTML / Code</h3>
              <button onClick={() => setImportOpen(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Paste any HTML code below. You can paste a full template, a section, or code from any website builder.
            </p>
            <textarea
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              placeholder={'<section>\n  <h1>My Page</h1>\n  <p>Paste your HTML here...</p>\n</section>'}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={handleImportCode} disabled={!importCode.trim()} className="bg-[#F7941D] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#e6850a] disabled:opacity-40 transition-colors">Import & Replace</button>
              <button onClick={() => { if (!importCode.trim() || !editorRef.current) return; editorRef.current.addComponents(importCode); setImportOpen(false); setImportCode(''); showToast('Code added!') }} disabled={!importCode.trim()} className="bg-[#1B2A6B] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#152155] disabled:opacity-40 transition-colors">Add Below</button>
              <button onClick={() => setImportOpen(false)} className="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-700">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings drawer */}
      {settingsOpen && (
        <div className="fixed inset-0" style={{ zIndex: 100000 }} onClick={() => setSettingsOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-2xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1B2A6B]">Page Settings</h3>
              <button onClick={() => setSettingsOpen(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close settings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">URL Slug</span>
              <input type="text" value={slug} onChange={(e) => { setSlug(e.target.value); touchPageFieldsDirty() }} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
              <span className="text-xs text-gray-400 mt-1 block">yoursite.com/{slug || 'page-url'}</span>
            </label>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Meta Title (SEO)</span>
              <input type="text" value={metaTitle} onChange={(e) => { setMetaTitle(e.target.value); touchPageFieldsDirty() }} placeholder={title} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
            </label>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Meta Description (SEO)</span>
              <textarea value={metaDescription} onChange={(e) => { setMetaDescription(e.target.value); touchPageFieldsDirty() }} rows={3} placeholder="Describe this page for search engines..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
            </label>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Social Share Image URL</span>
              <input type="text" value={metaOgImage} onChange={(e) => { setMetaOgImage(e.target.value); touchPageFieldsDirty() }} placeholder="https://..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
            </label>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button onClick={handleClearCanvas} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">Clear All Page Content</button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2">Keyboard Shortcuts</p>
              <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-400">
                <span>Ctrl + S</span><span>Save</span>
                <span>Ctrl + Z</span><span>Undo</span>
                <span>Ctrl + Shift + Z</span><span>Redo</span>
                <span>Delete</span><span>Remove selected</span>
                <span>Escape</span><span>Deselect</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {(previewDeviceCategory !== 'desktop' || selectionMobileHints.length > 0) && (
        <div
          className="shrink-0 border-b border-amber-500/35 bg-gradient-to-r from-amber-950/90 to-[#0f172a] px-2 sm:px-3 py-2 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 text-[10px] sm:text-[11px] text-amber-50/95"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {previewDeviceCategory !== 'desktop' && (
              <span className="font-semibold text-amber-200 shrink-0">
                {previewDeviceCategory === 'mobile' ? 'Mobile' : 'Tablet'} preview
              </span>
            )}
            {previewDeviceCategory !== 'desktop' && (
              <span className="text-amber-100/80 hidden sm:inline">
                Check stacking, spacing, and tap-sized buttons — this is a live narrow-canvas preview, not automatic fixes for every phone.
              </span>
            )}
            <button
              type="button"
              onClick={handleFlexibleWidthQuickFix}
              className="shrink-0 px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 text-amber-100 font-semibold border border-amber-400/30"
            >
              Flex width on selection
            </button>
          </div>
          {selectionMobileHints.length > 0 && (
            <ul className="list-disc list-inside text-amber-100/90 space-y-0.5 sm:ml-2 min-w-0 flex-1">
              {selectionMobileHints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          )}
        </div>
      )}

        {/* Row 3: GrapesJS editor — website view sits inside this panel */}
        <div className="flex-1 min-h-0 relative" style={{ minHeight: 0 }}>
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
                diggAlignmentSector,
                {
                  name: 'Layout',
                  open: false,
                  properties: [
                    'display', 'flex-direction', 'justify-content', 'align-items',
                    'flex-wrap', 'float', 'position',
                    'top', 'right', 'bottom', 'left',
                  ],
                },
                {
                  name: 'Size & Spacing',
                  open: false,
                  properties: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                },
                diggImageFramingSector,
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
                  properties: ['transition', 'perspective', 'transform', 'overflow'],
                },
              ],
            },
            plugins: [
              diggBlocksPlugin,
              gjsBlocksBasic,
              gjsPresetWebpage,
              gjsPluginForms,
              gjsCustomCode,
              gjsNavbar,
              gjsCountdown,
              gjsStyleBg,
              gjsTabs,
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
              [gjsNavbar as unknown as string]: {},
              [gjsCountdown as unknown as string]: {},
              [gjsStyleBg as unknown as string]: {},
              [gjsTabs as unknown as string]: { tabsBlock: { category: 'Extra' } },
            },
            assetManager: {
              uploadFile,
              assets: [],
            },
          }}
            onEditor={onEditor}
          />
        </div>
      </div>
    </>
  )
}
