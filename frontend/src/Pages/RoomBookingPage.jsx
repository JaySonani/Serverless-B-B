import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

const RoomBookingPage = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', margin: '5vh' }}>
        <Container>
          <h2>Book Room</h2>
          <Form>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput'>
              <FloatingLabel controlId='floatingSelectGrid' label='Room Type'>
                <Form.Select>
                  <option value='1'>Non AC</option>
                  <option value='2'>AC</option>
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3'>
              <FloatingLabel
                controlId='floatingInputGrid'
                label='Check In Date'
              >
                <Form.Control type='date' placeholder=''></Form.Control>
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3'>
              <FloatingLabel
                controlId='floatingInputGrid'
                label='Check Out Date'
              >
                <Form.Control type='date' placeholder=''></Form.Control>
              </FloatingLabel>
            </Form.Group>
            <div className='d-grid' style={{ margin: '2vh 0vh' }}>
              <Button variant='dark' size='lg' type='submit'>
                Submit
              </Button>
            </div>
          </Form>
        </Container>
        <Container>
          <h2>Prices</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Room Type</th>
                <th>Price / Night</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Non AC</td>
                <td>99 $</td>
              </tr>
              <tr>
                <td>2</td>
                <td>AC</td>
                <td>149 $</td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default RoomBookingPage;
