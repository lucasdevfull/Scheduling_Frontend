import { db } from '@/db'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export async function getNextId(counterName: string): Promise<number> {
  const counterRef = doc(db, 'counters', counterName)
  const counterSnap = await getDoc(counterRef)
  console.log(counterName)
  if (!counterSnap.exists()) {
    // inicializa com 1
    await setDoc(counterRef, { value: 1 })
    return 1
  } else {
    const data = counterSnap.data()
    const current = typeof data?.value === 'number' ? data.value : Number(data?.value ?? 0)
    const next = current + 1
    await updateDoc(counterRef, { value: next })
    console.log('next id:', next)
    return next
  }
}
