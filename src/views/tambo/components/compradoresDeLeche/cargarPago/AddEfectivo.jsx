import { useRef } from "react";
import Titulo from "../../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { Validation } from "../../../../../common/Validation";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const AddEfectivo = ({
  setCloseModal,
  setMetodosLista,
  metodosLista,
  setMetodoPago,
  id_cliente,
}) => {
  //? DESPAZAMIENTO CON LA FLECHA
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const handleKeyDown = (e, nextRef, prevRef) => {
    if (e.key === "ArrowDown" && nextRef) {
      e.preventDefault();
      nextRef.current.focus();
    } else if (e.key === "ArrowUp" && prevRef) {
      e.preventDefault();
      prevRef.current.focus();
    }
  };

  const [efectivo, setEfectivo] = useState("");
  const [errors, setErrors] = useState({});

  const handleChangeForm = (e) => {
    const { value, name } = e.target;
    const errorMsg = Validation(name, value);

    // Bloquear el ingreso de "0"
    if (value === "0") {
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setEfectivo(value);
  };

  const addEfectivo = (e) => {
    e.preventDefault();

    // Validación adicional para monto <= 0
    if (Number(efectivo) <= 0) {
      return Swal.fire({
        title: "El importe debe ser mayor a cero",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    if (!efectivo || errors.efectivo) {
      return Swal.fire({
        title: "Competa los datos para agregar el efectivo",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setMetodosLista([
      ...metodosLista,
      {
        importe: Number(efectivo),
        detalle: "Pago en efectivo",
        id_cliente: id_cliente,
        id_proveedor: null,
        estado: "ACEPTADO",
        tipo: "INGRESO",
        metodo_pago: "Efectivo",
        metodo: "EFECTIVO",
        id: metodosLista.length + 1,
      },
    ]);
    close();
  };

  const close = () => {
    setCloseModal(false);
    setMetodoPago("none");
  };

  return (
    <form
      onSubmit={addEfectivo}
      className="flex flex-col space-y-2 items-start"
    >
      <Titulo text="EFECTIVO" />
      <div className="text-xl flex flex-col space-y-2">
        <div className="containerInput">
          <label className="labelInput">Importe en efectivo</label>
          <Tippy
            content={errors.efectivo || ""}
            visible={!!errors.efectivo}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
              <p className="text-xl text-white-bg3">$</p>
              <input
                ref={input2Ref}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                  handleKeyDown(e, input3Ref, null);
                }}
                onChange={handleChangeForm}
                type="number"
                name="efectivo"
                value={efectivo}
                className={`input ${
                  errors.efectivo ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: 1000"
              />
            </div>
          </Tippy>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button className="boton_rojo" onClick={close}>
            CANCELAR
          </button>
          <button
            type="submit"
            className="boton_verde"
            ref={input3Ref}
            onKeyDown={(e) => handleKeyDown(e, null, input2Ref)}
          >
            AGREGAR
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddEfectivo;
