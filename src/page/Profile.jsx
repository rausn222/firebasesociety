import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/features/userSlice';
import profile from '../assets/profile.png';
import Text from '../components/elements/Text';
import { TextField } from '@mui/material';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Button from '../components/elements/Button';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';

const Profile = () => {
    const user = useSelector((state) => state.user.value);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [aadharFrontUrl, setAadharFrontUrl] = useState('');
    const [aadharBackUrl, setAadharBackUrl] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => setName(e.target.value);

    const fetchAadharImages = async () => {
        try {
            const frontRef = ref(storage, `aadhar/${user.uid}/front`);
            const backRef = ref(storage, `aadhar/${user.uid}/back`);

            const frontUrl = await getDownloadURL(frontRef);
            const backUrl = await getDownloadURL(backRef);
            setAadharFrontUrl(frontUrl);
            setAadharBackUrl(backUrl);
        } catch (error) {
            console.error('Error fetching Aadhar images:', error);
        }
    };

    const fetchUserInfo = async () => {
        const userDocRef = doc(db, "userInfo", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
            const userData = { id: userDocSnapshot.id, ...userDocSnapshot.data() };
            if (userData.name) {
                setName(userData.name);
            }
            console.log(userData);
        } else {
            console.log("No such document!");
        }
    }

    const saveChanges = async () => {
        try {
            const userDocRef = doc(db, "userInfo", user.uid);
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {
                await updateDoc(userDocRef, {
                    name: name
                });
                console.log('Document updated successfully');
                toast("User Data updated successfully");
            }
            else {
                await setDoc(userDocRef, {
                    amount: 0,
                    name: name,
                    email: user.email
                });
                console.log('Document created successfully');
                toast("User Data updated successfully");
            }
        } catch (error) {
            console.error('Error updating/creating document:', error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleFileChange = async (event, side) => {
        const file = event.target.files[0];
        if (!file) return;

        const storageRef = ref(storage, `aadhar/${user.uid}/${side}`);

        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            if (side === 'front') {
                setAadharFrontUrl(url);
                toast("Aadhar card front image updated successfully");
            } else {
                setAadharBackUrl(url);
                toast("Aadhar card back image updated successfully");
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    useEffect(() => {
        dispatch(getCurrentUser());
        fetchAadharImages();
        fetchUserInfo();
        setEmail(user.email)
    }, []);

    return (
        <section className="text-white pt-10 pb-24 px-3  md:pt-10 md:pb-20">
            <center>
                <Text className="font-bold text-xl">
                    Profile
                </Text>
                <img src={profile} width={200} height={200} style={{ marginTop: 30, marginBottom: 10 }} alt="Profile" />
                <Text className="font-light text-xl">
                    {email}
                </Text>
                <div style={{ width: '80%' }}>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        value={name}
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
                        placeholder="Full Name"
                    />
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginTop: 10 }}>
                        <Text>Aadhar Front</Text>
                        {
                            aadharFrontUrl ?
                                <div>
                                    <a
                                        href={aadharFrontUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'blue', textDecoration: 'underline' }}
                                    >
                                        View Aadhar Front
                                    </a>
                                </div> :
                                <Text style={{ color: 'white' }}>{"No Image"}</Text>
                        }
                        <label>
                            {aadharBackUrl ? "Replace" : "Upload"}
                            <input type="file" hidden accept=".pdf, image/*" onChange={(e) => handleFileChange(e, 'front')} />
                        </label>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginTop: 10 }}>
                        <Text>Aadhar Back</Text>
                        {
                            aadharBackUrl ?
                                <div>
                                    <a
                                        href={aadharBackUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'blue', textDecoration: 'underline' }}
                                    >
                                        View Aadhar Back
                                    </a>
                                </div> :
                                <Text style={{ color: 'white' }}>{"No Image"}</Text>
                        }
                        <label>
                            {aadharBackUrl ? "Replace" : "Upload"}
                            <input type="file" hidden accept=".pdf, image/*" onChange={(e) => handleFileChange(e, 'back')} />
                        </label>
                    </div>
                    <Button onClick={() => saveChanges()} className="mt-6 w-full mx-auto">
                        Save
                    </Button>
                    <Button onClick={() => handleGoBack()} className="mt-6 w-full mx-auto">
                        Back
                    </Button>
                </div>
                <ToastContainer />
            </center>
        </section>
    );
};

export default Profile;
