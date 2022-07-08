import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import axios from '../Config/AxiosConfig';
import { useState, useEffect } from 'react';

const RoomBookingPage = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState({});

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/get-rooms/`);
        if (response.status === 200) {
          setRooms(response.data);
        }
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);

  return (
    <>
      <Header />
      {loading && <h1>Loading...</h1>}
      {!loading && (
        <div style={{ display: 'flex', margin: '5vh' }}>
          <Container>
            <h2>Book Room</h2>
            <Form>
              <Form.Group className='mb-3' controlId='exampleForm.ControlInput'>
                <FloatingLabel controlId='floatingSelectGrid' label='Room Type'>
                  <Form.Select>
                    {rooms.map((room, index) => {
                      return (
                        <option key={index} value={room.id}>
                          {room.data.room_type}
                        </option>
                      );
                    })}
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
                {rooms.map((room, index) => {
                  return (
                    <tr key={index}>
                      <td>{room.id}</td>
                      <td>{room.data.room_type}</td>
                      <td>{room.data.room_price} $</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Container>
        </div>
      )}
      <Footer />
    </>
  );
};

export default RoomBookingPage;
