import React, { useEffect, useState } from 'react';
import { db } from '../../config/Firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { CircularProgress, Box, Typography } from '@mui/material';
import InstallmentTable from './InstallmentTable';

const InstallmentsDetail = () => {
    const [installments, setInstallments] = useState([]);
    const [saleStats, setSaleStats] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                const installmentSnapshot = await getDocs(collection(db, "salesInstallments"));
                const salesSnapshot = await getDocs(collection(db, "sales"));

                const fetchedInstallments = installmentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const fetchedSales = salesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setInstallments(fetchedInstallments);
                setSaleStats(fetchedSales);
                setSalesData(fetchedSales);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
   

    return (
        <Box sx={{ padding: 3 }}>
        
            <Typography variant="h4" fontWeight="bold" mb={2}>
                Installments Page
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <InstallmentTable 
                    loading={loading} 
                    installments={installments} 
                    saleStats={saleStats} 
                    salesData={salesData} 
                />
            )}
        </Box>
    );
};

export default InstallmentsDetail;

