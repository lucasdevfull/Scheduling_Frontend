// src/repositories/availabilities.repository.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as limitQuery,
  runTransaction,
  setDoc,
  updateDoc,
  deleteDoc,
  getFirestore,
  DocumentReference,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Transaction,
} from 'firebase/firestore'
import { srtToTime } from '@/utils/datetime'
import { Service, UpdateService } from '@/types/services.types'
import { db } from '..'
import { getNextId } from '@/utils/id'

// Helper: pega próximo id dentro de uma transação

export class AvailabilitiesRepository {
  // --- LIST / PAGINATION ---
  async findAll(limit: number, cursor?: number) {
    const serviceCol = collection(db, 'service')
    let q

    if (cursor !== undefined) {
      q = query(serviceCol, where('id', '>', cursor), orderBy('id', 'asc'), limitQuery(limit + 1))
    } else {
      q = query(serviceCol, orderBy('id', 'asc'), limitQuery(limit + 1))
    }

    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q)
    const services = await Promise.all(
      snapshot.docs.map(async (d: QueryDocumentSnapshot<DocumentData>) => {
        const data = d.data()
        const serviceIdNum = typeof data.id === 'number' ? data.id : Number(data.id)

        const serviceData = {
          id: serviceIdNum,
          name: (data.name ?? '') as string,
        }

        // busca availabilities por campo numeric serviceId
        const availQ = query(collection(db, 'availability'), where('serviceId', '==', serviceIdNum))
        const availSnap = await getDocs(availQ)

        const availabilities = availSnap.docs.map(a => {
          const adata = a.data()
          const dayId =
            typeof adata.dayId === 'number' ? adata.dayId : adata.dayId ? Number(adata.dayId) : null

          const startTime = adata.startTime ? srtToTime(adata.startTime).toISOString() : ''
          const endTime = adata.endTime ? srtToTime(adata.endTime).toISOString() : ''

          return {
            id: typeof adata.id === 'number' ? adata.id : Number(adata.id),
            dayId: Number(adata.dayId),
            startTime,
            endTime,
          }
        })

        return {
          ...serviceData,
          availabilities,
        }
      })
    )

    const hasNextPage = snapshot.docs.length > limit
    const trimmed = hasNextPage ? services.slice(0, limit) : services
    const nextCursor = hasNextPage ? (trimmed[trimmed.length - 1]?.id ?? null) : null

