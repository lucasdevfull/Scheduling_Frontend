export function timeToHHMM(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}


export function hhmmToDate(hhmm?: string): Date {
  const now = new Date()
  if (!hhmm) return now
  const parts = hhmm.split(':').map(n => Number(n))
  const hh = Number.isFinite(parts[0]) ? parts[0] : 0
  const mm = Number.isFinite(parts[1]) ? parts[1] : 0
  now.setHours(hh, mm, 0, 0)
  return now
}


export function srtToTime(value?: string): Date {
  const d = new Date()
  if (!value) return d
  const parts = value.split(':').map(n => Number(n))
  const H = Number.isFinite(parts[0]) ? parts[0] : 0
  const M = Number.isFinite(parts[1]) ? parts[1] : 0
  const S = Number.isFinite(parts[2]) ? parts[2] : 0
  d.setHours(H, M, S, 0)
  return d
}
