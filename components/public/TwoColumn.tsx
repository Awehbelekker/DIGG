import ImageWithPlaceholder from './ImageWithPlaceholder'
import RevealSection from './RevealSection'

type TwoColumnProps = {
  heading: string
  body: string
  imageUrl?: string
  imageAlt?: string
  reversed?: boolean
}

export default function TwoColumn({ heading, body, imageUrl, imageAlt, reversed }: TwoColumnProps) {
  return (
    <RevealSection className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reversed ? 'lg:[direction:rtl]' : ''}`}>
          <div className={reversed ? 'lg:[direction:ltr]' : ''}>
            {heading && (
              <h2 className="text-3xl font-bold text-[#1B2A6B] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                {heading}
              </h2>
            )}
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">{body}</div>
          </div>
          <div className={`rounded-2xl overflow-hidden ${reversed ? 'lg:[direction:ltr]' : ''}`}>
            <ImageWithPlaceholder
              src={imageUrl}
              alt={imageAlt || heading}
              aspectRatio="4/3"
              placeholderLabel="Image"
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </RevealSection>
  )
}
