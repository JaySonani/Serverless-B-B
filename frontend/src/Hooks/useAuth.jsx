import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserAttributes, isUserSessionActive } from '../Services/AuthService';

const useAuthHook = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAttributes, setUserAttributes] = useState({
    email: '',
    given_name: '',
    family_name: '',
    email_verified: false
  });
  const [fetchingUserDetails, setFetchingUserDetails] = useState(true);
  const [isSecurityQuestionAnswered, setIsSecurityQuestionAnswered] = useState(false);
  const navigate = useNavigate();

  const logOutEventHandler = useCallback(() => {
    getUserSessionAndAttributes();
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    getUserSessionAndAttributes();

    document.addEventListener('user-logged-in', getUserSessionAndAttributes);
    document.addEventListener('user-logged-out', logOutEventHandler);

    return () => {
      document.removeEventListener('user-logged-in', getUserSessionAndAttributes);
      document.removeEventListener('user-logged-out', logOutEventHandler);
    }
  }, [logOutEventHandler]);

  const getUserSessionAndAttributes = () => {
    isUserSessionActive()
      .then(() => {
        setIsAuthenticated(true);

        if (localStorage.getItem('security-question-answer-status') === 'answered') {
          setIsSecurityQuestionAnswered(true);
        }

        getCurrentUserAttributes()
          .then((attributes) => {
            setUserAttributes(attributes);
            setFetchingUserDetails(false)
          })
          .catch(() => {
            setUserAttributes({
              email: '',
              given_name: '',
              family_name: '',
              email_verified: false
            })

            setFetchingUserDetails(false);
          });
      })
      .catch(() => {
        setIsAuthenticated(false);
        setFetchingUserDetails(false);
      });
  }

  return {
    isAuthenticated: isAuthenticated && isSecurityQuestionAnswered,
    userAttributes,
    fetchingUserDetails
  }
}

export default useAuthHook;