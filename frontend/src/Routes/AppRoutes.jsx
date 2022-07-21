import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MealBookingPage from '../Pages/MealBookingPage';
import HomePage from '../Pages/HomePage';
import RoomBookingPage from '../Pages/RoomBookingPage';
import TourBookingPage from '../Pages/TourBookingPage';
import OutletPage from '../Pages/OutletPage';
import RegisterPage from '../Pages/RegisterPage';
import LoginPage from '../Pages/LoginPage';
import ValidateUserSession from '../Components/ValidateUserSession';
import ReviewPage from '../Pages/ReviewPage';
import VisualizationsPage from "../Pages/VisualizationsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<OutletPage />}>
          <Route path='/' element={<RoomBookingPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/visualizations' element={<VisualizationsPage />} />
          <Route
            path='/home'
            element={
              <ValidateUserSession>
                <HomePage />
              </ValidateUserSession>
            }
          />
          <Route
            path='/meals'
            element={
              <ValidateUserSession>
                <MealBookingPage />
              </ValidateUserSession>
            }
          />
          <Route
            path='/tours'
            element={
              <ValidateUserSession>
                <TourBookingPage />
              </ValidateUserSession>
            }
          />
          <Route
            path='/feedback'
            element={
              <ValidateUserSession>
                <ReviewPage />
              </ValidateUserSession>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
