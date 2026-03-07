'use client'

import { useEffect } from 'react'

/**
 * Suppresses the harmless "play() request was interrupted by pause()" AbortError
 * that can occur when video/audio is unmounted or navigated away before play() resolves.
 * See https://goo.gl/LdLk22
 */
export default function SuppressPlayAbortError() {
  useEffect(() => {
    const handler = (e: PromiseRejectionEvent) => {
      const reason = e?.reason
      if (reason?.name === 'AbortError' && typeof reason?.message === 'string' && reason.message.includes('play')) {
        e.preventDefault()
      }
    }
    globalThis.addEventListener('unhandledrejection', handler)
    return () => globalThis.removeEventListener('unhandledrejection', handler)
  }, [])
  return null
}
