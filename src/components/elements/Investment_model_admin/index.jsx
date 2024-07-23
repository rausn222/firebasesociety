import Button from '../Button';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Text from '../Text';
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { doc, updateDoc } from "firebase/firestore";

const Investment_Details_Admin = ({ isOpen, onClose, investment, onApprove }) => {
  const [user, setUser] = useState("");
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const customStyles = {
    content: {
      width: '90%',
      height: investment.mode == "withdraw" ? '60%' : '50%',
      margin: 'auto',
    },
  };

  const handleSubmit = async () => {
    if (investment.mode == "withdraw") {
      if (utrNumber.trim() === "") {
        setError("UTRN cannot be empty.");
        return;
      }
      const userDocRef = doc(db, 'transactions', investment.id);
      await updateDoc(userDocRef, { utrNumber: utrNumber });
      onApprove();
    } else{
      onApprove();
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="UPI Payment" style={customStyles}>
        <center><b><h2>Transaction Details</h2></b></center>
        <p>Please find the details of your investment here.</p>
        <Text>Investment ID : {investment.id}</Text>
        <Text>User ID : {investment.uid}</Text>
        <Text>Investment Type : {investment.type}</Text>
        <Text>Investment Amount : {investment.amount}</Text>
        <Text>Investment Status : {investment.status}</Text>
        <Text>Investment Date : {investment.dateCreated}</Text>
        {investment.mode != "withdraw" ?
          (<Text>Investment UTRN : {investment.utrNumber}</Text>) :
          (<Text>UPI ID : {investment.upiID}</Text>)
        }
        {investment.mode == "withdraw" &&
          (<label>
            Enter UTR Number:
            <input type="text" style={{ marginLeft: 10 }} value={utrNumber} onChange={handleUtrChange} />
          </label>)
        }
        {error && <p className="error-message">{error}</p>}
        <Button onClick={handleSubmit} className="mt-6 w-full mx-auto">
          Approve
        </Button>
        <Button onClick={onClose} className="mt-6 w-full mx-auto">
          Okay
        </Button>
        <ToastContainer />
      </Modal>
    </div>
  );
};

Modal.setAppElement('#root');

export default Investment_Details_Admin;
