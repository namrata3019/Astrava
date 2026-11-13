import { createBrowserRouter } from 'react-router-dom'
import { ComingSoonPage, NotFoundPage } from '../pages/ComingSoonPage'
import HomePage from '../pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/birth-details',
    element: <ComingSoonPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
