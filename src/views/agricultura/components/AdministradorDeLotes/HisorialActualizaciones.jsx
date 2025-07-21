import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";
import { MdDelete } from "react-icons/md";
import LoaderDatos from "../../../../common/LoaderDatos";
import LoaderModal from "../../../../common/LoaderModal";

const HistorialActualizaciones = ({ data, getData, loader }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteAct = (id) => {
    Swal.fire({
      title: "¿Confirmar eliminación?",
      text: "Al eliminar esta actualización, el estado del lote volverá al anterior",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#D64747",
      cancelButtonColor: "#A3A3A3",
      iconColor: "#D64747",
    }).then((res) => {
      if (res.isConfirmed) {
        setDeletingId(id);
        axios
          .delete(url + "agricultura/estado/" + id)
          .then(() => {
            Swal.fire({
              title: "¡Actualización eliminada!",
              text: "El estado se ha revertido a la versión anterior",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#86C394",
              icon: "success",
              iconColor: "#86C394",
            }).then(() => {
              getData();
              setDeletingId(null);
            });
          })
          .catch((error) => {
            setDeletingId(null);
            Swal.fire({
              title: "Error al eliminar",
              text:
                error.response?.data?.message || "Intente nuevamente más tarde",
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
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 p-2 bg-white-bg2 h-full scrollbar lg:overflow-auto">
      <div className="flex flex-col w-full space-y-2">
        <div className="flex">
          <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
            HISTORIAL DE ESTADOS
          </h2>
        </div>

        {loader ? (
          <LoaderDatos textLoader="Cargando estados" />
        ) : data.EstadoSiembras && data.EstadoSiembras.length ? (
          data.EstadoSiembras.map((estado, index) => (
            <div
              key={estado.id}
              className={`${
                index === 0 ? "bg-[#dabdbd]" : "bg-white-bg"
              } p-2 hover:bg-[#c9d3cc]`}
            >
              <div className="flex w-full justify-between items-center">
                <p className="font-bold">{estado.estado}</p>
                <button
                  onClick={() => handleDeleteAct(estado.id)}
                  className="bg-button-red hover:bg-button-red_hover p-1 text-xl text-white-bg2 rounded"
                  disabled={deletingId === estado.id}
                >
                  {deletingId === estado.id ? (
                    <LoaderModal textLoader="" size="small" />
                  ) : (
                    <MdDelete />
                  )}
                </button>
              </div>
              <p className="w-full max-h-32 scrollbar overflow-auto py-1">
                {estado.detalle}
              </p>
              <p className="text-white-bg3 text-sm">{estado.fechaFormat}</p>
            </div>
          ))
        ) : (
          <p className="text-xl text-white-bg3 p-4 text-center">
            Sin estados registrados
          </p>
        )}
      </div>
    </div>
  );
};

export default HistorialActualizaciones;
