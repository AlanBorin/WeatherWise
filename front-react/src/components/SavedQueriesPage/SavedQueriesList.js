import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SavedQueriesList.css';

const SavedQueriesList = () => {
    const [savedQueries, setSavedQueries] = useState([]);

    useEffect(() => {
        const fetchSavedQueries = async () => {
            const userId = localStorage.getItem("userId");

            try {
                const response = await axios.get(`http://localhost:8000/api/saved-queries/${userId}`);
                console.log(response.data);

                setSavedQueries(response.data);
            } catch (error) {
                console.error('Erro ao buscar consultas salvas:', error.response.data);
            }
        };

        fetchSavedQueries();
    }, []);

    return (
        <div>
            <h1>Consultas Salvas</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cidade</th>
                        <th>Temperatura</th>
                        <th>Descrição</th>
                        <th>Velocidade do Vento</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {savedQueries.map(query => (
                        <tr key={query.id}>
                            <td>{query.id}</td>
                            <td>{query.city}</td>
                            <td>{query.temperature} °C</td>
                            <td>{query.description}</td>
                            <td>{query.wind_speed}  km/h</td>
                            <td>{new Date(query.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SavedQueriesList;
