import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TestApp from './TestApp';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TestApp />} />
          <Route path="/test" element={<TestApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;