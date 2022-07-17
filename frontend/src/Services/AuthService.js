import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import axios from '../Config/AxiosConfig';

export const userLogInEvent = new Event('user-logged-in');
const userLogOutEvent = new Event('user-logged-out');
const userSessionRefreshEvent = new Event('user-session-refreshed');

const COGNITO_REGION = process.env.REACT_APP_COGNITO_REGION;
const IDENTITY_POOL_ID = process.env.REACT_APP_IDENTITY_POOL_ID;
const USER_POOL_ID = process.env.REACT_APP_USER_POOL_ID;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const COGNITO_PROVIDER = `cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}`;

const poolData = {
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID
}

const userPool = new CognitoUserPool(poolData);

export const registerUser = (email, password, firstName, lastName) => {
  return new Promise((resolve, reject) => {
    const attributes = [];

    const emailAttribute = new CognitoUserAttribute({
      Name: 'email',
      Value: email
    });

    const firstNameAttribute = new CognitoUserAttribute({
      Name: 'given_name',
      Value: firstName
    });

    const lastNameAttribute = new CognitoUserAttribute({
      Name: 'family_name',
      Value: lastName
    });

    attributes.push(emailAttribute, firstNameAttribute, lastNameAttribute);

    userPool.signUp(email, password, attributes, null, (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result.user);
    });
  });
};

const getCognitoUserFromEmail = (email) => {
  const userData = {
    Username: email,
    Pool: userPool
  };

  return new CognitoUser(userData);
}

export const validateEmailOTP = (email, otp) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUserFromEmail(email);
    cognitoUser.confirmRegistration(otp, true, (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

export const resendOTP = (email) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUserFromEmail(email);
    cognitoUser.resendConfirmationCode((error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

export const authenticateUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    const cognitoUser = getCognitoUserFromEmail(email);
    cognitoUser.authenticateUser(authenticationDetails, {
      onFailure: (error) => reject(error),
      onSuccess: (session) => {
        document.dispatchEvent(userLogInEvent);
        const idToken = session.getIdToken().getJwtToken();
        refreshSessionCredentialsInConfig(idToken)
          .then(() => resolve(true))
          .catch((error) => reject(error));
      }
    });
  });
}

export const isUserSessionActive = () => {
  return new Promise((resolve, reject) => {
    try {
      const currentUser = userPool.getCurrentUser();

      currentUser.getSession((error, session) => {
        if (error) {
          console.error(error);
          reject(error);
        }

        const idToken = session.getIdToken().getJwtToken();

        refreshSessionCredentialsInConfig(idToken)
          .then(() => resolve(true))
          .catch((error) => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}

export const getCurrentUserAttributes = () => {
  return new Promise((resolve, reject) => {
    try {
      const currentUser = userPool.getCurrentUser();

      currentUser.getSession((error, session) => {
        if (error) {
          reject(error);
        }

        currentUser.getUserAttributes((error, attributes) => {
          if (error || attributes === null) {
            return reject(error);
          }

          const userAttributes = new Map();

          for (let i = 0; i < attributes.length; i++) {
            const { Name, Value } = attributes[i];

            if (Name === 'sub') {
              continue;
            }

            userAttributes.set(Name, Value);
          }

          const idToken = session.getIdToken().getJwtToken();
          refreshSessionCredentialsInConfig(idToken)
            .then(() => resolve(Object.fromEntries(userAttributes)))
            .catch((error) => reject(error));
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

export const logoutUser = () => {
  try {
    const currentUser = userPool.getCurrentUser();

    currentUser.getSession((error) => {
      if (error) throw error;

      currentUser.getUserAttributes((error, attributes) => {
        if (error) throw error;

        const emailAttribute = attributes.find((attribute) => attribute.Name === 'email');
        const email = emailAttribute.Value;

        currentUser.globalSignOut({
          onSuccess: async () => {
            localStorage.removeItem('security-question-answer-status');
            document.dispatchEvent(userLogOutEvent);
            await axios.post('/set-user-status', {
              email,
              status: false
            });
            window.location = '/login';
          },
          onFailure: (error) => {
            throw error;
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
}

const refreshSessionCredentialsInConfig = (idToken) => {
  return new Promise((resolve, reject) => {
    AWS.config.region = COGNITO_REGION;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IDENTITY_POOL_ID,
      Logins: {
        [COGNITO_PROVIDER]: idToken
      }
    });

    AWS.config.credentials.refresh((error) => {
      if (error) {
        reject(error);
      }

      document.dispatchEvent(userSessionRefreshEvent);
      resolve(true);
    });
  });
}