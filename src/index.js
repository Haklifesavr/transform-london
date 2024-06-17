import React from "react";
// import ReactDOM from "react-dom";
import "assets/css/App.css";
import { HashRouter, Route, BrowserRouter, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import RTLLayout from "layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import App from "App";
import { AppProvider } from "AppContext/AppProvider";

import { createRoot } from 'react-dom/client';



const container = document.getElementById('root')
const root = createRoot(container);


root.render(
  <BrowserRouter>
  <ChakraProvider theme={theme}>
    {/* <React.StrictMode> */}
      <ThemeEditorProvider>
      <AppProvider>
        <App />
      </AppProvider>
      </ThemeEditorProvider>
    {/* </React.StrictMode> */}
  </ChakraProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
