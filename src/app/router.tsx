import { SignIn, SignUp } from '@clerk/react'
import { createBrowserRouter } from 'react-router'
import { AuthLayout } from '@/app/AuthLayout'
import { ProtectedLayout } from '@/app/ProtectedLayout'
import { RootLayout } from '@/app/RootLayout'
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
          { index: true },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
