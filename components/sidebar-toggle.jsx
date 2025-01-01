import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function SidebarToggle() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is the breakpoint for md in Tailwind
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile);
  }, [])

  const toggleSidebar = () => {
    const event = new CustomEvent('toggleSidebar')
    window.dispatchEvent(event)
  }

  if (!isMobile) return null

  return (
    (<Button
      variant="outline"
      size="icon"
      className="fixed top-4 left-4 z-50 md:hidden"
      onClick={toggleSidebar}>
      <Menu className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle Menu</span>
    </Button>)
  );
}

