import React, { useEffect, useState, useRef } from "react";
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

  const userRole = localStorage.getItem("userRole");
  const { id } = useParams();
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editGlassDialogOpen, setEditGlassDialogOpen] = useState(false);
  const [editKbcwDialogOpen, setEditKbcwDialogOpen] = useState(false);
  const [editVendorDialogOpen, setEditVendorDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [glassesProducts, setGlassesProducts] = useState([]);
  const [editGlassProduct, setEditGlassProduct] = useState({});
  const [kbcwProducts, setKbcwProducts] =useState([]);
  const [editKbcwProduct, setEditKbcwProduct] =useState ({});
   const[vendorProducts, setVendorProducts] = useState([]);
   const [editVendorProduct, setEditVendorProduct] = useState({});
  const [selectedGlassesProductId, setSelectedGlassesProductId] = useState();
  const [editOpen, setEditOpen] = useState(false);

  const printRef = useRef(null);

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

   try {
     // If it's a Firebase Timestamp (object with `seconds`), convert it to a Date object
     if (typeof date === "object" && date.seconds) {
       date = new Date(date.seconds * 1000);
     }

     // Ensure `date` is now a valid Date object
     const validDate = date instanceof Date ? date : new Date(date);

     if (isNaN(validDate.getTime())) {
       // Handle invalid dates gracefully
       return "Invalid Date";
     }

     // Format the valid Date object to a readable string (dd-MMM-yyyy)
     return validDate.toLocaleDateString("en-GB", {
       day: "2-digit",
       month: "short",
       year: "numeric",
     });
   } catch (error) {
     console.error("Error formatting date:", error);
     return "Invalid Date";
   }
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

  const handleKbcwEditClick = (product, productType) => {
    setEditGlassProduct(product);
    setEditKbcwProduct(product);
    setEditVendorProduct(product);
  
    
    setEditKbcwDialogOpen(true);
   

  };
   const handleGlassEditClick = (product, productType) => {
     setEditGlassProduct(product);
     setEditKbcwProduct(product);
     setEditVendorProduct(product);

     setEditGlassDialogOpen(true);
     
   };
    const handleVendorEditClick = (product, productType) => {
      setEditGlassProduct(product);
      setEditKbcwProduct(product);
      setEditVendorProduct(product);

      
      setEditVendorDialogOpen(true);
    };

const handleDeleteClick = async (product, productType) => {
  try {
    console.log("Current sales data:", salesData); // Log the sales data to check its structure
    console.log("Trying to delete product type:", productType); // Log the product type being passed

    // Check if the productType exists in the sales data
    if (!salesData[productType]) {
      console.error(
        `Product type "${productType}" does not exist in sales data.`
      );
      return;
    }

    // Filter out the specific product using its unique identifier (e.g., product.id)
    const updatedProducts = salesData[productType].filter(
      (item) => item.id !== product.id
    );

    // Update the sales data with the filtered list of products
    const updatedSalesData = {
      ...salesData,
      [productType]: updatedProducts,
    };

    // Update the Firestore document with the new sales data
    const saleDocRef = doc(db, "sales", id);
    await updateDoc(saleDocRef, { [productType]: updatedProducts });

    // Update the state with the new sales data
    setSalesData(updatedSalesData);
  } catch (error) {
    console.error("Error deleting product:", error);
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




   const handlePrint = () => {
     // Clone the printRef content to a new window for printing
     const printContents = printRef.current.innerHTML;
     const newWindow = window.open("", "_blank");

     // Write the content to the new window
     newWindow.document.open();
     newWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print</title>
        <style>
          /* Ensure the table fits on the page */
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          /* Add styling for large tables */
          .print-container {
            overflow: visible !important; /* Ensure all content is visible */
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${printContents}
        </div>
      </body>
    </html>
  `);
     newWindow.document.close();
     newWindow.print();
     newWindow.close();
   };


  return (
    <div style={{ padding: "2rem" }}>
      {/* Customer Information */}
      <Typography variant="h6" style={styles.heading}>
        Customer Information
      </Typography>

      {userRole == "admin" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print Sale Information
          </Button>
        </div>
      )}

      <div ref={printRef}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell style={styles.tableCell}>Sales Date</TableCell>
                <TableCell>{formatDate(salesData.startDate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={styles.tableCell}>Delivery Date</TableCell>
                <TableCell>{formatDate(salesData.endDate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={styles.tableCell}>Delivered Date</TableCell>
                <TableCell>{formatDate(salesData.deliveredDate)}</TableCell>
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
              <TableRow>
                <TableCell style={styles.tableCell}>Payment Method</TableCell>
                <TableCell>{salesData.payment}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={styles.tableCell}>Instruction</TableCell>
                <TableCell>{salesData.instruction}</TableCell>
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
              {/* RE Row */}
              <TableRow>
                <TableCell style={styles.tableCell}>RE</TableCell>
                <TableCell>{salesData.reSph}</TableCell>
                <TableCell>{salesData.reCyl}</TableCell>
                <TableCell>{salesData.reAxis}</TableCell>
                <TableCell>{salesData.reAdd}</TableCell>
                <TableCell>{salesData.reIpd}</TableCell>
              </TableRow>
              {/* LE Row */}
              <TableRow>
                <TableCell style={styles.tableCell}>LE</TableCell>
                <TableCell>{salesData.leSph}</TableCell>
                <TableCell>{salesData.leCyl}</TableCell>
                <TableCell>{salesData.leAxis}</TableCell>
                <TableCell>{salesData.leAdd}</TableCell>
                <TableCell>{salesData.leIpd}</TableCell>
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
              <TableCell style={styles.tableCell}>Sr.No</TableCell>
              <TableCell style={styles.tableCell}>Image</TableCell>
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
                  <TableCell>{product.kbcwImage ? (
  <img
    src={product.kbcwImage}
    alt="Product"
    style={{
      width: "100%",
      height: "auto",
      maxHeight: "150px",
      objectFit: "cover",
      borderRadius: "12px",
      backgroundColor: "#808080",
    }}
  />
) : (
  <div style={{ width: "100%", height: "150px", backgroundColor: "#f0f0f0", textAlign: "center", lineHeight: "150px", borderRadius: "12px" }}>
    No Image Available
  </div>
)}</TableCell>

                  <TableCell>{product.kbcwBarcode}</TableCell>
                  <TableCell>{product.kbcwType}</TableCell>
                  <TableCell>{product.kbcwName}</TableCell>
                  <TableCell>{product.kbcwSize}</TableCell>
                  <TableCell>{product.enteredQuantity}</TableCell>
                  <TableCell>{product.kbcwPrice}</TableCell>

                  <TableCell>{formatDate(product.kbcwDeliveredDate)}</TableCell>

{userRole == "admin" && (
                  <TableCell>
                    <Button onClick={() => handleKbcwEditClick(product)}>
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(product, "kbcwProducts")}
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                  )}

                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              color: "#3f51b5",
              marginBottom: "1rem",
            }}
          >
            Total Amount For KBCW Products:
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
                <TableCell style={styles.tableCell}>Sr.No</TableCell>
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
                  <TableCell>{product.enteredQuantity}</TableCell>
                  <TableCell>{product.glassesPrice}</TableCell>
                  <TableCell>
                    {formatDate(product.glassesDeliveredDate)}
                  </TableCell>

                  {userRole == "admin" && (
                  <TableCell>
                    <Button onClick={() => handleGlassEditClick(product)}>
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(product)}
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                  )}

                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              color: "#3f51b5",
              marginBottom: "1rem",
            }}
          >
            Total Amount For Glasses Products:
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
                <TableCell style={styles.tableCell}>Borrowed Branch</TableCell>
                <TableCell style={styles.tableCell}>Vendor Name</TableCell>
                <TableCell style={styles.tableCell}>Glass Number</TableCell>
                <TableCell style={styles.tableCell}>Item Number</TableCell>
                <TableCell style={styles.tableCell}>Price</TableCell>
                <TableCell style={styles.tableCell}>Quantity</TableCell>

               
                <TableCell style={styles.tableCell}>Delivered Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.vendorProducts?.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.orderNumber}</TableCell>
                  <TableCell>{product.borrowedBranch}</TableCell>
                  <TableCell>{product.vendorName}</TableCell>
                  <TableCell>{product.vendorGlassNumber}</TableCell>
                  <TableCell>{product.vendorItemNumber}</TableCell>
                  <TableCell>{product.vendorPrice}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  
                  
                  <TableCell>
                    {formatDate(product.vendorDeliveredDate)}
                  </TableCell>

              {userRole == "admin" && ( 
                  <TableCell>
                    <Button onClick={() => handleVendorEditClick(product)}>
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(product)}
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              color: "#3f51b5",
              marginBottom: "1rem",
            }}
          >
            Total Amount For Vendor Amount:
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
      </div>
      <EditGlassDialog
        editGlassProduct={editGlassProduct}
        setEditGlassProduct={setEditGlassProduct}
        open={editGlassDialogOpen}
        onClose={() => setEditGlassDialogOpen(false)}
        onSubmit={handleEditGlassesSubmit}
      />
      <EditKbcwDialog
        editKbcwProduct={editKbcwProduct}
        setEditKbcwProduct={setEditKbcwProduct}
        open={editKbcwDialogOpen}
        onClose={() => setEditKbcwDialogOpen(false)}
        onSubmit={handleEditKbcwSubmit}
      />
      <EditVendorDialog
        editVendorProduct={editVendorProduct}
        setEditVendorProduct={setEditVendorProduct}
        open={editVendorDialogOpen}
        onClose={() => setEditVendorDialogOpen(false)}
        onSubmit={handleEditVendorSubmit}
      />
    </div>
  );
};

export default ViewProducts;
