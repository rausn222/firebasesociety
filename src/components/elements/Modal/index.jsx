import Button from '../../../components/elements/Button';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import moment from 'moment/moment';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const UPIPopup = ({ isOpen, onClose, type, amount, time }) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState("");

  const handleUtrChange = (e) => setUtrNumber(e.target.value);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(uid);
      } else {
        console.log("Wahala de");
      }
    });

  }, [user])

  const handleAddTransactionToDb = async () => {
    if (utrNumber.trim() === "") {
      setError("UTRN cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const investmentRef = await addDoc(collection(db, "investments"), {
        utrNumber: utrNumber,
        uid: user,
        time : time,
        dateCreated: moment().format("MMM Do YY"),
        type: type,
        amount: amount,
        status: "submitted"
      });
      const docRef = await addDoc(collection(db, "transactions"), {
        utrNumber: utrNumber,
        uid: user,
        dateCreated: moment().format("MMM Do YY"),
        type: type,
        amount: amount,
        status: "submitted",
        investmentID: investmentRef.id
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error adding document:", error);
      setError("Error adding the note.");
      setLoading(false);
      return false;
    }
  }

  const handleSubmit = async () => {
    // Handle the UTR number submission (e.g., send it to the server or process it further)
    console.log('UTR Number submitted:', utrNumber);
    const added = await handleAddTransactionToDb();
    console.log(added);
    if(added == true){
      onClose(added);
    }
    else{
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
        <center><b><h2>UPI Payment</h2></b></center>
        <p>Please send the payment to the following UPI ID: <strong>your-upi-id@bank</strong></p>
        <label>
          Enter UTR Number:
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

export default UPIPopup;
