import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

const TourBookingPage = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', margin: '5vh' }}>
        <Container>
          <h2>Book Tour</h2>
          <Form>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput'>
              <FloatingLabel controlId='floatingSelectGrid' label='Tour Type'>
                <Form.Select>
                  <option value='1'>Adventure</option>
                  <option value='2'>Wildlife</option>
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3'>
              <FloatingLabel controlId='floatingInputGrid' label='Date'>
                <Form.Control type='date' placeholder=''></Form.Control>
              </FloatingLabel>
            </Form.Group>
            <Form.Group>
              <FloatingLabel
                controlId='floatingInputGrid'
                label='No. of People'
              >
                <Form.Control type='number' placeholder='1' />
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
                <th>Tour Type</th>
                <th>Price / Person</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Adventure</td>
                <td>99 $</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Wildlife</td>
                <td>79 $</td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default TourBookingPage;