    return {
      data: trimmed,
      nextCursor,
      hasNextPage,
    }
  }

  // --- CREATE (usa transação para counters + criação atômica) ---
  async create({ name, availabilities }: Service) {
    const serviceCol = collection(db, 'service')
    const availCol = collection(db, 'availability')
    const dayCol = collection(db, 'day')
    // prefetch days (opcional)
    const daySnap = await getDocs(dayCol)
    const dayById = new Map<number, { id: number }>()
    daySnap.docs.forEach(d => {
      const dd = d.data()
      const numeric = typeof dd?.id === 'number' ? dd.id : Number(dd?.id)
      if (!Number.isNaN(numeric)) dayById.set(numeric, { id: numeric })
    })
    return runTransaction(db, async tx => {
      const nextServiceId = await getNextId('service')
      const newServiceRef = doc(serviceCol, String(nextServiceId))

      tx.set(newServiceRef, {
        id: nextServiceId,
        name,
        createdAt: new Date().toISOString(),
      })

      const createdAvailabilities: Array<any> = []

      for (const a of availabilities) {
        const nextAvailId = await getNextId('availability')
        console.log(nextAvailId)
        //console.log('id: ',nextAvailId)
        const dayIdNumeric = typeof a.dayId === 'number' ? a.dayId : Number(a.dayId)
        // opcional: validar existência do day
        // if (!dayById.has(dayIdNumeric)) throw new Error('Day not found');

        const startTime = srtToTime(a.startTime)
        const endTime = srtToTime(a.endTime)

        const availDocRef = doc(availCol, String(nextAvailId))
        tx.set(availDocRef, {
          id: nextAvailId,
          serviceId: nextServiceId,
          dayId: dayIdNumeric,
          startTime: startTime.toTimeString(),
          endTime: endTime.toTimeString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

        createdAvailabilities.push({
          id: nextAvailId,
          dayId: dayIdNumeric,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })
      }

      return {
        id: nextServiceId,
        name,
        availabilities: createdAvailabilities,
      }
    })
  }

  // --- FIND BY ID (service) ---
  async findById(id: number | string) {
    const numericId = typeof id === 'number' ? id : Number(id)
    const serviceDocRef = doc(db, 'service', String(id))
    const serviceSnap = await getDoc(serviceDocRef)

    if (!serviceSnap.exists()) return null
    const sdata = serviceSnap.data()!

    const availQ = query(collection(db, 'availability'), where('serviceId', '==', numericId))
    const availSnap = await getDocs(availQ)

    const availabilities = availSnap.docs.map(a => {
      const ad = a.data()
      const dayId = typeof ad.dayId === 'number' ? ad.dayId : ad.dayId ? Number(ad.dayId) : null
      const startTime = ad.startTime ? srtToTime(ad.startTime) : null
      const endTime = ad.endTime ? srtToTime(ad.endTime) : null

      return {
        id: typeof ad.id === 'number' ? ad.id : Number(ad.id),
        dayId: dayId!,
        startTime: startTime?.toISOString() ?? null,
        endTime: endTime?.toISOString() ?? null,
      }
    })

    return {
      id: Number(sdata.id) ?? numericId,
      name: String(sdata.name) ?? '',
      availabilities,
    }
  }

  // --- FIND AVAILABILITY BY ID ---
  async findAvailabilitiesById(id: number | string, serviceId: number | string) {
    const numericId = typeof id === 'number' ? id : Number(id)
    const numericServiceId = typeof serviceId === 'number' ? serviceId : Number(serviceId)

    const availQ = query(
      collection(db, 'availability'),
      where('id', '==', numericId),
      where('serviceId', '==', numericServiceId),
      limitQuery(1)
    )
    const availSnap = await getDocs(availQ)
    if (availSnap.empty) return null
    const aDoc = availSnap.docs[0]
    const ad = aDoc.data()

    const dayId = typeof ad.dayId === 'number' ? ad.dayId : ad.dayId ? Number(ad.dayId) : null
    const startTime = ad.startTime ? srtToTime(ad.startTime) : null
    const endTime = ad.endTime ? srtToTime(ad.endTime) : null

    return {
      id: typeof ad.id === 'number' ? ad.id : Number(aDoc.id),
      dayId,
      startTime,
      endTime,
    }
  }

  // --- FIND BY NAME ---
  async findByName(name: string) {
    const serviceQ = query(collection(db, 'service'), where('name', '==', name), limitQuery(1))
    const serviceSnaps = await getDocs(serviceQ)
    if (serviceSnaps.empty) return null
    const serviceDoc = serviceSnaps.docs[0]
    const sdata = serviceDoc.data()
    const numericId = typeof sdata.id === 'number' ? sdata.id : Number(sdata.id)

    const availQ = query(collection(db, 'availability'), where('serviceId', '==', numericId))
    const availSnap = await getDocs(availQ)

    const availabilities = availSnap.docs.map(a => {
      const ad = a.data()
      const dayId = typeof ad.dayId === 'number' ? ad.dayId : ad.dayId ? Number(ad.dayId) : null
      const startTime = ad.startTime ? srtToTime(ad.startTime) : null
      const endTime = ad.endTime ? srtToTime(ad.endTime) : null

      return {
        id: typeof ad.id === 'number' ? ad.id : Number(ad.id),
        dayId,
        startTime: startTime?.toISOString(),
        endTime: endTime?.toISOString(),
      }
    })

    return {
      id: sdata.id ?? numericId,
      name: sdata.name ?? '',
      availabilities,
    }
  }

  // --- UPDATE: upsert availabilities mantendo ids numéricos ---
  async update(id: number | string, data: UpdateService) {
    const numericId = typeof id === 'number' ? id : Number(id)
    console.log(numericId)
    const serviceQ = query(collection(db, 'service'), where('id', '==', numericId), limitQuery(1))
    const serviceSnaps = await getDocs(serviceQ)
    if (serviceSnaps.empty) throw new Error('Service not found')
    const serviceDoc = serviceSnaps.docs[0]
    const serviceRef = doc(db, 'service', serviceDoc.id)

    await runTransaction(db, async tx => {
      tx.update(serviceRef, { name: data.name })

      for (const a of data.availabilities) {
        if (a.id) {
          const availQ = query(
            collection(db, 'availability'),
            where('id', '==', a.id),
            where('serviceId', '==', numericId),
            limitQuery(1)
          )
          const availSnap = await getDocs(availQ)

          if (!availSnap.empty) {
            const availDocRef = doc(db, 'availability', availSnap.docs[0].id)
            tx.update(availDocRef, {
              dayId: a.dayId,
              startTime: srtToTime(a.startTime).toTimeString(),
              endTime: srtToTime(a.endTime).toTimeString(),
              updatedAt: new Date().toISOString(),
            })
            continue
          }
        }

        // cria novo availability com id numérico
        const newAvailId = await getNextId('availability')
        const newAvailRef = doc(db, 'availability', String(newAvailId))
        tx.set(newAvailRef, {
          id: newAvailId,
          serviceId: numericId,
          dayId: a.dayId,
          startTime: srtToTime(a.startTime).toTimeString(),
          endTime: srtToTime(a.endTime).toTimeString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    })

    return this.findById(numericId)
  }

  // --- DELETE SERVICE + AVAILABILITIES ---
  async delete(id: number | string) {
    const numericId = typeof id === 'number' ? id : Number(id)
    const serviceDocRef = doc(db, 'service', String(id))
    const serviceSnap = await getDoc(serviceDocRef)
    if (!serviceSnap.exists()) throw new Error('Service not found')

    await runTransaction(db, async tx => {
      const availQ = query(collection(db, 'availability'), where('serviceId', '==', numericId))
      const availSnap = await getDocs(availQ)
      for (const a of availSnap.docs) {
        const ref = doc(db, 'availability', a.id)
        tx.delete(ref)
      }
      tx.delete(serviceDocRef)
    })

    return { id: numericId, deleted: true }
  }

  // --- DELETE AVAILABILITY ESPECÍFICA ---
  async deleteAvailabilities(id: number | string, serviceId: number | string) {
    const numericId = typeof id === 'number' ? id : Number(id)
    const numericServiceId = typeof serviceId === 'number' ? serviceId : Number(serviceId)

    const availQ = query(
      collection(db, 'availability'),
      where('id', '==', numericId),
      where('serviceId', '==', numericServiceId),
      limitQuery(1)
    )

    const availSnap = await getDocs(availQ)
    if (availSnap.empty) throw new Error('Availability not found')

    await deleteDoc(doc(db, 'availability', availSnap.docs[0].id))

    return { id: numericId, deleted: true }
  }
}
