interface GjsPageRendererProps {
  html: string
  css: string
}

export default function GjsPageRenderer({ html, css }: GjsPageRendererProps) {
  return (
    <div className="min-h-screen gjs-rendered-page">
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
