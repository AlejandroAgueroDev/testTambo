import { useState, useEffect } from "react";
import Modal from "../../../../common/Modal";
import Historial from "../../../../common/Historial";
import axios from "axios";
import Liquidar from "./Liquidar";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";

const TablaRetirosComprador = ({ id }) => {
  //? LOADER
  const [loaderTabla, setLoaderTabla] = useState(true);
  const [showHistorial, setShowHistorial] = useState(false);
  const [showLiquidar, setShowLiquidar] = useState(false);
  const [cargadosRecientemente, setCargadosRecientemente] = useState([]);
  const [cargadosRecientementeSave, setCargadosRecientementeSave] = useState(
    []
  );
  const [selectFinlt, setSelectFilt] = useState("TODOS");

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
  const [sinLiquidar, setSinLiquidar] = useState([]);

  useEffect(() => {
    axios(url + "tambo/retiroleche/")
      .then(({ data }) => {
        const recientes = [];
        const noLiquidados = [];
        data.map((cargado) => {
          const fecha = cargado.fecha.split("T")[0];
          const arrayFecha = fecha.split("-");
          const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
          if (cargado.id_cliente === id) {
            recientes.push({
              fecha: fechaFinal,
              liquidado: cargado.liquidado,
              cantidad: cargado.cantidad,
              encargado: cargado.encargado_retiro,
            });

            const fechaConHora = insertarHora(
              cargado.fecha,
              cargado.hora_retiro
            );

            if (!cargado.liquidado) {
              noLiquidados.push({
                ...cargado,
                fecha_muestra: fechaFinal,
                fecha: fechaConHora,
              });
            }
          }
        });
        setSinLiquidar(
          noLiquidados.sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          )
        );
        setCargadosRecientemente(recientes.slice(0, 10));
        setCargadosRecientementeSave(recientes.slice(0, 10));
        setLoaderTabla(false);
      })
      .catch((error) => {
        setLoaderTabla(false);
        console.log(error);
      });

    axios(url + "tambo/retiroleche?page=1&limit=10").then(({ data }) => {
      //!para historial
      const arrayValoresRetiros = [];
      const arrayObjetosNoLiquidados = [];
      data.map((ordeñe) => {
        const fecha = ordeñe.fecha.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;

        if (ordeñe.id_cliente === id) {
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
        }
      });
      setArrayContent(arrayValoresRetiros);

      setSinLiquidar(
        arrayObjetosNoLiquidados.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )
      );
    });
  }, []);

  useEffect(() => {
    if (selectFinlt === "TODOS") {
      setCargadosRecientemente([...cargadosRecientementeSave]);
    }
    if (selectFinlt === "LIQUIDADOS") {
      setCargadosRecientemente(
        [...cargadosRecientementeSave].filter((c) => c.liquidado)
      );
    }
    if (selectFinlt === "SIN LIQUIDAR") {
      setCargadosRecientemente(
        [...cargadosRecientementeSave].filter((c) => !c.liquidado)
      );
    }
  }, [selectFinlt]);

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
    <div className="w-full flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
      <div className="flex w-full justify-between">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          RETIROS RECIENTES
        </h2>
        <select
          className="bg-white-bg2 text-black-comun py-2 px-2 text-xl w-full sm:w-auto"
          onChange={(e) => setSelectFilt(e.target.value)}
        >
          <option value="TODOS">Todos</option>
          <option value="LIQUIDADOS">Liquidados</option>
          <option value="SIN LIQUIDAR">Sin liquidar</option>
        </select>
      </div>
      {loaderTabla ? (
        <LoaderDatos textLoader="Cargando ultimos retiros" />
      ) : (
        <div className="flex flex-col w-full h-full">
          <p className="text-start w-full">
            Se mostraran los ultimos diez (10) retiros.
          </p>
          <div className="flex-1 w-full max-h-[100%] scrollbar overflow-auto">
            <table className="border-separate text-lg w-full text-black-comun">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-center">
                  <th className="px-1">Fecha</th>
                  <th className="px-1">Liquidado</th>
                  <th className="px-1">Encargado</th>
                  <th className="px-1">Litros</th>
                </tr>
              </thead>
              <tbody >
                {cargadosRecientemente.length ? (
                  cargadosRecientemente.map((cargado) => (
                    <tr
                      className="bg-white-bg2 text-base text-center"
                      key={
                        cargado.id || `${cargado.fecha}-${cargado.encargado}`
                      }
                    >
                      <td className="px-1">{cargado.fecha}</td>
                      <td
                        className={`px-1 ${
                          cargado.liquidado
                            ? "text-green-600 font-bold"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {cargado.liquidado ? "Si" : "No"}
                      </td>
                      <td className="px-1">{cargado.encargado}</td>
                      <td className="px-1">{cargado.cantidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-white-bg3 text-md text-center"
                    >
                      No se encontraron retiros pendientes.
                    </td>
                  </tr>
                )}               
              </tbody>
            </table>
          </div>

          <div className="space-x-2 flex justify-end w-full">
            <button
              onClick={() => setShowLiquidar(true)}
              className="boton_rojo"
            >
              LIQUIDAR RETIROS
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
          <Historial
            setCloseModal={setShowHistorial}
            title="HISTORIAL DE ORDEÑES"
            arrayHeader={arrayHeader}
            arrayContent={arrayContent}
            placeHolder="Aun no se cargaron ordeñes."
          />
        </Modal>
      ) : null}

      {showLiquidar ? (
        <Modal>
          <Liquidar
            setCloseModal={setShowLiquidar}
            retirosNoLiquidados={sinLiquidar}
            id={id}
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default TablaRetirosComprador;
