import { useEffect } from "react";

// react-router-dom components
import { Navigate } from "react-router-dom";

//Project Imports
import {useNavigate} from "react-router-dom";
import { useApp } from "AppContext/AppProvider";


function Logout() {
  const ceo = useApp();
  useEffect(() => {
    ceo.actions.emptyAllStates();
  }, [])
  
  return (
    <Navigate to="/auth" />
  );
}

export default Logout;
