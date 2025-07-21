import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const EditarTernera = ({ setCloseModal, data, fetchData }) => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState(data);

  const handleForm = (e) => {
    const { name, value } = e.target;

    if (name !== "detalles") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCarga = () => {
    if (!formData.caravana || !formData.tipo || !formData.estado) {
      return Swal.fire({
        title:
          "Complete los campos necesarios para actualizar los datos del animal",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    setLoader(true);

    axios
      .put(url + "tambo/ganado", formData)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "¡Animal actualizado con exito!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => {
          window.location.reload(); 
        });
      })
      .catch((error) => {
        setLoader(false);
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
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[500px]">
      <div className="w-full flex justify-between">
        <Titulo text={`EDICION DE DATOS`} />
      </div>

      <div className="w-full space-y-3">
        <div className="flex space-x-3 items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Caravana
          </label>
          <input
            placeholder="XXXX"
            type="text"
            onChange={handleForm}
            name="caravana"
            value={formData.caravana}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          />
        </div>

        <div className="flex flex-col space-y-1 items-start w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Observaciones
          </label>
          <textarea
            onChange={handleForm}
            placeholder="Observaciones sobre el animal"
            type="text"
            value={formData.detalles}
            name="detalles"
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl max-h-20 min-h-20 w-full"
          />
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={() => setCloseModal(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={handleCarga} className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "EDITAR"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarTernera;