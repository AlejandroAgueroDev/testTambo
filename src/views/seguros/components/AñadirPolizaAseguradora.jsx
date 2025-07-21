import { BiLoaderAlt } from "react-icons/bi";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//?COMPONENTS
import Titulo from "../../../common/Titulo";
import { url } from "../../../common/URL_SERVER";
import { Validation } from "../../../common/Validation";

const AñadirPolizaAseguradora = ({ closeModal, fetchSeguros }) => {
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [formPoliza, setFormPoliza] = useState({
    nombre: "",
    seccion: "",
    desde: "",
    hasta: "",
    importe: "",
    numero_poliza:"",
    estado: "VIGENTE",
    cantidad_cuotas: "",
    factura_base64: "",
    afectados: "",
  });

  const handleCancel = () => {
    setFormPoliza({
      nombre: "",
      seccion: "",
      desde: "",
      hasta: "",
      importe: "",
      numero_poliza:"",
      estado: "VIGENTE",
      cantidad_cuotas: "",
      factura_base64: "",
      afectados: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if ((["importe", "cantidad_cuotas"].includes(name)) && value === "0") {
      return;
    }

    const errorMsg = Validation(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    setFormPoliza((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const base64String = reader.result.split(",")[1];
          setFormPoliza((prev) => ({ ...prev, factura_base64: base64String }));
        } catch (error) {
          console.error("Error procesando imagen:", error);
        }
      };
      reader.onerror = (error) => {
        console.error("Error leyendo archivo:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const camposRequeridos = [
      "nombre",
      "seccion",
      "desde",
      "hasta",
      "numero_poliza",
      "importe",
      "estado",
      "cantidad_cuotas",
      "afectados",
    ];
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !formPoliza[campo]
    );

    if (camposFaltantes.length > 0) {
      Swal.fire({
        title: "Debe completar todos los campos.",
        text: `Complete: ${camposFaltantes.join(", ")}`,
        icon: "warning",
        confirmButtonColor: "#D64747",
      });
      return;
    }

    try {
      setLoader(true);
      const importeNum = parseFloat(formPoliza.importe);
      const cuotasNum = parseInt(formPoliza.cantidad_cuotas);

      if (isNaN(importeNum) || isNaN(cuotasNum)) {
        throw new Error("Valores numéricos inválidos");
      }

      const payload = {
        nombre: formPoliza.nombre.trim(),
        seccion: formPoliza.seccion.trim(),
        numero_poliza: formPoliza.numero_poliza.trim(),
        desde: formPoliza.desde,
        hasta: formPoliza.hasta,
        importe: importeNum,
        estado: formPoliza.estado,
        cantidad_cuotas: cuotasNum,
        factura_base64: formPoliza.factura_base64 || null,
        afectados: formPoliza.afectados.trim(),
      };

      const { data } = await axios.post(`${url}poliza`, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await Swal.fire({
        title: "¡Éxito!",
        text: "Póliza creada correctamente",
        icon: "success",
        confirmButtonColor: "#86C394",
      });

      if (result.isConfirmed) {
        await fetchSeguros();
        handleCancel();
        closeModal();
      }
    } catch (error) {
      console.error("Error en el envío:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.error ||
          error.message ||
          "Error al procesar la solicitud",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[350px] sm:w-[680px]">
      <div className="w-full flex justify-between">
        <Titulo text="AÑADIR NUEVA POLIZA" />
      </div>
      <div className="w-full max-h-[70dvh] overflow-y-auto overflow-x-hidden space-y-3 scrollbar sm:h-full">
        <div className="containerInput">
          <label htmlFor="nombre" className="labelInput">
            Nombre de Aseguradora<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.nombre || ""}
            visible={!!errors.nombre}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ej: La Patronal"
              className={`input ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
              value={formPoliza.nombre}
              onChange={handleChange}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label htmlFor="numeroPoliza" className="labelInput">
            Número de poliza
          </label>
         
            <input
              id="numeroPoliza"
              name="numero_poliza"
              type="number"
              placeholder="Ej: 34452123"
              className="input"
              value={formPoliza.numero_poliza}
              onChange={handleChange}
            />
        </div>

        <div className="containerInput">
          <label htmlFor="importe" className="labelInput">
            Importe de la poliza<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.importe || ""}
            visible={!!errors.importe}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              id="importe"
              name="importe"
              type="text"
              placeholder="Ej: 1000"
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
              className={`input ${
                errors.importe ? "border-red-500" : "border-gray-300"
              }`}
              value={formPoliza.importe}
              onChange={handleChange}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label htmlFor="cantidad_cuotas" className="labelInput">
            Cantidad de cuotas para la poliza
            <strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.cantidad_cuotas || ""}
            visible={!!errors.cantidad_cuotas}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              id="cantidad_cuotas"
              name="cantidad_cuotas"
              type="text"
              placeholder="Ej: 6"
              className={`input ${
                errors.cantidad_cuotas ? "border-red-500" : "border-gray-300"
              }`}
              value={formPoliza.cantidad_cuotas}
              onChange={handleChange}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label htmlFor="seccion" className="labelInput">
            Sección<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.seccion || ""}
            visible={!!errors.seccion}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              id="seccion"
              name="seccion"
              type="text"
              placeholder="Ej: Accidentes Personales"
              className="input"
              value={formPoliza.seccion}
              onChange={handleChange}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label htmlFor="desde" className="labelInput">
            Vigencia Desde<strong className="text-red-400">*</strong>
          </label>
          <input
            id="desde"
            name="desde"
            type="date"
            className="input"
            value={formPoliza.desde}
            onChange={handleChange}
          />
        </div>

        <div className="containerInput">
          <label htmlFor="hasta" className="labelInput">
            Vigencia Hasta<strong className="text-red-400">*</strong>
          </label>
          <input
            id="hasta"
            name="hasta"
            type="date"
            className="input"
            value={formPoliza.hasta}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="afectados" className="labelInput">
            Afectados por la Poliza<strong className="text-red-400">*</strong>
          </label>

          <textarea
            id="afectados"
            name="afectados"
            placeholder="Por favor ingrese las personas o maquinas afectadas por la poliza."
            className="input resize-none"
            rows={2}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="factura_base64" className="labelInput">
            Subir Foto de Poliza<strong className="text-red-400">*</strong>
          </label>

          <input
            id="factura_base64"
            name="factura_base64"
            type="file"
            className="input"
            onChange={handleSelectFile}
          />
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={closeModal} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={handleSubmit} className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "AÑADIR POLIZA"
            )}
          </button>
        </div>
      </div>
      <p className="text-white-bg3 w-full">
        - Los campos marcados con <strong className="text-red-400">*</strong>{" "}
        son <strong className="text-black-comun underline">obligatorios</strong>{" "}
        para cargar la nueva poliza.
      </p>
    </div>
  );
};

export default AñadirPolizaAseguradora;
