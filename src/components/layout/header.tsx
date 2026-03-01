"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { AuthModal } from "@/components/auth/auth-modal";

export function Header() {
  const t = useTranslations("nav");
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const user = session?.backendUser ?? (session?.user as { name?: string; email?: string; image?: string } | undefined);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/tournaments", label: t("tournaments") },
    { href: "/clubs", label: t("clubs") },
    { href: "/groups", label: t("groups") },
  ];

  const openAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    signOut({ redirect: false });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-primary shadow-lg">
        <div className="mx-auto flex h-[72px] max-w-container items-center justify-between px-6 lg:px-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight text-white">
              5<span className="text-white">SPORT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 text-white hover:bg-white/20 hover:text-white"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          ("avatarUrl" in user
                            ? user.avatarUrl
                            : "image" in user
                              ? user.image
                              : undefined) as string | undefined
                        }
                      />
                      <AvatarFallback className="bg-white/20 text-xs font-bold text-white">
                        {(
                          ("displayName" in user
                            ? user.displayName
                            : "name" in user
                              ? user.name
                              : user.email) ?? "U"
                        )
                          ?.charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[120px] truncate text-sm">
                      {("displayName" in user
                        ? user.displayName
                        : "name" in user
                          ? user.name
                          : user.email) ?? "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    {t("profile")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 hover:text-white"
                  onClick={() => openAuth("login")}
                >
                  {t("login")}
                </Button>
                <Button
                  size="sm"
                  className="bg-green-500 font-semibold text-white hover:bg-green-600"
                  onClick={() => openAuth("register")}
                >
                  {t("register")}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <MobileNav onOpenAuth={openAuth} user={user} onSignOut={handleSignOut} />
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </>
  );
}
