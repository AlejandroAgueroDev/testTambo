import { useState, useEffect } from "react";
import { CiTempHigh } from "react-icons/ci";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { CiMemoPad } from "react-icons/ci";
import PronosticoExtendido from "./PronosticoExtendido";
import Modal from "../../../common/Modal";

const DataClima = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const CACHE_DURATION = 20 * 60 * 1000; // 20 minutos
  const MAX_CACHE_AGE = 30 * 60 * 1000; // 30 minutos
  const API_KEY = "10585de72dff451087a193645252003";
  const LOCATION = "Calchin";
  const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${LOCATION}&days=7&lang=es`;

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const currentTime = new Date().getTime();

      // Guarda en estado y localStorage
      setWeatherData(data);
      setLastFetchTime(currentTime);
      localStorage.setItem("weatherData", JSON.stringify(data));
      localStorage.setItem("lastFetchTime", currentTime.toString());
    } catch (error) {
      console.error("Error al obtener los datos del clima:", error.message);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("weatherData");
    const storedTime = localStorage.getItem("lastFetchTime");
    const now = new Date().getTime();

    if (storedData && storedTime) {
      const parsedData = JSON.parse(storedData);
      const parsedTime = parseInt(storedTime, 10);

      if (now - parsedTime < MAX_CACHE_AGE) {
        setWeatherData(parsedData);
        setLastFetchTime(parsedTime);
      } else {
        fetchWeatherData(); // Datos vencidos
      }
    } else {
      fetchWeatherData(); // No hay datos
    }

    const interval = setInterval(() => {
      fetchWeatherData();
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const handleAbrirModal = () => setIsOpenModal(true);
  const handleCerrarModal = () => setIsOpenModal(false);

  if (!weatherData) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Cargando datos del clima...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center font-NS select-none w-full h-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center sm:items-start w-full mb-4 space-y-2">
        <h2 className="font-medium text-lg sm:text-xl text-center sm:text-left">
          Condiciones actuales en{" "}
          <strong className="underline">{weatherData.location.name}</strong>
        </h2>
        <button onClick={handleAbrirModal} className="boton_verde w-full">
          VER PRONOSTICO EXTENDIDO
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-gray-700 to-blue-gray-500 shadow-lg rounded-lg p-4 sm:p-6 mb-4 w-full max-w-3xl text-white-bg text-xl space-y-4">
        <p className="flex flex-wrap items-center">
          <CiTempHigh className="mr-2 size-8 sm:size-10" />
          <strong>Temperatura:</strong>
          <span className="ml-2">{weatherData.current.temp_c}°C</span>
        </p>
        <p className="flex flex-wrap items-center">
          <WiHumidity className="mr-2 size-8 sm:size-10" />
          <strong>Humedad:</strong>
          <span className="ml-2">{weatherData.current.humidity}%</span>
        </p>
        <p className="flex flex-wrap items-center">
          <FaWind className="mr-2 size-8 sm:size-10" />
          <strong>Viento:</strong>
          <span className="ml-2">
            {weatherData.current.wind_kph}km/h, {weatherData.current.wind_dir}
          </span>
        </p>
        <p className="flex flex-wrap items-center">
          <CiMemoPad className="mr-2 size-10 sm:size-14" />
          <strong>Condición:</strong>
          <span className="ml-2">{weatherData.current.condition.text}</span>
        </p>
      </div>

      {isOpenModal && (
        <Modal>
          <PronosticoExtendido
            forecast={weatherData.forecast.forecastday}
            onClose={handleCerrarModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default DataClima;
