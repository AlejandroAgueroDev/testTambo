import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Titulo from "../../../../common/Titulo";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import { useState } from "react";
import Modal from "../../../../common/Modal";
import LoaderModal from "../../../../common/LoaderModal";

const TablaInsumos = ({
  title,
  arrayHeader,
  arrayContent,
  placeHolder,
  hanldeCargar,
  handleNuevo,
}) => {
  const [loader, setLoader] = useState(false);
  const tituloSingular = title === "OTROS" ? title : title.slice(0, -1);

  const deleteInsumo = (id, id_sector, nombre) => {
    const datos = { id: id, id_sector: id_sector };
    Swal.fire({
      title: `¿Quieres eliminar el insumo "${nombre}" definitivamente?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
      confirmButtonColor: "#86C394",
      denyButtonColor: "#D64747",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoader(true);
        axios
          .delete(url + `insumo?id=${id}&id_sector=${id_sector}`, datos)
          .then(() => {
            Swal.fire({
              title: `¡Insumo "${nombre}" eliminado con éxito!`,
              confirmButtonText: "Aceptar",
              icon: "success",
              confirmButtonColor: "#86C394",
            }).then(() => {
              setLoader(false);
              window.location.reload();
            });
          })
          .catch((error) => {
            setLoader(false);
            console.log(error);
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
      } else if (result.isDenied) {
        setLoader(false);
        return;
      }
    });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-full">
      <div className="w-full flex justify-between">
        <Titulo text={title} />
        <button
          className="boton_rojo hidden sm:block"
          onClick={(e) => handleNuevo(e, tituloSingular)}
        >
          AGREGAR {title}
        </button>
      </div>
      <div className="w-full scrollbar overflow-auto">
        <div className="h-full max-h-[400px] min-w-[648px]">
          <table className="border-separate text-lg w-full relative">
            <thead className="sticky top-0 bg-white-bg3 z-10">
              <tr className="bg-white-bg3 text-center">
                {arrayHeader.map((ah) => (
                  <td className="truncate px-1" key={ah}>
                    {ah}
                  </td>
                ))}
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {arrayContent.length ? (
                arrayContent.map((ac, index) => (
                  <tr
                    key={index}
                    className={`text-center ${
                      ac[1] < 2 ? "bg-[#e8b3b3]" : "bg-white-bg "
                    }`}
                  >
                    <td className="truncate px-1">{ac[0]}</td>
                    <td className="truncate px-1">{ac[1]}</td>
                    <td className="truncate px-1">{ac[2]}</td>
                    <td className="truncate px-1">{ac[3]}</td>
                    <td className="truncate px-1">$ {ac[4]}</td>
                    <td
                      onClick={() => hanldeCargar(ac[5])}
                      className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8"
                    >
                      <MdEdit className="mx-auto" />
                    </td>
                    <td
                      onClick={() => deleteInsumo(ac[5], ac[6], ac[0])}
                      className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                    >
                      <MdDelete className="mx-auto" />
                    </td>
                  </tr>
                ))
              ) : (
                <p>{placeHolder}</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={(e) => handleNuevo(e, tituloSingular)}
        className="boton_rojo sm:hidden"
      >
        AGREGAR {title}
      </button>

      {loader ? (
        <Modal>
          <LoaderModal textLoader="Eliminado insumo..." />
        </Modal>
      ) : null}
    </div>
  );
};

export default TablaInsumos;
