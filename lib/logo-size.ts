export type LogoSize = 'small' | 'medium' | 'large'

export function logoImageClassName(size: LogoSize | undefined, placement: 'nav' | 'footer'): string {
  const base = 'w-auto object-contain'
  if (placement === 'nav') {
    switch (size) {
      case 'small':
        return `${base} h-8 sm:h-9 max-h-10`
      case 'large':
        return `${base} h-12 sm:h-14 md:h-[4.25rem] max-h-[4.5rem]`
      default:
        return `${base} h-10 sm:h-11 md:h-12 max-h-14`
    }
  }
  switch (size) {
    case 'small':
      return `${base} h-9 sm:h-10 max-h-11`
    case 'large':
      return `${base} h-14 sm:h-16 md:h-[4.5rem] max-h-[5rem]`
    default:
      return `${base} h-11 sm:h-12 md:h-14 max-h-16`
  }
}

export function logoWordmarkClassName(size: LogoSize | undefined, placement: 'nav' | 'footer'): string {
  if (placement === 'nav') {
    switch (size) {
      case 'small':
        return 'text-[1.5rem] sm:text-[1.65rem]'
      case 'large':
        return 'text-[2.25rem] sm:text-[2.75rem] md:text-[3rem]'
      default:
        return 'text-[1.75rem] sm:text-[2rem]'
    }
  }
  switch (size) {
    case 'small':
      return 'text-[1.65rem]'
    case 'large':
      return 'text-[2.5rem] sm:text-[3rem]'
    default:
      return 'text-[2rem]'
  }
}
