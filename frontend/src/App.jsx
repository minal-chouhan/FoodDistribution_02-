import { useState, useCallback } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar     from './components/Navbar'
import Dashboard  from './components/Dashboard'
import Donate     from './components/Donate'
import Listings   from './components/Listings'
import MapPage    from './components/MapPage'
import NGOHub     from './components/NGOHub'
import Predict    from './components/Predict'
import Login      from './components/Login'
import AdminPanel from './components/AdminPanel'

export default function App() {
  const [page, setPage]       = useState('login')
  const [refresh, setRefresh] = useState(0)
  const [user, setUser]       = useState(null)

  const onDonateSuccess = useCallback(() => {
    setRefresh((r) => r + 1)
  }, [])

  const handleLogin = useCallback((account) => {
    setUser(account)
    setPage(account.role === 'admin' ? 'admin' : account.role === 'receiver' ? 'listings' : 'donate')
  }, [])

  const handleLogout = useCallback(() => {
    setUser(null)
    setPage('login')
  }, [])

  const navigate = (p) => {
    if (!user) return
    if (p === 'admin' && user.role !== 'admin') return
    setPage(p)
  }

  const currentPage = !user
    ? 'login'
    : page === 'admin' && user.role !== 'admin'
      ? user.role === 'donor' ? 'donate' : 'listings'
      : page

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1A1612',
            color: '#F7F4EE',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#1D7A45', secondary: '#F7F4EE' } },
          error:   { iconTheme: { primary: '#B03232', secondary: '#F7F4EE' } },
        }}
      />

      {user && (
        <Navbar
          page={currentPage}
          setPage={navigate}
          listingCount={refresh}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <main className="min-h-screen bg-[#F7F4EE]">
        {!user && <Login onLogin={handleLogin} />}
        {user && currentPage === 'admin' && <AdminPanel onNavigate={navigate} refresh={refresh} />}
        {user && currentPage === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {user && currentPage === 'donate'    && <Donate    onSuccess={onDonateSuccess} />}
        {user && currentPage === 'listings'  && <Listings  refresh={refresh} />}
        {user && currentPage === 'map'       && <MapPage   refresh={refresh} />}
        {user && currentPage === 'ngo'       && <NGOHub    refresh={refresh} />}
        {user && currentPage === 'predict'   && <Predict user={user} />}
      </main>
    </>
  )
}
