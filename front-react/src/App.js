import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/LoginPage/Login';
import Register from './components/RegisterPage/Register';
import Home from './components/HomePage/Home';
import SavedQueriesList from './components/SavedQueriesPage/SavedQueriesList';
import CompareWeather from './components/CompareWeatherPage/CompareWeather';

function App() {
    const [weatherHistory, setWeatherHistory] = useState([]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setWeatherHistory={setWeatherHistory} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login setWeatherHistory={setWeatherHistory} />} />
                <Route path="/home" element={<Home weatherHistory={weatherHistory} />} />
                <Route path="/saved-queries" element={<SavedQueriesList/> } />
                <Route path="/compare" element={<CompareWeather/> } />
            </Routes>
        </Router>
    );
}

export default App;
