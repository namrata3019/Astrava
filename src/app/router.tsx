import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NotFoundPage } from '../pages/ComingSoonPage'

const AccountPage = lazy(() => import('../pages/AccountPage'))
const ConversationPage = lazy(() => import('../pages/ConversationPage'))
const BirthDetailsPage = lazy(() => import('../pages/BirthDetailsPage'))
const ChartPage = lazy(() => import('../pages/ChartPage'))
const HomePage = lazy(() => import('../pages/HomePage'))
const InterpretationPage = lazy(() => import('../pages/InterpretationPage'))
const MethodologyPage = lazy(() => import('../pages/MethodologyPage'))
const ReportsPage = lazy(() => import('../pages/ReportsPage'))

function PageLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-ivory">
      <p className="text-sm text-ink/70" role="status">Loading page…</p>
    </main>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/birth-details',
    element: <BirthDetailsPage />,
  },
  {
    path: '/chart',
    element: <ChartPage />,
  },
  {
    path: '/account',
    element: (
      <Suspense fallback={<PageLoading />}>
        <AccountPage />
      </Suspense>
    ),
  },
  {
    path: '/explore',
    element: (
      <Suspense fallback={<PageLoading />}>
        <ConversationPage />
      </Suspense>
    ),
  },
  {
    path: '/interpretation',
    element: (
      <Suspense fallback={<PageLoading />}>
        <InterpretationPage />
      </Suspense>
    ),
  },
  {
    path: '/reports',
    element: (
      <Suspense fallback={<PageLoading />}>
        <ReportsPage />
      </Suspense>
    ),
  },
  {
    path: '/methodology',
    element: (
      <Suspense fallback={<PageLoading />}>
        <MethodologyPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
