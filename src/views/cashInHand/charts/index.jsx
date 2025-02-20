import { Grid } from '@mui/material'
import ChartComponent from './ChartComponent'
import LineChartComponent from './LineChartComponent'
import PieChartComponent from './PieChartComponent'
import AreaChartComponent from './AreaChartComponent'
import RadarChartComponent from './RadarChartComponent'

const Charts = ({ totalSales, totalExpenses, remainingCash, totalInHand,  Balance ,totalInBank, totalInCash,installmentTotal}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <ChartComponent
        totalSales={totalSales}
        totalExpenses={totalExpenses}
        remainingCash={remainingCash}
        totalInHand={totalInHand}
        Balance={Balance}
        totalInCash = {totalInCash }
        totalInBank = {totalInBank}
        installmentTotal ={installmentTotal}

      />
{/* 
      <PieChartComponent totalExpenses={totalExpenses} remainingCash={remainingCash} />
      <RadarChartComponent totalSales={totalSales} totalExpenses={totalExpenses} Balance={Balance} />
      <LineChartComponent totalSales={totalSales} totalExpenses={totalExpenses} remainingCash={remainingCash} />
      <AreaChartComponent totalInHand={totalInHand} totalExpenses={totalExpenses} Balance={Balance} /> */}
    </Grid>
  )
}

export default Charts
