import { useState, useEffect } from "react";
import Titulo from "../../../../common/Titulo";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Validation } from "../../../../common/Validation";

const Remito = ({ onCancel, onSubmit, venta }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [remito, setRemito] = useState({
    razonSocial: "",
    cuit: "",
    monto: "",
  });

  useEffect(() => {
    if (venta?.monto) {
      setRemito((prev) => ({ ...prev, monto: venta.monto }));
    }
  }, [venta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = Validation(name, value);

    if (name === "monto" && value === "0") {
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setRemito({ ...remito, [name]: value });
  };
  const handleSubmit = async () => {
    const { razonSocial, cuit, monto } = remito;

    const hasErrors = Object.values(errors).some((e) => e);
    if (hasErrors) {
      setErrors({})
      return Swal.fire({
        title: "Solucionar errores antes de continuar.",
        text: "Por favor corregí los errores antes de continuar.",
        icon: "warning",
        confirmButtonColor: "#D64747",
      });
    }

    if (!razonSocial || !cuit || !monto) {
      return Swal.fire({
        title: "Datos incompletos",
        text: "Por favor complete todos los campos requeridos",
        icon: "warning",
        confirmButtonColor: "#D64747",
      });
    }

    try {
      setLoading(true);

      const ventaConRemito = {
        ...venta,
        model: "REMITO",
        datosFacturacion: {
          razon_social: razonSocial,
          cuit,
          monto,
          numero: `R-${Date.now()}`,
        },
      };

      await axios.post(`${url}fabrica/ventaproducto`, ventaConRemito);

      Swal.fire({
        title: "\u00a1Remito generado!",
        text: "La venta fue registrada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#86C394",
      });

      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Error en el proceso:", error);
      setErrors({})
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
        <Titulo text="GENERAR REMITO" />
      </div>
      <div className="w-full max-h-[60dvh] sm:max-h-[70dvh] overflow-y-auto overflow-x-hidden space-y-3 scrollbar sm:h-full">
        <div className="w-full space-y-3">
          <div className="containerInput">
            <label className="labelInput">
              Razón Social <strong className="text-red-400">*</strong>
            </label>
            <Tippy
              content={errors.razonSocial || ""}
              visible={!!errors.razonSocial}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <input
                type="text"
                value={remito.razonSocial}
                name="razonSocial"
                onChange={handleChange}
                placeholder="Ej: Nombre de la empresa"
                className={`input ${
                  errors.razonSocial ? "border-red-500" : "border-gray-300"
                }`}
              />
            </Tippy>
          </div>

          <div className="containerInput">
            <label className="labelInput">
              CUIT <strong className="text-red-400">*</strong>
            </label>
            <Tippy
              content={errors.cuit || ""}
              visible={!!errors.cuit}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <input
                type="number"
                value={remito.cuit}
                name="cuit"
                onChange={handleChange}
                placeholder="Ej: 20-12345678-9"
                className={`input ${
                  errors.cuit ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={11}
              />
            </Tippy>
          </div>

          <div className="containerInput">
            <label className="labelInput">
              Monto <strong className="text-red-400">*</strong>
            </label>
            <Tippy
              content={errors.monto || ""}
              visible={!!errors.monto}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <input
                type="number"
                value={remito.monto}
                disabled
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "+" ||
                    e.key === "-"
                  ) {
                    e.preventDefault();
                  }
                }}
                placeholder="Ej: 1000"
                className={`input ${
                  errors.monto ? "border-red-500" : "border-gray-300"
                }`}
              />
            </Tippy>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="boton_rojo"
            disabled={loading}
          >
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
    </div>
  );
};

export default Remito;
