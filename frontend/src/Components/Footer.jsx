import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { ReactComponent as ReactLogo } from '../Assets/logo.svg';

const Footer = () => {
  return (
    <Navbar fixed='bottom' bg='dark' variant='dark'>
      <Container style={{ height: '40vh' }}>
        <Navbar.Brand href='#home'>
          <ReactLogo style={{ width: '30vw', height: '15vh' }} />
        </Navbar.Brand>
        <Nav className='justify-content-end flex-column'>
          <Nav.Link href='#home'>Bookings</Nav.Link>
          <Nav.Link href='#features'>Kitchen</Nav.Link>
          <Nav.Link href='#pricing'>Tours</Nav.Link>
        </Nav>
        <Nav className='justify-content-end flex-column'>
          <Nav.Link href='#home'>Home</Nav.Link>
          <Nav.Link href='#features'>FAQ</Nav.Link>
          <Nav.Link href='#pricing'>About</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Footer;
