import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Typography, Paper, Box } from '@mui/material'

const SalemanPieChart = ({ saleStats }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2']

  const calculatePieData = () => {
    const groupedData = {}
    const nameMapping = {} // To preserve original case formatting

    saleStats.forEach(sale => {
      const normalizedSalesman = sale.salesman ? sale.salesman.toLowerCase() : 'unknown'

      if (!groupedData[normalizedSalesman]) {
        groupedData[normalizedSalesman] = 0
        nameMapping[normalizedSalesman] = sale.salesman // Preserve original name format
      }

      groupedData[normalizedSalesman] += sale.totalAmount
    })

    return Object.keys(groupedData).map(normalizedName => ({
      name: nameMapping[normalizedName] || 'Unknown',
      value: groupedData[normalizedName]
    }))
  }

  const pieData = calculatePieData()

  const topSalesman =
    pieData.length > 0 ? pieData.reduce((max, entry) => (entry.value > max.value ? entry : max)) : null

  return (
    <Paper sx={{ borderRadius: 3, boxShadow: 4, padding: 2, textAlign: 'center' }}>
      {/* Top Salesman Info */}
      {topSalesman && (
        <Box sx={{ mb: 2 }}>
          <Typography variant='subtitle2' color='textSecondary'>
            <strong>Top Salesman:</strong>
          </Typography>
          <Typography variant='body1' fontWeight='bold' color='primary'>
            {topSalesman.name} with Rs {topSalesman.value}
          </Typography>
        </Box>
      )}

      {/* Centered Pie Chart */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ResponsiveContainer width={400} height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={120}
              fill='#8884d8'
              label={entry => `${entry.name}: Rs ${entry.value}`}
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}

export default SalemanPieChart
