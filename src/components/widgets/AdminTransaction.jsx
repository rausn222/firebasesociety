import React, { useEffect, useState } from 'react';
import Card from '../elements/Card';
import Text from '../elements/Text';
import { useNavigate } from 'react-router-dom';
import Button from '../elements/Button';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from '../../firebase';
import Investment_Details_Admin from '../elements/Investment_model_admin';

const AdminTransactions = () => {
    const [user, setUser] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedInvestment, setSelectedInvestment] = useState(null); // State for selected investment
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    const fetchData = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "transactions"), where("status", "==", "submitted"));
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

    useEffect(() => {
        fetchData();
    }, [user])

    const handleItemClick = (investment) => {
        setSelectedInvestment(investment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvestment(null);
    };


    const approveTransaction = async () => {
        setIsModalOpen(false);
        try {
            if (selectedInvestment.mode === "add money") {
                const userDocRef = doc(db, 'userInfo', selectedInvestment.uid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const currentAmount = userDocSnapshot.data().amount;
                    if (currentAmount == undefined) {
                        await updateDoc(userDocRef, { amount: selectedInvestment.amount });
                    }
                    else {
                        const newAmount = currentAmount + parseFloat(selectedInvestment.amount);
                        await updateDoc(userDocRef, { amount: newAmount });
                    }
                } else {
                    await updateDoc(userDocRef, { amount: selectedInvestment.amount });
                }
            }

            const transactionDocRef = doc(db, 'transactions', selectedInvestment.id);
            await updateDoc(transactionDocRef, { status: "verified" });
            alert('Status updated successfully!');
            setSelectedInvestment(null);
            fetchData();
        } catch (error) {
            console.error("Error updating document: ", error);
            alert('Error updating status');
        }
    };


    return (
        <section>
            {
                data.length === 0 && <Card className="text-center pb-16">
                    <Text className="font-semibold text-xl">
                        No Transaction approval pending yet !!!
                    </Text>
                    <div className='flex flex-col'>
                        <Button onClick={fetchData} className="mt-6 w-auto mx-auto">
                            Refresh
                        </Button>
                    </div>
                </Card>
            }
            {
                data.length !== 0 &&
                <div>
                    <Text className="font-semibold text-xl">
                        Transactions
                    </Text>

                    <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginTop: 15, marginBottom: 15 }}>
                        <div style={{ fontSize: "15px" }}>
                            Amount
                        </div>
                        <div style={{ fontSize: "15px" }}>
                            Date
                        </div>
                        <div style={{ fontSize: "15px" }}>
                            Transaction Type
                        </div>
                        <div style={{ fontSize: "15px" }}>
                            UTRN
                        </div>
                    </div>
                </div>
            }

            {
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
                                {note.type ? note.type : note.mode}
                            </div>

                            <div style={{ fontSize: "15px" }}>
                                {note.utrNumber}
                            </div>
                        </div>
                    </div>
                ))
            }

            {isModalOpen && selectedInvestment && (
                <Investment_Details_Admin
                    isOpen={isModalOpen}
                    investment={selectedInvestment}
                    onClose={closeModal}
                    onApprove={approveTransaction}
                />
            )}
        </section>
    )
}

export default AdminTransactions;
