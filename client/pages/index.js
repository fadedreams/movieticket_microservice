import { useEffect } from 'react';
import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users/currentuser', { withCredentials: true });
        console.log('Current User:', response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []); // Empty dependency array means this effect runs once, similar to componentDidMount

  return <h1>Landing Page</h1>;
};

export default LandingPage;

//LandingPage.getInitialProps = async ({ req }) => {

////console.log('I WAS EXECUTED222');
////console.log(req.headers);
//if (typeof window === 'undefined') {
//console.log("server")
////const response = await axios.get('http://localhost:3000/api/users/currentuser');
////return response.data;
////const response = await axios.get('http://auth:3000/api/users/currentuser');
////return response.data;
//// we are on the server!
//// requests should be made to http://ingress-nginx.ingress-nginx...laksdjfk
//} else {
//console.log("client")
//const response = await axios.get('http://localhost:3000/api/users/currentuser');
//return response.data;
//// we are on the browser!
//// requests can be made with a base url of ''
//}
//return {};
//};

