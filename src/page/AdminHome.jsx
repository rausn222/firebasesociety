import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/features/userSlice';
import AdminTransactions from '../components/widgets/AdminTransaction';

const AdminHome = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch])

    return (
        <section className="text-white pt-10 pb-24 px-3  md:pt-10 md:pb-20">
            <section className="grid grid-cols-1 space-y-6 md:space-y-0 md:gap-4">
                <AdminTransactions />
            </section>
        </section>
    )
}

export default AdminHome


