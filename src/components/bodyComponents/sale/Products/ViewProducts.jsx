import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/Firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddGlasses from "./AddProduct/AddGlasses";
import EditGlassDialog from "./EditProduct/EditGlass";
import EditKbcwDialog from "./EditProduct/EditKbcw";
import AddKbcw from "./AddProduct/AddKbcw";
import EditVendorDialog from "./EditProduct/EditVendor";

// -----------------------------------------

const ViewProducts = () => {
  const { id } = useParams();
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [glassesProducts, setGlassesProducts] = useState([]);
  const [editGlassProduct, setEditGlassProduct] = useState({});
  const [kbcwProducts, setKbcwProducts] =useState([]);
  const [editKbcwProduct, setEditKbcwProduct] =useState ({});
   const[vendorProducts, setVendorProducts] = useState([]);
   const [editVendorProduct, setEditVendorProduct] = useState({});
  const [selectedGlassesProductId, setSelectedGlassesProductId] = useState();
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const docRef = doc(db, "sales", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSalesData(docSnap.data());
          setGlassesProducts(docSnap.data().glassesProducts);
           setKbcwProducts(docSnap.data().kbcwProducts);
            setVendorProducts(docSnap.data().vendorProducts);

        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!salesData) return <p>No sales data found for this customer.</p>;

  const formatDate = (date) => {
    if (!date) return "N/A"; // Handle null or undefined dates

    // If it's a Firebase Timestamp, convert it to a Date object
    if (date.seconds) {
      date = new Date(date.seconds * 1000);
    }

    // Format the Date object to a readable string (dd-MMM-yyyy)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const styles = {
    heading: { color: "#3f51b5", fontWeight: "bold", marginBottom: "1rem" },
    tableCell: { fontWeight: "bold", backgroundColor: "#e3f2fd" },
  };

  // Function to calculate the total amount for a product category
  const calculateTotal = (products, priceKey) =>
    products?.reduce(
      (acc, product) => acc + parseFloat(product[priceKey] || 0),
      0
    ) || 0;

  const totalKBCWAmount = calculateTotal(salesData.kbcwProducts, "kbcwPrice");

  const totalGlassesAmount = calculateTotal(
    salesData.glassesProducts,
    "glassesPrice"
  );
  const totalVendorAmount = calculateTotal(
    salesData.vendorProducts,
    "vendorPrice"
  );

  const totalSalesAmount =
    totalGlassesAmount + totalKBCWAmount + totalVendorAmount;

  const handleEditClick = (product, productType) => {
    setEditGlassProduct(product);
    setEditKbcwProduct(product);
    setEditVendorProduct(product);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = async (product, productType) => {
    try {
      const updatedSalesData = { ...salesData };
      updatedSalesData[productType] = updatedSalesData[productType].filter(
        (item) => item !== product
      );

      // Update the sales data in Firestore
      const saleDocRef = doc(db, "sales", id);
      await updateDoc(saleDocRef, updatedSalesData);

      setSalesData(updatedSalesData);
    } catch (error) {
      console.error("Error deleting product:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  const handleSaveProduct = async () => {
    try {
      const updatedSalesData = { ...salesData };
      updatedSalesData[selectedProduct.productType] = updatedSalesData[
        selectedProduct.productType
      ].map((item) =>
        item === selectedProduct.product ? selectedProduct.product : item
      );

      // Update the sales data in Firestore
      const saleDocRef = doc(db, "sales", id);
      await updateDoc(saleDocRef, updatedSalesData);

      setSalesData(updatedSalesData);
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  const handleEditGlassesSubmit = async () => {
    let newGlassesProducts = glassesProducts.filter(
      (g) => g.id !== editGlassProduct.id
    );
    newGlassesProducts.push(editGlassProduct);
    try {
      const docRef = doc(db, "sales", id);
      await updateDoc(docRef, {
        ...salesData,
        glassesProducts: newGlassesProducts,
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const handleEditKbcwSubmit = async () => {
    let newKbcwProducts = kbcwProducts.filter(
      (g) => g.id !== editKbcwProduct.id
    );
    newKbcwProducts.push(editKbcwProduct);
    try {
      const docRef = doc(db, "sales", id);
      await updateDoc(docRef, {
        ...salesData,
        kbcwProducts: newKbcwProducts,
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const handleEditVendorSubmit = async () => {
    let newVendorProducts = vendorProducts.filter(
      (g) => g.id !== editVendorProduct.id
    );
    newVendorProducts.push(editVendorProduct);
    try {
      const docRef = doc(db, "sales", id);
      await updateDoc(docRef, {
        ...salesData,
        vendorProducts: newVendorProducts,
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* Customer Information */}
      <Typography variant="h6" style={styles.heading}>
        Customer Information
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={styles.tableCell}>Sales Date</TableCell>
              <TableCell>{formatDate(salesData.startDate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={styles.tableCell}>Delivery Date</TableCell>
              <TableCell>{formatDate(salesData.endDateDate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={styles.tableCell}>Customer Name</TableCell>
              <TableCell>{salesData.customerName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={styles.tableCell}>Contact No</TableCell>
              <TableCell>{salesData.contactNo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={styles.tableCell}>Address</TableCell>
              <TableCell>{salesData.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={styles.tableCell}>Doctor</TableCell>
              <TableCell>{salesData.doctor}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details */}
      <Typography variant="h6" style={styles.heading}>
        Order Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={styles.tableCell}>Order No</TableCell>
              <TableCell>{salesData.orderNo}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <br />
        {/* table for displaying Numbers  */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>

              <TableCell style={styles.tableCell}>SPH</TableCell>
              <TableCell style={styles.tableCell}>CYL</TableCell>
              <TableCell style={styles.tableCell}>AXIS</TableCell>
              <TableCell style={styles.tableCell}>ADD</TableCell>
              <TableCell style={styles.tableCell}>IPD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* LE Row */}
            <TableRow>
              <TableCell style={styles.tableCell}>LE</TableCell>
              <TableCell>{salesData.leSph}</TableCell>
              <TableCell>{salesData.leCyl}</TableCell>
              <TableCell>{salesData.leAxis}</TableCell>
              <TableCell>{salesData.leAdd}</TableCell>
              <TableCell>{salesData.leIpd}</TableCell>
            </TableRow>

            {/* RE Row */}
            <TableRow>
              <TableCell style={styles.tableCell}>RE</TableCell>
              <TableCell>{salesData.reSph}</TableCell>
              <TableCell>{salesData.reCyl}</TableCell>
              <TableCell>{salesData.reAxis}</TableCell>
              <TableCell>{salesData.reAdd}</TableCell>
              <TableCell>{salesData.reIpd}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* KBCW Products */}
      <Typography variant="h6" style={styles.heading}>
        KBCW Products
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={styles.tableCell}>Barcode</TableCell>
              <TableCell style={styles.tableCell}>Type</TableCell>
              <TableCell style={styles.tableCell}>Name</TableCell>
              <TableCell style={styles.tableCell}>Size</TableCell>
              <TableCell style={styles.tableCell}>Quantity</TableCell>
              <TableCell style={styles.tableCell}>Price</TableCell>
              <TableCell style={styles.tableCell}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.kbcwProducts?.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.kbcwBarcode}</TableCell>
                <TableCell>{product.kbcwType}</TableCell>
                <TableCell>{product.kbcwName}</TableCell>
                <TableCell>{product.kbcwQuantity}</TableCell>
                <TableCell>{product.kbcwPrice}</TableCell>
                <TableCell>{formatDate(product.vendorDeliveredDate)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditClick(product)}>Edit</Button>
                  <Button
                    onClick={() => handleDeleteClick(product)}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", color: "#3f51b5", marginBottom: "1rem" }}
        >
          Total Amount:
          <span
            style={{ fontWeight: "bold", color: "black", marginLeft: "8px" }}
          >
            Rs {totalKBCWAmount}
          </span>
        </Typography>
      </TableContainer>

      {/* Glasses Products */}
      <Typography variant="h6" style={styles.heading}>
        Glasses Products
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={styles.tableCell}>Product</TableCell>
              <TableCell style={styles.tableCell}>Type</TableCell>
              <TableCell style={styles.tableCell}>Number</TableCell>
              <TableCell style={styles.tableCell}>Quantity</TableCell>
              <TableCell style={styles.tableCell}>Price</TableCell>
              <TableCell style={styles.tableCell}>Delivered Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.glassesProducts?.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.glassesType}</TableCell>
                <TableCell>{product.glassesNumber}</TableCell>
                <TableCell>{product.glassesQuantity}</TableCell>
                <TableCell>{product.glassesPrice}</TableCell>
                <TableCell>
                  {formatDate(product.glassesDeliveredDate)}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEditClick(product, "kbcwProducts")}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(product)}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", color: "#3f51b5", marginBottom: "1rem" }}
        >
          Total Amount:
          <span
            style={{ fontWeight: "bold", color: "black", marginLeft: "8px" }}
          >
            Rs {totalGlassesAmount}
          </span>
        </Typography>
      </TableContainer>

      {/* Vendor Products */}
      <Typography variant="h6" style={styles.heading}>
        Vendor Products
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={styles.tableCell}>Sr. No</TableCell>
              <TableCell style={styles.tableCell}>Order No</TableCell>
              <TableCell style={styles.tableCell}>Vendor Name</TableCell>
              <TableCell style={styles.tableCell}>Borrowed Branch</TableCell>
              <TableCell style={styles.tableCell}>Quantity</TableCell>
              <TableCell style={styles.tableCell}>Price</TableCell>
              <TableCell style={styles.tableCell}>Item Name</TableCell>
              <TableCell style={styles.tableCell}>Delivered Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.vendorProducts?.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.orderNumber}</TableCell>
                <TableCell>{product.vendorName}</TableCell>
                <TableCell>{product.borrowedBranch}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.vendorPrice}</TableCell>
                <TableCell>{product.VendorItemName}</TableCell>
                <TableCell>{formatDate(product.vendorDeliveredDate)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditClick(product)}>Edit</Button>
                  <Button
                    onClick={() => handleDeleteClick(product)}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", color: "#3f51b5", marginBottom: "1rem" }}
        >
          Total Amount:
          <span
            style={{ fontWeight: "bold", color: "black", marginLeft: "8px" }}
          >
            Rs {totalVendorAmount}
          </span>
        </Typography>
      </TableContainer>
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
              {" "}
              {/* Light Blue Background */}
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "#000", fontSize: "16px" }}
              >
                Total Sales Amount
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "#000", fontSize: "16px" }}
              >
                Discount
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "#000", fontSize: "16px" }}
              >
                Advance
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "#000", fontSize: "16px" }}
              >
                Pending Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
            >
              <TableCell
                align="center"
                sx={{ padding: "10px", fontSize: "15px" }}
              >
                Rs: {totalSalesAmount}
              </TableCell>
              <TableCell
                align="center"
                sx={{ padding: "10px", fontSize: "15px" }}
              >
                Rs: {salesData.discount}
              </TableCell>
              <TableCell
                align="center"
                sx={{ padding: "10px", fontSize: "15px" }}
              >
               Rs: {salesData.advance}
              </TableCell>
              <TableCell
                align="center"
                sx={{ padding: "10px", fontSize: "15px" }}
              >
               Rs: {salesData.pendingAmount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      

      <EditGlassDialog
        editGlassProduct={editGlassProduct}
        setEditGlassProduct={setEditGlassProduct}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditGlassesSubmit}
      />
      <EditKbcwDialog
        editKbcwProduct={editKbcwProduct}
        setEditKbcwProduct={setEditKbcwProduct}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditKbcwSubmit}
      />
      <EditVendorDialog
        editVendorProduct={editVendorProduct}
        setEditVendorProduct={setEditVendorProduct}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditVendorSubmit}
      />
    </div>
  );
};

export default ViewProducts;
