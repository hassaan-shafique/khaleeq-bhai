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

const CustomInstallments = ({ loading, installments, saleStats, salesData }) => {
    const [customDate, setCustomDate] = useState({ start: '', end: '' });
    const [filteredInstallments, setFilteredInstallments] = useState(installments);

    // Handle Date Change
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setCustomDate((prev) => ({ ...prev, [name]: value }));
    };

    // Apply Date Filter
    const applyFilter = () => {
        if (!customDate.start || !customDate.end) {
            setFilteredInstallments(installments);
            return;
        }

        const startDate = new Date(customDate.start);
        const endDate = new Date(customDate.end);
        endDate.setHours(23, 59, 59, 999); // Include full day

        const filtered = installments.filter(inst => {
            const instDate = new Date(inst.date);
            return instDate >= startDate && instDate <= endDate;
        });

        setFilteredInstallments(filtered);
    };

    // Sort installments by latest date
    const sortedInstallments = [...filteredInstallments].sort((a, b) => new Date(b.date) - new Date(a.date));

    const renderTableRows = () => {
        if (sortedInstallments.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="textSecondary">
                            No Installment data available.
                        </Typography>
                    </TableCell>
                </TableRow>
            );
        }
    
       return sortedInstallments.map((installment, index) => {
    const normalizedSaleId = String(installment.saleId).trim();
    
    const matchingSale = saleStats.find(sale => String(sale.id).trim() === normalizedSaleId) 
        || salesData.find(sale => String(sale.id).trim() === normalizedSaleId);

    if (!matchingSale) {
        console.warn(`⚠️ No matching sale found for saleId: "${normalizedSaleId}"`);
    } else {
        console.log(`✅ Found Sale for saleId: "${normalizedSaleId}" → Order No: "${matchingSale.orderNo}"`);
    }
    
    const orderNo = matchingSale ? matchingSale.orderNo : 'N/A';

    
            return (
                <TableRow key={installment.id} hover sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                    '&:nth-of-type(even)': { backgroundColor: '#ffffff' }
                }}>
                    <TableCell>
                        <Typography variant="body2">{index + 1}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" color="primary">
                            {orderNo}
                        </Typography>
                    </TableCell>
                    <TableCell align="left">
                        <Typography variant="body2" color="secondary">
                            {new Date(installment.date).toLocaleDateString('en-GB')}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="secondary">
                            Rs {Number(installment.amount || 0).toLocaleString()}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="secondary">
                            {(installment.payment || "Not Added").toLocaleString()}
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
                    <Typography variant="h6" fontWeight="bold">
                        Custom Installment Data
                    </Typography>
                </Grid>

                {/* Date Filters */}
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
                                {['Sr No', 'Order No', 'Installment Date', 'Installment Amount', 'Method'].map((header, index) => (
                                    <TableCell key={index}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {header}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                renderTableRows()
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default CustomInstallments;
