import { SignIn, SignUp } from '@clerk/react'
import { createBrowserRouter, Navigate } from 'react-router'
import { AuthLayout } from '@/app/AuthLayout'
import { ProtectedLayout } from '@/app/ProtectedLayout'
import { RootLayout } from '@/app/RootLayout'
import { IncidentPage } from '@/features/incidents/pages/IncidentPage'
import { IncidentsPage } from '@/features/incidents/pages/IncidentsPage'
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
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
