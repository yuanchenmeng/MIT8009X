import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from 'jwt-decode';

export default function Secure() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});

  //const getUserDetails = async (accessToken) => {
  //  const response = await fetch(
  //    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
  //  );
  //  const data = await response.json();
  //  console.log("Fetched user", data.name, data.email);
  //  console.log(data);
  //  setUserDetails(data);
  //}; 

  const getUserDetails = async (token) => {

    // Decode the token to get user details
    const decodedToken = jwtDecode(token);
    console.log('Decoded Token:', decodedToken);

    // Extract user info
    const {name, email, picture} = decodedToken;
    console.log('User Info:', {name, email, picture});
  };


  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      console.log("WARNING, not token, redirects");
      navigate('/');
    }

    getUserDetails(accessToken);
  }, [navigate]);

  return (
    <>
      {userDetails ? (
        <div className="user-profile">
          <div className="card">
            <img
              src={userDetails.picture}
              alt={`${userDetails.given_name}'s profile`}
              className="profile-pic"
            />
            <p>Welcome</p>
            <h1 className="name">{userDetails.name}</h1>
            <p className="email">{userDetails.email}</p>
            <p className="locale">{`Locale: ${userDetails.locale}`}</p>
          </div>
        </div>
      ) : (
        <div>
          <h1>Loading...</h1>
        </div>
      )}
    </>
  );
}