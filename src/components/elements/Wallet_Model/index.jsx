import Button from '../Button';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Text from '../Text';
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment/moment';
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from 'react-spinners';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

const Wallet_model = ({ isOpen, onClose, mode }) => {
  const [user, setUser] = useState("");
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleUtrChange = (e) => setUtrNumber(e.target.value);
  const [upi, setUpi] = useState("");
  const [qrCode, setQrCode] = useState('');
  const handleAmountChange = (e) => {
    if(mode == "withdraw"){
      if(parseFloat(e.target.value) > balance)
        {
          setError("Not enough balance");
          setIsValid(false);
        }
        else{
          setError("");
          setIsValid(true);
        }
    }
    setAmount(e.target.value)
  };
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(uid);
      }
    });
    mode == "withdraw" && fetchUserAmount();
    fetchQrCode();
    fetchUpi();
  }, [user]);

  const fetchUserAmount = async () => {
    const userDocRef = doc(db, 'userInfo', user);
    const userDocSnapshot = await getDoc(userDocRef);
    const currentAmount = userDocSnapshot.data().amount;
    setBalance(currentAmount);
    console.log(currentAmount);
    if (currentAmount == 0) {
      setError("Not enough balance");
      setIsValid(false);
    }
    if (currentAmount < parseFloat(amount)) {
      setError("Not enough balance");
      setIsValid(false);
    }
  }

  const fetchQrCode = async () => {
    try {
      setLoading(true);
      const frontRef = ref(storage, `configurations/qrCode`);
      const frontUrl = await getDownloadURL(frontRef);
      setQrCode(frontUrl);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching qrCode:', error);
    }
  };

  const fetchUpi = async () => {
    const userDocRef = doc(db, "configuration", "configuration");
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = { id: userDocSnapshot.id, ...userDocSnapshot.data() };
      if (userData.upiID) {
        setUpi(userData.upiID);
      }
      console.log(userData);
    } else {
      console.log("No such document!");
    }
  }

  const handleAddTransactionToDb = async () => {
    setLoading(true);
    try {
      if (mode == "add money") {
        await addDoc(collection(db, "transactions"), {
          mode: mode,
          utrNumber: utrNumber,
          uid: user,
          dateCreated: moment().valueOf(),
          amount: amount,
          status: "submitted"
        });
        setLoading(false);
        return true;
      }
      else {
        await addDoc(collection(db, "transactions"), {
          mode: mode,
          uid: user,
          dateCreated: moment().valueOf(),
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
    if (utrNumber.trim() === "" && mode == "add money") {
      setError("UTRN cannot be empty.");
      return;
    };
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
        {mode === "add money" && (<div>
          <p>Please send the payment to the following UPI ID: <strong>{upi}</strong></p>
        {
          qrCode &&
          <div>
            <a
              href={qrCode}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              View QR Code
            </a>
          </div>
        }
        </div>)}
        <br />
        <label>
          Enter Amount:
          <input type="text" style={{ marginLeft: 10, marginRight: 20 }} value={amount} onChange={handleAmountChange} />
        </label>
        {mode == "add money" && (
          <label>
            Enter UTR Number:
            <input type="text" style={{ marginLeft: 10 }} value={utrNumber} onChange={handleUtrChange} />
          </label>)}
        <br />
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <center><ClipLoader size={35} color={"#123abc"} loading={loading} /> </center>
        ) : (
          <div>
            {isValid &&
              (<Button onClick={handleSubmit} className="mt-6 w-full mx-auto">
                Submit
              </Button>)}
            <Button onClick={onClose} className="mt-6 w-full mx-auto">
              Cancel
            </Button>
          </div>)}
        <ToastContainer />
      </Modal>
    </div>
  );
};

Modal.setAppElement('#root');

export default Wallet_model;
