import React, { useState } from "react";
import axios from "axios";
import { Cloud, MapPin, ThermometerSun, Search } from "lucide-react";
import "./CompareWeather.css";
import weatherTranslations from "../../utils/weatherTranslations";

const CompareWeather = () => {
  const [cep1, setCep1] = useState("");
  const [cep2, setCep2] = useState("");
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [weather1, setWeather1] = useState(null);
  const [weather2, setWeather2] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchWeather = async (cep, setWeather, setCity) => {
    try {
      setError("");
      const cepResponse = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`
      );
      if (cepResponse.data.erro) {
        throw new Error("CEP não encontrado");
      }
      const city = cepResponse.data.localidade;
      setCity(city);
      const weatherResponse = await axios.get(
        `https://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${city}`
      );
      setWeather(weatherResponse.data);
    } catch (err) {
      setError(err.message || "Erro ao buscar dados de previsão do tempo");
    }
  };

  const handleCompareWeather = async () => {
    setLoading(true);
    setWeather1(null);
    setWeather2(null);
    setCity1("");
    setCity2("");
    setError("");

    await handleFetchWeather(cep1, setWeather1, setCity1);
    await handleFetchWeather(cep2, setWeather2, setCity2);
    setLoading(false);
  };

  const handleCepChange = (value, setCep) => {
    const formattedCep = value.replace(/\D/g, "").slice(0, 8);
    setCep(formattedCep);
  };

  const WeatherCard = ({ weather }) => {
    if (!weather) return null;

    const translatedDescription =
          weatherTranslations[weather.current.weather_descriptions[0]] ||
          weather.current.weather_descriptions[0];

    return (
      <div className="weather-card">
        <div className="city-name">
          <MapPin className="icon" />
          <span>{weather.location.name}</span>
        </div>
        <div className="temperature">
          <ThermometerSun className="icon" />
          <span>{weather.current.temperature}°C</span>
        </div>
        <div className="description">
          <Cloud className="icon" />
          <span>{weatherTranslations[weather.current.weather_descriptions[0]] ||
            weather.current.weather_descriptions[0]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="compare-weather-container">
      <h1>Comparar Previsão do Tempo</h1>
      
      <div className="input-section">
        <div className="input-group">
          <input
            type="text"
            value={cep1}
            onChange={(e) => handleCepChange(e.target.value, setCep1)}
            placeholder="Insira um CEP"
            className="input-cep"
          />
          <span className="city-name">{city1}</span>
        </div>
        <div className="input-group">
          <input
            type="text"
            value={cep2}
            onChange={(e) => handleCepChange(e.target.value, setCep2)}
            placeholder="Insira um CEP"
            className="input-cep"
          />
          <span className="city-name">{city2}</span>
        </div>
        <button onClick={handleCompareWeather} disabled={loading} className="search-button">
          {loading ? "Comparando..." : <><Search className="icon" /> Comparar Cidades</>}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="results-section">
        <WeatherCard weather={weather1} />
        <WeatherCard weather={weather2} />
      </div>
    </div>
  );
};

export default CompareWeather;
