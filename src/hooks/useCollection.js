import { useState, useEffect } from 'react'
import { fetchCollectionData } from '../services'

const useCollection = collectionName => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchCollectionData(collectionName)
      setData(response)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return { data, loading, error, refetch: getData }
}

export default useCollection
