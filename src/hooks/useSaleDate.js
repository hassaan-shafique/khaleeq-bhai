import { useMemo } from 'react'

const useSaleDate = (customDate, sale) => {
  return useMemo(() => {
    let saleDate = null

    if (sale?.startDate) {
      if (sale.startDate.seconds) {
        // Convert Firestore Timestamp to JS Date
        saleDate = new Date(sale.startDate.seconds * 1000)
      } else {
        // Convert string date ('YYYY-MM-DD') to JS Date with time reset
        saleDate = new Date(sale.startDate)
        saleDate.setHours(0, 0, 0, 0)
      }
    }

    // Convert customDate start & end to JS Dates
    const startDate = customDate?.start ? new Date(customDate.start).setHours(0, 0, 0, 0) : null
    const endDate = customDate?.end ? new Date(customDate.end).setHours(23, 59, 59, 999) : null

    return { saleDate, startDate, endDate }
  }, [customDate, sale])
}

export default useSaleDate
