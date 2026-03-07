type ImagePlaceholderProps = {
  className?: string
  aspectRatio?: 'video' | '4/3' | 'square' | 'auto'
  label?: string
}

const aspectClass: Record<NonNullable<ImagePlaceholderProps['aspectRatio']>, string> = {
  'video': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  'square': 'aspect-square',
  'auto': '',
}

export default function ImagePlaceholder({
  className = '',
  aspectRatio = '4/3',
  label = 'Image',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`${aspectClass[aspectRatio]} ${aspectRatio === 'auto' ? 'min-h-[200px]' : ''} w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-2 ${className}`}
      aria-hidden
    >
      <svg
        className="w-12 h-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="text-gray-400 text-sm font-medium">{label}</span>
    </div>
  )
}
