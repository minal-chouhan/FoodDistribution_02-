import { useState } from 'react'

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'donor', label: 'Donor' },
  { value: 'receiver', label: 'Receiver' },
]

export default function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('donor')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name or organization.')
      return
    }
    setError('')
    onLogin({ name: name.trim(), role })
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[36px] border border-[#E7E1D8] bg-white p-8 shadow-[0_24px_60px_-40px_rgba(26,22,18,0.35)]">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-[#7A6F63] font-semibold">No Food Left</p>
          <h1 className="mt-2 text-3xl font-black text-[#1A1612]">Welcome back</h1>
          <p className="mt-3 text-sm text-[#7A6F63]">Login to continue as admin, donor, or receiver.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#4C4B48] mb-2">Name or Organization</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spice Garden or Riya"
              className="w-full rounded-3xl border border-[#E2DAD0] bg-[#FAF8F4] px-4 py-3 text-sm text-[#1A1612] outline-none transition focus:border-[#1D7A45]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4C4B48] mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-3xl border border-[#E2DAD0] bg-[#FAF8F4] px-4 py-3 text-sm text-[#1A1612] outline-none transition focus:border-[#1D7A45]"
            >
              {roles.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {error && <div className="rounded-3xl bg-[#FFF2F2] px-4 py-3 text-sm text-[#B03232]">{error}</div>}

          <button
            type="submit"
            className="w-full rounded-3xl bg-[#1A1612] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#33302c]"
          >
            Continue as {role}
          </button>
        </form>

        <div className="mt-8 rounded-3xl bg-[#F7F9F4] p-4 text-sm text-[#4C4B48]">
          <p className="font-semibold text-[#1A1612] mb-3">Quick start</p>
          <div className="flex flex-wrap gap-2">
            {roles.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setName(option.label)
                  setRole(option.value)
                  setError('')
                  onLogin({ name: option.label, role: option.value })
                }}
                className="rounded-full border border-[#E2DAD0] bg-white px-4 py-2 text-xs font-semibold text-[#1A1612] hover:bg-[#EDE8DE]"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
