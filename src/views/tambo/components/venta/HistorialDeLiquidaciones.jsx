import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../../../../common/URL_SERVER";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import Titulo from "../../../../common/Titulo";
import { FaNewspaper } from "react-icons/fa6";
import Modal from "../../../../common/Modal";
import Paginador from "../../../../common/Paginador";
import LoaderDatos from "../../../../common/LoaderDatos";

const HistorialDeLiquidaciones = () => {
  const [showModalDatos, setShowModalDatos] = useState(false);
  const [datosModal, setDatosModal] = useState("");
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [loader, setLoader] = useState(true);

  const [cantidadPaginas, setCantidadPaginas] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);

  const handleMostrarInforme = (imagen) => {
    setDatosModal(imagen);
    setShowModalDatos(true);
  };

  useEffect(() => {
    setLoader(true);
    axios(url + `tambo/retiroleche/liquidacion?page=${paginaActual}&limit=14`)
      .then(({ data }) => {
        setLoader(false);
        setCantidadPaginas(data.totalPages);
        setPaginaActual(data.currentPage);
        const recientes = data.data.map((cargado) => {
          const fecha = cargado.fecha.split("T")[0];
          const arrayFecha = fecha.split("-");
          const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
          return {
            ...cargado,
            fecha: fechaFinal,
          };
        });

        setLiquidaciones(recientes);
      })
      .catch((error) => console.log(error));
  }, [paginaActual]);

  return (
    <ContenedorGeneral navText="TAMBO">
      <div className="w-screen md:w-full flex sm:hidden justify-between pl-10 sm:pl-14 md:pl-0 pr-4 md:pr-0 pt-1">
        <Titulo text="HISTORIAL DE LIQUIDACIONES" />

        <Link to={`/tambo/venta`} className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="HISTORIAL DE LIQUIDACIONES" />

        <Link to={`/tambo/venta`} className="boton_rojo">
          VOLVER
        </Link>
      </div>
      {loader ? (
        <LoaderDatos textLoader="Cargando lista de liquidaciones" />
      ) : (
        <div className="w-full flex flex-col space-y-2 sm:bg-white-bg pt-2">
          <p>Seleccione registro para ver su informe.</p>

          <div className="w-full h-[70dvh] scrollbar overflow-auto space-y-3">
            <table className="border-separate text-lg w-full text-black-comun">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-center">
                  <td className="px-1">Fecha</td>
                  <td className="px-1">Importe total</td>
                  <td className="px-1">Facturado</td>
                  <td className="px-1">No facturado</td>
                  <td className="px-1">Litros</td>
                  <td className="px-1">Precio litros</td>
                  <td></td>
                </tr>
              </thead>
              <tbody className="relative">
                {liquidaciones.length ? (
                  liquidaciones.map((c) => (
                    <tr key={c.id} className="bg-white-bg2">
                      <td className="px-1">{c.fecha}</td>
                      <td className="px-1">$ {c.importe_total}</td>
                      <td className="px-1">$ {c.importe_blanco}</td>
                      <td className="px-1">$ {c.importe_negro}</td>
                      <td className="px-1">{c.litros}</td>
                      <td className="px-1">$ {c.precio_litro}</td>
                      <td
                        onClick={
                          c.url_image
                            ? () => handleMostrarInforme(c.url_image)
                            : null
                        }
                        className={
                          c.url_image
                            ? "hover:bg-button-green_hover bg-button-green text-white-bg2 text-xl cursor-pointer w-8"
                            : "bg-white-bg3 text-white-bg2 text-xl w-8"
                        }
                      >
                        <FaNewspaper className="mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <p className="text-white-bg3 absolute text-md">
                    No hay liquidaciones cargadas
                  </p>
                )}
              </tbody>
            </table>
          </div>
          <div className={cantidadPaginas <= 1 ? "hidden" : "block"}>
            <Paginador
              cantidadPaginas={cantidadPaginas}
              paginaActual={paginaActual}
              setPagina={setPaginaActual}
            />
          </div>
        </div>
      )}
      {showModalDatos ? (
        <Modal>
          <div className="w-full flex justify-between pb-2">
            <Titulo text="DOCUMENTO DE LIQUIDACION" />
            <button
              onClick={() => setShowModalDatos(false)}
              className="boton_rojo"
            >
              VOLVER
            </button>
          </div>
          <img
            src={datosModal}
            alt="Imagen cargada en liquidación"
            className="w-[300px] lg:w-[450px] aspect-[9/16] object-cover scrollbar overflow-auto"
          />
        </Modal>
      ) : null}
    </ContenedorGeneral>
  );
};

export default HistorialDeLiquidaciones;
