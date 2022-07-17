import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import axios from '../Config/AxiosConfig';
import { useState, useEffect } from 'react';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';

const LoginPage = () => {

  const [loading, setLoading] = useState(false);
  const [plainTextAndKey, setPlainTextAndKey] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleCaesarCipher = async (event) => {
    setLoading(true);
    event.preventDefault();

    const cipherTextInput = event.target.cipherText.value;

    try {
      const response = await axios.post(`/caesar-cipher/`, {
        cipher_text: plainTextAndKey[0],
        key: plainTextAndKey[1],
        answer: cipherTextInput,
      });
      if (response.status === 200) {
        console.log(response.data);
        setSuccess(true);
      }
    } catch (error) {
      console.error(error.message);
    }


  }

  //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  const generatePlainText = () => {
    let result = '';
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * 5));
    }
    return result;
  }

  //https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
  const generateKey = () => {
    return Math.floor(Math.random() * 9) + 1;
  }

  useEffect(() => {
    let textAndKey = [];
    const plainText = generatePlainText();
    const key = generateKey();
    textAndKey.push(plainText);
    textAndKey.push(key);
    setPlainTextAndKey(textAndKey);
  }, []);

  return !success ? (
    <>
      <div style={{ display: 'flex', margin: '5vh' }}>
        <Container>
          <h2>Are you Human? Solve this Caesar cipher!</h2>
          <Form method='POST' onSubmit={(event) => handleCaesarCipher(event)}>
            <Form.Group as={Row} className="mb-3" controlId="plainText">
              <Form.Label column sm="3">
                Plain Text
              </Form.Label>
              <Col sm="9">
                <Form.Control plaintext readOnly defaultValue={plainTextAndKey[0]} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="key">
              <Form.Label column sm="3">
                Key
              </Form.Label>
              <Col sm="9">
                <Form.Control plaintext readOnly defaultValue={plainTextAndKey[1]} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="cipherText">
              <Form.Label column sm="3">
                Cipher Text
              </Form.Label>
              <Col sm="9">
                <Form.Control type="text" name="cipherText" />
              </Col>
            </Form.Group>

            <div className='d-grid' style={{ margin: '2vh 0vh' }}>
              <Button variant='dark' size='lg' type='submit' disabled={loading}>
                <Spinner
                    hidden={!loading}
                    animation="grow"
                    as="span"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{ marginRight: '8px' }}
                  />
                  Submit
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </>
  ) : (
    <Container style={{ margin: '32px', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Alert variant="success">
        You have successfully logged in.
      </Alert>
    </Container>
  );
};

export default LoginPage;
