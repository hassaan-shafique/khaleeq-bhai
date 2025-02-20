import { Grid, Button } from '@mui/material'

const Tab = ({ tab, handler, value }) => {
  const { label, value: tabValue } = tab

  const getVariant = () => {
    return value === tabValue ? 'contained' : 'outlined'
  }

  return (
    <Grid item >
      <Button variant={getVariant()} onClick={() => handler(tabValue)}>
        {label}
      </Button>
    </Grid>
  )
}

const Tabs = ({ handler, tabs, value }) => {
  return tabs.map((tab, i) => <Tab key={`${i}-${tab.value}`} tab={tab} handler={handler} value={value} />)
}

export default Tabs
