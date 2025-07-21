import { useState, useEffect } from "react";
import Modal from "../../../../common/Modal";
import Historial from "../../../../common/Historial";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";
import { Link } from "react-router-dom";

const UltimosRetiros = () => {
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
    "Liquidado",
  ];
  const [arrayContent, setArrayContent] = useState([]);

  useEffect(() => {
    axios(`${url}tambo/retiroleche`)
      .then(({ data }) => {
        const recientes = data.map((cargado) => {
          const fecha = cargado.fecha.split("T")[0];
          const arrayFecha = fecha.split("-");
          const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
          return {
            fecha: fechaFinal,
            liquidado: cargado.liquidado,
            cantidad: cargado.cantidad,
          };
        });
        setCargadosRecientemente(recientes.slice(0, 10));
        setLoaderTabla(false);
      })
      .catch((error) => {
        setLoaderTabla(false);
        console.log(error);
      });

    axios(`${url}tambo/retiroleche/parcial`).then(({ data }) => {
      //!para historial
      const arrayValoresRetiros = [];
      const arrayObjetosNoLiquidados = [];
      data.map((ordeñe) => {
        const fecha = ordeñe.fecha.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;

        arrayValoresRetiros.push([
          fechaFinal,
          ordeñe.hora_carga,
          ordeñe.hora_retiro,
          ordeñe.cantidad,
          ordeñe.encargado_retiro,
          ordeñe.aclaracion,
          ordeñe.liquidado ? "Si" : "No",
        ]);

        const fechaConHora = insertarHora(ordeñe.fecha, ordeñe.hora_retiro);

        if (!ordeñe.liquidado) {
          arrayObjetosNoLiquidados.push({
            ...ordeñe,
            fecha_muestra: fechaFinal,
            fecha: fechaConHora,
          });
        }
      });
      setArrayContent(arrayValoresRetiros);

      // const arraySinLiquidar = [];
      // data.map((ordeñe) => {
      //     if (!ordeñe.liquidado) {
      //         arraySinLiquidar.push(ordeñe);
      //     }
      // });
      // setSinLiquidar(
      //     arrayObjetosNoLiquidados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      // );
    });
  }, []);

  //! INSERTAR HORA EN LA FECHA
  const insertarHora = (fechaISO, hora) => {
    // Extraer solo la parte de la fecha (YYYY-MM-DD)
    const fechaBase = fechaISO.split("T")[0];

    // Separar la hora y minutos
    const [horas, minutos] = hora.split(":");

    // Crear un nuevo objeto Date con la fecha base
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setUTCHours(horas, minutos, 0, 0); // Establecer la hora y minutos

    return nuevaFecha.toISOString(); // Retornar en formato ISO
  };

  return (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
      <div className="flex w-full justify-between">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          CARGADOS RECIENTEMENTE
        </h2>
      </div>
      {loaderTabla ? (
        <LoaderDatos textLoader="Cargando ultimos retiros" />
      ) : (
        <div className="flex flex-col w-full h-full">
          <p className="text-start w-full">
            Se mostraran los ultimos diez (10) retiros.
          </p>
          <div className="min-h-[300px] h-[83%] w-full scrollbar overflow-auto">
            <table className="border-separate text-lg w-full text-black-comun">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-center">
                  <td>Fecha</td>
                  <td>Liquidado</td>
                  <td>Litros</td>
                </tr>
              </thead>
              <tbody className="relative">
                {cargadosRecientemente.length ? (
                  cargadosRecientemente.map((cargado, index) => (
                    <tr
                      key={
                        cargado.id ||
                        `${cargado.fecha}-${cargado.cantidad}-${index}`
                      }
                      className="bg-white-bg2 text-center"
                    >
                      <td>{cargado.fecha}</td>
                      <td>{cargado.liquidado ? "Si" : "No"}</td>
                      <td>{cargado.cantidad}</td>
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
            <Link to="/tambo/compradores-leche" className="boton_rojo">
              COMPRADORES DE LECHE
            </Link>
            <button
              onClick={() => setShowHistorial(true)}
              className="boton_verde"
            >
              HISTORIAL DE RETIROS
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
          <div className="w-full flex justify-end mt-2">
            <Link to="/tambo/venta/liquidaciones" className="boton_verde">
              HISTORIAL LIQUIDACIONES
            </Link>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default UltimosRetiros;
