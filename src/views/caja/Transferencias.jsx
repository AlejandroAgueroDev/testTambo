import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { url } from "../../common/URL_SERVER";
import axios from "axios";
//?COMPONENTS
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import Modal from "../../common/Modal";
import TablaTransferencias from "./components/transferencias/TablaTransferencias";
import NuevaCuenta from "./components/transferencias/NuevaCuenta";
import TablaAnulada from "./components/transferencias/TablaAnuladas";
import TodasLasCuentas from "./components/transferencias/TodasLasCuentas";

const Transferencias = ({ token }) => {
  const [nuevaCuenta, setNuevaCuenta] = useState(false);
  const [showAnuladas, setShowAnuladas] = useState(false);
  const [transferencias, setTransferencias] = useState([]);
  const [cuentaSelec, setCuentaSelect] = useState("TODAS");
  const [cuentaSelecData, setCuentaSelecData] = useState({});
  const [cuentas, setCuentas] = useState([]);
  const [showCuentas, setShowCuentas] = useState(false);
  const [transferenciasAnuladas, setTransferenciasAnuladas] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${url}caja/transferencia`);
      console.log("Data:", data);
      setTransferencias(
        data.filter((pendiente) => pendiente.estado !== "ANULADA")
      );
      setTransferenciasAnuladas(
        data.filter((anuladas) => anuladas.estado === "ANULADA")
      );
    } catch (error) {
      console.log("Error al obtener los datos:", error);
    }
  };

  const fetchCuentas = async () => {
    try {
      const { data } = await axios.get(`${url}cuenta`);

      setCuentas(data);

      if (cuentaSelecData?.id) {
        const cuentaActualizada = data.find(
          (cuenta) => cuenta.id === cuentaSelecData.id
        );
        if (cuentaActualizada) {
          setCuentaSelecData(cuentaActualizada);
        } else {
          setCuentaSelecData({});
          setCuentaSelect("TODAS");
        }
      }
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCuentas();
  }, []);

  const selectCuenta = (cuenta, nombre) => {
    if (cuentaSelecData?.id === cuenta.id) {
      setCuentaSelect("TODAS");
      setCuentaSelecData({});
    } else {
      setCuentaSelect(nombre);
      setCuentaSelecData(cuenta);
    }
  };
  return (
    <div className="h-screen w-screen scrollbar overflow-y-auto flex flex-col overflow-x-hidden">
      <ContenedorGeneral navText="CAJA">
        <div className="w-screen md:w-full flex md:justify-between md:pl-0 md:pr-0 justify-center items-center pl-14 pr-4 text-center space-x-3">
          <Titulo text="CAJA | TRANSFERENCIAS" />
          <div className="flex gap-4">
            <Link to="/caja" className="boton_rojo flex justify-end">
              VOLVER
            </Link>
          </div>
        </div>

        <div className="flex-1 scrollbar overflow-auto">
          <div className="h-full w-full flex flex-col md:flex-row gap-2 md:gap-0">
            {/* Tabla de transferencias */}
            <div className="w-full md:grow bg-white-bg scrollbar overflow-x-auto">
              <TablaTransferencias
                transferencias={transferencias}
                cuentas={cuentas}
                cuentaSelecData={cuentaSelecData}
                fetchCuentas={fetchCuentas}
                fetchData={fetchData}
                setShowAnuladas={setShowAnuladas}
                token={token}
              />
            </div>

            {/* Lista de cuentas */}
            <div className="w-full md:w-52 flex flex-col p-2 bg-white-bg2">
              <div className="flex-1 overflow-hidden">
                <h2 className="bg-white-bg3 text-white-bg2 p-2 text-center font-bold">
                  LISTA DE CUENTAS
                </h2>

                <button
                  onClick={() => setShowCuentas(true)}
                  className="bg-button-green hover:bg-button-green_hover text-white-bg2 p-2 w-full mt-1 text-lg;"
                >
                  VER TODAS
                </button>

                {/* CONTENEDOR SCROLLABLE */}
                <div className="mt-2 h-[150px] sm:h-[400px] scrollbar overflow-y-auto flex flex-col gap-2">
                  {cuentas.length ? (
                    cuentas.map((cuenta) => (
                      <button
                        key={cuenta.id}
                        onClick={() =>
                          selectCuenta(
                            cuenta,
                            cuenta.nombre_cuenta.toUpperCase()
                          )
                        }
                        className={`p-1 w-full text-lg text-white-bg2
                          ${
                            cuentaSelecData?.id === cuenta.id
                            ? "bg-gray-800"
                            : "bg-black-comun hover:bg-black-hover"
                          }
                        `}
                      >
                        {cuenta.nombre_cuenta.toUpperCase()}
                      </button>
                    ))
                  ) : (
                    <p className="text-wrap bg-white-bg p-1 text-white-bg3">
                      Aún no hay cuentas creadas
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setNuevaCuenta(true)}
                className="boton_verde mt-2"
              >
                NUEVA CUENTA
              </button>
            </div>
          </div>
        </div>

        {nuevaCuenta && (
          <Modal>
            <NuevaCuenta
              setCloseModal={setNuevaCuenta}
              fetchCuentas={fetchCuentas}
            />
          </Modal>
        )}

        {showAnuladas && (
          <Modal>
            <TablaAnulada
              setCloseModal={setShowAnuladas}
              anuladas={transferenciasAnuladas}
              cuentas={cuentas}
            />
          </Modal>
        )}

        {showCuentas && (
          <Modal>
            <TodasLasCuentas
              setCloseModal={setShowCuentas}
              cuentas={cuentas}
              selectCuenta={selectCuenta}
            />
          </Modal>
        )}
      </ContenedorGeneral>
    </div>
  );
};

export default Transferencias;
