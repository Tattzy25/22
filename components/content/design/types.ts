export interface ThemeConfig {
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  borderRadius: number
  fontFamily: string
  fontSize: number
}

export interface BrandingAssets {
  logo: string | null
  favicon: string | null
  banner: string | null
  customCSS: string
  customJS: string
}

export const predefinedThemes: ThemeConfig[] = [
  {
    name: 'Default',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: 8,
    fontFamily: 'Inter',
    fontSize: 14
  },
  {
    name: 'Dark',
    primaryColor: '#60a5fa',
    secondaryColor: '#94a3b8',
    accentColor: '#fbbf24',
    backgroundColor: '#1f2937',
    textColor: '#f9fafb',
    borderRadius: 8,
    fontFamily: 'Inter',
    fontSize: 14
  },
  {
    name: 'Minimal',
    primaryColor: '#000000',
    secondaryColor: '#6b7280',
    accentColor: '#ef4444',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    borderRadius: 0,
    fontFamily: 'Helvetica',
    fontSize: 14
  },
  {
    name: 'Colorful',
    primaryColor: '#8b5cf6',
    secondaryColor: '#06b6d4',
    accentColor: '#10b981',
    backgroundColor: '#fef3c7',
    textColor: '#1f2937',
    borderRadius: 12,
    fontFamily: 'Poppins',
    fontSize: 14
  }
]

export const fontFamilies = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Helvetica', 'Arial', 'Georgia', 'Times New Roman'
]