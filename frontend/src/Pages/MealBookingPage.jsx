import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

const MealBookingPage = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', margin: '5vh' }}>
        <Container>
          <h2>Book Meal</h2>
          <Form>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput'>
              <FloatingLabel controlId='floatingSelectGrid' label='Meal Type'>
                <Form.Select>
                  <option value='1'>Veg</option>
                  <option value='2'>Non Veg</option>
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
            <Form.Group>
              <FloatingLabel controlId='floatingInputGrid' label='Quantity'>
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
          <h2>Menu</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Meal Type</th>
                <th>Price / Meal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Veg</td>
                <td>19.99 $</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Non-Veg</td>
                <td>29.99 $</td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default MealBookingPage;
