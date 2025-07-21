import { useState } from "react";
import Titulo from "../../../../common/Titulo";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Swal from "sweetalert2";
import { Validation } from "../../../../common/Validation";

const CompraVenta = ({ setShowModal, onConfirm }) => {
  const [tipo, setTipo] = useState("");
  const [importe, setImporte] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (name, value) => {
    const error = Validation(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (name === "tipo") setTipo(value);
    if (name === "importe") setImporte(value);
    if (name === "descripcion") setDescripcion(value);
  };

  const handleSubmit = () => {
    const newErrors = {
      tipo: Validation("tipo", tipo),
      importe: Validation("importe", importe),
      descripcion: Validation("descripcion", descripcion),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (hasErrors) {
      setErrors({});
      return Swal.fire({
        icon: "warning",
        title: "Faltan completar campos",
        text: "Revisá los datos antes de continuar.",
        confirmButtonColor: "#D64747",
      });
    }

    const valor = parseFloat(importe);
    const signo = tipo === "compra" ? -1 : 1;

    onConfirm({
      tipo,
      importe: signo * valor,
      descripcion,
    });

    setShowModal(false);
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[390px]">
      <div className="w-full flex justify-between">
        <Titulo text="COMPRA O VENTA" />
      </div>

      <div className="w-full space-y-3">
        <h2 className="text-lg font-semibold">
          Registrar:{" "}
          {tipo
            ? tipo.charAt(0).toUpperCase() + tipo.slice(1)
            : "Pendiente de selección"}
        </h2>

        {/* Movimiento */}
        <div className="containerInput">
          <label htmlFor="tipo" className="labelInput">
            Movimiento
          </label>
          <Tippy
            content={errors.tipo}
            visible={!!errors.tipo}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <select
              id="tipo"
              value={tipo}
              name="tipo"
              onChange={(e) => handleInputChange("tipo", e.target.value)}
              className={`input ${errors.tipo ? "border-red-500" : ""}`}
            >
              <option value="" disabled>
                Seleccionar Opción
              </option>
              <option value="compra">Compra</option>
              <option value="venta">Venta</option>
            </select>
          </Tippy>
        </div>

        {/* Importe */}
        <div className="containerInput">
          <label htmlFor="importe" className="labelInput">
            Importe
          </label>
          <Tippy
            content={errors.importe}
            visible={!!errors.importe}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow w-full">
              <p className="text-xl text-white-bg3">$</p>
              <input
                id="importe"
                name="importe"
                type="number"
                placeholder="Ej: 1000"
                value={importe || ""}
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
                onChange={(e) => handleInputChange("importe", e.target.value)}
                className={`input ${errors.importe ? "border-red-500" : ""}`}
              />
            </div>
          </Tippy>
        </div>

        {/* Descripción */}
        <div className="containerInput">
          <label htmlFor="descripcion" className="labelInput">
            Descripción
          </label>
          <Tippy
            content={errors.descripcion}
            visible={!!errors.descripcion}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Descripción del movimiento"
              value={descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              className={`bg-white-bg2 text-black-comun grow py-2 px-5 text-xl max-h-20 min-h-20 ${
                errors.descripcion ? "border border-red-500" : ""
              }`}
            />
          </Tippy>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <button className="boton_rojo" onClick={() => setShowModal(false)}>
            CANCELAR
          </button>
          <button onClick={handleSubmit} className="boton_verde">
            ACEPTAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompraVenta;
