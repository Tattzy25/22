"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminModeContextType {
  isAdminMode: boolean
  toggleAdminMode: () => void
  setAdminMode: (mode: boolean) => void
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined)

interface AdminModeProviderProps {
  children: ReactNode
}

export function AdminModeProvider({ children }: AdminModeProviderProps) {
  const [isAdminMode, setIsAdminMode] = useState(false)

  // Load admin mode from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('admin-mode')
    if (saved === 'true') {
      setIsAdminMode(true)
    }
  }, [])

  // Save admin mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('admin-mode', isAdminMode.toString())
  }, [isAdminMode])

  const toggleAdminMode = () => {
    setIsAdminMode(prev => !prev)
  }

  const setAdminMode = (mode: boolean) => {
    setIsAdminMode(mode)
  }

  return (
    <AdminModeContext.Provider value={{ isAdminMode, toggleAdminMode, setAdminMode }}>
      {children}
    </AdminModeContext.Provider>
  )
}

export function useAdminMode() {
  const context = useContext(AdminModeContext)
  if (context === undefined) {
    throw new Error('useAdminMode must be used within an AdminModeProvider')
  }
  return context
}