import Button from '../../../components/elements/Button';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { query, where, doc, getDoc, getDocs, collection, addDoc, updateDoc } from "firebase/firestore"; // Import updateDoc
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import moment from 'moment/moment';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import { ClipLoader } from 'react-spinners';

const UPIPopup = ({ isOpen, onClose, type, amount, time }) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInvested, setUserInvested] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  const [upi, setUpi] = useState("");
  const [refer, setRefer] = useState("");
  const [qrCode, setQrCode] = useState('');
  const [balance, setBalance] = useState(0);
  const [referBonus, setReferBonus] = useState(0);

  const handleUtrChange = (e) => setUtrNumber(e.target.value);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(uid);
      }
    });
  }, []);

  useEffect(() => {
    fetchQrCode();
    fetchUpi();
    fetchUserData();
  }, [user]);

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
        setReferBonus(userData.referBonus);
      }
      console.log(userData);
    } else {
      console.log("No such document!");
    }
  }

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, "userInfo", user);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = { id: userDocSnapshot.id, ...userDocSnapshot.data() };
        if (userData.amount) {
          setBalance(userData.amount);
          setUserInvested(userData.invested);
          setRefer(userData.refer);
        }
        console.log(userData);
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setLoading(false);
    }
  };

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
        time: time,
        dateCreated: moment().valueOf(),
        type: type,
        amount: amount,
        status: "submitted"
      });
      const transactionRef = await addDoc(collection(db, "transactions"), {
        utrNumber: utrNumber,
        uid: user,
        dateCreated: moment().valueOf(),
        type: type,
        amount: amount,
        status: "submitted",
        investmentID: investmentRef.id
      });

      await updateDoc(investmentRef, { transactionID: transactionRef.id });

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
    console.log('UTR Number submitted:', utrNumber);
    if (!loading) {
      const added = await handleAddTransactionToDb();
      console.log(added);
      if (added === true) {
        onClose(added);
      }
      else {
        toast("Error submitting UTRN");
      }
    }
  };

  const payViaWallet = async () => {
    if (amount) {
      const amountFloat = parseFloat(amount);
      if (amountFloat <= balance) {
        setLoading(true);
        try {
          if (!userInvested) {
            var referUID;
            const q = query(collection(db, "userInfo"), where("myRefer", "==", refer));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              referUID = doc.id;
            });
            console.log("uid", referUID);
            if (referUID) {
              const referUserDocRef = doc(db, "userInfo", referUID);
              const referUserDocSnapshot = await getDoc(referUserDocRef);
              if (referUserDocSnapshot.exists()) {
                const referUserData = referUserDocSnapshot.data();
                const newReferBalance = referUserData.amount + referBonus;
                await updateDoc(referUserDocRef, { amount: newReferBalance });

                await addDoc(collection(db, "transactions"), {
                  utrNumber: "Rererral Bonus",
                  uid: referUID,
                  dateCreated: moment().valueOf(),
                  mode: "Rererral Bonus",
                  amount: referBonus,
                  status: "Credited"
                });
              }

            }
          }
          const newBalance = balance - amountFloat;
          const userDocRef = doc(db, "userInfo", user);
          await updateDoc(userDocRef, { amount: newBalance, invested: true });

          const investmentRef = await addDoc(collection(db, "investments"), {
            utrNumber: "wallet_payment",
            uid: user,
            time: time,
            dateCreated: moment().valueOf(),
            type: type,
            amount: amount,
            status: "verified"
          });

          await addDoc(collection(db, "transactions"), {
            utrNumber: "wallet_payment",
            uid: user,
            dateCreated: moment().valueOf(),
            type: type,
            amount: amountFloat,
            status: "verified",
            investmentID: investmentRef.id
          });

          setBalance(newBalance);
          setLoading(false);
          onClose(true);
        } catch (error) {
          console.error("Error updating balance:", error);
          setError("Error processing the payment.");
          setLoading(false);
        }
      } else {
        setError("Insufficient balance.");
      }
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
        <p>Please send the payment of Rs.{amount} to the following UPI ID: <strong>{upi}</strong></p>
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
        <label>
          Enter UTR Number:
          <input type="text" style={{ marginLeft: 10 }} value={utrNumber} onChange={handleUtrChange} />
        </label>
        <br />
        {error && <p className="error-message">{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          {loading ? (
            <ClipLoader size={35} color={"#123abc"} loading={loading} />
          ) : (
            <>
              <Button onClick={handleSubmit} className="mt-6 w-full mx-auto">
                Submit
              </Button>
              <div style={{ width: 5 }}></div>
              <Button onClick={onClose} className="mt-6 w-full mx-auto">
                Cancel
              </Button>
              <div style={{ width: 5 }}></div>
              <Button onClick={payViaWallet} className="mt-6 w-full mx-auto">
                Pay via Wallet (Balance {balance})
              </Button>
            </>
          )}
        </div>
        <ToastContainer />
      </Modal>
    </div>
  );
};

Modal.setAppElement('#root');

export default UPIPopup;
