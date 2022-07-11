import React from 'react';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

const LandingPage = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', margin: '5vh' }}>
        <Container>
          <h1 align='left' style={{ marginBottom: '5vh' }}>
            Hello User! 👋
          </h1>
          <h2 align='left'>Welcome to ServerlessB&B ❤️</h2>
        </Container>
        <Container>
          <h2>Notifications</h2>
          <Table style={{ marginTop: '5vh' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Food Order Placed!</td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
