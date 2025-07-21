import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import LoaderDatos from "../../../../common/LoaderDatos";
import EditarLote from "./EditarLote";
import { useState, useEffect } from "react";
import Modal from "../../../../common/Modal";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoaderModal from "../../../../common/LoaderModal";

const DatosLote = ({ dataLote, loader }) => {
  const [editarLote, setEditarLote] = useState(false);
  const [arrayNombreLotes, setArrayNombreLotes] = useState([]);
  const nav = useNavigate();
  const [loaderDelete, setLoaderDelete] = useState(false);

  useEffect(() => {
    axios(url + "agricultura/").then(({ data }) => {
      const arrayNombres = [];
      data.map((d) => {
        if (d.nombre !== dataLote.nombre)
          arrayNombres.push(d.nombre.toLowerCase());
      });
      setArrayNombreLotes(arrayNombres);
    });
  }, []);

  const deleteLote = () => {
    Swal.fire({
      title: "¿Quieres eliminar este lote definitivamente?",
      text: "Una vez eliminado no se podrá recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#D64747",
      cancelButtonColor: "#A3A3A3",
      iconColor: "#D64747",
    }).then((res) => {
      if (res.isConfirmed) {
        setLoaderDelete(true);
        axios
          .delete(url + "agricultura/" + dataLote.id)
          .then((data) => {
            setLoaderDelete(false);
            Swal.fire({
              title: "Lote eliminado con éxito",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#86C394",
              icon: "success",
              iconColor: "#86C394",
            }).then(() => nav("/agricultura/lotes"));
          })
          .catch((error) => {
            console.log("Error al eliminar el lote:", error);
            setLoaderDelete(false);
            Swal.fire({
              title: "Algo salió mal",
              text: "Intente nuevamente o llame al servicio técnico",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#D64747",
              icon: "error",
              iconColor: "#D64747",
            });
          });
      }
    });
  };

  return (
    <div className=" bg-white-bg2 p-2 flex justify-between gap-2 mx-auto">
      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">Lote</label>
        <p className="bg-white-bg text-black-comun py-1 px-3 text-xl w-full">
          {loader ? (
            <LoaderDatos textLoader="Cargando datos" />
          ) : (
            dataLote.nombre
          )}
        </p>
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Hectareas
        </label>
        <p className="bg-white-bg text-black-comun py-1 px-3 text-xl w-full">
          {loader ? (
            <LoaderDatos textLoader="Cargando datos" />
          ) : (
            dataLote.hectareas
          )}
        </p>
      </div>
      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">Ubicaión</label>
        <p className="bg-white-bg text-black-comun py-1 px-3 text-xl w-full">
          {loader ? (
            <LoaderDatos textLoader="Cargando datos" />
          ) : (
            dataLote.ubicacion
          )}
        </p>
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Propiedad
        </label>
        <p className="bg-white-bg text-black-comun py-1 px-3 text-xl w-full truncate">
          {loader ? (
            <LoaderDatos textLoader="Cargando datos" />
          ) : (
            dataLote.propiedad
          )}
        </p>
      </div>

      <div className="flex items-end space-x-2">
        <button
          onClick={() => setEditarLote(true)}
          className="bg-button-green hover:bg-button-green_hover px-3 py-2 text-xl text-white-bg2"
        >
          <MdEdit />
        </button>

        <button
          onClick={deleteLote}
          className="bg-button-red hover:bg-button-red_hover px-3 py-2 text-xl text-white-bg2"
        >
          <MdDelete />
        </button>
      </div>

      {editarLote ? (
        <Modal>
          <EditarLote
            setCloseModal={setEditarLote}
            arrayNombreLotes={arrayNombreLotes}
            data={dataLote}
          />
        </Modal>
      ) : null}

      {loaderDelete ? (
        <Modal>
          <LoaderModal textLoader="Eliminando lote" />
        </Modal>
      ) : null}
    </div>
  );
};

export default DatosLote;
