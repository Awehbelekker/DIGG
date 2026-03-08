import { GOOGLE_FONT_OPTIONS, googleFontsUrl } from '@/lib/google-fonts'

interface GjsPageRendererProps {
  html: string
  css: string
}

export default function GjsPageRenderer({ html, css }: GjsPageRendererProps) {
  return (
    <div className="min-h-screen gjs-rendered-page">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={googleFontsUrl(GOOGLE_FONT_OPTIONS)} />
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
