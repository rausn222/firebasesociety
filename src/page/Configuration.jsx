import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../store/features/userSlice';
import Text from '../components/elements/Text';
import { TextField } from '@mui/material';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Button from '../components/elements/Button';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';

const Configuration = () => {
    const [upi, setUpi] = useState('');
    const [qrCode, setQrCode] = useState('');
    const dispatch = useDispatch();
    const handleChange = (e) => setUpi(e.target.value);

    const fetchQrCode = async () => {
        try {
            const frontRef = ref(storage, `configurations/qrCode`);
            const frontUrl = await getDownloadURL(frontRef);
            setQrCode(frontUrl);
        } catch (error) {
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

    const saveChanges = async () => {
        try {
            const userDocRef = doc(db, "configuration", "configuration");
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {
                await updateDoc(userDocRef, {
                    upiID: upi
                });
                console.log('Document updated successfully');
                toast("UPI updated successfully");
            }
            else {
                await setDoc(userDocRef, {
                    upiID: upi
                });
                console.log('Document created successfully');
                toast("UPI updated successfully");
            }
        } catch (error) {
            console.error('Error updating/creating document:', error);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const storageRef = ref(storage, `configurations/qrCode`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setQrCode(url);
            toast("QR Code Updated Successfully");
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    useEffect(() => {
        dispatch(getCurrentUser());
        fetchQrCode();
        fetchUpi();
    }, [dispatch]);

    return (
        <section className="text-white pt-10 pb-24 px-3  md:pt-10 md:pb-20">
            <center>
                <Text className="font-bold text-xl">
                    Profile
                </Text>

                <div style={{ width: '80%' }}>
                    <TextField
                        label="UPI ID"
                        variant="outlined"
                        value={upi}
                        onChange={handleChange}
                        InputLabelProps={{
                            style: { color: 'green' },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                                backgroundColor: 'white',
                            },
                        }}
                        style={{ width: '100%', color: 'white', marginTop: 40 }}
                        placeholder="UPI ID"
                    />
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginTop: 10 }}>
                        <Text>QR Code</Text>
                        {
                            qrCode ?
                                <div>
                                    <a
                                        href={qrCode}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'blue', textDecoration: 'underline' }}
                                    >
                                        View QR Code
                                    </a>
                                </div> :
                                <Text style={{ color: 'white' }}>{"No Image"}</Text>
                        }
                        <label>
                            {qrCode ? "Replace" : "Upload"}
                            <input type="file" hidden accept=".pdf, image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <Button onClick={saveChanges} className="mt-6 w-full mx-auto">
                        Save
                    </Button>
                </div>
                <ToastContainer />
            </center>
        </section>
    );
};

export default Configuration;
