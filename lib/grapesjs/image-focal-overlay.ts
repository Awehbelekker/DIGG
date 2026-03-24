import type { Component, Editor } from 'grapesjs'

const OVERLAY_CLASS = 'digg-img-focal-overlay'

function parseObjectPosition(op: string | undefined): [number, number] {
  if (!op || typeof op !== 'string') return [50, 50]
  const t = op.trim()
  const m = t.match(/^([\d.]+)%\s+([\d.]+)%$/)
  if (m) {
    return [
      Math.min(100, Math.max(0, parseFloat(m[1]))),
      Math.min(100, Math.max(0, parseFloat(m[2]))),
    ]
  }
  return [50, 50]
}

function removeFocalOverlays(editor: Editor) {
  editor.Canvas.getDocument()?.querySelectorAll(`.${OVERLAY_CLASS}`).forEach((n) => n.remove())
}

function mountFocalOverlay(editor: Editor, component: Component) {
  removeFocalOverlays(editor)
  if (component.get('type') !== 'image') return

  const view = component.getView()
  const el = view?.el as HTMLElement | undefined
  if (!el || el.tagName !== 'IMG') return

  const doc = editor.Canvas.getDocument()
  if (!doc) return

  const parent = el.parentElement
  if (!parent) return

  const prev = parent.style.position
  if (!prev || prev === 'static') parent.style.position = 'relative'

  const overlay = doc.createElement('div')
  overlay.className = OVERLAY_CLASS
  overlay.style.cssText =
    'position:absolute;inset:0;z-index:6;cursor:crosshair;pointer-events:auto;border:1px dashed rgba(247,148,29,0.45);box-sizing:border-box;'

  const hint = doc.createElement('div')
  hint.textContent = 'Drag — focal point (what shows in the frame)'
  hint.style.cssText =
    'position:absolute;top:4px;left:4px;font:10px/1.2 system-ui,sans-serif;background:rgba(27,42,107,0.88);color:#fff;padding:3px 7px;border-radius:4px;pointer-events:none;max-width:calc(100% - 8px);'

  const style = component.getStyle() || {}
  const op = (style['object-position'] as string) || '50% 50%'
  const [px, py] = parseObjectPosition(op)

  const dot = doc.createElement('div')
  dot.style.cssText = `position:absolute;width:20px;height:20px;border:3px solid #F7941D;border-radius:50%;background:rgba(255,255,255,0.4);transform:translate(-50%,-50%);left:${px}%;top:${py}%;pointer-events:none;box-shadow:0 1px 4px rgba(0,0,0,0.25);`

  overlay.appendChild(hint)
  overlay.appendChild(dot)

  const applyFromEvent = (e: MouseEvent) => {
    const r = el.getBoundingClientRect()
    if (r.width <= 0 || r.height <= 0) return
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    const cx = Math.max(0, Math.min(100, x))
    const cy = Math.max(0, Math.min(100, y))
    component.addStyle({ 'object-position': `${cx}% ${cy}%` })
    dot.style.left = `${cx}%`
    dot.style.top = `${cy}%`
  }

  overlay.addEventListener('mousedown', (e) => {
    e.preventDefault()
    e.stopPropagation()
    applyFromEvent(e)

    const onMove = (ev: MouseEvent) => {
      applyFromEvent(ev)
    }
    const onUp = () => {
      doc.removeEventListener('mousemove', onMove)
      doc.removeEventListener('mouseup', onUp)
    }
    doc.addEventListener('mousemove', onMove)
    doc.addEventListener('mouseup', onUp)
  })

  parent.appendChild(overlay)
}

/**
 * When an image is selected, show a dashed overlay to drag-set object-position (focal point).
 * Corners still use GrapesJS resize for stretching the frame.
 */
export function registerImageFocalOverlay(editor: Editor) {
  const refresh = () => {
    const sel = editor.getSelected()
    removeFocalOverlays(editor)
    if (sel && sel.get('type') === 'image') mountFocalOverlay(editor, sel)
  }

  editor.on('component:deselected', () => {
    removeFocalOverlays(editor)
  })

  editor.on('component:selected', (component: Component) => {
    removeFocalOverlays(editor)
    if (component.get('type') === 'image') mountFocalOverlay(editor, component)
  })

  editor.on('canvas:frame:load', () => {
    removeFocalOverlays(editor)
    queueMicrotask(refresh)
  })
}
