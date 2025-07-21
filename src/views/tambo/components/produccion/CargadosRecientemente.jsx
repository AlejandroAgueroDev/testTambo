import { useState, useEffect } from "react";
import Modal from "../../../../common/Modal";
import Historial from "../../../../common/Historial";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";

const CargadosRecientemente = ({recargarDatos}) => {
  //? LOADER
  const [loaderTabla, setLoaderTabla] = useState(true);

  const [showHistorial, setShowHistorial] = useState(false);
  const [cargadosRecientemente, setCargadosRecientemente] = useState([]);

  //! DATOS PARA HISTORIAL
  const arrayHeader = [
    "Fecha",
    "Hora de carga",
    "Hora de ordeñe",
    "Litros",
    "Cantidad animales",
    "Aclaraciones",
  ];
  const [arrayContent, setArrayContent] = useState([]);

  useEffect(() => {
    axios(url + "tambo/produccionleche/parcial").then(({ data }) => {
      const recientes = data.map((cargado) => {
        const fecha = cargado.fecha.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
        return {
          fecha: fechaFinal,
          hora: cargado.hora_recoleccion,
          litros: cargado.litros,
        };
      });
      setCargadosRecientemente(recientes.slice(0, 10));
      setLoaderTabla(false);
    });

    axios(url + "tambo/produccionleche").then(({ data }) => {
      const ordeñes = data.map((ordeñe) => {
        const fecha = ordeñe.fecha.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;

        return [
          fechaFinal,
          ordeñe.hora_carga,
          ordeñe.hora_recoleccion,
          ordeñe.litros,
          ordeñe.cantidad_animales,
          ordeñe.aclaracion,
        ];
      });

      const ordenados = ordeñes.sort((a, b) => {
        const [diaA, mesA, añioA] = a[0].split("/").map(Number);
        const [diaB, mesB, añioB] = b[0].split("/").map(Number);

        const fechaA = new Date(añioA, mesA - 1, diaA);
        const fechaB = new Date(añioB, mesB - 1, diaB);

        return fechaB - fechaA;
      });

      setArrayContent(ordenados);
    });
  }, [recargarDatos]);

  return (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
      <div className="flex w-full">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          CARGADOS RECIENTEMENTE
        </h2>
      </div>
      {loaderTabla ? (
        <LoaderDatos textLoader="Cargando historial" />
      ) : (
        <div className="flex flex-col w-full h-full">
          <p className="text-start w-full">
            Se mostraran los ultimos diez (10) registro de produccion.
          </p>
          <div className="min-h-[300px] h-[83%] w-full scrollbar overflow-auto">
            <table className="border-separate text-lg w-full text-black-comun">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-center">
                  <td>Fecha</td>
                  <td>Hora</td>
                  <td>Litros</td>
                </tr>
              </thead>
              <tbody className="relative">
                {cargadosRecientemente.length ? (
                  cargadosRecientemente.map((cargado, index) => (
                    <tr key={index} className="bg-white-bg2 text-center">
                      <td>{cargado.fecha}</td>
                      <td>{cargado.hora}</td>
                      <td>{cargado.litros}</td>
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
              onClick={() => setShowHistorial(true)}
              className="boton_verde"
            >
              VER HISTORIAL DE ORDEÑES
            </button>
          </div>
        </div>
      )}

      {showHistorial ? (
        <Modal>
          <Historial
            setCloseModal={setShowHistorial}
            title="HISTORIAL DE ORDEÑES"
            arrayHeader={arrayHeader}
            arrayContent={arrayContent}
            placeHolder="Aun no se cargaron ordeñes."
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default CargadosRecientemente;
