import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../store/features/userSlice';
import { useLocation } from 'react-router-dom';
import Button from '../components/elements/Button';
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import Text from '../components/elements/Text';
import { db } from '../firebase';
import profile from '../assets/profile.png';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ref, getMetadata, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import Wallet_model from '../components/elements/Wallet_Model';

const UsersDetails = () => {
    const location = useLocation();
    const userID = location.state;
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState("userDetails");
    const [userData, setUserData] = useState();
    const [aadharFrontUrl, setAadharFrontUrl] = useState('');
    const [aadharBackUrl, setAadharBackUrl] = useState('');
    const [data, setData] = useState([]);
    const [investmentData, setinvestmentData] = useState([]);
    const [referData, setReferData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [referCode, setReferCode] = useState("");

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch]);

    useEffect(() => {
        fetchUserData();
        fetchAadharImages();
        fetchData();
        fetchInvestment();
        fetchReferData();
    }, [])

    const referfunction = async () => {
        const shareData = {
            title: 'Referral Code',
            text: 'Join our app using my referral code!',
            url: referCode,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                console.log('Referral link shared successfully');
            } else {
                await navigator.clipboard.writeText(referCode);
                alert('Referral link copied to clipboard. You can now share it manually.');
            }
        } catch (error) {
            console.error('Error sharing referral link:', error);
        }
    };

    const fetchReferData = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "userInfo"), where("refer", "==", referCode));
            const querySnapshot = await getDocs(q);
            const fetchedData = [];
            querySnapshot.forEach((doc) => {
                setLoading(false);
                fetchedData.push({ id: doc.id, ...doc.data() });
            });
            console.log(fetchedData);
            setReferData(fetchedData);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    const fetchInvestment = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "investments"), where("uid", "==", userID.userId));
            const querySnapshot = await getDocs(q);
            const fetchedData = [];
            querySnapshot.forEach((doc) => {
                setLoading(false);
                fetchedData.push({ id: doc.id, ...doc.data() });
            });
            console.log(fetchedData);
            setinvestmentData(fetchedData);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    const fetchData = async () => {
        try {
            const q = query(collection(db, "transactions"), where("uid", "==", userID.userId));
            const querySnapshot = await getDocs(q);
            const fetchedData = [];
            querySnapshot.forEach((doc) => {
                fetchedData.push({ id: doc.id, ...doc.data() });
            });
            console.log(fetchedData);
            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    const fetchUserData = async () => {
        try {
            const userDocRef = doc(db, "userInfo", userID.userId);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = { id: userDocSnapshot.id, ...userDocSnapshot.data() };
                setUserData(userData);
                setReferCode(userData.myRefer)
                console.log(userData);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    const fetchAadharImages = async () => {
        try {
            const frontRef = ref(storage, `aadhar/${userID.userId}/front`);
            await getMetadata(frontRef);
            const frontUrl = await getDownloadURL(frontRef);
            setAadharFrontUrl(frontUrl);
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                console.log("Front File does not exist");
                return null;
            } else {
                console.error("Error checking file existence", error);
                throw error;
            }
        }
        try {
            const backRef = ref(storage, `aadhar/${userID.userId}/back`);
            await getMetadata(backRef);
            const backUrl = await getDownloadURL(backRef);
            setAadharBackUrl(backUrl);
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                console.log("Back File does not exist");
                return null;
            } else {
                console.error("Error checking file existence", error);
                throw error;
            }
        }
    };

    return (
        <section className="text-white pt-10 pb-24 px-3 md:pt-10 md:pb-20">
            <section className="grid grid-cols-1 space-y-6 md:space-y-0 md:gap-4">
                <div>User ID: {userID.userId}</div>

                <div className="tab-buttons flex">
                    <Button
                        onClick={() => setSelectedTab("userDetails")}
                        className={`mt-6 w-1/2 mx-auto ${selectedTab === "userDetails" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                        User Details
                    </Button>
                    <div style={{ width: 3 }}></div>
                    <Button
                        onClick={() => setSelectedTab("investmentDetails")}
                        className={`mt-6 w-1/2 mx-auto ${selectedTab === "investmentDetails" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                        Investment Details
                    </Button>
                    <div style={{ width: 3 }}></div>
                    <Button
                        onClick={() => setSelectedTab("referDetails")}
                        className={`mt-6 w-1/2 mx-auto ${selectedTab === "referDetails" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                        Refferal Details
                    </Button>
                </div>

                {(selectedTab === "userDetails" && userData != undefined) && (
                    <div>
                        <center>
                            <img src={profile} width={200} height={200} style={{ marginTop: 30, marginBottom: 10 }} alt="Profile" />
                            <Text className="font-light text-xl">
                                {userData.email}
                            </Text>
                            <Text className="font-light text-xl">
                                {userData.name}
                            </Text>
                            <Text className="font-light text-xl">
                                Wallet Balance: {userData.amount}
                            </Text>
                            <div style={{ width: '80%' }}>
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

                                </div>
                            </div>
                            <ToastContainer />
                        </center>
                        <Text className="font-semibold text-3xl" style={{ marginTop: 20 }}>
                            Transactions
                        </Text>
                        <section>
                            {
                                <div>
                                    <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginTop: 15, marginBottom: 15 }}>
                                        <div style={{ fontSize: "15px" }}>
                                            Amount
                                        </div>
                                        <div style={{ fontSize: "15px" }}>
                                            Date
                                        </div>
                                        <div style={{ fontSize: "15px" }}>
                                            UTRN / UPI ID
                                        </div>
                                        <div style={{ fontSize: "15px" }}>
                                            Deposit / Invest
                                        </div>
                                        <div style={{ fontSize: "15px" }}>
                                            Status
                                        </div>
                                    </div>
                                </div>
                            }
                            {(data != [] && data != null) &&
                                data.map((note) => (
                                    <div key={note.id} onClick={() => handleItemClick(note)} style={{ cursor: 'pointer' }}>
                                        <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginBottom: 15 }}>
                                            <div style={{ fontSize: "15px" }}>
                                                {note.amount}
                                            </div>
                                            <div style={{ fontSize: "15px" }}>
                                                {note.dateCreated}
                                            </div>
                                            <div style={{ fontSize: "15px" }}>
                                                {note.utrNumber}
                                            </div>
                                            <div style={{ fontSize: "15px" }}>
                                                {note.mode}
                                            </div>
                                            <div style={{ fontSize: "15px" }}>
                                                {note.status}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                            {isModalOpen && (
                                <Wallet_model
                                    isOpen={isModalOpen}
                                    mode={selectedMode}
                                    onClose={closeModal}
                                />
                            )}
                        </section>
                    </div>
                )}

                {selectedTab === "investmentDetails" && (
                    <div className="investment-details">
                        <p>Investment Details</p>
                        {
                            investmentData.length !== 0 &&
                            <div>
                                <Text className="font-semibold text-xl">
                                    Investments
                                </Text>

                                <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginTop: 15, marginBottom: 15 }}>
                                    <div style={{ fontSize: "15px" }}>
                                        Amount
                                    </div>
                                    <div style={{ fontSize: "15px" }}>
                                        Date Invested
                                    </div>
                                    <div style={{ fontSize: "15px" }}>
                                        Investment Type
                                    </div>
                                    <div style={{ fontSize: "15px" }}>
                                        Status
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            investmentData.map((note) => (
                                <div key={note.id} onClick={() => handleItemClick(note)} style={{ cursor: 'pointer' }}>
                                    <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginBottom: 15 }}>
                                        <div style={{ fontSize: "15px" }}>
                                            {note.amount}
                                        </div>
                                        <div style={{ fontSize: "15px" }}>
                                            {note.dateCreated}
                                        </div>
                                        <div style={{ fontSize: "15px" }}>
                                            {note.type}
                                        </div>

                                        <div style={{ fontSize: "15px" }}>
                                            {note.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
                {selectedTab === "referDetails" && (
                    <div className="referDetails">
                        <p>Referal Details</p> Referal Code: {referCode} <Button onClick={referfunction} className="mt-6 w-auto mx-auto">
                            Copy Code
                        </Button>
                        {
                            referData.length !== 0 &&
                            <div>
                                <Text className="font-semibold text-xl">
                                    Refferals
                                </Text>

                                <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginTop: 15, marginBottom: 15 }}>
                                    <div style={{ fontSize: "15px" }}>
                                        Name
                                    </div>
                                    <div style={{ fontSize: "15px" }}>
                                        UID
                                    </div>
                                    <div style={{ fontSize: "15px" }}>
                                        Date Signed Up
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            referData.map((note) => (
                                <div key={note.id} onClick={() => handleItemClick(note)} style={{ cursor: 'pointer' }}>
                                    <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginBottom: 15 }}>
                                        <div style={{ fontSize: "15px" }}>
                                            {note.name}
                                        </div>
                                        <div style={{ fontSize: "15px" }}>
                                            {note.id}
                                        </div>
                                        <div style={{ fontSize: "15px" }}>
                                            {note.date}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
            </section>
        </section>
    );
};

export default UsersDetails;
