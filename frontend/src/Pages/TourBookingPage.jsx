import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import axios from '../Config/AxiosConfig';
import { useState, useEffect } from 'react';

const TourBookingPage = () => {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState({});

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/get-tours/`);
        if (response.status === 200) {
          setTours(response.data);
        }
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchTours();
  }, []);
  return (
    <>
      {loading && <h1>Loading...</h1>}
      {!loading && (
        <div style={{ display: 'flex', margin: '5vh' }}>
          <Container>
            <h2>Book Tour</h2>
            <Form>
              <Form.Group className='mb-3' controlId='exampleForm.ControlInput'>
                <FloatingLabel controlId='floatingSelectGrid' label='Tour Type'>
                  <Form.Select>
                    {tours.map((tour, index) => {
                      return (
                        <option key={index} value={tour.id}>
                          {tour.data.tour_type}
                        </option>
                      );
                    })}
                  </Form.Select>
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
                {tours.map((tour, index) => {
                  return (
                    <tr key={index}>
                      <td>{tour.id}</td>
                      <td>{tour.data.tour_type}</td>
                      <td>{tour.data.tour_price} $</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Container>
        </div>
      )}
    </>
  );
};

export default TourBookingPage;
