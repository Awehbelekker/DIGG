import ImageWithPlaceholder from './ImageWithPlaceholder'

type TestimonialProps = {
  quote: string
  author: string
  role?: string
  company?: string
  photoUrl?: string
}

export default function Testimonial({ quote, author, role, company, photoUrl }: TestimonialProps) {
  return (
    <section className="bg-[#FAFAFA] py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <svg className="w-10 h-10 text-[#F7941D] mx-auto mb-6 opacity-60" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
        </svg>
        <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 italic">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          {photoUrl && (
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
              <ImageWithPlaceholder src={photoUrl} alt={author} aspectRatio="square" placeholderLabel={author.charAt(0)} className="rounded-full" />
            </div>
          )}
          <div className="text-left">
            <p className="font-semibold text-[#1B2A6B]">{author}</p>
            {(role || company) && (
              <p className="text-sm text-gray-500">{[role, company].filter(Boolean).join(', ')}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
