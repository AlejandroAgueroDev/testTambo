import { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import axios from "axios";
import Swal from "sweetalert2";
//?COMPONENTS
import { url } from "../../../../common/URL_SERVER";
import Titulo from "../../../../common/Titulo";
import { Validation } from "../../../../common/Validation";

const AñadirGastoIngreso = ({ onClose, onAñadir, sectores, fetchData }) => {
  const [gastoIngreso, setGastoIngreso] = useState({
    tipo: "",
    fecha: "",
    detalle: "",
    monto: "",
    id_sector: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const errorMsg = Validation(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setGastoIngreso((prev) => ({
      ...prev,
      [name]: name === "monto" ? Number(value) : value,
    }));
  };

  const handleAñadir = async () => {
    const nuevoRegistro = {
      detalle: gastoIngreso.detalle,
      estado: "ACEPTADO",
      tipo: gastoIngreso.tipo === "ingreso" ? "INGRESO" : "EGRESO",
      fecha: gastoIngreso.fecha,
      id_sector: gastoIngreso.id_sector,
      metodosPago: [
        {
          metodo: "EFECTIVO",
          monto: gastoIngreso.monto,
        },
      ],
    };

    if (nuevoRegistro.monto <= 0) {
      setErrors({});
      Swal.fire({
        title: "El importe debe ser mayor a cero",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
      return;
    }
    const monto = gastoIngreso.monto;
    const camposVacios =
      !nuevoRegistro.tipo ||
      !nuevoRegistro.fecha ||
      !nuevoRegistro.detalle ||
      isNaN(monto) ||
      monto === "";

    if (camposVacios) {
      setErrors({});
      Swal.fire({
        title: "No puedes dejar campos vacíos",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${url}gasto-ingreso`, nuevoRegistro);

      Swal.fire({
        icon: "success",
        title: "Registro guardado",
        text: "El gasto o ingreso fue añadido correctamente.",
        confirmButtonText: "Aceptar",
        icon: "success",
        confirmButtonColor: "#86C394",
      });

      if (onAñadir) onAñadir(response.data);

      // Resetear formulario
      setGastoIngreso({
        tipo: "",
        fecha: "",
        monto: "",
        detalle: "",
        id_sector: "",
      });

      setErrors({});
      fetchData();
      onClose();
    } catch (error) {
      console.error("Error al añadir gasto o ingreso:", error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: error.data?.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-full">
      <div className="w-full flex justify-between">
        <Titulo text="AÑADIR GASTO O INGRESO" />
      </div>
      <div className="w-full space-y-3">
        <div className="containerInput">
          <label className="labelInput">Tipo</label>
          <select
            name="tipo"
            value={gastoIngreso.tipo}
            onChange={handleChange}
            className="input"
          >
            <option value="" disabled>
              Seleccionar TIPO
            </option>
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>
        <div className="containerInput">
          <label className="labelInput">Sector para el gasto o ingreso</label>
          <select
            name="id_sector"
            value={gastoIngreso.id_sector}
            onChange={handleChange}
            className="input"
          >
            <option value="" disabled>
              Seleccionar SECTOR
            </option>
            {sectores.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="containerInput">
          <label className="labelInput">Fecha</label>
          <input
            name="fecha"
            type="date"
            value={gastoIngreso.fecha}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="containerInput">
          <label className="labelInput">Detalle</label>
          <input
            name="detalle"
            placeholder="Detalle del gasto o ingreso."
            type="text"
            value={gastoIngreso.detalle || ""}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Importe</label>
          <Tippy
            content={errors.monto || ""}
            visible={!!errors.monto}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              name="monto"
              type="number"
              value={gastoIngreso.monto || ""}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
              onChange={handleChange}
              className={`input ${
                errors.monto ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: 1000"
            />
          </Tippy>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button onClick={onClose} className="boton_rojo" disabled={loading}>
            CANCELAR
          </button>
          <button
            onClick={handleAñadir}
            className="boton_verde"
            disabled={loading}
          >
            {loading ? "GUARDANDO..." : "AÑADIR"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AñadirGastoIngreso;
