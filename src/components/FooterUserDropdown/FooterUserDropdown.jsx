import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOut,
  Bell,
  CreditCard,
  Settings,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { GetUser } from "@/Network/Super_Admin/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/auth/authSlice";


const menuItems = [
  {
    label: "Upgrade to Pro",
    icon: Star,
    to: "/upgrade",
  },
  {
    label: "Account",
    icon: Settings,
    to: "/account",
  },
  {
    label: "Billing",
    icon: CreditCard,
    to: "/eduworm-admin/Invoice-List",
  },
  {
    label: "Notifications",
    icon: Bell,
    to: "/notifications",
  },
];

const bottomItems = [
  {
    label: "Log out",
    icon: LogOut,
    to: "/logout",
  },
];

export function FooterUserDropdown() {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = GetUser();
    if (userData) {
      setUser(userData);
    } else {
      setUser(null);
    }
  },[])

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="bg-slate-200 p-2 rounded-md cursor-pointer">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.substring(0, 2)?.toUpperCase() }
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || "Demo"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "Demo@gmail.com"}</p>
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="start"
        className="w-56 bg-popover mb-4 ml-4"
      >
        {/* Header Info */}
        <div className="flex items-center space-x-3 p-3">
          <Avatar>
            <AvatarImage src="/avatar.png" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user?.name || "Demo"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "Demo@gmail.com"}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Dynamic Navigation Items */}
        {menuItems.map(({ label, icon: Icon, to }) => (
          <Link to={to} key={label}>
            <DropdownMenuItem>
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </DropdownMenuItem>
          </Link>
        ))}

        <DropdownMenuSeparator />

        {/* Bottom Links */}
        {bottomItems.map(({ label, icon: Icon, to }) => (
            <DropdownMenuItem onClick={handleLogout} key={label}>
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
