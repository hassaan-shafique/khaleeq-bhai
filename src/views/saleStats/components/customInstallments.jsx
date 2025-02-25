import { useState } from 'react';
import {
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    TableContainer,
    Box,
    Grid,
    TextField,
    Button
} from '@mui/material';

const CustomInstallments = ({ saleStats, loading, installments }) => {
    const [customDate, setCustomDate] = useState({ start: '', end: '' });
    const [filteredInstallments, setFilteredInstallments] = useState(installments);

    // Function to handle date input changes
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setCustomDate((prev) => ({ ...prev, [name]: value }));
    };

    // Function to filter installments based on selected date range
    const applyFilter = () => {
        if (!customDate.start || !customDate.end) {
            setFilteredInstallments(installments);
            return;
        }

        const startDate = new Date(customDate.start);
        const endDate = new Date(customDate.end);
        endDate.setHours(23, 59, 59, 999); // Include entire end day

        const filtered = installments.filter((inst) => {
            const instDate = new Date(inst.date);
            return instDate >= startDate && instDate <= endDate;
        });

        setFilteredInstallments(filtered);
    };

    const renderTableRows = () => {
        return saleStats.map((sale, index) => {
            // Filter installments for the current sale
            const saleInstallments = filteredInstallments.filter(inst => inst.saleId === sale.id);

            // Calculate total installment amount
            const totalInstallmentAmount = saleInstallments.reduce((total, inst) => total + Number(inst.amount || 0), 0);

            // Get the latest installment date
            const latestInstallmentDate = saleInstallments.length
                ? new Date(Math.max(...saleInstallments.map(inst => new Date(inst.date)))).toLocaleDateString('en-GB') // "dd/mm/yyyy"
                : 'No Date';

            // Skip rows where totalInstallmentAmount is 0
            if (totalInstallmentAmount === 0) {
                return null;
            }

            return (
                <TableRow key={sale.id} hover sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                    '&:nth-of-type(even)': { backgroundColor: '#ffffff' }
                }}>
                    <TableCell>
                        <Typography variant='body2'>{index + 1}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant='body2' color='primary'>
                            {sale.orderNo}
                        </Typography>
                    </TableCell>
                    <TableCell align='left'>
                        <Typography variant='body2' color='secondary'>
                            {latestInstallmentDate}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant='body2' fontWeight='bold' color='secondary'>
                            Rs {totalInstallmentAmount}
                        </Typography>
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <Box sx={{ padding: 3 }}>
            {/* Header and Filters */}
            <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
                <Grid item xs={12} md={4}>
                    <Typography variant='h6' fontWeight='bold'>
                        Custom Installment Data
                    </Typography>
                </Grid>

                {/* Date Filters - Aligned in One Row */}
                <Grid item xs={12} md={8} container spacing={2} alignItems="center">
                    <Grid item xs={5} md={4}>
                        <TextField
                            label="Start Date"
                            type="date"
                            name="start"
                            value={customDate.start}
                            onChange={handleDateChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={5} md={4}>
                        <TextField
                            label="End Date"
                            type="date"
                            name="end"
                            value={customDate.end}
                            onChange={handleDateChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={2} md={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={applyFilter}
                        >
                            Filter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            {/* Table */}
            <Paper sx={{ borderRadius: 3, boxShadow: 4, padding: 2 }}>
                <TableContainer sx={{ maxHeight: 450, overflowY: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                {['Sr No', 'Order No', 'Installment Date', 'Installment Amount'].map((header, index) => (
                                    <TableCell key={index}>
                                        <Typography variant='subtitle1' fontWeight='bold'>
                                            {header}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align='center'>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : saleStats.length > 0 ? (
                                renderTableRows()
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align='center'>
                                        <Typography variant='body2' color='textSecondary'>
                                            No Installment data available.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default CustomInstallments;
