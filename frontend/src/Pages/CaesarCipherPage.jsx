import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import axios from '../Config/AxiosConfig';
import { useState, useEffect } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginPage = (props) => {

  const [loading, setLoading] = useState(false);
  const [plainText, setPlainText] = useState("");
  const navigate = useNavigate();

  const handleCaesarCipher = async (event) => {
    setLoading(true);
    event.preventDefault();
    const cipherTextInput = event.target.cipherText.value;
    try {
      const response = await axios.post(`/caesar-cipher/`, {
        plain_text: plainText,
        user_id: props.userId,
        cipher_text: cipherTextInput,
      });
      if (response.status === 200) {
        if(response.data.success) {
          navigate('/rooms', {state: {userId: props.userId}});
        }
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

  useEffect(() => {
    const plainText = generatePlainText();
    setPlainText(plainText);
  }, []);

  return (
    <div style={{ display: 'flex', margin: '5vh' }}>
    <Container>
      <h2>Solve this Caesar cipher with your Key!</h2>
      <Form method='POST' onSubmit={(event) => handleCaesarCipher(event)}>
        <Form.Group as={Row} className="mb-3" controlId="plainText">
          <Form.Label column sm="3">
            Plain Text
          </Form.Label>
          <Col sm="9">
            <Form.Control plaintext readOnly defaultValue={plainText} />
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
  )
};

export default LoginPage;
