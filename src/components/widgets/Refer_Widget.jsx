import React, { useEffect, useState } from 'react';
import Card from '../elements/Card';
import Text from '../elements/Text';
import { useNavigate } from 'react-router-dom';
import Button from '../elements/Button';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from '../../firebase';
import Investment_Details from '../elements/Investment_model';

const Refer_Widget = () => {
    const [user, setUser] = useState("");
    const [referCode, setReferCode] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedInvestment, setSelectedInvestment] = useState(null); // State for selected investment
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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

    const fetchData = async () => {
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
                setReferCode(user.email.slice(0, 5) + uid.slice(0, 5));
            } else {
                navigate("login");
            }
        });
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
                        No Refers yet !!!
                    </Text>

                    <Text className="text-sm pt-2">
                        Start Refering
                    </Text>

                    <div className='flex flex-col'>
                        <Button onClick={referfunction} className="mt-6 w-auto mx-auto">
                            Refer
                        </Button>
                    </div>
                </Card>
            }
            Referal Code: {referCode} <Button onClick={referfunction} className="mt-6 w-auto mx-auto">
                Copy Code
            </Button>
            {
                data.length !== 0 &&
                <div>
                    <Text className="font-semibold text-xl">
                        Refers
                    </Text>

                    <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginTop: 15, marginBottom: 15 }}>
                        <div style={{ fontSize: "15px" }}>
                            Date Signed Up
                        </div>
                        <div style={{ fontSize: "15px" }}>
                            Name
                        </div>
                    </div>
                </div>
            }

            {
                data.map((note) => (
                    <div key={note.id} onClick={() => handleItemClick(note)} style={{ cursor: 'pointer' }}>
                        <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginBottom: 15 }}>
                            <div style={{ fontSize: "15px" }}>
                                {note.date}
                            </div>
                            <div style={{ fontSize: "15px" }}>
                                {note.name}
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

export default Refer_Widget;
