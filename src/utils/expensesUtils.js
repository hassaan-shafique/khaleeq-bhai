import { isSameDay, isSameMonth, isSameWeek } from './dateUtils'

export const calculateTotalExpenses = (expenses,customDate, timeframe) => {
  let totalExpenses = 0
  let withinCustomRange = false

  expenses.forEach(expense => {
    if (expense.selectedDate && expense.selectedDate.seconds) {
      const expenseDate = new Date(expense.selectedDate.seconds * 1000) // Convert Firestore timestamp

      if (customDate.start && customDate.end) {
        const startDate = customDate.start ? new Date(customDate.start) : null
        const endDate = customDate.end ? new Date(customDate.end) : null

        if (endDate) {
          endDate.setHours(23, 59, 59, 999)
        }

        withinCustomRange =
          timeframe === 'custom' && startDate && endDate && expenseDate >= startDate && expenseDate <= endDate
      }

      if (
        (timeframe === 'day' && isSameDay(expense.selectedDate)) ||
        (timeframe === 'week' && isSameWeek(expense.selectedDate)) ||
        (timeframe === 'month' && isSameMonth(expense.selectedDate)) ||
        withinCustomRange
      ) {
        totalExpenses += Number(expense.price)
      }
    }
  })

  return totalExpenses
}
