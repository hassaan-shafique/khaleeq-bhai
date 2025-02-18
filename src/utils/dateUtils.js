export const isSameDay = orderDate => {
  const now = new Date()
  const saleDate = new Date(orderDate.seconds * 1000)
  return saleDate.toDateString() === now.toDateString()
}

export const isSameWeek = orderDate => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() - 7)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)
  const saleDate = new Date(orderDate.seconds * 1000)
  return saleDate >= startOfWeek && saleDate <= endOfWeek
}

export const isSameMonth = orderDate => {
  const now = new Date()
  const saleDate = new Date(orderDate.seconds * 1000)
  return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
}

export const formatDate = date => {
  const epochTime = date
  const newDate = new Date(epochTime * 1000)
  const formattedDate = newDate.toISOString().split('T')[0]
  return formattedDate
}
