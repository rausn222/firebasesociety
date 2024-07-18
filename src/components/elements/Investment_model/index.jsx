import Button from '../../../components/elements/Button';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Text from '../Text';
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Investment_Details = ({ isOpen, onClose, investment }) => {
  const [user, setUser] = useState("");

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
      height: '40%',
      margin: 'auto',
    },
  };

  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="UPI Payment" style={customStyles}>
        <center><b><h2>Investment Details</h2></b></center>
        <p>Please find the details of your investment here.</p>
        <Text>Investment ID : {investment.id}</Text>
        <Text>Investment Type : {investment.type}</Text>
        <Text>Investment Amount : {investment.amount}</Text>
        <Text>Investment Status : {investment.status}</Text>
        <Text>Investment Date : {investment.dateCreated}</Text>
        <Text>Investment UTRN : {investment.utrNumber}</Text>
        <Button onClick={onClose} className="mt-6 w-full mx-auto">
          Okay
        </Button>
        <ToastContainer />
      </Modal>
    </div>
  );
};

Modal.setAppElement('#root');

export default Investment_Details;
