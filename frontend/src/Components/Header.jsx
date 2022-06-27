import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { ReactComponent as ReactLogo } from '../Assets/logo.svg';

const Header = () => {
  return (
    <Navbar fixed='top' collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand href='#home'>
          <ReactLogo style={{ width: '20vw', height: '10vh' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link href='#features'>Bookings</Nav.Link>
            <Nav.Link href='#features'>Kitchen</Nav.Link>
            <Nav.Link href='#features'>Tours</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href='#deets'>Login / Register</Nav.Link>
            <Nav.Link href='#deets'>My Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
