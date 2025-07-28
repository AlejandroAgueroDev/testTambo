import BarraSeparadora from "../../../common/BarraSeparadora";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CotizacionDolar from "../../../common/CotizacionDolar";
import Modal from "../../../common/Modal";
import Contacto from "../../../common/Contacto";
import { useState, useEffect, useRef } from "react";
import { FiAlertCircle } from "react-icons/fi";
import DataClima from "./DataClima";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const DataHome = () => {
  const nav = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [movimientos, setMovimientos] = useState([]);

  // Referencias para tour
  const refBienvenida = useRef(null);
  const refMovimientos = useRef(null);
  const refClima = useRef(null);
  const refSoporte = useRef(null);

  const handleCerrarSesion = () => {
    Swal.fire({
      title: `¿Cerrar sesión?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
      confirmButtonColor: "#86C394",
      denyButtonColor: "#D64747",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        nav("/");
      }
    });
  };

  const fetchMovimientos = async () => {
    try {
      const { data } = await axios.get(`${url}sistema-movimiento`);
      setMovimientos(data);
    } catch (error) {
      console.log("Error al traer los movimientos", error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
    fetchMovimientos();
  }, []);

  const handleAbrirModal = () => setIsOpenModal(true);
  const handleCerrarModal = () => setIsOpenModal(false);

  const startTour = () => {
    const driverObj = driver({
      allowClose: true,
      doneBtnText: "Finalizar",
      popoverClass: 'driverjs-theme',
      closeBtnText: "Cerrar",
      nextBtnText: "Siguiente",
      prevBtnText: "Anterior",
      steps: [
        {
          element: refBienvenida.current,
          popover: {
            title: "Bienvenida",
            description: "Aquí ves el saludo, la fecha y el boton de cerrar sesión.",
            position: "bottom",
          },
        },
        {
          element: refMovimientos.current,
          popover: {
            title: "Movimientos",
            description:
              "Esta sección muestra los últimos movimientos de usuarios.",
            position: "bottom",
          },
        },
        {
          element: refClima.current,
          popover: {
            title: "Clima",
            description: "Información del clima en tiempo real.",
            position: "bottom",
          },
        },
        {
          element: refSoporte.current,
          popover: {
            title: "Soporte Técnico",
            description: "Podés contactar al soporte técnico desde aquí.",
            position: "top",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <h6 className="uppercase text-end -mt-1 font-bold">V: 1.0.0</h6>
      <div className="font-NS space-y-4 scrollbar overflow-auto">
        {/* Encabezado */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
          ref={refBienvenida}
        >
          <h1 className="text-3xl sm:text-4xl text-center sm:text-left">
            ¡Bienvenido!
          </h1>
          <h2 className="text-xl sm:text-2xl uppercase text-center">
            {currentDate}
          </h2>
          <button
            onClick={handleCerrarSesion}
            className="boton_rojo w-full sm:w-auto"
          >
            CERRAR SESION
          </button>
        </div>

        <BarraSeparadora orientacion="horizontal" />

        {/* Contenedor principal en columnas */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Movimientos */}
          <div className="flex-1" ref={refMovimientos}>
            <h2 className="text-xl sm:text-2xl mb-2">
              Últimos movimientos de los usuarios
            </h2>
            <ul className="space-y-3 scrollbar overflow-y-auto max-h-[495px]">
              {movimientos.map((movimiento, index) => (
                <li
                  key={index}
                  className="overflow-x-auto rounded-md bg-gradient-to-r from-blue-gray-200 to-blue-gray-500 hover:from-blue-gray-300 hover:to-blue-gray-600 transition duration-300 ease-in-out"
                >
                  <div className="flex items-center gap-4 min-w-[550px] sm:min-w-0 py-2 px-2 text-base sm:text-lg text-black-comun font-medium whitespace-nowrap">
                    <div className="flex items-center text-teal-700 mb-2 sm:mb-0">
                      <FiAlertCircle />
                    </div>
                    <p>
                      <strong>Usuario:</strong> {movimiento.usuario}
                    </p>
                    <p>
                      <strong>Movimiento:</strong>{" "}
                      {movimiento.ultimo_movimiento}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {(() => {
                        const fecha = new Date(movimiento.fecha);
                        const dia = String(fecha.getDate()).padStart(2, "0");
                        const mes = String(fecha.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const anio = fecha.getFullYear();
                        return `${dia}/${mes}/${anio}`;
                      })()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Clima */}
          <div className="flex-1" ref={refClima}>
            <DataClima />
          </div>
        </div>
      </div>

      <CotizacionDolar />

      {/* Botón soporte técnico */}
      <div
        className="w-full sm:w-[400px] mx-auto mt-4 
                  lg:fixed lg:bottom-12 lg:left-48"
        ref={refSoporte}
      >
        <button
          onClick={handleAbrirModal}
          className="boton_verde w-full bg-white"
        >
          CONTACTAR A SOPORTE TECNICO
        </button>
      </div>

      {/* Botón para iniciar el tour */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={startTour}
          className="boton_verde bg-blue-600 text-white px-4 py-2 rounded-md shadow-md mb-24"
        >
          ¿Cómo funciona?
        </button>
      </div>

      {isOpenModal && (
        <Modal>
          <Contacto onClose={handleCerrarModal} />
        </Modal>
      )}
    </div>
  );
};

export default DataHome;
