import { OrganizationSwitcher } from '@clerk/react'
import { LayoutDashboard, MessageSquare, Plug, Server, Settings, Siren, Webhook } from 'lucide-react'
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
import { contactEnabled } from '@/lib/features'

const navItems = [
  { to: '/app/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/app/incidents', label: 'Incidents', icon: Siren },
  { to: '/app/clusters', label: 'Clusters', icon: Server },
  { to: '/app/alert-sources', label: 'Alert sources', icon: Webhook },
  { to: '/app/integrations', label: 'Integrations', icon: Plug },
  { to: '/app/settings', label: 'Settings', icon: Settings },
  ...(contactEnabled ? [{ to: '/app/contact', label: 'Contact', icon: MessageSquare }] : []),
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
