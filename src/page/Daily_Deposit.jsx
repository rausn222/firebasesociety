import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/features/userSlice';
import Card from '../components/elements/Card';
import Button from '../components/elements/Button';
import Text from '../components/elements/Text';
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import Wallet_Model from '../components/elements/Wallet_Model';

const Daily_Deposit = () => {

    const user = useSelector((state) => state.user.value);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMode, setSelectedMode] = useState('');
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch]);

    const handleClick = (mode) => {
        setSelectedMode(mode);
        setIsModalOpen(true);
    };

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const userDocRef = doc(db, "userInfo", user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = { id: userDocSnapshot.id, ...userDocSnapshot.data() };
                if (userData.amount) {
                    setBalance(userData.amount);
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

    const fetchData = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "transactions"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const fetchedData = [];
            querySnapshot.forEach((doc) => {
                setLoading(false);
                fetchedData.push({ id: doc.id, ...doc.data() });
            });
            console.log(fetchedData);
            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchData();
        fetchUserData();
    }, []);

    return (
        <section className="text-white pt-10 pb-24 px-3 md:pt-10 md:pb-20">
            <section className="grid grid-cols-1 space-y-6 md:space-y-0 md:gap-4">
                <Card className="text-center pb-16">
                    <Text className="font-semibold text-3xl">
                        Wallet
                    </Text>
                    <Text className="font-semibold text-2xl">
                        Current Balance - {balance}
                    </Text>
                    <div className='flex flex-row'>
                        <Button onClick={() => handleClick("add money")} className="mt-6 w-full mx-4">
                            Add Money
                        </Button>
                        <Button onClick={() => handleClick("withdraw")} className="mt-6 w-full mx-4">
                            Withdraw
                        </Button>
                    </div>
                </Card>
            </section>
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
                {(data != [] && data!= null ) &&
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
                                    {note.mode ? note.mode : note.type}
                                </div>
                                <div style={{ fontSize: "15px" }}>
                                    {note.status}
                                </div>
                            </div>
                        </div>
                    ))
                }

                {isModalOpen && (
                    <Wallet_Model
                        isOpen={isModalOpen}
                        mode={selectedMode}
                        onClose={closeModal}
                    />
                )}
            </section>
        </section>
    );
};

export default Daily_Deposit;
