import { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';

const SignoutForm = () => {
  const [errors, setErrors] = useState([]);

  const onSignout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/users/signout', {}, { withCredentials: true });

      console.log(response.data);
      Router.push('/');
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  // Use useEffect to call onSignout when the component mounts
  useEffect(() => {
    onSignout();
  }, []); // The empty dependency array ensures this effect runs only once, equivalent to componentDidMount

  return <div>Signing you out...</div>;
};

export default SignoutForm;

