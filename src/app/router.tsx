import { SignIn, SignUp } from '@clerk/react'
import { createBrowserRouter, Navigate } from 'react-router'
import { AuthLayout } from '@/app/AuthLayout'
import { ProtectedLayout } from '@/app/ProtectedLayout'
import { RootLayout } from '@/app/RootLayout'
import { AlertSourcesPage } from '@/features/alert-sources/pages/AlertSourcesPage'
import { ClustersPage } from '@/features/clusters/pages/ClustersPage'
import { IncidentPage } from '@/features/incidents/pages/IncidentPage'
import { IncidentsPage } from '@/features/incidents/pages/IncidentsPage'
import { McpServersPage } from '@/features/mcp-servers/pages/McpServersPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/sign-in/*', element: <SignIn path="/sign-in" /> },
          { path: '/sign-up/*', element: <SignUp path="/sign-up" /> },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <Navigate to="/incidents" replace /> },
          { path: '/incidents', element: <IncidentsPage /> },
          { path: '/incidents/:incidentId', element: <IncidentPage /> },
          { path: '/clusters', element: <ClustersPage /> },
          { path: '/alert-sources', element: <AlertSourcesPage /> },
          { path: '/mcp-servers', element: <McpServersPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
