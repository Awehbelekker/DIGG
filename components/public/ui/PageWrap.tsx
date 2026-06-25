export default function PageWrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-7 ${className}`}>
      {children}
    </div>
  )
}
