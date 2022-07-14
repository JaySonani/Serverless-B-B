import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';

const COGNITO_REGION = 'us-east-1';
const IDENTITY_POOL_ID = 'us-east-1:d01b4574-2107-42ee-9e67-092b82893799';
const USER_POOL_ID = 'us-east-1_tw6DYffSf';
const CLIENT_ID = '43jpaef8i1np9jk2pnktq8g13s';
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
      onSuccess: (result) => {
        const accessToken = result.getIdToken().getJwtToken();

        AWS.config.region = COGNITO_REGION;

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: IDENTITY_POOL_ID,
          Logins: {
            [COGNITO_PROVIDER]: result.getIdToken().getJwtToken()
          }
        });

        AWS.config.credentials.refresh((error) => {
          if (error) {
            reject(error);
          }

          resolve(accessToken);
        });
      }
    });
  });
}