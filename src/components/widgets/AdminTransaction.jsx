import React, { useEffect, useState } from 'react';
import Card from '../elements/Card';
import Text from '../elements/Text';
import { useNavigate } from 'react-router-dom';
import Button from '../elements/Button';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from '../../firebase';
import Investment_Details from '../elements/Investment_model';

const AdminTransactions = () => {
    const [user, setUser] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedInvestment, setSelectedInvestment] = useState(null); // State for selected investment
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    const resetTimer = () => {
        navigate("/invest");
    }

    const fetchData = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "investments"), where("uid", "==", user));
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

    return (
        <section>
            {
                data.length === 0 && <Card className="text-center pb-16">
                    <Text className="font-semibold text-xl">
                        No Investment yet !!!
                    </Text>

                    <Text className="text-sm pt-2">
                        Invest today and start earning
                    </Text>

                    <div className='flex flex-col'>
                        <Button onClick={resetTimer} className="mt-6 w-auto mx-auto">
                            Invest
                        </Button>
                    </div>
                </Card>
            }
            {
                data.length !== 0 &&
                <div>
                    <Text className="font-semibold text-xl">
                        Investments
                    </Text>

                    <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginTop:15, marginBottom: 15 }}>
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
                                {note.type}
                            </div>

                            <div style={{ fontSize: "15px" }}>
                                {note.status}
                            </div>
                        </div>
                    </div>
                ))
            }

            {isModalOpen && selectedInvestment && (
                <Investment_Details 
                    isOpen={isModalOpen}
                    investment={selectedInvestment}
                    onClose={closeModal}
                />
            )}
        </section>
    )
}

export default AdminTransactions;
