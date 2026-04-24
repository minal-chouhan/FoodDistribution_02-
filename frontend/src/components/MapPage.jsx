import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { foodAPI } from '../api'
import { Badge } from './UI'

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom colored icons
const makeIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const greenIcon  = makeIcon('#1D7A45')
const amberIcon  = makeIcon('#9A5700')
const redIcon    = makeIcon('#B03232')
const grayIcon   = makeIcon('#B5AA9E')

// Zone coordinates (Indore areas — approximate)
const ZONE_COORDS = {
  'Vijay Nagar': [22.7196, 75.8577],
  'Palasia':     [22.7189, 75.8799],
  'MG Road':     [22.7179, 75.8673],
  'Scheme 54':   [22.7350, 75.8850],
  'Race Course': [22.7259, 75.8762],
  'Rajwada':     [22.7170, 75.8570],
  'Bhawarkuan':  [22.6975, 75.8569],
}

export default function MapPage({ refresh }) {
  const [listings, setListings] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    foodAPI.getAll().then(r => setListings(r.data.listings))
  }, [refresh])

  const getCoords = (l) => {
    const base = ZONE_COORDS[l.zone] || [22.7196, 75.8577]
    // Slightly randomize so markers don't overlap
    return [base[0] + (Math.random() - 0.5) * 0.008, base[1] + (Math.random() - 0.5) * 0.008]
  }

  const getIcon = (l) => {
    if (l.status === 'claimed') return grayIcon
    if (l.expiry_level === 'urgent') return redIcon
    if (l.expiry_level === 'moderate') return amberIcon
    return greenIcon
  }

  const expBadge = e => e === 'fresh' ? 'green' : e === 'moderate' ? 'amber' : 'red'

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-syne text-3xl font-black mb-1">Food map — <span className="text-[#1D7A45]">Indore</span></h1>
      <p className="text-sm text-[#7A6F63] mb-4">Click any marker to see details and accept pickup.</p>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs text-[#7A6F63]">
        {[['#1D7A45','Fresh'],['#9A5700','Moderate'],['#B03232','Urgent'],['#B5AA9E','Claimed']].map(([c,l]) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm inline-block" style={{background:c}}/>
            {l}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-2xl overflow-hidden border border-[#E2DAD0]" style={{height:'480px'}}>
          <MapContainer center={[22.7196, 75.8577]} zoom={13} style={{height:'100%',width:'100%'}}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {listings.map(l => {
              const coords = getCoords(l)
              return (
                <Marker key={l.id} position={coords} icon={getIcon(l)}
                  eventHandlers={{ click: () => setSelected(l) }}>
                  <Popup>
                    <div style={{fontFamily:'DM Sans,sans-serif',minWidth:'160px'}}>
                      <strong style={{fontFamily:'Syne,sans-serif'}}>{l.food_name}</strong><br/>
                      <span style={{fontSize:'12px',color:'#7A6F63'}}>{l.donor_name}</span><br/>
                      <span style={{fontSize:'12px',fontWeight:600,color: l.expiry_level==='urgent'?'#B03232':l.expiry_level==='moderate'?'#9A5700':'#1D7A45'}}>
                        {l.quantity} {l.unit} · {l.expiry_level}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3">
          {selected ? (
            <div className="bg-white border border-[#E2DAD0] rounded-2xl p-4 animate-fade-up">
              <h3 className="font-syne font-bold text-base mb-1">{selected.food_name}</h3>
              <p className="text-xs text-[#7A6F63] mb-3">{selected.donor_name} · {selected.zone}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge variant={expBadge(selected.expiry_level)}>{selected.expiry_level}</Badge>
                <Badge variant={selected.food_type === 'veg' ? 'green' : 'amber'}>{selected.food_type}</Badge>
                <Badge variant="blue">{selected.quantity} {selected.unit}</Badge>
              </div>
              {selected.allergens?.length > 0 && (
                <div className="text-xs bg-[#FDEAEA] text-[#B03232] rounded-lg p-2 mb-2">
                  ⚠️ {selected.allergens.join(', ')}
                </div>
              )}
              <p className="text-xs text-[#7A6F63] mb-3">{selected.address}</p>
              <span className={`block w-full text-center py-2 rounded-xl text-sm font-medium ${
                selected.status === 'available' ? 'bg-[#1D7A45] text-white cursor-pointer hover:bg-[#155E36]'
                : 'bg-[#F0EDE6] text-[#B5AA9E]'}`}>
                {selected.status === 'available' ? 'Available for pickup' : `✓ Claimed by ${selected.accepted_by}`}
              </span>
              <button className="w-full text-xs text-[#7A6F63] mt-2 hover:text-[#1A1612]" onClick={() => setSelected(null)}>
                Close ✕
              </button>
            </div>
          ) : (
            <div className="bg-white border border-[#E2DAD0] rounded-2xl p-4">
              <div className="font-syne text-sm font-bold text-[#B5AA9E] uppercase tracking-wider mb-3">All listings</div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {listings.map(l => (
                  <button key={l.id} onClick={() => setSelected(l)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#F0EDE6] transition-colors border border-transparent hover:border-[#E2DAD0]">
                    <div className="text-sm font-medium truncate">{l.food_name}</div>
                    <div className="text-xs text-[#7A6F63]">{l.zone} · {l.quantity} {l.unit}</div>
                    <div className={`text-xs mt-0.5 font-medium ${
                      l.status === 'claimed' ? 'text-[#B5AA9E]'
                      : l.expiry_level === 'urgent' ? 'text-[#B03232]'
                      : 'text-[#1D7A45]'}`}>
                      {l.status === 'claimed' ? '✓ claimed' : l.expiry_level}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
