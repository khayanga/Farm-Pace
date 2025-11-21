'use client'
import { usePathname } from "next/navigation"; 
import { SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { items, navItems } from "../data"
import Link from "next/link"
import { cn } from "@/lib/utils" 
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";

export function AppSidebar() {
  const pathname = usePathname(); 
  
  return (
    <Sidebar className="shadow-md">
      <SidebarHeader>
        {/* <div className="bg-red-200 p-3 rounded-md w-fit">
    <Image
      src="/logo.png"
      alt="FarmPace Logo"
      width={150}
      height={50}
    />
  </div> */}

  <h1 className="test-lg font-bold ml-2 text-primary">SHAMBANY</h1>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url; 
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.url}
                        className={cn(
                          "flex items-center gap-2 ", 
                          isActive 
                            ? "bg-primary-100 text-primary dark:bg-primary-900  dark:text-primary-100" 
                            : "hover:bg-primary-100 dark:hover:bg-primary-900" 
                        )}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={() => signOut()}>Sign out</Button>
        {/* <User/> */}
      </SidebarFooter>
    </Sidebar>
  )
}