export interface Page {
  id: string
  slug: string
  title: string
  content: PageContent
  meta_title: string | null
  meta_description: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface PageContent {
  sections: PageSection[]
}

export interface PageSection {
  type: 'hero' | 'text' | 'grid' | 'stats' | 'products' | 'cta' | 'form'
  data: Record<string, any>
}

export interface Image {
  id: string
  filename: string
  url: string
  folder: 'hero' | 'logo' | 'team' | 'portfolio'
  alt_text: string | null
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string | Record<string, any>
  updated_at: string
}

export interface FormSubmission {
  id: string
  form_type: 'contact' | 'agent'
  data: Record<string, any>
  created_at: string
}
