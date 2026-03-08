'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

export default function useHistory<T>(initial: T) {
  const [past, setPast] = useState<T[]>([])
  const [present, setPresent] = useState<T>(initial)
  const [future, setFuture] = useState<T[]>([])
  const skipRef = useRef(false)

  const push = useCallback((value: T) => {
    setPresent((prev) => {
      setPast((p) => [...p.slice(-49), prev])
      setFuture([])
      return value
    })
  }, [])

  const set = useCallback((value: T) => {
    skipRef.current = true
    setPresent(value)
  }, [])

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p
      const prev = p[p.length - 1]
      setFuture((f) => [present, ...f])
      setPresent(prev)
      return p.slice(0, -1)
    })
  }, [present])

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f
      const next = f[0]
      setPast((p) => [...p, present])
      setPresent(next)
      return f.slice(1)
    })
  }, [present])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  return {
    state: present,
    push,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }
}
