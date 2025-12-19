import Image from 'next/image'

export function LogoIcon({ className = "w-12 h-12" }) {
  return (
    <Image 
      src="/logo.png" 
      alt="CyclingPRO Logo" 
      width={100} 
      height={100}
      className={className}
      priority
    />
  )
}