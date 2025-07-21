import { useState, useEffect } from "react";
import Modal from "../../../../common/Modal";
import Historial from "../../../../common/Historial";
import axios from "axios";
import { Link } from "react-router-dom";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";

const IngresosRecientes = () => {
  const [showHistorial, setShowHistorial] = useState(false);
  const [cargadosRecientemente, setCargadosRecientemente] = useState([]);
  const [loader, setLoader] = useState(true);

  //! DATOS PARA HISTORIAL
  const arrayHeader = ["Fecha", "Origen", "Caravana", "Genero"];
  const [arrayContent, setArrayContent] = useState([]);

  useEffect(() => {
    axios(url + "recria/ingreso").then((data) => {
      setLoader(false);
      const recientes = data.data.map((cargado) => {
        const fecha = cargado.fecha_ingreso.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
        return {
          fecha: fechaFinal,
          genero: cargado.genero,
          caravana: cargado.caravana,
        };
      });

      const ordenados = recientes.sort((a, b) => {
        const [diaA, mesA, añioA] = a.fecha.split("/").map(Number);
        const [diaB, mesB, añioB] = b.fecha.split("/").map(Number);
        const fechaA = new Date(añioA, mesA - 1, diaA);
        const fechaB = new Date(añioB, mesB - 1, diaB);
        return fechaB - fechaA;
      });
      setCargadosRecientemente(ordenados.slice(0, 10));
    });
    axios(url + "recria/ingreso").then(({ data }) => {
      const cargados = data.map((ordeñe) => {
        const fecha = ordeñe.fecha_ingreso.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
        return [fechaFinal, ordeñe.origen, ordeñe.caravana, ordeñe.genero];
      });
      const ordenados = cargados.sort((a, b) => {
        const [diaA, mesA, añioA] = a[0].split("/").map(Number);
        const [diaB, mesB, añioB] = b[0].split("/").map(Number);
        const fechaA = new Date(añioA, mesA - 1, diaA);
        const fechaB = new Date(añioB, mesB - 1, diaB);
        return fechaB - fechaA;
      });
      setArrayContent(ordenados);
    });
  }, []);

  return (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
      <div className="flex w-full">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          INGRESOS RECIENTES
        </h2>
      </div>

      {loader ? (
        <LoaderDatos textLoader="Cargando historial" />
      ) : (
        <div className="flex flex-col w-full h-full">
          <p className="text-start w-full">
            Se mostraran los ultimos diez (10) ingresos de terneros.
          </p>
          <div className="h-[83%] w-full scrollbar overflow-auto">
            <table className="border-separate text-lg w-full text-black-comun">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-center">
                  <td>Fecha</td>
                  <td>Caravana</td>
                  <td>Genero</td>
                </tr>
              </thead>
              <tbody className="relative">
                {cargadosRecientemente.length ? (
                  cargadosRecientemente.map((cargado) => (
                    <tr key={cargado.id} className="bg-white-bg2 text-center">
                      <td>{cargado.fecha}</td>
                      <td>{cargado.caravana || "-"}</td>
                      <td>{cargado.genero}</td>
                    </tr>
                  ))
                ) : (
                  <p className="text-white-bg3 absolute text-md">
                    No se encontraron datos cargados
                  </p>
                )}
              </tbody>
            </table>
          </div>

          <div className="space-x-2 flex justify-end w-full">
            <button
              onClick={() => setShowHistorial(true)}
              className="boton_verde"
            >
              VER HISTORIAL DE INGRESOS
            </button>
          </div>
        </div>
      )}
      {showHistorial ? (
        <Modal>
          <Historial
            setCloseModal={setShowHistorial}
            title="HISTORIAL DE INGRESOS"
            arrayHeader={arrayHeader}
            arrayContent={arrayContent}
            placeHolder="Aun no se cargaron ingresos."
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default IngresosRecientes;
