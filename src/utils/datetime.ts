export function timeToHHMM(d: Date) {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
export function hhmmToDate(hhmm: string) {
  const [hh, mm] = hhmm.split(':').map(Number)
  const now = new Date()
  now.setHours(Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0, 0)
  return now
}

export function srtToTime(value: string) {
  const [H, M, S] = value.split(':').map(Number)
  const date = new Date()
  date.setUTCHours(H, M)
  return date
}
