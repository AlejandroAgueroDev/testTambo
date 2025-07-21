import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import Swal from "sweetalert2";
import axios from "axios";
import Paginador from "../../../../common/Paginador";
import { FaNewspaper } from "react-icons/fa6";
import ControlDatos from "./ControlDatos";
import Modal from "../../../../common/Modal";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";

const HistorialDeControles = () => {
  //? LOADER
  const [loaderTabla, setLoaderTabla] = useState(true);

  const [controles, setControles] = useState([]);
  const [cantidadPaginas, setCantidadPaginas] = useState(0);
  const [paginaActual, setPaginaActual] = useState(0);

  const [showModalDatos, setShowModalDatos] = useState(false);
  const [datosModal, setDatosModal] = useState({});

  const handleMostrarControl = (datos) => {
    setDatosModal(datos);
    setShowModalDatos(true);
  };

  useEffect(() => {
    axios(url + "tambo/control?page=1&limit=10").then(({ data }) => {
      setLoaderTabla(false);
      setCantidadPaginas(data.totalPages);
      setPaginaActual(data.currentPage);
      const dataFormat = data.data.map((d) => {
        const fecha = d.createdAt.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
        return {
          ...d,
          createdAt: fechaFinal,
        };
      });
      setControles(dataFormat);
    });
  }, []);

  useEffect(() => {
    axios(url + `tambo/control?page=${paginaActual}&limit=10`).then(
      ({ data }) => {
        const dataFormat = data.data.map((d) => {
          const fecha = d.createdAt.split("T")[0];
          const arrayFecha = fecha.split("-");
          const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
          return {
            ...d,
            createdAt: fechaFinal,
          };
        });
        setControles(dataFormat);
      }
    );
  }, [paginaActual]);

  // Swal.fire({
  //     title: `¿Borrar los datos del control de produccion de la fecha: ${fecha}`,
  //     showDenyButton: true,
  //     confirmButtonText: "Si",
  //     denyButtonText: `No`,
  //     confirmButtonColor: "#86C394",
  //     denyButtonColor: "#D64747",
  //     allowOutsideClick: false,
  // }).then((result) => {
  //     if (result.isConfirmed) {
  //         localStorage.removeItem(key);

  //         Swal.fire({
  //             title: "¡Datos de control borrado!",
  //             confirmButtonText: "Aceptar",
  //             icon: "success",
  //             confirmButtonColor: "#86C394",
  //             allowOutsideClick: false,
  //         }).then(() => window.location.reload());
  //     } else if (result.isDenied) {
  //         return;
  //     }
  // });

  return (
    <ContenedorGeneral navText="TAMBO">
      <div className="w-screen md:w-full justify-between pl-14 md:pl-0 pr-4 md:pr-0 hidden sm:flex">
        <Titulo text="HISTORIAL DE CONTROL DE PRODUCCION" />

        <Link to="/tambo/control-produccion" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-screen md:w-full justify-between pl-10 md:pl-0 pr-4 md:pr-0 flex sm:hidden">
        <Titulo text="HISTORIAL DE CONTROLES" />

        <Link to="/tambo/control-produccion" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      {loaderTabla ? (
        <LoaderDatos textLoader="Cargando historial de controles" />
      ) : (
        <div className="w-full flex flex-col space-y-2 sm:bg-white-bg pt-2">
          <p>Seleccione un control para ver su informe.</p>

          <div className="w-full h-[400px] scrollbar overflow-auto space-y-3">
            <table className="border-separate text-lg w-full text-black-comun">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-center">
                  <td className="px-1 truncate">Fecha</td>
                  <td className="px-1 truncate">Litros medidos</td>
                  <td className="px-1 truncate">Cantidad de animales</td>
                  <td className="px-1 truncate">Promedio por animal</td>
                  <td></td>
                </tr>
              </thead>
              <tbody className="relative">
                {controles.length ? (
                  controles.map((c) => (
                    <tr key={c.id} className="bg-white-bg2 text-center">
                      <td>{c.createdAt}</td>
                      <td>{c.litros_medidos.toFixed(2)}</td>
                      <td>{c.total_vacas_ordeñe}</td>
                      <td>{c.promedio_tambo}</td>
                      <td
                        onClick={() => handleMostrarControl(c)}
                        className="hover:bg-button-green_hover
                                            bg-button-green text-white-bg text-xl cursor-pointer w-8"
                      >
                        <FaNewspaper className="mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <p className="text-white-bg3 absolute text-md">
                    No hay controles de producción cargados
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
          <ControlDatos setCloseModal={setShowModalDatos} datos={datosModal} />
        </Modal>
      ) : null}
    </ContenedorGeneral>
  );
};

export default HistorialDeControles;
