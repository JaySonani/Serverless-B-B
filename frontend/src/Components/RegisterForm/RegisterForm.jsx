import React from 'react';
import { Button, Form, Spinner, Container, Alert } from 'react-bootstrap';
import { isUserSessionActive, registerUser, validateEmailOTP } from '../../Services/AuthService';
import axios from '../../Config/AxiosConfig';
import { Navigate } from 'react-router-dom';

const FormModes = Object.freeze({
  Registration: Symbol('registration'),
  OtpVerification: Symbol('otp_verification'),
  SecurityQuestion: Symbol('security_question'),
  Success: Symbol('success')
});

const securityQuestions = [
  'What was the name of your first pet?',
  'What was the name of your first school?',
  'In which city were you born?',
  'What company\'s car did you first own?',
  'What was the name of your childhood best friend?'
]

class RegisterForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      formMode: FormModes.Registration,
      registrationValues: {
        email: '',
        firstName: '',
        lastName: ''
      },
      registrationFormErrors: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },
      otpFormErrors: {
        otp: ''
      },
      securityQuestionsValue: {
        question: '',
        answer: ''
      },
      securityQuestionsFormErrors: {
        question: '',
        answer: ''
      },
      loading: false,
      redirectToLogin: false
    };
  }

  componentDidMount() {
    isUserSessionActive()
      .then(() => this.setState({ redirectToLogin: true }))
      .catch((ignored) => {});
  }

  handleRegisterSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const dataValid = this.validateRegisterForm(firstName, lastName, email, password);

    if (dataValid) {
      try {
        const response = await registerUser(email, password, firstName, lastName);
        console.log(response);
        this.setState({
          formMode: FormModes.OtpVerification,
          registrationValues: { email, firstName, lastName }
        });
      } catch (error) {
        if (error.name === 'UsernameExistsException') {
          this.setState((currentState) => ({
            ...currentState,
            registrationFormErrors: {
              ...currentState.registrationFormErrors,
              email: 'Please enter a unique email ID.'
            }
          }));
        }
        console.error(error);
      }
    }

    this.setState({
      loading: false
    });
  }

  validateRegisterForm = (firstName, lastName, email, password) => {
    const registrationFormErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (firstName === null || firstName === undefined || firstName.length === 0) {
      registrationFormErrors.firstName = 'Please enter a first name.';
    }

    if (lastName === null || lastName === undefined || lastName.length === 0) {
      registrationFormErrors.lastName = 'Please enter a last name.';
    }

    if (email === null || email === undefined || email.length === 0) {
      registrationFormErrors.email = 'Please enter an email.';
    } else if (!emailRegex.test(email)) {
      registrationFormErrors.email = 'Please enter a valid email.';
    }

    if (password === null || password === undefined || password.length === 0) {
      registrationFormErrors.password = 'Please enter a password.';
    } else if (!passwordRegex.test(password)) {
      registrationFormErrors.password = 'Please enter a valid password that is longer than 8 characters and contains special characters, numbers, uppercase and lowercase letters.'
    }

    this.setState({ registrationFormErrors });

    return Object.values(registrationFormErrors).every((error) => error.length === 0);
  }

  handleOtpVerificationSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const otp = event.target.otp.value;

    const otpRegex = /^[0-9]{6}$/;

    if (otpRegex.test(otp)) {
      try {
        const result = await validateEmailOTP(this.state.registrationValues.email, otp);
        this.setState({
          formMode: FormModes.SecurityQuestion
        });
        console.log(result);
      } catch (error) {
        console.error(error);
        this.setState({
          otpFormErrors: {
            otp: 'OTP entered could not be verified.'
          }
        });
      }
    } else {
      this.setState({
        otpFormErrors: {
          otp: 'Please enter a valid 6-digit OTP.'
        }
      });
    }

    this.setState({ loading: false });
  }

  handleSecurityQuestionsFormSubmission = (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    const question = e.target.question.value;
    const answer = e.target.answer.value;

    const errors = {
      question: '',
      answer: ''
    };

    if (!securityQuestions.includes(question)) {
      errors.question = 'Please select a security question.';
    }

    if (answer === undefined || answer === null || answer.length === 0) {
      errors.answer = 'Please enter an answer.';
    }

    if (!Object.values(errors).every((error) => error.length === 0)) {
      this.setState({
        securityQuestionsFormErrors: errors
      });

      return;
    }

    axios.post('/store-security-question', {
      email: this.state.registrationValues.email,
      question,
      answer
    })
      .then(() => {
        this.setState({
          formMode: FormModes.Success,
          loading: false
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false
        });
      });
  }

  redirectUserToLogin = () => this.setState({ redirectToLogin: true });

  render () {
    const {
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
      password: passwordError
    } = this.state.registrationFormErrors;

    const { otp: otpError } = this.state.otpFormErrors;

    const {
      question: questionError,
      answer: answerError
    } = this.state.securityQuestionsFormErrors;

    if (this.state.redirectToLogin) {
      return <Navigate to="/login" />
    }

    if (this.state.formMode === FormModes.Success) {
      return (
        <Container style={{ margin: '32px auto', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Alert variant="success">
            Your account has been created successfully. Please <Alert.Link onClick={this.redirectUserToLogin}>Log In</Alert.Link> to start using our services!
          </Alert>
        </Container>
      )
    }

    if (this.state.formMode === FormModes.SecurityQuestion) {
      return (
        <Container style={{ margin: '32px auto', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Security Questions</h1>
          <p>Please select a security question for your account</p>
          <Container style={{ width: '50%', textAlign: 'left' }}>
            <Form method='POST' onSubmit={this.handleSecurityQuestionsFormSubmission} style={{ marginTop: '32px' }}>
              <Form.Group style={{ marginBottom: '24px' }}>
                <Form.Select name="question" defaultValue="default">
                  <option value="default">Select a security question</option>
                  {securityQuestions.map((question, index) => {
                    return (
                      <option key={index} value={question}>
                        {question}
                      </option>
                    )
                  })}
                </Form.Select>
                {questionError && (
                  <Form.Text
                    style={{ color: 'red', fontWeight: 'bold' }}
                  >{questionError}</Form.Text>
                )}
              </Form.Group>

              <Form.Group style={{ marginBottom: '24px' }}>
                <Form.Control name="answer" type="text" placeholder="Your answer" />
                {answerError && (
                  <Form.Text
                    style={{ color: 'red', fontWeight: 'bold' }}
                  >*{answerError}</Form.Text>
                )}
              </Form.Group>

              <Button
                style={{
                  margin: '0 auto',
                  display: 'block',
                  fontWeight: 'bold',
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
                Save Security Question
              </Button>
            </Form>
          </Container>
        </Container>
      );
    }

    // verify OTP form UI
    if (this.state.formMode === FormModes.OtpVerification) {
      return (
        <Container style={{ margin: '32px auto', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Account Verification</h1>
          <Container style={{ width: '50%', textAlign: 'left' }}>
            <p>An OTP has been sent to your email: {this.state.registrationValues.email}</p>
            <Form method='POST' onSubmit={this.handleOtpVerificationSubmit} style={{ marginTop: '32px' }}>
              <Form.Group style={{ marginBottom: '24px' }}>
                <Form.Control
                  name="otp"
                  type="text"
                  maxLength={6}
                  placeholder="Enter OTP"
                  style={{
                    width: '200px',
                    textAlign: 'center',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                {otpError && (
                  <Form.Text
                    style={{ display: 'block', textAlign: 'center', color: 'red', fontWeight: 'bold' }}
                  >{otpError}</Form.Text>
                )}
              </Form.Group>

              <Button
                style={{
                  margin: '0 auto',
                  display: 'block',
                  fontWeight: 'bold',
                  width: '200px'
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
                Verify Account
              </Button>
            </Form>
          </Container>
        </Container>
      )
    };

    // registration form UI
    return (
      <Container style={{ margin: '32px auto', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1>Register</h1>
        <Container style={{ width: '50%', textAlign: 'left' }}>
          <Form method='POST' onSubmit={this.handleRegisterSubmit} style={{ marginTop: '32px' }}>
            <Form.Group style={{ marginBottom: '24px' }}>
              <Form.Control name="firstName" type="text" placeholder="First Name" />
              {firstNameError && (
                <Form.Text
                  style={{ color: 'red', fontWeight: 'bold' }}
                >*{firstNameError}</Form.Text>
              )}
            </Form.Group>
            <Form.Group style={{ marginBottom: '24px' }}>
              <Form.Control name="lastName" type="text" placeholder="Last Name" />
              {lastNameError && (
                <Form.Text
                  style={{ color: 'red', fontWeight: 'bold' }}
                >*{lastNameError}</Form.Text>
              )}
            </Form.Group>
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
              Register
            </Button>
          </Form>
        </Container>
      </Container>
    );
  }
}

export default RegisterForm;
