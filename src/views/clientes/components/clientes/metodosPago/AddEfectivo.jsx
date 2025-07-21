import { useRef } from "react";
import Titulo from "../../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";

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
  //?-------------------------------

  const [efectivo, setEfectivo] = useState("");

  const handleChangeForm = (e) => {
    const value = e.target.value;
    setEfectivo(value);
  };

  const addEfectivo = () => {
    if (!efectivo) {
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

  //? ENVIAR CON ENTER
  const handleKeyDownEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita el comportamiento predeterminado
      addEfectivo();
    }
  };

  const close = () => {
    setCloseModal(false);
    setMetodoPago("none");
  };

  return (
    <div className="flex flex-col space-y-2 items-start">
      <Titulo text="EFECTIVO" />
      <div
        className="text-xl flex flex-col space-y-2"
        onKeyDown={handleKeyDownEnter}
      >
        <div className="flex flex-col w-[400px]">
          <label className="labelInput">Importe en efectivo</label>
          <div className="flex items-center bg-white-bg2 pl-3 w-full space-x-2 grow">
            <p className="text-xl text-white-bg3">$</p>
            <input
              ref={input2Ref}
              onKeyDown={(e) => {
                if (
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "-"
                ) {
                  e.preventDefault();
                  return;
                }

                handleKeyDown(e, input3Ref, null);
              }}
              onChange={handleChangeForm}
              type="number"
              name="banco"
              placeholder="Ej: 1000"
              className="input"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button className="boton_rojo" onClick={close}>
            CANCELAR
          </button>
          <button
            onClick={addEfectivo}
            className="boton_verde"
            ref={input3Ref}
            onKeyDown={(e) => handleKeyDown(e, null, input2Ref)}
          >
            AGREGAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEfectivo;
