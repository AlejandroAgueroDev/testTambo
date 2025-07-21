import { useState, useEffect } from "react";
import Modal from "../../../../common/Modal";
import Liquidar from "./Liquidar";
import LoaderDatos from "../../../../common/LoaderDatos";

const TablaRetiros = ({ retiros, fetchRetiros, id_proveedor }) => {
  const [loaderTabla, setLoaderTabla] = useState(true);
  const [showLiquidar, setShowLiquidar] = useState(false);
  const [cargadosRecientemente, setCargadosRecientemente] = useState([]);
  const [cargadosRecientementeSave, setCargadosRecientementeSave] = useState(
    []
  );
  const [selectFinlt, setSelectFilt] = useState("TODOS");
  const [retirosNoLiquidados, setRetirosNoLiquidados] = useState([]);

  useEffect(() => {
    if (retiros && retiros.length > 0) {
      const retirosFormateados = retiros.map((retiro) => ({
        id: retiro.id,
        fecha: new Date(retiro.fecha).toLocaleDateString(),
        liquidado: retiro.liquidado,
        encargado: retiro.encargado_retiro,
        cantidad: retiro.cantidad,
        fecha_muestra: retiro.fecha,
        hora_retiro: retiro.hora_retiro,
      }));

      setCargadosRecientemente(retirosFormateados);
      setCargadosRecientementeSave(retirosFormateados);
      setRetirosNoLiquidados(retirosFormateados.filter((c) => !c.liquidado));
      setLoaderTabla(false);
    } else {
      setLoaderTabla(false);
      setRetirosNoLiquidados([]);
    }
  }, [retiros]);

  useEffect(() => {
    if (selectFinlt === "TODOS") {
      setCargadosRecientemente([...cargadosRecientementeSave]);
    } else if (selectFinlt === "LIQUIDADOS") {
      setCargadosRecientemente(
        [...cargadosRecientementeSave].filter((c) => c.liquidado)
      );
    } else if (selectFinlt === "SIN LIQUIDAR") {
      const sinLiquidar = [...cargadosRecientementeSave].filter(
        (c) => !c.liquidado
      );
      setCargadosRecientemente(sinLiquidar);
      setRetirosNoLiquidados(sinLiquidar);
    }
  }, [selectFinlt, cargadosRecientementeSave]);

  return (
    <div className="w-full flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full mt-2">
      <div className="flex w-full justify-between">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          RETIROS RECIENTES
        </h2>
        <select
          className="bg-white-bg2 text-black-comun py-2 px-2 text-xl w-[160px]"
          onChange={(e) => setSelectFilt(e.target.value)}
        >
          <option value="TODOS">Todos</option>
          <option value="LIQUIDADOS">Liquidados</option>
          <option value="SIN LIQUIDAR">Sin liquidar</option>
        </select>
      </div>

      {loaderTabla ? (
        <LoaderDatos textLoader="Cargando últimos retiros" />
      ) : (
        <div className="flex flex-col w-full h-full">
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
              <tbody>
                {cargadosRecientemente.length ? (
                  cargadosRecientemente.map((cargado) => (
                    <tr
                      key={cargado.id}
                      className="bg-white-bg2 text-base text-center"
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

          <div className="mt-4 flex justify-end w-full">
            <button
              onClick={() => setShowLiquidar(true)}
              disabled={retirosNoLiquidados.length === 0} // Deshabilitar si no hay retiros
              className={`${
                retirosNoLiquidados.length === 0
                  ? "boton_rojo_deshabilitado"
                  : "boton_rojo"
              }`}
            >
              LIQUIDAR RETIROS
            </button>
          </div>
        </div>
      )}

      {showLiquidar && (
        <Modal>
          <Liquidar
            setCloseModal={setShowLiquidar}
            retirosNoLiquidados={retirosNoLiquidados}
            fetchRetiros={fetchRetiros}
            id_proveedor={id_proveedor}
          />
        </Modal>
      )}
    </div>
  );
};

export default TablaRetiros;
