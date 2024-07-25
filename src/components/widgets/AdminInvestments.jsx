import React, { useEffect, useState } from 'react';
import Card from '../elements/Card';
import Text from '../elements/Text';
import Button from '../elements/Button';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from '../../firebase';
import Investment_Complete_Admin from '../elements/Investment_Complete_Admin';
import moment from 'moment';

const AdminInv = () => {
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "investments"), where("status", "==", "Verified"));
            const querySnapshot = await getDocs(q);
            const fetchedData = [];
            const today = moment();

            querySnapshot.forEach((doc) => {
                const investment = { id: doc.id, ...doc.data() };
                if (investment.type === "Weekly") {
                    const weeksToAdd = investment.time || 0;
                    const eligibleDate = moment(investment.dateCreated).add(weeksToAdd, 'weeks');
                    if (today.isSameOrAfter(eligibleDate)) {
                        fetchedData.push(investment);
                    }
                } else {
                    fetchedData.push(investment);
                }
            });

            fetchedData.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
            setData(fetchedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching documents:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user.uid);
            }
        });
    }, []);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const handleItemClick = (investment) => {
        setSelectedInvestment(investment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvestment(null);
    };

    const convertTime = (time) => {
        return moment(time).format('DD/MM/YYYY HH:mm');
    }

    return (
        <section>
            {loading && (
                <Card className="text-center pb-16">
                    <Text className="font-semibold text-xl">Loading...</Text>
                </Card>
            )}
            {!loading && data.length === 0 && (
                <Card className="text-center pb-16">
                    <Text className="font-semibold text-xl">No Transaction approval pending yet !!!</Text>
                    <div className='flex flex-col'>
                        <Button onClick={fetchData} className="mt-6 w-auto mx-auto">
                            Refresh
                        </Button>
                    </div>
                </Card>
            )}
            {!loading && data.length > 0 && (
                <div>
                    <Text className="font-semibold text-xl">Transactions</Text>
                    <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginTop: 15, marginBottom: 15 }}>
                        <div style={{ fontSize: "15px" }}>Amount</div>
                        <div style={{ fontSize: "15px" }}>Date</div>
                        <div style={{ fontSize: "15px" }}>Transaction Type</div>
                        <div style={{ fontSize: "15px" }}>UTRN</div>
                    </div>
                </div>
            )}
            {!loading && data.map((note) => (
                <div key={note.id} onClick={() => handleItemClick(note)} style={{ cursor: 'pointer' }}>
                    <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginBottom: 15 }}>
                        <div style={{ fontSize: "15px" }}>{note.amount}</div>
                        <div style={{ fontSize: "15px" }}>{convertTime(note.dateCreated)}</div>
                        <div style={{ fontSize: "15px" }}>{note.type ? note.type : note.mode}</div>
                        <div style={{ fontSize: "15px" }}>{note.utrNumber}</div>
                    </div>
                </div>
            ))}
            {isModalOpen && selectedInvestment && (
                <Investment_Complete_Admin
                    isOpen={isModalOpen}
                    investment={selectedInvestment}
                    onClose={closeModal}
                />
            )}
        </section>
    )
}

export default AdminInv;
