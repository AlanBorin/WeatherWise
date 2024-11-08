import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
import { formatInTimeZone } from "date-fns-tz";
import weatherTranslations from "../../utils/weatherTranslations";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Home = () => {
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await axios.get(
            `http://localhost:8000/api/weather-history/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setHistory(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  const handleFetchWeather = async () => {
    try {
      setError("");
      setWeather(null);

      const cepResponse = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`
      );
      if (cepResponse.data.erro) {
        throw new Error("CEP não encontrado");
      }

      const fetchedCity = cepResponse.data.localidade;
      setCity(fetchedCity);

      const weatherResponse = await axios.get(
        `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${fetchedCity}`
      );

      setWeather(weatherResponse.data);

      await handleSaveWeather(weatherResponse.data, fetchedCity);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Falha ao salvar a previsão.",
      });
    }
  };

  const handleSaveWeather = async (weatherResponse, fetchedCity) => {
    try {
      const userId = localStorage.getItem("userId");
      const translatedDescription =
        weatherTranslations[weatherResponse.current.weather_descriptions[0]] ||
        weatherResponse.current.weather_descriptions[0];

      const formattedDate = formatInTimeZone(
        new Date(),
        "America/Sao_Paulo",
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      );

      const weatherData = {
        user_id: userId,
        city: fetchedCity,
        temperature: weatherResponse.current.temperature,
        description: translatedDescription,
        wind_speed: weatherResponse.current.wind_speed,
        date: formattedDate,
      };

      await axios.post(
        "http://localhost:8000/api/weather-history",
        weatherData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const newEntry = {
        date: formattedDate,
        city: fetchedCity,
        temperature: weatherResponse.current.temperature,
        description: translatedDescription,
        wind_speed: weatherResponse.current.wind_speed,
      };
      setHistory((prevHistory) => [...prevHistory, newEntry]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Falha ao salvar a previsão.",
      });
    }
  };

  const handleSaveQuery = async () => {
    const formattedDate = formatInTimeZone(
      new Date(),
      "America/Sao_Paulo",
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );

    if (weather) {
      try {
        const userId = localStorage.getItem("userId");
        const translatedDescription =
          weatherTranslations[weather.current.weather_descriptions[0]] ||
          weather.current.weather_descriptions[0];

        const queryData = {
          user_id: userId,
          city: weather.location.name,
          temperature: weather.current.temperature,
          description: translatedDescription,
          wind_speed: weather.current.wind_speed,
          date: formattedDate,
        };

        await axios.post("http://localhost:8000/api/saved-queries", queryData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        Swal.fire({
          icon: "success",
          text: "Consulta salva com sucesso.",
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Falha ao salvar consulta.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        text: "Nenhuma previsão disponível para salvar.",
      });
    }
  };

  return (
    <div className="home-container">
      <h1>Previsão do Tempo</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Informe o CEP"
          value={cep}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, "");
            setCep(onlyNumbers.slice(0, 8));
          }}
        />
        <input
          type="text"
          placeholder="Nome da Cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          style={{ backgroundColor: "#32CD32" }}
          onClick={handleFetchWeather}
        >
          Buscar
        </button>
        <div>
          <Link to="/saved-queries">
            <button>Ver Consultas Salvas</button>
          </Link>
          <Link to="/compare">
            <button>Comparar Cidades</button>
          </Link>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {weather && (
        <div className="weather-info" style={{ backgroundColor: "#d7d7d8"}}>
          <h2>{`Previsão para ${weather.location.name}`}</h2>
          <div>
            <span style={{ fontWeight: "bold" }}>Temperatura:</span>
            <span>{` ${weather.current.temperature} °C`}</span>
          </div>  
          <div>
          <span  style={{ fontWeight: "bold" }}>Condições:</span>
          <span>{` ${
            weatherTranslations[weather.current.weather_descriptions[0]] ||
            weather.current.weather_descriptions[0]
          }`}</span>
           </div> 
           <div>
            <span style={{ fontWeight: "bold" }}>Velocidade do vento:</span>
            <span>{` ${weather.current.wind_speed} km/h`}</span>
          </div> 
          <button onClick={handleSaveQuery}>Salvar Consulta</button>
        </div>
      )}
      {history.length > 0 && (
        <div style={{ backgroundColor: "#d7d7d8", padding: 15 }}>
          <div className="history">
            <h3>Histórico de Consultas</h3>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Cidade</th>
                  <th>Temperatura (°C)</th>
                  <th>Descrição do Tempo</th>
                  <th>Velocidade do Vento (km/h)</th>
                </tr>
              </thead>
              <tbody>
                {history
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((entry, index) => (
                    <tr key={index}>
                      <td>{new Date(entry.date).toLocaleString("pt-BR")}</td>
                      <td>{entry.city}</td>
                      <td>{entry.temperature} °C</td>
                      <td>{entry.description}</td>
                      <td>{entry.wind_speed} km/h</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
