import React, { useState, useEffect } from 'react';
import bg from './components/assets/bg.png';
// import Sidebar from './components/widgets/Sidebar';
import Home from './page/Home';
import Notes from './page/Notes';
import Signup from './page/Signup';
import Login from './page/Login';
import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/widgets/Navbar';
import Layout from './components/widgets/Layout';
import { BrowserRouter as Router } from 'react-router-dom';
import NoteDetail from './page/NoteDetail';
import ProtectedRoute from './components/widgets/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/features/userSlice';
import NotFound from './page/NotFound';
import Investments from './page/Investments';
import Weekly_Investments from './page/Weekly_Investments';
import Society_Investments from './page/Society_Investments';
import Profile from './page/Profile';
import Daily_Deposit from './page/Daily_Deposit';
import AdminHome from './page/AdminHome';
import ProtectedRouteAdmin from './components/widgets/ProtectedRouteAdmin';
import Users from './page/Users';


function App() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  // const user = "asasa";
  console.log(user);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch])


  return (
    <Router>
      <div className="md:overflow-x-auto overflow-x-hidden bg-primary">
        <section>
          <div>
            <Routes>
              <Route element={<ProtectedRoute user={user} />}>
                <Route
                  path="/home"
                  element={
                    < Home />
                  }
                />
                <Route
                  path="/invest"
                  element={
                    < Investments />
                  }
                />

                <Route
                  path="/notes/:id"
                  element={<NoteDetail />}
                />

                <Route
                  path="/notes"
                  element={
                    < Notes />
                  }
                />

                <Route path="/weekly" element={<Weekly_Investments />} />
                <Route path="/society" element={<Society_Investments />} />
                <Route path="/daily" element={<Daily_Deposit />} />

              </Route>

              <Route element={<ProtectedRouteAdmin user={user} />}>
                <Route
                  path="/adminHome"
                  element={
                    < AdminHome />
                  }
                />
                <Route
                  path="/users"
                  element={
                    < Users />
                  }
                />
              </Route>

              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Login />} />
              <Route path="*" element={< NotFound />} />
              <Route path="/profile" element={< Profile />} />
            </Routes>
          </div>
        </section>

      </div>
    </Router>
  );
}

export default App;



