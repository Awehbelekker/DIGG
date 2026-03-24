import type { Component, Editor } from 'grapesjs'
import { showToast } from '@/components/admin/Toast'

/** Aligns with common “phone / small tablet” layout breakpoint */
const MEDIA_MOBILE = '(max-width: 767px)'

function getOrCreateRspClass(comp: Component): string {
  const attrs = comp.getAttributes()
  let cls = attrs['data-digg-rsp'] as string | undefined
  if (!cls) {
    cls = `digg-rsp-${Math.random().toString(36).slice(2, 11)}`
    comp.addAttributes({ 'data-digg-rsp': cls })
  }
  comp.addClass(cls)
  return cls
}

function requireSelection(editor: Editor): Component | null {
  const c = editor.getSelected()
  if (!c) {
    showToast('Select a block first.', 'info')
    return null
  }
  if (c.is('wrapper')) {
    showToast('Select a section or element — not the whole page.', 'info')
    return null
  }
  return c
}

function setMobileRule(editor: Editor, comp: Component, style: Record<string, string>) {
  const cls = getOrCreateRspClass(comp)
  editor.Css.setRule(`.${cls}`, style, {
    atRuleType: 'media',
    atRuleParams: MEDIA_MOBILE,
    addStyles: true,
  })
}

/**
 * One-click helpers that add @media (max-width: 767px) rules scoped to the selection.
 */
export function registerMobileResponsiveCommands(editor: Editor) {
  editor.Commands.add('digg:mobile-stack', {
    run() {
      const c = requireSelection(editor)
      if (!c) return
      setMobileRule(editor, c, {
        'flex-direction': 'column',
        'align-items': 'stretch',
        'flex-wrap': 'nowrap',
        gap: '1rem',
      })
      showToast('Mobile: stack columns (≤767px). Use device preview to check.')
    },
  })

  editor.Commands.add('digg:mobile-full', {
    run() {
      const c = requireSelection(editor)
      if (!c) return
      setMobileRule(editor, c, {
        width: '100%',
        'max-width': '100%',
        'box-sizing': 'border-box',
      })
      showToast('Mobile: full width (≤767px).')
    },
  })

  editor.Commands.add('digg:mobile-text', {
    run() {
      const c = requireSelection(editor)
      if (!c) return
      setMobileRule(editor, c, {
        'font-size': '1rem',
        'line-height': '1.5',
      })
      showToast('Mobile: comfortable text size (≤767px).')
    },
  })
}
