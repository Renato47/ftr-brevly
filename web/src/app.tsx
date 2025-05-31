import { Route, Routes } from 'react-router'

import { Links } from './pages/links'
import { NotFound } from './pages/notFound'
import { Redirect } from './pages/redirect'

export function App() {
  return (
    <Routes>
      <Route path="/" Component={Links} />
      <Route path="/:urlEncurtada" Component={Redirect} />

      <Route path="*" Component={NotFound} />
    </Routes>
  )
}
