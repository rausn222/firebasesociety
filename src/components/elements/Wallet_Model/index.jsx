import Button from '../Button';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Text from '../Text';
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment/moment';
import "react-toastify/dist/ReactToastify.css";

const Wallet_model = ({ isOpen, onClose, mode }) => {
  const [user, setUser] = useState("");
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const handleUtrChange = (e) => setUtrNumber(e.target.value);
  const handleAmountChange = (e) => setAmount(e.target.value);
  const [error, setError] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(uid);
      }
    });

  }, [user]);

  const handleAddTransactionToDb = async () => {
    setLoading(true);
    try {
      if (mode == "add money") {
        await addDoc(collection(db, "transactions"), {
          mode: mode,
          utrNumber: utrNumber,
          uid: user,
          dateCreated: moment().format("MMM Do YY"),
          amount: amount,
          status: "submitted"
        });
        setLoading(false);
        return true;
      }
      else {
        await addDoc(collection(db, "transactions"), {
          mode: mode,
          upiID: utrNumber,
          uid: user,
          dateCreated: moment().format("MMM Do YY"),
          amount: amount,
          status: "submitted"
        });
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Error adding document:", error);
      setError("Error adding the note.");
      setLoading(false);
      return false;
    }
  }

  const handleSubmit = async () => {
    console.log('UTR Number submitted:', utrNumber);
    if (utrNumber.trim() === "") {
      setError("UTRN cannot be empty.");
      return;
    }
    console.log(amount);
    if (amount == undefined || amount == 0) {
      setError("Amount cannot be empty.");
      return;
    }
    const added = await handleAddTransactionToDb();
    console.log(added);
    if (added == true) {
      onClose(added);
    }
    else {
      toast("Error submitting UTRN");
    }
  };

  const customStyles = {
    content: {
      width: '90%',
      height: '40%',
      margin: 'auto',
    },
  };

  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="UPI Payment" style={customStyles}>
        <center><b><h2>Want to {mode}?</h2></b></center>
        <p>Please fill the details.</p>
        <br />
        {mode === "add money" ?? <p>Please send the payment to the following UPI ID: <strong>your-upi-id@bank</strong></p>}
        <br />
        <label>
          Enter Amount:
          <input type="text" style={{ marginLeft: 10, marginRight: 20 }} value={amount} onChange={handleAmountChange} />
        </label>
        <label>
          {mode == "add money" ? "Enter UTR Number:" : "Enter you UPI ID"}
          <input type="text" style={{ marginLeft: 10 }} value={utrNumber} onChange={handleUtrChange} />
        </label>
        <br />
        {error && <p className="error-message">{error}</p>}
        <Button onClick={handleSubmit} className="mt-6 w-full mx-auto">
          Submit
        </Button>
        <Button onClick={onClose} className="mt-6 w-full mx-auto">
          Cancel
        </Button>
        <ToastContainer />
      </Modal>
    </div>
  );
};

Modal.setAppElement('#root');

export default Wallet_model;
