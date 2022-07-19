import React from 'react';
import { Button, Form, Spinner, Container, Alert } from 'react-bootstrap';
import { authenticateUser, isUserSessionActive, userLogInEvent } from '../../Services/AuthService';
import axios from '../../Config/AxiosConfig';
import CaesarCipherPage from '../../Pages/CaesarCipherPage';

const FormModes = Object.freeze({
  Login: Symbol('login'),
  SecurityQuestion: Symbol('security_question'),
  Success: Symbol('success'),
});

class LoginForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      formMode: FormModes.Registration,
      email: '',
      loginFormErrors: {
        email: '',
        password: ''
      },
      securityQuestion: '',
      securityQuestionError: '',
      loading: false
    };
  }

  componentDidMount() {
    isUserSessionActive()
      .then(() => this.setState({
        formMode: FormModes.Success
      }))
      .catch(() => {});
  }

  handleLoginSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    const email = event.target.email.value;
    const password = event.target.password.value;

    const emailFormErrors = {
      email: '',
      password: ''
    }

    if (email === null || email === undefined || email.length === 0) {
      emailFormErrors.email = 'Please enter an email.';
    }

    if (password === null || password === undefined || password.length === 0) {
      emailFormErrors.password = 'Please enter a password.';
    }

    if (emailFormErrors.email !== '' || emailFormErrors.password !== '') {
      this.setState({
        emailFormErrors,
        loading: false
      });

      return;
    }

    try {
      await authenticateUser(email, password);
      const questionResponse = await axios.post('/get-security-question', { email });

      this.setState({
        email,
        securityQuestion: questionResponse.data.question,
        formMode: FormModes.SecurityQuestion
      });
    } catch (error) {
      console.log(error);
    }

    this.setState({
      loading: false
    });
  }

  handleSecurityQuestionSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      loading: true
    });

    const answer = event.target.answer.value;

    if (answer === null || answer === undefined || answer.length === 0) {
      this.setState({
        securityQuestionError: 'Please enter an answer.'
      });

      return;
    }

    try {
      await axios.post('/validate-security-question-answer', {
        email: this.state.email,
        answer
      });

      localStorage.setItem('security-question-answer-status', 'answered');
      await axios.post('/set-user-status', {
        email: this.state.email,
        status: true
      });
      document.dispatchEvent(userLogInEvent);
      this.setState({
        formMode: FormModes.Success
      });
    } catch (error) {
      console.log(error);
    }

    this.setState({
      loading: false
    });
  }

  render () {
    const {
      email: emailError,
      password: passwordError
    } = this.state.loginFormErrors;

    if (this.state.formMode === FormModes.Success) {
      return (
        <Container style={{ margin: '32px', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* <Alert variant="success">
            You have successfully logged in.
          </Alert> */}
          <CaesarCipherPage />
        </Container>
      )
    }

    if (this.state.formMode === FormModes.SecurityQuestion) {
      return (
        <Container style={{ margin: '32px auto', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Answer your security question</h1>
          <p>{this.state.securityQuestion}</p>
          <Container style={{ width: '50%', textAlign: 'left' }}>
            <Form method='POST' onSubmit={this.handleSecurityQuestionSubmit} style={{ marginTop: '32px' }}>
              <Form.Group style={{ marginBottom: '24px' }}>
                <Form.Control name="answer" type="text" placeholder="Answer" />
                {this.state.securityQuestionError && (
                  <Form.Text
                    style={{ color: 'red', fontWeight: 'bold' }}
                  >*{this.state.securityQuestionError}</Form.Text>
                )}
              </Form.Group>

              <Button
                style={{
                  margin: '0 auto',
                  display: 'block',
                  fontWeight: 'bold'
                }}
                name="submit"
                type="submit"
                disabled={this.state.loading}
              >
                <Spinner
                  hidden={!this.state.loading}
                  animation="grow"
                  as="span"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: '8px' }}
                />
                Submit Answer
              </Button>
            </Form>
          </Container>
        </Container>
      );
    }

    // login form UI
    return (
      <Container style={{ margin: '32px auto', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1>Login</h1>
        <Container style={{ width: '50%', textAlign: 'left' }}>
          <Form method='POST' onSubmit={this.handleLoginSubmit} style={{ marginTop: '32px' }}>
            <Form.Group style={{ marginBottom: '24px' }}>
              <Form.Control name="email" type="email" placeholder="Email ID" />
              {emailError && (
                <Form.Text
                  style={{ color: 'red', fontWeight: 'bold' }}
                >*{emailError}</Form.Text>
              )}
            </Form.Group>
            <Form.Group style={{ marginBottom: '24px' }}>
              <Form.Control name="password" type="password" placeholder="Password" />
              {passwordError && (
                <Form.Text
                  style={{ color: 'red', fontWeight: 'bold' }}
                >*{passwordError}</Form.Text>
              )}
            </Form.Group>

            <Button
              style={{
                margin: '0 auto',
                display: 'block',
                fontWeight: 'bold'
              }}
              name="submit"
              type="submit"
              disabled={this.state.loading}
            >
              <Spinner
                hidden={!this.state.loading}
                animation="grow"
                as="span"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{ marginRight: '8px' }}
              />
              Log In
            </Button>
          </Form>
        </Container>
      </Container>
    );
  }
}

export default LoginForm;
