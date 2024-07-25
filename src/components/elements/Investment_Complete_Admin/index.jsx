import Button from '../Button';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Text from '../Text';
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import moment from 'moment';

const Investment_Complete_Admin = ({ isOpen, onClose, investment }) => {
  const [user, setUser] = useState("");
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(0);
  const handleUtrChange = (e) => setUtrNumber(e.target.value);
  const [bankName, setBankName] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(uid);
      } else {
        console.log("Wahala de");
      }
    });
    console.log(investment.mode == "withdraw");
    investment.mode == "withdraw" && fetchUserAmount();
  }, [user])

  const fetchUserAmount = async () => {
    const userDocRef = doc(db, 'userInfo', investment.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    console.log(userDocSnapshot);
    const currentAmount = userDocSnapshot.data().amount;
    setBankName(userDocSnapshot.data().bankName);
    setIfsc(userDocSnapshot.data().ifsc);
    setAccountName(userDocSnapshot.data().accountName);
    setAccountNumber(userDocSnapshot.data().accountNumber);
    setAmount(currentAmount);
    if (currentAmount < parseFloat(investment.amount)) {
      setError("Not enough user balance");
      setIsValid(false);
    }
  }

  const customStyles = {
    content: {
      width: '90%',
      height: investment.mode == "withdraw" ? '70%' : '60%',
      margin: 'auto',
    },
  };

  const onReject = async () =>{
    
  }

  const handleSubmit = async () => {
    if (investment.mode == "withdraw") {
      if (utrNumber.trim() === "") {
        setError("UTRN cannot be empty.");
        return;
      }
      const userDocRef = doc(db, 'transactions', investment.id);
      await updateDoc(userDocRef, { utrNumber: utrNumber });
      onApprove();
    } else {
      onApprove();
    }
  };

  const convertTime = (time) => {
    const formattedDate = moment(time).format('DD/MM/YYYY HH:mm');
    return formattedDate;
  }

  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="UPI Payment" style={customStyles}>
        <center><b><h2>Transaction Details</h2></b></center>
        <p>Please find the details of your investment here.</p>
        <Text>Transaction ID : {investment.id}</Text>
        <Text>User ID : {investment.uid}</Text>
        <Text>Investment Type : {investment.mode ? investment.mode : investment.type}</Text>
        {investment.mode != "withdraw" ?
          (<Text>Investment Amount : {investment.amount}</Text>) :
          (<Text>Withdraw Amount : {investment.amount}</Text>)
        }
        <Text> {investment.mode == "withdraw" ? "Withdraw Status :" : "Investment Status :"} {investment.status}</Text>
        <Text>Transaction Date : {convertTime(investment.dateCreated)}</Text>
        {investment.mode != "withdraw" &&
          (<Text>Investment UTRN : {investment.utrNumber}</Text>)
        }
        {investment.mode == "withdraw" &&
          (<div>
            <Text>Current Balance : {amount}</Text>
            <Text>Bank Name : {bankName}</Text>
            <Text>IFSC : {ifsc}</Text>
            <Text>Account Holder Name : {accountName}</Text>
            <Text>Account Number : {accountNumber}</Text>
            {isValid && (<label>
              Enter UTR Number:
              <input type="text" style={{ marginLeft: 10 }} value={utrNumber} onChange={handleUtrChange} />
            </label>)}
          </div>)
        }
        {error && <p className="error-message">{error}</p>}
        <Button onClick={handleSubmit} className="mt-6 w-full mx-auto">
          Approve
        </Button>
        <Button onClick={onReject} className="mt-6 w-full mx-auto">
          Reject
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

export default Investment_Complete_Admin;
