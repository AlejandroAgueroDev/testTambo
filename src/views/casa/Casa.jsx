import { useEffect, useState } from "react";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import BarraSeparadora from "../../common/BarraSeparadora";
import PropietarioCasa from "./components/PropietarioCasa";
import TablaCompromisoPagos from "./components/compromisoPago/TablaCompromisoPagos";
import Modal from "../../common/Modal";
import AñadirPropietario from "./components/AñadirPropietario";
import TablaPagoEventual from "./components/pagoEventual/TablaPagoEventual";
import { url } from "../../common/URL_SERVER";
import axios from "axios";
import Swal from "sweetalert2";
import EditarPropietario from "./components/EditarPropietario";

const Casa = () => {
  const [selectedCasa, setSelectedCasa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [casas, setCasas] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState(() => {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    return `${año}-${mes.toString().padStart(2, "0")}`;
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = () => setIsModalEditOpen(true);

  const closeEditModal = () => setIsModalEditOpen(false);

  const fetchCasas = async () => {
    try {
      const { data } = await axios.get(`${url}casa`);

      setCasas(data);

      if (selectedCasa) {
        const updatedCasa = data.find((casa) => casa.id === selectedCasa.id);
        if (updatedCasa) {
          setSelectedCasa(updatedCasa);
        }
      }
      return data;
    } catch (error) {
      console.error("Error al obtener las casas:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las casas.",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
      return []; // Devolver un array vacío en caso de error
    }
  };

  const handlePeriodoChange = (e) => {
    setSelectedPeriodo(e.target.value);
  };

  // Filtrar servicios por período seleccionado
const filtrarServiciosPorPeriodo = (servicios) => {
  if (!servicios) return [];
  const filtrados = servicios.filter((servicio) => {
    if (!servicio.fecha) return false;
    const fechaServicio = new Date(servicio.fecha);
    const añoMesServicio = `${fechaServicio.getFullYear()}-${(
      fechaServicio.getMonth() + 1
    ).toString().padStart(2, "0")}`;
    return añoMesServicio === selectedPeriodo;
  });
  // Si no hay filtrados, devolvé todos
  // return filtrados.length ? filtrados : servicios;
  return filtrados;
};

  // Servicios eventuales filtrados por período
  const pagosEventuales = filtrarServiciosPorPeriodo(
    selectedCasa?.CompromisoDePagos?.filter(
      (servicio) => servicio.eventual === true
    )
  );

  // Compromisos de pago normales filtrados por período
const compromisosPago = filtrarServiciosPorPeriodo(
  selectedCasa?.CompromisoDePagos?.filter(
    (servicio) => !servicio.eventual
  )
);

  useEffect(() => {
    fetchCasas();
  }, []);

  return (
    <ContenedorGeneral navText="CASA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="CASA" />
      </div>
      <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
        <PropietarioCasa
          casas={casas}
          selectedCasa={selectedCasa}
          setSelectedCasa={setSelectedCasa}
          openEditModal={openEditModal}
          fetchCasas={fetchCasas}
        />

        <div>
          <BarraSeparadora orientacion="vertical" />
        </div>

        <div className="w-full h-full flex flex-col space-y-3 scrollbar overflow-auto">
          {selectedCasa ? (
            <>
              <TablaCompromisoPagos
                servicios={compromisosPago}
                selectedCasa={selectedCasa}
                setSelectedCasa={setSelectedCasa}
                fetchCasas={fetchCasas}
                selectedPeriodo={selectedPeriodo}
                handlePeriodoChange={handlePeriodoChange}
              />

              <TablaPagoEventual
                servicios={pagosEventuales}
                selectedCasa={selectedCasa}
                fetchCasas={fetchCasas}
                setSelectedCasa={setSelectedCasa}
                selectedPeriodo={selectedPeriodo}
              />
            </>
          ) : (
            <p className="flex justify-center text-center items-center h-full text-xl py-4 font-bold">
              ESPERANDO SELECCIÓN DEL PROPIETARIO...
            </p>
          )}
        </div>
      </div>

      <div className="space-x-2">
        <button className="boton_verde" onClick={openModal}>
          AÑADIR PROPIETARIO
        </button>
      </div>

      {isModalOpen && (
        <Modal>
          <AñadirPropietario
            closeModal={closeModal}
            fetchPropietarios={fetchCasas}
          />
        </Modal>
      )}

      {isModalEditOpen && (
        <Modal>
          <EditarPropietario
            closeModal={closeEditModal}
            selectedCasa={selectedCasa}
            fetchCasas={fetchCasas}
          />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default Casa;
