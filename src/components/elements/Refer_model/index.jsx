import Button from '../Button';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Text from '../Text';
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Refer_Details = ({ isOpen, onClose, investment }) => {
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
        <center><b><h2>Reference Details</h2></b></center>
        <p>Please find the details of your reference here.</p>
        <Text>User ID : {investment.id}</Text>
        <Text>User Name : {investment.name}</Text>
        <Text>User Email : {investment.email}</Text>
        <Text>User Invested : {investment.invested ? "True":"False"}</Text>
        <Text>User Register Date : {investment.date}</Text>
        <Button onClick={onClose} className="mt-6 w-full mx-auto">
          Okay
        </Button>
        <ToastContainer />
      </Modal>
    </div>
  );
};

Modal.setAppElement('#root');

export default Refer_Details;
