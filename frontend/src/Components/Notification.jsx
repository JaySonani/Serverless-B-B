import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Notification = ({ show, setShow, message }) => {
  return (
    <ToastContainer style={{ width: '100%' }}>
      <Toast
        style={{ margin: '0 auto', backgroundColor: 'black', color: 'white' }}
        onClose={() => setShow(false)}
        show={show}
        delay={5000}
        autohide
      >
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Notification;
