import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaPlus, FaNewspaper } from "react-icons/fa6";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//?COMPONENTS
import Modal from "../../common/Modal";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { url } from "../../common/URL_SERVER";
import LoaderDatos from "../../common/LoaderDatos";
import Titulo from "../../common/Titulo";
import AgregarNuevo from "./components/rollos/AñadirNuevo";
import AñadirOEditar from "./components/rollos/AñadirOEditar";
import AddMovimientos from "./components/rollos/AddMovimientos";

const Rollos = () => {
  const [loader, setLoader] = useState(true);
  const [movimientos, setMovimientos] = useState([]);
  const [showAchivo, setShowArchivo] = useState(false);
  const [archivo, setArchivo] = useState("");
  const [showNewMov, setShowNewMov] = useState(false);
  const [nuevoRollo, setNuevoRollo] = useState(false);
  const [arrayTipo, setArrayTipos] = useState([]);
  const [editarRollo, setEditarRollo] = useState(false);
  const [editarRolloData, setEditarRolloData] = useState({});

  const handleAñadirRollo = (data) => {
    setEditarRolloData(data);
    setEditarRollo(true);
  };

  const [contadores, setContadores] = useState([]);

  useEffect(() => {
    axios(url + "agricultura/movimiento-rollo").then(({ data }) => {
      const dataFormat = data.map((d) => {
        const fechaFinal = d.fecha.split("T")[0].split("-").reverse().join("/");
        return {
          ...d,
          fechaFormt: fechaFinal,
        };
      });
      
      setMovimientos(dataFormat.reverse());
    });

    axios(url + "agricultura/rollo").then(({ data }) => {
      setContadores(data);
      const arrayTiposNombre = data.map((d) => {
        return d.tipo;
      });
      setArrayTipos(arrayTiposNombre);
      setLoader(false);
    });
  }, []);

  const handleShowArchivo = (arch) => {
    setArchivo(arch);
    setShowArchivo(true);
  };

  const handleDeleteMov = (id, text, fecha) => {
    Swal.fire({
      title: `¿Quieres eliminar el movimiento o aclaración cargada el dia ${fecha} con la siguiente descripción?`,
      text: `"${text}"`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
      confirmButtonColor: "#86C394",
      denyButtonColor: "#D64747",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(url + `agricultura/movimiento-rollo/${id}`)
          .then(() => {
            Swal.fire({
              title: "Movimiento o aclaracion eliminada con éxito",
              confirmButtonColor: "#86C394",
              icon: "success",
            }).then(() => {
              axios(url + "agricultura/movimiento-rollo").then(({ data }) => {
                const dataFormat = data.map((d) => {
                  const fechaFinal = d.fecha
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/");
                  return {
                    ...d,
                    fechaFormt: fechaFinal,
                  };
                });
                setMovimientos(dataFormat.reverse());
              });
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Ocurrio un error inesperado",
              text:
                error.message === "Network Error"
                  ? "Contacte con el servicio técnico"
                  : error,
              confirmButtonColor: "#D64747",
              icon: "error",
            });
          });
      }
    });
  };

  const handleDeleteRollo = (id, tipo) => {
    Swal.fire({
      title: `¿Quieres eliminar lote de rollos de ${tipo}?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
      confirmButtonColor: "#86C394",
      denyButtonColor: "#D64747",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(url + `agricultura/rollo/${id}`)
          .then(() => {
            Swal.fire({
              title: "Lote de rollos eliminado con éxito",
              confirmButtonColor: "#86C394",
              icon: "success",
            }).then(() => {
              axios(url + "agricultura/rollo").then(({ data }) => {
                setContadores(data);
                const arrayTiposNombre = data.map((d) => {
                  return d.tipo;
                });
                setArrayTipos(arrayTiposNombre);
                setLoader(false);
              });
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Ocurrio un error inesperado",
              text:
                error.message === "Network Error"
                  ? "Contacte con el servicio técnico"
                  : error,
              confirmButtonColor: "#D64747",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <ContenedorGeneral navText="AGRICULTURA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="AGRICULTURA | ROLLOS" />

        <Link to="/agricultura" className="boton_rojo">
          VOLVER
        </Link>
      </div>

      <div className="h-full w-full pr-4 md:p-2 md:w-auto bg-white-bg2 space-y-2 p-2">
        <div className="w-full flex justify-between items-end">
          <div className="flex gap-4 grow scrollbar overflow-x-auto flex-wrap">
            {loader ? (
              <LoaderDatos textLoader="Cargando datos" />
            ) : contadores.length ? (
              contadores.map((c) => (
                <div className="flex flex-col w-50">
                  <label className="labelInput truncate">{c.tipo}</label>
                  <div className="bg-white-bg text-black-comun text-xl w-full flex justify-between">
                    <p className="font-bold p-2">KG: {c.cantidad}</p>
                    <div className="flex">
                      <button
                        onClick={() => handleAñadirRollo(c)}
                        className="bg-button-green hover:bg-button-green_hover text-white-bg2 py-1 px-3 text-xl"
                      >
                        <MdEdit className="mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDeleteRollo(c.id, c.tipo)}
                        className="bg-button-red hover:bg-button-red_hover text-white-bg2 py-1 px-3 text-xl"
                      >
                        <MdDelete className="mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xl">No hay rollos cargados.</p>
            )}
          </div>
          <div>
            <button onClick={() => setNuevoRollo(true)} className="boton_verde">
              AGREGAR NUEVO ROLLO
            </button>
          </div>
        </div>

        <div className="relative">
          <p className="text-xl font-semibold text-white-bg3">
            Movimientos y anotaciones:
          </p>
          <div className="w-full h-[70dvh] bg-white-bg p-2 space-y-3 scrollbar overflow-auto border-[3px] border-white-bg">
            {loader ? (
              <LoaderDatos textLoader="Cargando datos" />
            ) : movimientos.length ? (
              movimientos.map((mov, index) => (
                <div key={index} className="bg-white-bg2 space-y-2 p-2">
                  <p className="text-xl">{mov.texto}</p>
                  <div className="flex w-full justify-between">
                    <p className="text-xl font-semibold text-white-bg3">
                      {mov.fechaFormt}
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleShowArchivo(mov.archivo)}
                        className={
                          mov.archivo
                            ? "hover:bg-button-green_hover bg-button-green text-white-bg text-[20px] cursor-pointer w-8"
                            : "hidden"
                        }
                      >
                        <FaNewspaper className="mx-auto" />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteMov(mov.id, mov.texto, mov.fecha)
                        }
                        className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                      >
                        <MdDelete className="mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xl">Sin movimientos ni anotaciones.</p>
            )}
          </div>

          <Tippy
            content="Agregar movimiento o aclaración"
            placement={window.innerWidth < 640 ? "top-end" : "left"} 
            arrow={true}
            theme="custom_2"
          >
            <div className="fixed sm:absolute bottom-4 right-4 sm:bottom-2 sm:right-2">
              <button
                onClick={() => setShowNewMov(true)}
                className="bg-button-green hover:bg-button-green_hover text-white-bg2 rounded-full shadow-xl flex items-center justify-center"
              >
                <span className="sm:hidden py-3 px-4 text-sm font-semibold">
                  AGREGAR ACLARACIÓN O MOVIMIENTO
                </span>

                <span className="hidden sm:flex p-4">
                  <FaPlus className="text-xl" />
                </span>
              </button>
            </div>
          </Tippy>
        </div>
      </div>

      {showNewMov ? (
        <Modal>
          <AddMovimientos
            setCloseModal={setShowNewMov}
            setContadores={setContadores}
            setMovimientos={setMovimientos}
            setArrayTipos={setArrayTipos}
            arrayNombreRollos={arrayTipo}
          />
        </Modal>
      ) : null}

      {nuevoRollo ? (
        <Modal>
          <AgregarNuevo
            setCloseModal={setNuevoRollo}
            setContadores={setContadores}
            arrayNombreRollos={arrayTipo}
            setMovimientos={setMovimientos}
            setArrayTipos={setArrayTipos}
          />
        </Modal>
      ) : null}

      {editarRollo ? (
        <Modal>
          <AñadirOEditar
            setCloseModal={setEditarRollo}
            arrayNombreRollos={arrayTipo}
            setContadores={setContadores}
            data={editarRolloData}
            setMovimientos={setMovimientos}
          />
        </Modal>
      ) : null}

      {showAchivo ? (
        <Modal>
          <div className="w-full flex justify-between pb-2">
            <Titulo text="DOCUMENTO ADJUNTO" />
            <button
              onClick={() => setShowArchivo(false)}
              className="boton_rojo"
            >
              VOLVER
            </button>
          </div>
          <img
            src={archivo}
            alt="Imagen cargada en liquidación"
            className="w-[300px] lg:w-[450px] sm:aspect-[10/12] aspect-[8/8] object-cover ml-10 sm:ml-0 scrollbar overflow-auto"
          />
        </Modal>
      ) : null}
    </ContenedorGeneral>
  );
};

export default Rollos;
