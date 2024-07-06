import React from 'react';
import Navbar from './components/Navbar';
import ImageGenerator from './components/ImageGenerator';
import './index.css';

const App = () => {
  return (
    <div className="App min-h-screen flex flex-col items-center">
      <Navbar />
      <ImageGenerator />
    </div>
  );
};

export default App;
