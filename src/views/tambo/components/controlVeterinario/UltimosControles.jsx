import { useState, useEffect } from "react";
import Modal from "../../../../common/Modal";
import Historial from "../../../../common/Historial";
import axios from "axios";
import { Link } from "react-router-dom";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";

const UltimosControles = ({ origen }) => {
  //? LOADER
  const [loaderTabla, setLoaderTabla] = useState(true);

  const [showHistorial, setShowHistorial] = useState(false);
  const [cargadosRecientemente, setCargadosRecientemente] = useState([]);

  //! DATOS PARA HISTORIAL
  const arrayHeader = [
    "Fecha",
    "Hora de carga",
    "Hora de retiro",
    "Litros",
    "Encargado del retiro",
    "Aclaraciones",
  ];
  const [arrayContent, setArrayContent] = useState([]);

  useEffect(() => {
    axios(url + "tambo/controlveterinario")
      .then(({ data }) => {
        setLoaderTabla(false);
        const recientes = data.map((cargado) => {
          const fecha = cargado.createdAt.split("T")[0];
          const arrayFecha = fecha.split("-");
          const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
          return {
            fecha: fechaFinal,
            veterinario: cargado.veterinario,
            cantidad: cargado.Ganados.length,
          };
        });
        setCargadosRecientemente(recientes.slice(0, 10));
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
      <div className="flex w-full">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          ULTIMOS CONTROLES
        </h2>
      </div>
      {loaderTabla ? (
        <LoaderDatos textLoader="Cargando historial" />
      ) : (
        <div className="flex flex-col w-full h-full">
          <p className="text-start w-full">
            Se mostraran los ultimos diez (10) controles veterinarios.
          </p>
          <div className="h-[83%] w-full scrollbar overflow-auto">
            <table className="border-separate text-lg w-full text-black-comun">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-center">
                  <td>Fecha</td>
                  <td>Veterinario</td>
                  <td>Cant. animales</td>
                </tr>
              </thead>
              <tbody className="relative">
                {cargadosRecientemente.length ? (
                  cargadosRecientemente.map((cargado, idx) => (
                    <tr
                      key={`${cargado.fecha}-${cargado.veterinario}-${idx}`}
                      className="bg-white-bg2 text-center"
                    >
                      <td>{cargado.fecha}</td>
                      <td>{cargado.veterinario}</td>
                      <td>{cargado.cantidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-white-bg3 absolute text-md">
                      No se encontraron datos cargados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="space-x-2 flex justify-end w-full">
            <Link
              to={`/control-veterinario/historial/${origen}`}
              className="boton_verde"
            >
              VER HISTORIAL DE CONTROLES
            </Link>
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

export default UltimosControles;
