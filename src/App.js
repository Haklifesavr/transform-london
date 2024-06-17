import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import RTLLayout from "layouts/rtl";
import SignIn from "views/auth/signIn";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import UserReports from "views/admin/default";
import Dashboard from "layouts/admin";
import Auth from "components/Auth";
import ListDashboard from "views/admin/ListDashboards";

function App() {
    return (
          <Routes>
            <Route exact path="/admin" element={<Auth> <Dashboard /> </Auth>} />
            <Route exact path="/auth" element={<SignIn />} />
            <Route exact path="/dashboards" element={<Auth><ListDashboard /> </Auth>} />
            
            {/* <Route exact path="/rtl" element={<RTLLayout />} /> */}
            <Route path='/'
             element={
                <Navigate
                  to={
                    "/dashboards" 
                  }
                />
              }
            />
          </Routes>
    );
}

export default App;