export default function WhatsAppButton() {
  const whatsappMessage = encodeURIComponent(
    "Hi DIGG team, I found you online and would love to chat about my property."
  )
  const whatsappUrl = `https://wa.me/27827077080?text=${whatsappMessage}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition-transform z-50"
      aria-label="Chat on WhatsApp"
    >
      💬
    </a>
  )
}
