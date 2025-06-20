// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/themes';
import Login from './components/auth/Login';
import PointRegister from './components/point/PointRegister';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PointRegister />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
