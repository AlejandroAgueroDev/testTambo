import { useState } from "react";
import Titulo from "../../../../common/Titulo";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Validation } from "../../../../common/Validation";

const Factura = ({ onCancel, onSubmit, venta }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [factura, setFactura] = useState({
    tipo: "",
    condicionIVA: "",
    numero: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = Validation(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setFactura({ ...factura, [name]: value });
  };

  const handleSubmit = async () => {
    const { tipo, condicionIVA, numero } = factura;

    // Validar todos los campos manualmente
    const newErrors = {
      numero: Validation("numero", numero),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (hasErrors) {
      setErrors({});
      return Swal.fire({
        title: "Solucionar errores antes de continuar.",
        text: "Por favor corregí los errores antes de continuar",
        icon: "warning",
        confirmButtonColor: "#D64747",
      });
    }

    // Verificación redundante pero útil si algún campo está vacío
    if (!numero || !tipo || !condicionIVA) {
      setErrors({});
      return Swal.fire({
        title: "Datos incompletos",
        text: "Por favor complete todos los campos requeridos",
        icon: "warning",
        confirmButtonColor: "#D64747",
      });
    }

    try {
      setLoading(true);

      const ventaConFactura = {
        ...venta,
        model: "FACTURA",
        datosFacturacion: {
          numero,
          tipo,
          condicionIVA,
        },
      };

      await axios.post(`${url}fabrica/ventaproducto`, ventaConFactura);

      Swal.fire({
        title: "¡Factura generada!",
        text: "La venta fue registrada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#86C394",
      });

      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Error al registrar la factura:", error);
      Swal.fire({
        title: "Error al registrar la venta",
        text: error?.response?.data?.error || error.message,
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[350px] sm:w-[450px]">
      <div className="w-full flex justify-between">
        <Titulo text="GENERAR FACTURA" />
      </div>

      <div className="w-full space-y-3 max-h-[60dvh] overflow-y-auto">
        <div className="containerInput">
          <label className="labelInput">
            N° de Factura <strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.numero || ""}
            visible={!!errors.numero}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              type="number"
              placeholder="Ej: 00000123"
              value={factura.numero}
              name="numero"
              onChange={handleChange}
              className={`input ${
                errors.numero ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">
            Tipo de Factura <strong className="text-red-400">*</strong>
          </label>
          <select
            value={factura.tipo}
            name="tipo"
            onChange={handleChange}
            className="input"
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        <div className="containerInput">
          <label className="labelInput">
            Condición frente al IVA <strong className="text-red-400">*</strong>
          </label>
          <select
            value={factura.condicionIVA}
            name="condicionIVA"
            onChange={handleChange}
            className="input"
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value="Responsable Inscripto">Responsable Inscripto</option>
            <option value="Monotributista">Monotributista</option>
            <option value="Exento">Exento</option>
            <option value="Consumidor Final">Consumidor Final</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 w-full">
        <button onClick={onCancel} className="boton_rojo" disabled={loading}>
          CANCELAR
        </button>
        <button
          onClick={handleSubmit}
          className="boton_verde"
          disabled={loading}
        >
          {loading ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "CONFIRMAR"
          )}
        </button>
      </div>
    </div>
  );
};

export default Factura;
