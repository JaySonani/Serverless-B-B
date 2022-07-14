import React from 'react';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import { ToastContainer, toast } from 'react-toastify';

const OutletPage = () => {
  const [currentUser, setCurrentUser] = useState('rh346685@dal.ca');
  return (
    <div>
      <Header />
      <Outlet context={[currentUser, toast]} />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default OutletPage;
