import Titulo from "../../../../common/Titulo";
import { url } from "../../../../common/URL_SERVER";
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { Validation } from "../../../../common/Validation";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const AñadirCompromisoPago = ({ closeModal, fetchData, casaId }) => {
  const [formData, setFormData] = useState({
    nombre_servicio: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = Validation(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar todos los campos
    const newErrors = {
      nombre_servicio: Validation("nombre_servicio", formData.nombre_servicio),
    };

    setErrors(newErrors);

    // Verificar si hay errores o campos vacíos
    if (
      Object.values(newErrors).some((error) => error) ||
      !formData.nombre_servicio
    ) {
      setErrors({});

      Swal.fire({
        title: "Por favor, completa todos los campos correctamente",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
      return;
    }

    setLoading(true);

    const nuevoServicio = {
      nombre_servicio: formData.nombre_servicio,
      fecha: new Date().toISOString().split("T")[0],
      id_propietario: casaId,
    };

    try {
      await axios.post(`${url}casa/compromiso`, nuevoServicio);

      Swal.fire({
        title: "Compromiso de pago añadido exitosamente",
        confirmButtonText: "Aceptar",
        icon: "success",
        confirmButtonColor: "#86C394",
      });
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error al añadir el servicio:", error);
      Swal.fire({
        title: "Error al añadir compromiso de pago",
        text: error.response?.data?.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-start w-[380px] ">
      <Titulo text="AÑADIR COMPROMISO DE PAGO" />

      <form
        onSubmit={handleSubmit}
        className="text-xl flex flex-col mx-auto space-y-3 w-full"
      >
        <div className="containerInput">
          <label className="labelInput">
            Nombre <strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.nombre_servicio || ""}
            visible={!!errors.nombre_servicio}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              placeholder="Ej: Luz, Agua, etc."
              type="text"
              name="nombre_servicio"
              className={`input border ${
                errors.nombre_servicio ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.nombre_servicio}
              onChange={handleChange}
            />
          </Tippy>
        </div>
        <div className="flex justify-end space-x-3 pt-5">
          <button
            type="button"
            className="boton_rojo"
            onClick={closeModal}
            disabled={loading}
          >
            CANCELAR
          </button>
          <button type="submit" className="boton_verde" disabled={loading}>
            {loading ? "AÑADIENDO..." : "AÑADIR"}
          </button>
        </div>
      </form>
      <p className="text-white-bg3 w-full">
        - Los campos marcados con <strong className="text-red-400">*</strong>{" "}
        son obligatorios.
      </p>
    </div>
  );
};

export default AñadirCompromisoPago;
