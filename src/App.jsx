import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ToDoForm from './AddTask';
import ToDo from './Task';

function App() {
  const [rates, setRates] = useState({});
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const currencyResponse = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
        setRates({
          USDrate: currencyResponse.data.Valute.USD.Value.toFixed(3),
          EURrate: currencyResponse.data.Valute.EUR.Value.toFixed(3)
        });

        navigator.geolocation.getCurrentPosition(async position => {
          const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=c7616da4b68205c2f3ae73df2c31d177`);
          setWeatherData(weatherResponse.data);
        });
      } catch (err) {
        setError('Ошибка загрузки данных.');
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  const addTask = (text) => { if(text) setTodos([...todos, { id: Math.random(), task: text, complete: false }]); };
  const removeTask = id => setTodos(todos.filter(t => t.id !== id));
  const toggleTask = id => setTodos(todos.map(t => t.id === id ? { ...t, complete: !t.complete } : t));

  return (
    <div className="content">
      {loading && <p>Загрузка...</p>}
      {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <>
          <div className="info">
            <div className="money">
              Доллар $ — {rates.USDrate} ₽<br/>
              Евро € — {rates.EURrate} ₽
            </div>
            <div className="weather-info">
              Погода сегодня: {(weatherData?.main.temp - 273.15).toFixed(1)}°C
            </div>
          </div>

          <h1>Список задач: {todos.length}</h1>

          <ToDoForm addTask={addTask} />
          {todos.map(todo => (
            <ToDo key={todo.id} todo={todo} toggleTask={toggleTask} removeTask={removeTask} />
          ))}
        </>
      )}
    </div>
  );
}

export default App;