import { useState } from 'react'
import { foodAPI } from '../api'
import { Btn, Field, SectionLabel } from './UI'
import toast from 'react-hot-toast'

const ALLERGENS = ['🥜 Nuts','🦐 Prawns/Shellfish','🥛 Dairy','🌾 Gluten/Wheat','🥚 Eggs','🫘 Soy','🐟 Fish','🌰 Sesame','🌶️ Very Spicy','🧅 Onion/Garlic']
const RESTRICTIONS = ['Diabetics (high sugar)','Infants <2 yrs','Elderly (very spicy)','Pregnant women','Jain (onion/garlic)','BP patients (high salt)']
const ZONES = ['Vijay Nagar','Palasia','MG Road','Scheme 54','Race Course','Rajwada','Bhawarkuan','Saket Nagar']

const INIT = {
  food_name:'', donor_name:'', food_type:'veg', quantity:20, unit:'plates',
  zone:'Vijay Nagar', address:'', expiry_level:'fresh',
  cooked_at:'', best_before:'', allergens:[], restrictions:[],
  description:'', contact_name:'', contact_phone:'', pickup_notes:''
}

export default function Donate({ onSuccess }) {
  const [step, setStep]       = useState(1)
  const [form, setForm]       = useState(INIT)
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleList = (key, val) => setForm(f => ({
    ...f,
    [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
  }))

  const submit = async () => {
    if (!form.food_name || !form.donor_name || !form.address) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await foodAPI.add(form)
      setDone(res.data.item)
      toast.success('🔔 4 NGOs notified!')
      onSuccess && onSuccess()
    } catch {
      toast.error('Failed to submit. Is the backend running?')
    }
    setLoading(false)
  }

  const reset = () => { setForm(INIT); setStep(1); setDone(null) }

  if (done) return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center animate-fade-up">
      <div className="w-16 h-16 rounded-2xl bg-[#E6F5ED] flex items-center justify-center text-3xl mx-auto mb-5">✅</div>
      <h2 className="font-syne text-2xl font-black mb-2">Listing published!</h2>
      <p className="text-sm text-[#7A6F63] mb-6">Nearby NGOs have been notified. You'll be contacted once pickup is accepted.</p>
      <div className="bg-white border border-[#E2DAD0] rounded-xl p-4 text-left mb-6 space-y-2">
        {[['Food', done.food_name],['Quantity', `${done.quantity} ${done.unit}`],['Zone', done.zone],['Urgency', done.expiry_level],['NGOs notified','4 nearby']].map(([l,v]) => (
          <div key={l} className="flex justify-between text-sm border-b border-[#F0EDE6] pb-2 last:border-0">
            <span className="text-[#7A6F63]">{l}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
      </div>
      <Btn variant="green" className="w-full justify-center" onClick={reset}>List more food</Btn>
    </div>
  )

  const steps = ['Food Details','Safety Info','Pickup Info','Preview']

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="font-syne text-3xl font-black mb-1">List your <span className="text-[#1D7A45]">surplus food</span></h1>
      <p className="text-sm text-[#7A6F63] mb-6">Fill in details — nearby NGOs get notified instantly.</p>

      {/* Step indicator */}
      <div className="flex rounded-xl overflow-hidden border border-[#E2DAD0] mb-8">
        {steps.map((s, i) => (
          <div key={i} className={`flex-1 py-2.5 text-center text-xs font-medium border-r border-[#E2DAD0] last:border-0 transition-all
            ${step === i+1 ? 'bg-[#1A1612] text-white' : step > i+1 ? 'bg-[#E6F5ED] text-[#1D7A45]' : 'bg-white text-[#B5AA9E]'}`}>
            <span className="font-syne font-bold text-sm block">{i+1}</span>{s}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="step-enter space-y-5">
          <div>
            <SectionLabel>Food type</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              {[['veg','🥦','Vegetarian'],['nonveg','🍗','Non-Veg'],['vegan','🌱','Vegan']].map(([v,e,l]) => (
                <button key={v} onClick={() => set('food_type', v)}
                  className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.food_type === v
                      ? v === 'veg' ? 'border-[#1D7A45] bg-[#E6F5ED] text-[#1D7A45]'
                        : v === 'nonveg' ? 'border-[#9A5700] bg-[#FEF2DC] text-[#9A5700]'
                        : 'border-[#2A7A7A] bg-[#E0F5F5] text-[#2A7A7A]'
                      : 'border-[#E2DAD0] bg-white text-[#7A6F63] hover:bg-[#F0EDE6]'
                  }`}>
                  <span className="block text-xl mb-1">{e}</span>{l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Food name *">
              <input className="w-full px-3 py-2.5 border border-[#E2DAD0] rounded-xl bg-white text-sm"
                placeholder="e.g. Dal Makhani" value={form.food_name}
                onChange={e => set('food_name', e.target.value)} />
            </Field>
            <Field label="Donor / Restaurant *">
              <input className="w-full px-3 py-2.5 border border-[#E2DAD0] rounded-xl bg-white text-sm"
                placeholder="e.g. Spice Garden" value={form.donor_name}
                onChange={e => set('donor_name', e.target.value)} />
            </Field>
          </div>

          <div>
            <SectionLabel>Quantity</SectionLabel>
            <div className="flex items-center gap-4 p-4 bg-[#F0EDE6] rounded-xl">
              <div className="text-center w-14">
                <div className="font-syne text-3xl font-black">{form.quantity}</div>
                <div className="text-[11px] text-[#7A6F63]">{form.unit}</div>
              </div>
              <input type="range" min="1" max="200" value={form.quantity} className="flex-1 accent-[#1D7A45]"
                onChange={e => set('quantity', parseInt(e.target.value))} />
              <select value={form.unit} onChange={e => set('unit', e.target.value)}
                className="px-3 py-2 border border-[#E2DAD0] rounded-lg bg-white text-sm w-24">
                {['plates','kg','litres','pieces','packets'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <Field label="Description (optional)">
            <textarea className="w-full px-3 py-2.5 border border-[#E2DAD0] rounded-xl bg-white text-sm resize-none h-20"
              placeholder="e.g. Full thali — dal, rice, sabzi, roti. Cooked at 7 PM."
              value={form.description} onChange={e => set('description', e.target.value)} />
          </Field>

          <div className="flex justify-end">
            <Btn onClick={() => setStep(2)}>Next: Safety Info →</Btn>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="step-enter space-y-6">
          <div>
            <SectionLabel>Allergen warnings — select all ingredients present</SectionLabel>
            <p className="text-xs text-[#7A6F63] mb-3">Receivers with these allergies will be automatically warned.</p>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map(a => (
                <button key={a} onClick={() => toggleList('allergens', a)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    form.allergens.includes(a)
                      ? 'border-[#B03232] bg-[#FDEAEA] text-[#B03232]'
                      : 'border-[#E2DAD0] bg-white text-[#7A6F63] hover:bg-[#F0EDE6]'
                  }`}>{a}</button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Who should NOT receive this food?</SectionLabel>
            <p className="text-xs text-[#7A6F63] mb-3">Helps NGOs route to the right community.</p>
            <div className="flex flex-wrap gap-2">
              {RESTRICTIONS.map(r => (
                <button key={r} onClick={() => toggleList('restrictions', r)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    form.restrictions.includes(r)
                      ? 'border-[#9A5700] bg-[#FEF2DC] text-[#9A5700]'
                      : 'border-[#E2DAD0] bg-white text-[#7A6F63] hover:bg-[#F0EDE6]'
                  }`}>{r}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
            <Btn onClick={() => setStep(3)}>Next: Pickup Info →</Btn>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="step-enter space-y-5">
          <div>
            <SectionLabel>Freshness / urgency</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              {[['fresh','🟢','Fresh','>4 hours'],['moderate','🟡','Moderate','2–4 hours'],['urgent','🔴','Urgent','<2 hours']].map(([v,e,l,s]) => (
                <button key={v} onClick={() => set('expiry_level', v)}
                  className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.expiry_level === v
                      ? v === 'fresh' ? 'border-[#1D7A45] bg-[#E6F5ED] text-[#1D7A45]'
                        : v === 'moderate' ? 'border-[#9A5700] bg-[#FEF2DC] text-[#9A5700]'
                        : 'border-[#B03232] bg-[#FDEAEA] text-[#B03232]'
                      : 'border-[#E2DAD0] bg-white text-[#7A6F63] hover:bg-[#F0EDE6]'
                  }`}>
                  <span className="block text-lg mb-0.5">{e}</span>{l}
                  <span className="block text-[10px] mt-0.5 opacity-70">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Cooked at">
              <input type="time" className="w-full px-3 py-2.5 border border-[#E2DAD0] rounded-xl bg-white text-sm"
                value={form.cooked_at} onChange={e => set('cooked_at', e.target.value)} />
            </Field>
            <Field label="Best before">
              <input type="datetime-local" className="w-full px-3 py-2.5 border border-[#E2DAD0] rounded-xl bg-white text-sm"
                value={form.best_before} onChange={e => set('best_before', e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Address *">
              <input className="w-full px-3 py-2.5 border border-[#E2DAD0] rounded-xl bg-white text-sm"
                placeholder="12, Vijay Nagar, Indore" value={form.address}
                onChange={e => set('address', e.target.value)} />
            </Field>
            <Field label="Zone">
              <select className="w-full px-3 py-2.5 border border-[#E2DAD0] rounded-xl bg-white text-sm"
                value={form.zone} onChange={e => set('zone', e.target.value)}>
                {ZONES.map(z => <option key={z}>{z}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Contact person">
              <input className="w-full px-3 py-2.5 border border-[#E2DAD0] rounded-xl bg-white text-sm"
                placeholder="Name" value={form.contact_name}
                onChange={e => set('contact_name', e.target.value)} />
            </Field>
            <Field label="Phone">
              <input className="w-full px-3 py-2.5 border border-[#E2DAD0] rounded-xl bg-white text-sm"
                placeholder="+91 98765 00000" value={form.contact_phone}
                onChange={e => set('contact_phone', e.target.value)} />
            </Field>
          </div>

          <Field label="Pickup notes">
            <input className="w-full px-3 py-2.5 border border-[#E2DAD0] rounded-xl bg-white text-sm"
              placeholder="e.g. Call before arriving, use side entrance"
              value={form.pickup_notes} onChange={e => set('pickup_notes', e.target.value)} />
          </Field>

          <div className="flex gap-3 justify-end">
            <Btn variant="ghost" onClick={() => setStep(2)}>← Back</Btn>
            <Btn onClick={() => setStep(4)}>Preview →</Btn>
          </div>
        </div>
      )}

      {/* STEP 4: PREVIEW */}
      {step === 4 && (
        <div className="step-enter space-y-4">
          <SectionLabel>Review before publishing</SectionLabel>
          <div className="bg-white border border-[#E2DAD0] rounded-2xl p-5">
            <h3 className="font-syne text-xl font-black mb-2">{form.food_name || 'Unnamed food'}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                form.expiry_level === 'fresh' ? 'bg-[#E6F5ED] text-[#1D7A45]'
                : form.expiry_level === 'moderate' ? 'bg-[#FEF2DC] text-[#9A5700]'
                : 'bg-[#FDEAEA] text-[#B03232]'}`}>
                {form.expiry_level === 'fresh' ? '🟢 Fresh' : form.expiry_level === 'moderate' ? '🟡 Moderate' : '🔴 Urgent'}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#E6F5ED] text-[#1D7A45] font-medium">
                {form.food_type === 'veg' ? '🥦 Veg' : form.food_type === 'nonveg' ? '🍗 Non-veg' : '🌱 Vegan'}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8EFFA] text-[#1A4E8A] font-medium">{form.quantity} {form.unit}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#EDE8FA] text-[#5B3FA0] font-medium">{form.zone}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[['Donor', form.donor_name || '—'],['Zone', form.zone],['Address', form.address || '—']].map(([l,v]) => (
                <div key={l} className="bg-[#F0EDE6] rounded-lg px-3 py-2">
                  <div className="text-[10px] text-[#B5AA9E]">{l}</div>
                  <div className="text-sm font-medium mt-0.5 truncate">{v}</div>
                </div>
              ))}
            </div>

            {form.allergens.length > 0 && (
              <div className="bg-[#FDEAEA] border border-[#EDBBBB] rounded-xl p-3 flex gap-2 text-sm text-[#B03232] mb-3">
                <span>⚠️</span>
                <span><strong>Allergens:</strong> {form.allergens.join(', ')}</span>
              </div>
            )}
            {form.restrictions.length > 0 && (
              <div className="bg-[#FEF2DC] border border-[#F0D8A0] rounded-xl p-3 flex gap-2 text-sm text-[#9A5700]">
                <span>🚫</span>
                <span><strong>Not for:</strong> {form.restrictions.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Btn variant="ghost" onClick={() => setStep(3)}>← Edit</Btn>
            <Btn variant="green" className="flex-1 justify-center" onClick={submit} disabled={loading}>
              {loading ? 'Publishing…' : '🔔 Publish — notify nearby NGOs'}
            </Btn>
          </div>
        </div>
      )}
    </div>
  )
}
