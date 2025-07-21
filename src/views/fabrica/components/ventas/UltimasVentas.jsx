import { useState, useEffect } from "react";
import Modal from "../../../../common/Modal";
import HistorialDeVentas from "./HistorialDeVentas";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";

const Ultimasventas = () => {
  //? LOADER
  const [loaderTabla, setLoaderTabla] = useState(true);

  const [showHistorial, setShowHistorial] = useState(false);
  const [cargadosRecientemente, setCargadosRecientemente] = useState([]);

  //! DATOS PARA HISTORIAL
  const [arrayVentas, setArrayVentas] = useState([]);

  //? GET de historial de ventas
  const fetchHistorial = async () => {
    try {
      const { data } = await axios.get(`${url}fabrica/ventaproducto`);

      const formateados = data.map((venta) => {
        return {
          id: venta.id,
          fecha: venta.fecha.split("T")[0].split("-").reverse().join("/"),
          importe: venta.monto,
          comprador: venta.nombre_cliente,
        };
      });

      // Mostrar últimos 10
      setCargadosRecientemente(formateados.slice(0, 10));

      setArrayVentas(data);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
    } finally {
      setLoaderTabla(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  return (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
      <div className="flex w-full">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          CARGADOS RECIENTEMENTE
        </h2>
      </div>

      {loaderTabla ? (
        <LoaderDatos textLoader="Cargando ultimos retiros" />
      ) : (
        <div className="flex flex-col w-full h-full">
          <p className="text-start w-full">
            Se mostrarán las últimas diez (10) ventas.
          </p>
          <div className="min-h-[300px] h-[83%] w-full scrollbar overflow-auto">
            <table className="border-separate text-lg w-full text-black-comun">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-center">
                  <td>Fecha</td>
                  <td>Comprador</td>
                  <td>Importe</td>
                </tr>
              </thead>
              <tbody className="relative">
                {cargadosRecientemente.length ? (
                  cargadosRecientemente.map((cargado) => (
                    <tr key={cargado.id} className="bg-white-bg2 text-center">
                      <td>{cargado.fecha}</td>
                      <td>{cargado.comprador}</td>
                      <td>$ {cargado.importe.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-white-bg3 text-center py-4">
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
              HISTORIAL DE VENTAS
            </button>
          </div>
        </div>
      )}

      {showHistorial && (
        <Modal>
          <HistorialDeVentas
            setCloseModal={setShowHistorial}
            arrayContent={arrayVentas}
          />
        </Modal>
      )}
    </div>
  );
};

export default Ultimasventas;
