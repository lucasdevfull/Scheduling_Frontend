import { db } from "@/db"
import { doc, Transaction } from "firebase/firestore";

export async function getNextId(tx: Transaction, counterName: string): Promise<number> {
  const counterRef = doc(db, 'counters', counterName);
  const counterSnap = await tx.get(counterRef);

  if (!counterSnap.exists()) {
    // inicializa com 1
    tx.set(counterRef, { value: 1 });
    return 1;
  } else {
    const data = counterSnap.data();
    const current = typeof data?.value === 'number' ? data.value : Number(data?.value ?? 0);
    const next = current + 1;
    tx.update(counterRef, { value: next });
    return next;
  }
}
