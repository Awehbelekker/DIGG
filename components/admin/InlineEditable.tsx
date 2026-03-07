'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

type InlineEditableProps = {
  value: string
  onChange: (value: string) => void
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  placeholder?: string
  multiline?: boolean
}

export default function InlineEditable({
  value,
  onChange,
  as: Tag = 'span',
  className = '',
  placeholder = 'Click to edit…',
  multiline = false,
}: InlineEditableProps) {
  const ref = useRef<HTMLElement>(null)
  const [editing, setEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    if (!editing) setLocalValue(value)
  }, [value, editing])

  const commit = useCallback(() => {
    setEditing(false)
    const el = ref.current
    if (!el) return
    const text = el.innerText.trim()
    if (text !== value) onChange(text)
  }, [onChange, value])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (ref.current) ref.current.innerText = value
      setEditing(false)
    }
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      commit()
    }
  }, [commit, multiline, value])

  const startEdit = useCallback(() => {
    setEditing(true)
    requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      el.focus()
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(el)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    })
  }, [])

  const isEmpty = !localValue || !localValue.trim()

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
      contentEditable={editing}
      suppressContentEditableWarning
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); startEdit() }}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      className={`${className} inline-editable ${editing ? 'inline-editable--active' : ''} ${isEmpty ? 'inline-editable--empty' : ''}`}
      data-placeholder={placeholder}
      style={{ outline: 'none', minHeight: '1em' }}
    >
      {localValue || ''}
    </Tag>
  )
}
