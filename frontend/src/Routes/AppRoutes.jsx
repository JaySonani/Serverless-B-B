import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LandingPage from '../Pages/LandingPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
