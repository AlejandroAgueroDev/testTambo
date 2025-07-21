import { useState, useRef } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Titulo from "../../../common/Titulo";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";

const EditarEmpleado = ({ setShowModal, empleado, token, fetchEmpleados }) => {
  const [loader, setLoader] = useState(false);
  const [tempEmpleado, setTempEmpleado] = useState(empleado);

  //? DESPLAZAMIENTO CON LA FLECHA
  const inputRefs = Array.from({ length: 9 }, () => useRef(null));

  // Función para manejar el desplazamiento con las flechas
  const handleKeyDown = (e, nextRef, prevRef) => {
    if (e.key === "ArrowDown" && nextRef) {
      e.preventDefault();
      nextRef.current.focus();
    } else if (e.key === "ArrowUp" && prevRef) {
      e.preventDefault();
      prevRef.current.focus();
    }
  };

  // Función para manejar el envío con "Enter"
  const handleKeyDownEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleFormEdit();
    }
  };

  // Función para manejar el cambio en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempEmpleado({
      ...tempEmpleado,
      [name]: value,
    });
  };

  const handleFormEdit = async () => {
    if (!tempEmpleado.nombre || !tempEmpleado.saldo || !tempEmpleado.dni) {
      return Swal.fire({
        title:
          "Debe completar los campos necesarios para actualizar el empleado",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setLoader(true);
    //?PUT de empleados
    try {
      const { password, ...datosEnvio } = tempEmpleado;

      axios.put(
        `${url}empleado`,
        { ...datosEnvio, id: empleado.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoader(false);

      const result = await Swal.fire({
        title: "¡Datos del empleado actualizados correctamente!",
        confirmButtonText: "Aceptar",
        icon: "success",
        iconColor: "#86C394",
        confirmButtonColor: "#86C394",
      });

      if (result.isConfirmed) {
        setShowModal(false);
        fetchEmpleados();
      }
    } catch (error) {
      setLoader(false);
      console.error("Error al editar empleado:", error);
      console.error("Detalles del error:", error.response?.data);
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
    <div>
      <div className="w-full flex justify-between">
        <Titulo text={`EDITAR EMPLEADO | ${empleado.nombre}`} />
      </div>
      <div className="flex flex-col space-y-2 items-start scrollbar overflow-auto w-[350px] sm:w-[500px] sm:overflow-visible">
        <div className="w-full space-y-3" onKeyDown={handleKeyDownEnter}>
          <div className="containerInput">
            <label className="labelInput">Nombre:</label>
            <input
              ref={inputRefs[0]}
              type="text"
              name="nombre"
              value={tempEmpleado.nombre}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, inputRefs[1], null)}
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl grow"
            />
          </div>
          <div className="containerInput">
            <label className="labelInput">Contacto</label>
            <input
              ref={inputRefs[3]}
              type="text"
              name="contacto"
              value={tempEmpleado.contacto}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, inputRefs[4], inputRefs[2])}
              className="input"
            />
          </div>
          <div className="containerInput">
            <label className="labelInput">DNI:</label>
            <input
              ref={inputRefs[5]}
              type="text"
              name="dni"
              value={tempEmpleado.dni}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, inputRefs[6], inputRefs[4])}
              className="input"
            />
          </div>
          <div className="containerInput">
            <label className="labelInput">Saldo:</label>
            <input
              ref={inputRefs[5]}
              type="number"
              name="saldo"
              value={tempEmpleado.saldo}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, inputRefs[6], inputRefs[4])}
              className="input"
            />
          </div>
          <div className="containerInput">
            <label className="labelInput">Cuit/Cuil:</label>
            <input
              ref={inputRefs[6]}
              type="text"
              name="cuit_cuil"
              value={tempEmpleado.cuit_cuil}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, inputRefs[7], inputRefs[5])}
              className="input"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end space-x-3">
        <button onClick={() => setShowModal(false)} className="boton_rojo">
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
  );
};

export default EditarEmpleado;
