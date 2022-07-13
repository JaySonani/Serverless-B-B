import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "../Config/AxiosConfig";
import { useState, useEffect } from "react";
const axioss = require("axios");

const Review = () => {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState({});
  const [feedback, setFeedback] = useState("");

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

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

  const predictSentiment = () => {
    console.log(feedback);
  };

  return (
    <>
      <Header />
      {loading && <h1>Loading...</h1>}
      {!loading && (
        <div style={{ display: "flex", margin: "5vh" }}>
          {/* ------- */}

          <Container>
            <h2>Provide your Honest Feedback</h2>
            <Form>
              <Form.Group>
                <FloatingLabel
                  controlId="floatingInputGrid"
                  label="Enter the feedback"
                  onChange={handleFeedbackChange}
                >
                  <Form.Control type="text" placeholder="1" />
                </FloatingLabel>
              </Form.Group>
              <div className="d-grid" style={{ margin: "2vh 0vh" }}>
                <Button variant="dark" size="lg" onClick={predictSentiment}>
                  Submit
                </Button>
              </div>
            </Form>
          </Container>

          {/* ------- */}

          {/* <Container>
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
          </Container> */}
        </div>
      )}
      <Footer />
    </>
  );
};

export default Review;
