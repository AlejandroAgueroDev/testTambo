import { useState, useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//?COMPONENTS
import { Validation } from "../../../../common/Validation";
import Titulo from "../../../../common/Titulo";
import { url } from "../../../../common/URL_SERVER";

const EditarServicio = ({ pago, closeModal, servicioEventual, fetchData }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const primerMes = pago.MesesCompromisos?.[0] || {};

  const [formEdit, setFormEdit] = useState({
    nombre_servicio: pago.nombre_servicio || "",
       });

  useEffect(() => {
    const primerMes = pago.MesesCompromisos?.[0] || {};
    setFormEdit({
      nombre_servicio: pago.nombre_servicio || "",
      
    });
  }, [pago]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const errorMsg = Validation(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setFormEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormEdit = async () => {
    const hasEmptyFields = Object.values(formEdit).some(
      (value) => String(value).trim() === ""
    );

    if (hasEmptyFields) {
      setErrors({});

      return Swal.fire({
        title: "No puedes dejar campos vacios",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setLoading(true);
    const servicioData = {
      nombre: formEdit.nombre_servicio,
      cuotas: servicioEventual ? Number(cuotas) : null,
      eventual: servicioEventual,
      id: pago.id,
    };

    try {
      await axios.put(`${url}casa/compromiso`, servicioData);
      setLoading(false);

      const result = await Swal.fire({
        title: "¡Datos del pago actualizados correctamente!",
        confirmButtonText: "Aceptar",
        icon: "success",
        iconColor: "#86C394",
        confirmButtonColor: "#86C394",
      });

      if (result.isConfirmed) {
        fetchData()
        closeModal(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al editar el pago:", error);
      console.error("Detalles del error:", error.response?.data);
      Swal.fire({
        title: "Ocurrió un error inesperado, intente nuevamente",
        text:
          error.message === "Network Error"
            ? "Contacte con el pago técnico"
            : error.response?.data?.message,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-2 items-start w-full font-NS">
        <Titulo
          text={
            servicioEventual ? "EDITAR SERVICIO EVENTUAL" : "EDITAR SERVICIO"
          }
        />
      </div>

      <div className="flex flex-col space-y-4 scrollbar overflow-y-auto max-h-[70dvh]">
        <div className="flex items-center space-x-4">
          <label className="text-xl font-semibold text-white-bg3">
            Descripcion del Servicio
          </label>
          <Tippy
            content={errors.nombre_servicio || ""}
            visible={!!errors.nombre_servicio}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              type="text"
              name="nombre_servicio"
              value={formEdit.nombre_servicio}
              onChange={handleChange}
              className={`input ${
                errors.nombre_servicio ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>
        
        <div className="flex justify-end space-x-3 mt-4">
          <button onClick={closeModal} className="boton_rojo">
            CANCELAR
          </button>
          <button
            type="button"
            className="boton_verde"
            onClick={handleFormEdit}
          >
            {loading ? (
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

export default EditarServicio;
