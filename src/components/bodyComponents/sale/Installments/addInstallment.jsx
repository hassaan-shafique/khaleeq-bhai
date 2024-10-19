import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { doc, updateDoc, deleteDoc ,addDoc,collection,query,getDocs,where,} from "firebase/firestore"; // Firestore functions
import { db } from "../../../../config/Firebase"; // Ensure db is correctly imported

const AddInstallment = ({ saleId, open, handleClose, updatePendingAmount=()=>{} }) => {
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    saleId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "salesInstallments"), formData);
      await updatePendingAmount(saleId,formData.amount);
      alert("Installment submitted successfully!");
      handleClose();
    } catch (error) {
      console.error("Error submitting installment:", error);
      alert("Failed to submit installment.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Installment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the installment date and amount below.
        </DialogContentText>
        <TextField
          margin="dense"
          name="date"
          label="Installment Date"
          type="date"
          fullWidth
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          name="amount"
          label="Amount"
          type="number"
          fullWidth
          value={formData.amount}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInstallment;
