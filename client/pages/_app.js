// pages/_app.js
import 'bootstrap/dist/css/bootstrap.css';
import App from 'next/app';
import axios from 'axios';
//import Header from './components/header';

const MyApp = ({ Component, pageProps, currentUser }) => {
  //<Header currentUser={currentUser} />
  return <Component {...pageProps} currentUser={currentUser} />;
};

MyApp.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  let currentUser = null;

  try {
    // Fetch current user on the server side
    const response = await axios.get('http://localhost:3000/api/users/currentuser', {
      withCredentials: true,
      headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
    });

    currentUser = response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
  }

  // Call the page's `getInitialProps` (if it exists)
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, currentUser };
};

export default MyApp;

