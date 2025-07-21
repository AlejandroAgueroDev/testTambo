import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import TablaGastosIngresos from "./components/gastosIngresos/TablaGastosIngresos";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import AñadirGastoIngreso from "./components/gastosIngresos/AñadirGastoIngreso";
import HistorialAnulados from "./components/gastosIngresos/HistorialAnulados";
import axios from "axios";
import { url } from "../../common/URL_SERVER";

const GastosIngresos = () => {
    const [modalAbierto, setModalAbierto] = useState(null);
    const [gastosIngreso, setGastoIngreso] = useState([]);
    const [anulados, setAnulados] = useState([]);
    const [sectores, setSectores] = useState([]);

    const fetchSectores = async () => {
        try {
            const { data } = await axios.get(`${url}sector`);
            setSectores(data);
        } catch (error) {
            console.log("Error al traer sectores:", error);
        }
    };

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`${url}gasto-ingreso`);

            const anulados = data.filter((item) => item.estado === "ANULADO");
            const activos = data.filter((item) => item.estado !== "ANULADO");
            setGastoIngreso(activos);
            setAnulados(anulados);
        } catch (error) {
            console.log("Error al trer los datos:", error);
        }
    };
    useEffect(() => {
        fetchSectores();
        fetchData();
    }, []);

    const handleAñadirRegistro = () => {
        setGastoIngreso(false);
    };

    const handleOpenModal = (tipo) => {
        setModalAbierto(tipo);
    };

    const handleCloseModal = () => {
        setModalAbierto(null);
    };

    return (
        <ContenedorGeneral navText="CAJA">
            <div className="font-NS w-screen md:w-full flex justify-between items-center pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="GASTOS E INGRESOS" />
                <div className="flex gap-4">
                    <Link to="/caja" className="boton_rojo flex justify-end">
                        VOLVER
                    </Link>
                </div>
            </div>
            <div className="h-full w-screen scrollbar overflow-auto pr-4 md:pr-0 md:w-auto">
                <TablaGastosIngresos gastosIngreso={gastosIngreso} fetchData={fetchData} />
            </div>
            <div className="flex flex-col md:flex-row justify-end gap-4">
                {/* <button
          onClick={() => handleOpenModal("nuevo")}
          className="boton_verde"
        >
          AÑADIR GASTO O INGRESO
        </button> */}

                <button onClick={() => handleOpenModal("historial")} className="boton_rojo">
                    HISTORIAL DE GASTOS E INGRESOS ANULADOS
                </button>
            </div>

            {modalAbierto === "nuevo" && (
                <Modal>
                    <AñadirGastoIngreso
                        onClose={handleCloseModal}
                        onAñadir={handleAñadirRegistro}
                        sectores={sectores}
                        fetchData={fetchData}
                    />
                </Modal>
            )}

            {modalAbierto === "historial" && (
                <Modal>
                    <HistorialAnulados anulados={anulados} onClose={handleCloseModal} />
                </Modal>
            )}
        </ContenedorGeneral>
    );
};

export default GastosIngresos;
