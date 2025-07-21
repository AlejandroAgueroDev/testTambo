import { useState } from "react";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import Swal from "sweetalert2";
import Titulo from "../../../common/Titulo";
import { BiLoaderAlt } from "react-icons/bi";

const EditarPropietario = ({ selectedCasa, closeModal, fetchCasas }) => {
  const [loader, setLoader] = useState(false);
  const [tempCasa, settempCasa] = useState({
    id: selectedCasa?.id || "", 
    nombre: selectedCasa?.nombre || "",
    localidad: selectedCasa?.localidad || "",
    contacto_1: selectedCasa?.contacto_1 || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    settempCasa({ ...tempCasa, [name]: value });
  };

  const handleFormEdit = async () => {
    const { nombre, localidad, contacto_1, id } = tempCasa;

    if (!nombre || !localidad || !contacto_1) {
      return Swal.fire({
        title: "Debe completar los campos necesarios para actualizar el propietario",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setLoader(true);

    try {
      const { data } = await axios.put(`${url}casa/propietario`, {
        id,
        nombre,
        localidad,
        contacto_1,
      });
      
      setLoader(false);

      const result = await Swal.fire({
        title: "¡Datos del propietario actualizados correctamente!",
        confirmButtonText: "Aceptar",
        icon: "success",
        iconColor: "#86C394",
        confirmButtonColor: "#86C394",
      });

      if (result.isConfirmed) {
        closeModal();
        fetchCasas();
      }

    } catch (error) {
      setLoader(false);
      console.error("Error al editar propietario:", error);
      
      Swal.fire({
        title: "Ocurrió un error inesperado, intente nuevamente",
        text:
          error.message === "Network Error"
            ? "Contacte con el servicio técnico"
            : error.response?.data?.message,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[500px]">
      <div className="w-full flex justify-between">
        <Titulo text="EDITAR PROPIETARIO" />
      </div>

      <div className="w-full space-y-3">
        <div className="containerInput">
          <label className="labelInput">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={tempCasa.nombre}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="containerInput">
          <label className="labelInput">Localidad</label>
          <input
            type="text"
            name="localidad"
            value={tempCasa.localidad}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="containerInput">
          <label className="labelInput">Teléfono</label>
          <input
            type="text"
            name="contacto_1"
            value={tempCasa.contacto_1}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" className="boton_rojo" onClick={closeModal}>
            CANCELAR
          </button>
          <button onClick={handleFormEdit} className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "MODIFICAR"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarPropietario;
