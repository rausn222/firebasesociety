import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Text from '../Text';
import Button from '../../../components/elements/Button';
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Investment_Details = ({ isOpen, onClose, investment }) => {
  const [user, setUser] = useState("");
  const [sipValues, setSipValues] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(uid);
      } else {
        console.log("Wahala de");
      }
    });
  }, []);

  useEffect(() => {
    // Fetch existing SIP values from Firestore
    const fetchSipValues = async () => {
      try {
        const investmentDoc = doc(db, "investments", investment.id);
        const docSnap = await getDoc(investmentDoc);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSipValues(data.sipValues || Array(investment.time - 2).fill(''));
        } else {
          setSipValues(Array(investment.time - 2).fill(''));
        }
      } catch (error) {
        toast.error("Error fetching SIP values: " + error.message);
      }
    };

    if (investment.id) {
      fetchSipValues();
    }
  }, [investment.id, investment.time]);

  const handleInputChange = (index, value) => {
    const newSipValues = [...sipValues];
    newSipValues[index] = value;
    setSipValues(newSipValues);
  };

  const handleSubmit = async () => {
    try {
      const investmentDoc = doc(db, "investments", investment.id);
      await updateDoc(investmentDoc, {
        sipValues: sipValues,
      });
      toast.success("SIP values updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Error updating SIP values: " + error.message);
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
      <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Investment Details" style={customStyles}>
        <center><b><h2>Investment Details</h2></b></center>
        <p>Please find the details of your investment here.</p>
        <Text>Investment ID : {investment.id}</Text>
        <Text>Investment Type : {investment.type}</Text>
        <Text>Investment Amount : {investment.amount}</Text>
        <Text>Investment Time : {investment.time}</Text>
        <Text>Investment Status : {investment.status}</Text>
        <Text>Investment Date : {investment.dateCreated}</Text>
        <Text>Investment UTRN : {investment.utrNumber}</Text>
        {investment.type != "Weekly" && (<div>
          <div>
            {Array.from({ length: investment.time - 2 }).map((_, index) => (
              <div key={index} style={{ margin: 10 }}>
                <label>SIP {index + 2}:</label>
                <input
                  type="text"
                  value={sipValues[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} className="mt-6 w-full mx-auto">
            Save
          </Button>
        </div>)}
        <Button onClick={onClose} className="mt-6 w-full mx-auto">
          Cancel
        </Button>
        <ToastContainer />
      </Modal>
    </div>
  );
};

Modal.setAppElement('#root');

export default Investment_Details;
