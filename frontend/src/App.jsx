import { useState, useCallback } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar     from './components/Navbar'
import Dashboard  from './components/Dashboard'
import Donate     from './components/Donate'
import Listings   from './components/Listings'
import MapPage    from './components/MapPage'
import NGOHub     from './components/NGOHub'
import Predict    from './components/Predict'

export default function App() {
  const [page, setPage]       = useState('dashboard')
  const [refresh, setRefresh] = useState(0)

  // Called after a successful donation to refresh listings/stats
  const onDonateSuccess = useCallback(() => {
    setRefresh(r => r + 1)
  }, [])

  const navigate = (p) => setPage(p)

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

      <Navbar
        page={page}
        setPage={setPage}
        listingCount={refresh} // triggers re-render on new listing
      />

      <main>
        {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {page === 'donate'    && <Donate    onSuccess={onDonateSuccess} />}
        {page === 'listings'  && <Listings  refresh={refresh} />}
        {page === 'map'       && <MapPage   refresh={refresh} />}
        {page === 'ngo'       && <NGOHub    refresh={refresh} />}
        {page === 'predict'   && <Predict />}
      </main>
    </>
  )
}
