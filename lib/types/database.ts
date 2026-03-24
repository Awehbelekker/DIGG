export type EditorType = 'sections' | 'grapesjs'

export interface Page {
  id: string
  slug: string
  title: string
  content: PageContent
  meta_title: string | null
  meta_description: string | null
  meta_og_image: string | null
  published: boolean
  editor_type: EditorType
  gjs_data: Record<string, unknown> | null
  content_html: string | null
  content_css: string | null
  created_at: string
  updated_at: string
}

export interface PageContent {
  sections: PageSection[]
}

export type SectionType =
  | 'hero'
  | 'text'
  | 'image'
  | 'grid'
  | 'stats'
  | 'products'
  | 'cta'
  | 'form'
  | 'testimonial'
  | 'video'
  | 'gallery'
  | 'two_column'
  | 'logos'
  | 'faq'
  | 'divider'

export interface PageSection {
  type: SectionType
  data: Record<string, unknown>
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
  value: string | Record<string, unknown>
  updated_at: string
}

export interface FormSubmission {
  id: string
  form_type: 'contact' | 'agent'
  data: Record<string, unknown>
  created_at: string
  read?: boolean
  archived?: boolean
}

export interface Insight {
  id: string
  slug: string
  title: string
  body: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface NewsletterSignup {
  id: string
  email: string
  source: string | null
  created_at: string
}

/** Saved GrapesJS component JSON for “My blocks” / reusable sections */
export interface BuilderSnippet {
  id: string
  title: string
  component: Record<string, unknown>
  created_at: string
}
