import { MdEdit } from "react-icons/md";
import Titulo from "../../../../common/Titulo";
import { FaNewspaper } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Modal from "../../../../common/Modal";
import EditarTernera from "./EditarDatosTernera";
import { url } from "../../../../common/URL_SERVER";
import axios from "axios";
import LoaderDatos from "../../../../common/LoaderDatos";
import Swal from "sweetalert2";
import LoaderModal from "../../../../common/LoaderModal";

const DatosTernera = ({ animalSeleccionado, fetchData }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [controlesVet, setControlesVet] = useState([]);
  const [loaderTablaContVet, setLoaderTablaContVet] = useState(true);
  const [showActa, setShowActa] = useState(false);
  const [dataActa, setDataActa] = useState({ url: "", fecha: "" });
  const [animalActualizado, setAnimalActualizado] =
    useState(animalSeleccionado);

  const handleShowActa = (url, fecha) => {
    setDataActa({ url, fecha });
    setShowActa(true);
  };
  const [loaderPasarTambo, setLoaderPasarTambo] = useState(false);

  // Actualizar el estado local cuando cambie animalSeleccionado
  useEffect(() => {
    setAnimalActualizado(animalSeleccionado);
  }, [animalSeleccionado]);

  useEffect(() => {
    if (!animalSeleccionado) return;

    setLoaderTablaContVet(true);
    axios(url + "tambo/controlveterinario")
      .then(({ data }) => {
        setLoaderTablaContVet(false);
        const controles = [];
        data.map((cargado) => {
          const fecha = cargado.createdAt.split("T")[0];
          const arrayFecha = fecha.split("-");
          const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;

          cargado.Ganados.map((ganado) => {
            controles.push({
              caravana: ganado.caravana,
              fecha: fechaFinal,
              veterinario: cargado.veterinario,
              aclaracion: cargado.detalle,
              url: cargado.acta_url,
            });
          });
        });
        const contVetParticipes = [];
        controles.map((df) => {
          if (df.caravana === animalSeleccionado.caravana) {
            contVetParticipes.push(df);
          }
        });
        setControlesVet(contVetParticipes);
      })
      .catch((error) => console.log(error));
  }, [animalSeleccionado]);

  const handlePasarATambo = () => {
    Swal.fire({
      title: `¿Quieres pasar a la ternera ${animalActualizado.caravana} al tambo?`,
      confirmButtonText: "Aceptar",
      icon: "question",
      iconColor: "#86C394",
      confirmButtonColor: "#86C394",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoaderPasarTambo(true);
        axios
          .put(url + "tambo/ganado", {
            ...animalActualizado,
            tipo: "VAQUILLONA",
            estado: "ORDEÑE",
          })
          .then((res) => {
            setLoaderPasarTambo(false);
            Swal.fire({
              title: "¡Animal actualizado con exito!",
              text: "Ahora podras encontrarlo en la lista de animales del tambo.",
              confirmButtonText: "Aceptar",
              icon: "success",
              confirmButtonColor: "#86C394",
            }).then(() => {
              fetchData(); // Actualiza la lista principal
              // window.location.reload();
            });
          })
          .catch((error) => {
            setLoaderPasarTambo(false);
            Swal.fire({
              title: "Ocurrio un error inesperado, intente nuevamente",
              text:
                error.message === "Network Error"
                  ? "Contacte con el servicio técnico"
                  : error,
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#D64747",
              icon: "error",
            });
          });
      }
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: `¿Estas seguro de dar de baja al animal con caravana ${animalActualizado.caravana}?`,
      text: "Si es asi, se perderan algunos de los registros de este",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      confirmButtonColor: "#D64747",
      iconColor: "#D64747",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${url}tambo/ganado/${animalActualizado.id}`)
          .then((res) => {
            Swal.fire({
              title: "Animal eliminado",
              icon: "success",
              iconColor: "#86C394",
              confirmButtonColor: "#86C394",
            }).then(() => {
              window.location.reload();
            });
          });
      } else {
        return;
      }
    });
  };

  return animalActualizado ? (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 bg-white-bg h-full scrollbar overflow-auto">
      <div className="w-full flex flex-col items-start bg-white-bg2 p-2 space-y-1">
        <div className="flex w-full justify-between">
          <Titulo text="DATOS BASICOS" />
          <button
            onClick={() => setShowEdit(true)}
            className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-12"
          >
            <MdEdit className="mx-auto text-2xl" />
          </button>
        </div>
        <div className="flex items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Caravana:
          </label>
          <p className=" text-black-comun p-2 text-xl grow">
            {animalActualizado.caravana}
          </p>
        </div>
        <div className="flex items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Fecha de ingreso:
          </label>
          <p className=" text-black-comun p-2 text-xl grow">
            {animalActualizado.fecha_ingreso_format}
          </p>
        </div>

        {/* datos moka */}
        <div
          className={
            animalActualizado.detalles ? "flex flex-col w-full" : "hidden"
          }
        >
          <label className="text-xl font-semibold text-white-bg3">
            Observaciones:
          </label>
          <p className=" text-black-comun text-xl grow">
            {animalActualizado.detalles}
          </p>
        </div>

        <div className="pt-2 flex justify-between w-full">
          <button onClick={handlePasarATambo} className="boton_verde">
            PASAR A TAMBO
          </button>

          <button onClick={handleDelete} className="boton_rojo">
            DAR DE BAJA
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col items-start bg-white-bg2 p-2 space-y-1">
        <Titulo text="CONTROL VETERINARIO" />
        <table className="border-separate text-lg w-full">
          <thead className=" bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Fecha</td>
              <td>Veterinario</td>
              <td>Detalle</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {loaderTablaContVet ? (
              <LoaderDatos textLoader="Cargando datos..." />
            ) : controlesVet.length ? (
              controlesVet.map((g) => (
                <tr key={g.id} className="bg-white-bg">
                  <td className="px-1">{g.fecha}</td>
                  <td className="px-1 max-w-32 truncate">{g.veterinario}</td>
                  <td className="px-1 max-w-32 truncate">{g.aclaracion}</td>
                  <td
                    className="hover:bg-button-green_hover
                                     bg-button-green text-white-bg text-xl cursor-pointer w-8"
                    onClick={() => handleShowActa(g.url, g.fecha)}
                  >
                    <FaNewspaper className="mx-auto" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Sin datos.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div
          className={`w-full justify-end ${
            animalActualizado.ControlVeterinarios &&
            animalActualizado.ControlVeterinarios.length
              ? "flex"
              : "hidden"
          }`}
        >
          <button className="boton_rojo">HISTORIAL DE CONTROL</button>
        </div>
      </div>

      {showEdit ? (
        <Modal>
          <EditarTernera
            setCloseModal={setShowEdit}
            data={animalActualizado}
            fetchData={fetchData}
          />
        </Modal>
      ) : null}

      {loaderPasarTambo ? (
        <Modal>
          <LoaderModal textLoader="Actualizando datos" />
        </Modal>
      ) : null}

      {showActa ? (
        <Modal>
          <div className="flex flex-col space-y-2 items-start w-[90vw] sm:w-[500px] max-h-[90dvh]">
            <div className="w-full flex justify-between">
              <Titulo text={`ACTA CONTROL | ${dataActa.fecha}`} />
              <button className="boton_rojo" onClick={() => setShowActa(false)}>
                VOLVER
              </button>
            </div>
            <div className="max-h-[78dvh] scrollbar overflow-auto">
              <img
                src={dataActa.url}
                alt="Acta de control veterinario"
                className="w-full"
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  ) : (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 bg-white-bg h-full scrollbar overflow-auto">
      <p className="text-white-bg3 text-xl">
        Selecciona uno para ver sus detalles.
      </p>
    </div>
  );
};

export default DatosTernera;
