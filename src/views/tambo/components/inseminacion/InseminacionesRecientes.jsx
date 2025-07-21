import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";
import Modal from "../../../../common/Modal";
import HistorialDeInseminaciones from "./HistorialDeInseminaciones";
import InseminadasActualmente from "./InseminadasActualmente";

const InseminacionesRecientes = () => {
  //? LOADER
  const [loaderTabla, setLoaderTabla] = useState(true);

  const nav = useNavigate();
  const [cargadosRecientemente, setCargadosRecientemente] = useState([]);
  const [totalInseminaciones, setTotalInseminaciones] = useState([]);

  //! DATOS PARA HISTORIAL
  const [showHistorial, setShowHistorial] = useState(false);
  const [showInseminadasActualmente, setShowInseminadasActualmente] =
    useState(false);

  useEffect(() => {
    axios(url + "tambo/ganado/inseminacion/partial").then(({ data }) => {
      setLoaderTabla(false);
      const recientes = data.map((cargado) => {
        const fecha = cargado.fecha.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
        return {
          fecha: fechaFinal,
          caravana: cargado.caravana,
          sexado: cargado.sexado,
        };
      });
      setCargadosRecientemente(recientes.slice(0, 10));
    });

    axios(url + "tambo/ganado/inseminacion?limit=99999999999").then(
      ({ data }) => {
        setTotalInseminaciones(data.data);
      }
    );
  }, []);
  return (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
      <div className="flex w-full">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          CARGADAS RECIENTEMENTE
        </h2>
      </div>
      {loaderTabla ? (
        <LoaderDatos textLoader="Cargando ultimos retiros" />
      ) : (
        <div className="flex flex-col w-full h-full">
          <p className="text-start w-full">
            Se mostraran los ultimos diez (10) registro de inseminaciones.
          </p>
          <div className="min-h-[300px] h-[83%] w-full scrollbar overflow-auto">
            <table className="border-separate text-lg w-full text-black-comun">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-center">
                  <td>Fecha</td>
                  <td>Caravana</td>
                  <td>Sexado</td>
                </tr>
              </thead>
              <tbody className="relative">
                {cargadosRecientemente.length ? (
                  cargadosRecientemente.map((cargado) => (
                    <tr key={cargado.id} className="bg-white-bg2 text-center">
                      <td>{cargado.fecha}</td>
                      <td>{cargado.caravana}</td>
                      <td>{cargado.sexado}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-white-bg3 text-md text-center"
                    >
                      No se encontraron datos cargados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="space-x-2 flex justify-end w-full">
            <button
              onClick={() => setShowInseminadasActualmente(true)}
              className="boton_rojo"
            >
              INSEMINADAS ACTUALMENTE
            </button>
            <button
              onClick={() => setShowHistorial(true)}
              className="boton_verde"
            >
              HISTORIAL COMPLETO
            </button>
          </div>
        </div>
      )}

      {showHistorial ? (
        <Modal>
          <HistorialDeInseminaciones
            setCloseModal={setShowHistorial}
            title="HISTORIAL DE INSEMINACIONES"
            placeHolder="Aun no se cargaron inseminaciones."
            showPaginate={true}
          />
        </Modal>
      ) : null}

      {showInseminadasActualmente ? (
        <Modal>
          <InseminadasActualmente
            setCloseModal={setShowInseminadasActualmente}
            allInseminaciones={totalInseminaciones}
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default InseminacionesRecientes;
