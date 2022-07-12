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

const TourBookingPage = () => {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState({});
  const [ptour, setPtours] = useState("");
  const [duration, setDuration] = useState(0);

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
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

  const predictPackage = async (
    duration,
    Bearer_token,
    ProjectId,
    EndpointId
  ) => {
    const res = await axioss.post(
      "https://us-central1-aiplatform.googleapis.com/v1/projects/" +
        ProjectId +
        "/locations/us-central1/endpoints/" +
        EndpointId +
        ":predict",
      { instances: { duration: duration } },
      {
        headers: {
          Authorization: "Bearer " + Bearer_token,
          "content-type": "application/json",
        },
      }
    );
    const maxi = await Math.max(...res.data.predictions[0].scores);
    const ind = await res.data.predictions[0].scores.indexOf(maxi);
    //console.log(res.data.predictions[0].classes[ind]);
    return res.data.predictions[0].classes[ind];
  };

  const predictTour = async () => {
    const tourTypess = {
      0: "Adventure",
      1: "WildLife",
      2: "Nature",
    };

    const Bearer_token =
      "ya29.a0AVA9y1vObZFUFsc8f5P05NZ9CFB7Nk-MkHw7AQey8MW36CnY2RjB4KICQg3fAjRxKNC2a7EA0pWzCW-Izsba_EiFaa9lScTVER5EH7xBNnEWv4-T40FQoZ7-CnUjSHpepBeZhVYsfWXNafP_BnMUvaW-n7donSC54uPdvgs";
    const ProjectId = "ml-learning-352715";
    const EndpointId = "8254772661528297472";

    const output = await predictPackage(
      duration.toString(),
      Bearer_token,
      ProjectId,
      EndpointId
    );
    //console.log("Output : " + output);
    setPtours(tourTypess[output]);
  };

  return (
    <>
      <Header />
      {loading && <h1>Loading...</h1>}
      {!loading && (
        <div style={{ display: "flex", margin: "5vh" }}>
          {/* ------- */}

          <Container>
            <h2>Predict Best Tour for you!</h2>
            <Form>
              <Form.Group>
                <FloatingLabel
                  controlId="floatingInputGrid"
                  label="Stay duration"
                  onChange={handleDurationChange}
                >
                  <Form.Control type="number" placeholder="1" />
                </FloatingLabel>
              </Form.Group>
              <div className="d-grid" style={{ margin: "2vh 0vh" }}>
                <Button variant="dark" size="lg" onClick={predictTour}>
                  Predict
                </Button>
              </div>
              <div className="d-grid" style={{ margin: "2vh 0vh" }}>
                {ptour.length > 0 && (
                  <h5>You should select "{ptour}" type of tour!</h5>
                )}
              </div>
            </Form>
          </Container>

          {/* ------- */}

          <Container>
            <h2>Book Tour</h2>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput">
                <FloatingLabel controlId="floatingSelectGrid" label="Tour Type">
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
                  controlId="floatingInputGrid"
                  label="No. of People"
                >
                  <Form.Control type="number" placeholder="1" />
                </FloatingLabel>
              </Form.Group>
              <div className="d-grid" style={{ margin: "2vh 0vh" }}>
                <Button variant="dark" size="lg" type="submit">
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
      <Footer />
    </>
  );
};

export default TourBookingPage;
