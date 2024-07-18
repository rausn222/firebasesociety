import React, { useState } from 'react';
import Text from '../elements/Text';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { BsPersonCircle } from 'react-icons/bs';
import { Box, Divider, List } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { FaBars } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Button from '../elements/Button';

const NavbarAdmin = () => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        left: false,
    });

    const user = useSelector((state) => state.user.value);

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });

    }

    const handleOpenNavbar = () => {
        setOpen(prev => !prev);
    }

    const navigateProfile = () => {
        navigate("/profile");
    }

    const list = (anchor) => (
        <Box
            className="bg-sidebar h-screen text-white"
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Divider />

            <List>
                <div>
                    <ul>
                        <Text className="pl-4 text-2xl mt-6 font-bold mb-12">
                            Bhartiye<span className="text-tertiary">Society</span>
                        </Text>

                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                isActive ? "bg-secondary w-full block border-l-2 border-l-tertiary mr-2 py-3  text-sm"
                                    :
                                    "mr-2 text-sm py-3 "
                            }
                        >
                            <li className="p-4 ">
                                Home
                            </li>
                        </NavLink>
                    </ul>
                </div>
            </List>
        </Box>
    );


    return (
        <>

            <nav className="flex justify-between px-3 pt-8">
                <div className='flex items-center space-x-2'>
                    <div className='md:hidden block'>
                        {['left'].map((anchor) => (
                            <div className='flex items-center' key={anchor}>
                                <button onClick={toggleDrawer(anchor, true)}>
                                    <FaBars className='text-white' />
                                </button>
                                <SwipeableDrawer
                                    anchor={anchor}
                                    open={state[anchor]}
                                    onClose={toggleDrawer(anchor, false)}
                                    onOpen={toggleDrawer(anchor, true)}
                                >
                                    {list(anchor)}
                                </SwipeableDrawer>
                            </div>
                        ))}
                    </div>
                    <Text className="text-white font-bold text-xl">
                        Welcome, <span> {user.displayName} </span>
                    </Text>
                </div>
                <div className='relative space-y-2'>
                    <BsPersonCircle onClick={handleOpenNavbar} className='cursor-pointer text-white' />
                    {
                        open && (
                            <div className='absolute top-5 right-0 flex justify-end border border-slate-500 bg-sidebar z-40 w-64'>
                                <div className='flex flex-col text-right justify-end w-full pl-4 pr-2 py-4 space-y-2'>
                                    <Button onClick={navigateProfile} className="w-full mx-auto">
                                        View Profile
                                    </Button>
                                    <div className="border-t border-gray-500 mx-2"></div>
                                    <Button onClick={handleLogout} className="w-full mx-auto">
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </nav>
        </>
    )
}

export default NavbarAdmin;