import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { LogOut, Bell, CreditCard, Settings, Star } from "lucide-react";
  
  export function FooterUserDropdown() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="bg-slate-200 p-2 rounded-md ">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback className={'bg-primary text-primary-foreground'}>SC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">shadcn</p>
              <p className="text-xs text-muted-foreground">m@example.com</p>
            </div>
          </div>
          </div>
        </DropdownMenuTrigger>
  
        <DropdownMenuContent side="right" align="start" className="w-56 bg-popover mb-4 ml-4">

          <div className="flex items-center space-x-3 p-3">
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">shadcn</p>
              <p className="text-xs text-muted-foreground">m@example.com</p>
            </div>
          </div>
  
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Star className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  