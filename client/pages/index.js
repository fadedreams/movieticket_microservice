import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  // console.log(currentUser);
  // axios.get('/api/users/currentuser');

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {

  console.log(req.headers);
  console.log('I WAS EXECUTED');
  if (typeof window === 'undefined') {
    //const response = await axios.get('http://localhost:3000/api/users/currentuser');
    //return response.data;
    //const response = await axios.get('http://auth:3000/api/users/currentuser');
    //return response.data;
    // we are on the server!
    // requests should be made to http://ingress-nginx.ingress-nginx...laksdjfk
  } else {
    const response = await axios.get('http://localhost:3000/api/users/currentuser');
    return response.data;
    // we are on the browser!
    // requests can be made with a base url of ''
  }
  return {};
};

export default LandingPage;
