'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChartBar, Clapperboard, Dna, Film, Home, List, Plus, Settings } from "lucide-react"
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    icon: Home,
    subItems: [
      {
        title: "Dashboard",
        url: "/",
        icon: ChartBar,
      },
    ],
  },
  {
    title: "Genres",
    icon: Dna,
    subItems: [
      {
        title: "List Genres",
        url: "/genres",
        icon: List,
      },
      {
        title: "Add Genre",
        url: "/genres/new",
        icon: Plus,
      },
    ],
  },
  {
    title: "Movies",
    icon: Clapperboard,
    subItems: [
      {
        title: "List Movies",
        url: "/movies",
        icon: List,
      },
      {
        title: "Add Movie",
        url: "/movies/new",
        icon: Plus,
      },
    ],
  },
  {
    title: "Series",
    icon: Film,
    subItems: [
      {
        title: "List Series",
        url: "/series",
        icon: List,
      },
      {
        title: "Add Series",
        url: "/series/new",
        icon: Plus,
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    subItems: [
      {
        title: "Profile",
        url: "/settings",
        icon: List,
      }
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 bg-slate-800 text-white">
        <h2 className="text-lg font-semibold">Apsara Entertainment</h2>
      </SidebarHeader>

      <SidebarContent className="px-4 bg-slate-800 text-white">
        {items.map((item) => (
          <div key={item.title}>
            <SidebarGroup />
            <SidebarGroupLabel className="text-white">
              <item.icon />
              <span className="ml-2">{item.title}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent className="ml-2">
              <SidebarMenu>
                {item.subItems.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild isActive={pathname === subItem.url}>
                      <a href={subItem.url}>
                        <subItem.icon />
                        <span>{subItem.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 bg-slate-800 text-white" />
    </Sidebar>
  )
}
{/* <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            Help
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent />
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible> */}