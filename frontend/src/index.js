import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router} from "react-router-dom";

import { ChakraProvider } from '@chakra-ui/react'
import ChatProvider from './Context/ChatProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

    <Router>
      <ChakraProvider>
        <ChatProvider> 
          <App />
        </ChatProvider>
      </ChakraProvider>
    </Router>
);

reportWebVitals();
