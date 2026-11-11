import { SignIn, SignUp } from '@clerk/react'
import { createBrowserRouter, Navigate } from 'react-router'
import { AuthLayout } from '@/app/AuthLayout'
import { LegacyRedirect } from '@/app/LegacyRedirect'
import { NotFoundPage } from '@/app/NotFoundPage'
import { ProtectedLayout } from '@/app/ProtectedLayout'
import { PublicLayout } from '@/app/PublicLayout'
import { RootLayout } from '@/app/RootLayout'
import { AlertSourcesPage } from '@/features/alert-sources/pages/AlertSourcesPage'
import { ClustersPage } from '@/features/clusters/pages/ClustersPage'
import { AppContactPage } from '@/features/contact/pages/AppContactPage'
import { ContactPage } from '@/features/contact/pages/ContactPage'
import { IncidentPage } from '@/features/incidents/pages/IncidentPage'
import { IncidentsPage } from '@/features/incidents/pages/IncidentsPage'
import { OverviewPage } from '@/features/incidents/pages/OverviewPage'
import { LandingPage } from '@/features/landing/pages/LandingPage'
import { PrivacyPage } from '@/features/legal/pages/PrivacyPage'
import { TermsPage } from '@/features/legal/pages/TermsPage'
import { IntegrationsPage } from '@/features/mcp-servers/pages/IntegrationsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'

const legacyPaths = [
  '/overview',
  '/incidents',
  '/incidents/:incidentId',
  '/clusters',
  '/alert-sources',
  '/integrations',
  '/settings',
]

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <LandingPage /> },
          { path: '/contact', element: <ContactPage /> },
          { path: '/privacy', element: <PrivacyPage /> },
          { path: '/terms', element: <TermsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: '/sign-in/*', element: <SignIn path="/sign-in" /> },
          { path: '/sign-up/*', element: <SignUp path="/sign-up" /> },
        ],
      },
      {
        path: '/app',
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <Navigate to="/app/overview" replace /> },
          { path: 'overview', element: <OverviewPage /> },
          { path: 'incidents', element: <IncidentsPage /> },
          { path: 'incidents/:incidentId', element: <IncidentPage /> },
          { path: 'clusters', element: <ClustersPage /> },
          { path: 'alert-sources', element: <AlertSourcesPage /> },
          { path: 'integrations', element: <IntegrationsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'contact', element: <AppContactPage /> },
        ],
      },
      ...legacyPaths.map((path) => ({ path, element: <LegacyRedirect /> })),
    ],
  },
])
