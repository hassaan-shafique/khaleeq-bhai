export const isSameDay = orderDate => {
  const now = new Date()
  const saleDate = new Date(orderDate.seconds * 1000)
  return saleDate.toDateString() === now.toDateString()
}

export const isSameWeek = orderDate => {
  const now = new Date()
  const saleDate = new Date(orderDate.seconds * 1000)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1)
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  return saleDate >= startOfWeek && saleDate <= endOfWeek
}

export const isSameMonth = orderDate => {
  const now = new Date()
  const saleDate = new Date(orderDate.seconds * 1000)
  return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
}

export const formatDateDisplay = date => {
  let saleDate
  if (date) {
    if (date.seconds) {
      saleDate = new Date(date.seconds * 1000).toLocaleDateString('en-GB')
    } else {
      saleDate = new Date(date).toLocaleDateString('en-GB')
    }
  }
  return saleDate
}
