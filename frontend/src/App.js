import './App.css';
import AppRoutes from './Routes/AppRoutes';
import { useState } from 'react';
import { fetchToken, onMessageListener } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isTokenFound, setTokenFound] = useState(false);

  fetchToken(setTokenFound);

  onMessageListener()
    .then((payload) => {
      console.log(payload);
      toast(payload.notification.body);
    })
    .catch((err) => console.log('failed: ', err));

  return (
    <div className='App'>
      {!isTokenFound && <h1>Please Provide Notification Permissions</h1>}
      {isTokenFound && <AppRoutes />}
      <ToastContainer />
    </div>
  );
}

export default App;
