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
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState(page?.title || 'Untitled page')
  const [slug, setSlug] = useState(page?.slug || '')
  const [published, setPublished] = useState(page?.published ?? true)
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [metaTitle, setMetaTitle] = useState(page?.meta_title || '')
  const [metaDescription, setMetaDescription] = useState(page?.meta_description || '')
  const [metaOgImage, setMetaOgImage] = useState(page?.meta_og_image || '')

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
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave])

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
  }, [page])

  const uploadFile = useCallback(async (e: DragEvent | Event) => {
    const files = (e as DragEvent).dataTransfer
      ? (e as DragEvent).dataTransfer!.files
      : ((e as Event).target as HTMLInputElement).files
    if (!files) return

    const urls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `grapesjs/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error } = await supabase.storage
        .from('hero-images')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (error) {
        showToast(`Upload failed: ${error.message}`, 'error')
        continue
      }

      const { data: publicData } = supabase.storage
        .from('hero-images')
        .getPublicUrl(path)
      urls.push(publicData.publicUrl)
    }

    if (editorRef.current && urls.length) {
      editorRef.current.AssetManager.add(urls.map(u => ({ src: u, type: 'image' as const })))
    }
  }, [supabase])

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gray-100">
      {/* Top bar */}
      <div className="h-14 bg-[#1B2A6B] flex items-center px-4 gap-3 shrink-0 shadow-lg z-50">
        <button
          onClick={() => router.push('/admin/pages')}
          className="text-white/70 hover:text-white transition-colors"
          title="Back to pages"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
        </button>

        <div className="h-6 w-px bg-white/20" />

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Page title"
          placeholder="Page title"
          className="bg-transparent text-white font-semibold text-sm border-none outline-none focus:ring-1 focus:ring-[#5BC8E8] rounded px-2 py-1 w-48"
        />

        <div className="flex-1" />

        {/* Device toggles */}
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
          {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
            <button
              key={d}
              onClick={() => handleDeviceChange(d)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeDevice === d ? 'bg-white text-[#1B2A6B]' : 'text-white/70 hover:text-white'
              }`}
            >
              {d === 'desktop' ? '\uD83D\uDDA5' : d === 'tablet' ? '\uD83D\uDCF1' : '\uD83D\uDCF2'} {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-white/20" />

        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="text-white/70 hover:text-white transition-colors"
          title="Page settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>

        {/* Published toggle */}
        <button
          onClick={() => setPublished(!published)}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
            published ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
          }`}
        >
          {published ? 'Published' : 'Draft'}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#F7941D] text-white px-5 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#e6850a] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

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
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Meta Title</span>
              <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Meta Description</span>
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">OG Image URL</span>
              <input type="text" value={metaOgImage} onChange={(e) => setMetaOgImage(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F7941D] focus:border-transparent" />
            </label>
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
                      defaults: 'Montserrat, sans-serif',
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
                  name: 'General',
                  open: false,
                  properties: [
                    'display', 'float', 'position',
                    'top', 'right', 'bottom', 'left',
                  ],
                },
                {
                  name: 'Dimension',
                  open: false,
                  properties: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                },
                {
                  name: 'Decorations',
                  open: false,
                  properties: [
                    'opacity', 'border-radius', 'border', 'box-shadow',
                    'background', 'background-color',
                  ],
                },
                {
                  name: 'Extra',
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
