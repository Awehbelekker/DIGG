'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type AdminUnsavedContextValue = {
  /** True when the active admin route reports unsaved edits (for nav + logout guard). */
  unsaved: boolean
  setRouteUnsaved: (dirty: boolean) => void
}

const AdminUnsavedContext = createContext<AdminUnsavedContextValue | null>(null)

export function AdminUnsavedProvider({ children }: { children: React.ReactNode }) {
  const [unsaved, setUnsaved] = useState(false)
  const setRouteUnsaved = useCallback((dirty: boolean) => {
    setUnsaved(dirty)
  }, [])

  const value = useMemo(() => ({ unsaved, setRouteUnsaved }), [unsaved, setRouteUnsaved])

  return <AdminUnsavedContext.Provider value={value}>{children}</AdminUnsavedContext.Provider>
}

/** Sync this route’s dirty flag so AdminNav can prompt before leaving. */
export function useRegisterAdminNavUnsaved(dirty: boolean) {
  const ctx = useContext(AdminUnsavedContext)
  useEffect(() => {
    if (!ctx) return
    ctx.setRouteUnsaved(dirty)
    return () => {
      ctx.setRouteUnsaved(false)
    }
  }, [ctx, dirty])
}

export function useAdminNavUnsavedFlag() {
  return useContext(AdminUnsavedContext)?.unsaved ?? false
}
