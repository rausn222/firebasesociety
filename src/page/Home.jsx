import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../store/features/userSlice';
import Pomodoro from '../components/widgets/Pomodoro';
// import { getAllUserNotes } from '../store/features/noteSlice';

const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch])

    return (
        <section className="text-white pt-10 pb-24 px-3  md:pt-10 md:pb-20">
            <section className="grid grid-cols-1 space-y-6 md:space-y-0 md:gap-4">
                <Pomodoro />
            </section>
        </section>
    )
}

export default Home


