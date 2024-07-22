import React, { useEffect, useState } from 'react';
import Card from '../elements/Card';
import Text from '../elements/Text';
import Button from '../elements/Button';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, getDocs } from "firebase/firestore";
import { db, auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "userInfo"));
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

    const navigate = useNavigate();

    const handleNavigation = (id) => {
        const dataToPass = {
            userId: id,
        };

        navigate("/userDetails", { state: dataToPass });
    };

    return (
        <section>
            {
                data.length === 0 && <Card className="text-center pb-16">
                    <Text className="font-semibold text-xl">
                        No Users yet !!!
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
                        Users List
                    </Text>

                    <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginTop: 15, marginBottom: 15 }}>
                        <div style={{ fontSize: "15px" }}>
                            Name
                        </div>
                        <div style={{ fontSize: "15px" }}>
                            Wallet Amount
                        </div>
                        <div style={{ fontSize: "15px" }}>
                            User ID
                        </div>
                        <div style={{ fontSize: "15px" }}>
                            Email
                        </div>
                    </div>
                </div>
            }

            {
                data.map((note) => (
                    <div key={note.id} onClick={() => handleNavigation(note.id)} style={{ cursor: 'pointer' }}>
                        <div className='relative todo-weekly rounded-lg shadow-md' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginBottom: 15 }}>
                            <div style={{ fontSize: "15px" }}>
                                {note.name}
                            </div>
                            <div style={{ fontSize: "15px" }}>
                                {note.amount}
                            </div>
                            <div style={{ fontSize: "15px" }}>
                                {note.id}
                            </div>

                            <div style={{ fontSize: "15px" }}>
                                {note.email}
                            </div>
                        </div>
                    </div>
                ))
            }
        </section>
    )
}

export default UserList;
