import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/features/userSlice';
import profile from '../assets/profile.png';
import Text from '../components/elements/Text';
import { TextField } from '@mui/material';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Button from '../components/elements/Button';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

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

    const saveChanges = async () => {
        console.log("called");
        await updateProfile(auth.currentUser, {
            displayName: `${name} `,
        }).then(() => {
            toast("Changes Saved !!");
            console.log("updated successfully");
        }).catch((error) => {
            toast("Error changing name");
            console.log("error updating name");
            console.log(error);
        })
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
            } else {
                setAadharBackUrl(url);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    useEffect(() => {
        dispatch(getCurrentUser());
        fetchAadharImages();
        setName(user.displayName);
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
                        <Button variant="contained" component="label">
                            {aadharBackUrl ? "Replace" : "Upload"}
                            <input type="file" hidden accept=".pdf, image/*" onChange={(e) => handleFileChange(e, 'front')} />
                        </Button>
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
                        <Button variant="contained" component="label">
                            {aadharBackUrl ? "Replace" : "Upload"}
                            <input type="file" hidden accept=".pdf, image/*" onChange={(e) => handleFileChange(e, 'back')} />
                        </Button>
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
