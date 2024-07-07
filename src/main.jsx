import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';

const Main = () => {
  return (
    <ChakraProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
