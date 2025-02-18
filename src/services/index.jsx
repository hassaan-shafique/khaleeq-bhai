import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/Firebase'

export const fetchCollectionData = async collectionName => {
  try {
    const data = collection(db, collectionName)
    const snapShot = await getDocs(data)
    return snapShot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching collection data:', error)
    throw error
  }
}

