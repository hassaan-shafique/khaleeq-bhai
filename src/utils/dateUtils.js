// Check if sale date is the same day as today
export const isSameDay = orderDate => {
  const now = new Date()
  const saleDate = new Date(orderDate.seconds * 1000)
  // Normalize both dates by setting time to 00:00:00 for accurate comparison
  return saleDate.toDateString() === now.toDateString()
}

// Check if sale date is within the same week as today
export const isSameWeek = orderDate => {
  const now = new Date()
  const saleDate = new Date(orderDate.seconds * 1000)

  // Normalize saleDate to the start of the week (Monday)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Monday
  startOfWeek.setHours(0, 0, 0, 0) // Set to 00:00:00 for comparison

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday
  endOfWeek.setHours(23, 59, 59, 999) // Set to 23:59:59 for comparison

  return saleDate >= startOfWeek && saleDate <= endOfWeek
}

// Check if sale date is within the same month and year as today
export const isSameMonth = orderDate => {
  const now = new Date()
  const saleDate = new Date(orderDate.seconds * 1000)

  return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
}
