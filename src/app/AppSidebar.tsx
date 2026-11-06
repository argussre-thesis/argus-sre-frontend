import { OrganizationSwitcher } from '@clerk/react'
import { Plug, Server, Settings, Siren, Webhook } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const navItems = [
  { to: '/incidents', label: 'Incidents', icon: Siren },
  { to: '/clusters', label: 'Clusters', icon: Server },
  { to: '/alert-sources', label: 'Alert sources', icon: Webhook },
  { to: '/integrations', label: 'Integrations', icon: Plug },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppSidebar() {
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader>
        <OrganizationSwitcher hidePersonal />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.to)}>
                    {/* On mobile the sidebar is a sheet over the page; close it once a page is picked. */}
                    <Link to={item.to} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
