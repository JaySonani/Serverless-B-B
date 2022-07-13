import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MealBookingPage from '../Pages/MealBookingPage';
import LandingPage from '../Pages/LandingPage';
import RoomBookingPage from '../Pages/RoomBookingPage';
import TourBookingPage from '../Pages/TourBookingPage';
import OutletPage from '../Pages/OutletPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<OutletPage />}>
          <Route index element={<LandingPage />} />
          <Route path='/meals' element={<MealBookingPage />} />
          <Route path='/rooms' element={<RoomBookingPage />} />
          <Route path='/tours' element={<TourBookingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
