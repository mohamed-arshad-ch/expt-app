import { useState } from 'react'
import { Bell, Settings, LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Dummy data for notifications
const notifications = [
  { id: 1, message: "New payment received", time: "2 minutes ago" },
  { id: 2, message: "Meeting scheduled", time: "1 hour ago" },
  { id: 3, message: "New comment on your post", time: "3 hours ago" },
  { id: 4, message: "You have a new follower", time: "5 hours ago" },
  { id: 5, message: "Your subscription is expiring soon", time: "1 day ago" },
]

export function Header() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    (<header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[60px] items-center">
        <div className="flex flex-1 items-center mr-10 justify-end space-x-4">
          <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle notifications</span>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Notifications</h4>
                  <p className="text-sm text-muted-foreground">You have {notifications.length} unread messages.</p>
                </div>
                <div className="grid gap-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 rounded-md p-2 hover:bg-accent">
                      <Bell className="mt-1 h-4 w-4" />
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">shadcn</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    m@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>)
  );
}

