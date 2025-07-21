import { useRef } from "react";
import Titulo from "../../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Validation } from "../../../../../common/Validation";

const AddTransferencia = ({
  setCloseModal,
  setMetodosLista,
  metodosLista,
  setMetodoPago,
  id_cliente,
}) => {
  //? DESPAZAMIENTO CON LA FLECHA
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  
  const handleKeyDown = (e, nextRef, prevRef) => {
    if (e.key === "ArrowDown" && nextRef) {
      e.preventDefault();
      nextRef.current.focus();
    } else if (e.key === "ArrowUp" && prevRef) {
      e.preventDefault();
      prevRef.current.focus();
    }
  };

  const [transferencia, setTransferencia] = useState({
    cuenta_origen: "",
    cuenta_destino: "",
    importe: "",
    fecha: new Date().toISOString(),
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = Validation(name, value);

    // Bloquear el ingreso de "0" solo para el campo importe
    if (name === "importe" && value === "0") {
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setTransferencia(prev => ({
      ...prev,
      [name]: name === "importe" ? (value === "" ? "" : Number(value)) : value
    }));
  };

  const addTransferencia = (e) => {
    e.preventDefault();

    // Validación adicional para monto <= 0
    if (Number(transferencia.importe) <= 0) {
      setErrors({})
      return Swal.fire({
        title: "El importe debe ser mayor a cero",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    if (
      !transferencia.cuenta_destino ||
      !transferencia.importe ||
      !transferencia.cuenta_origen
    ) {
      setErrors({})
      return Swal.fire({
        title: "Complete los datos para agregar la transferencia",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setMetodosLista([
      ...metodosLista,
      {
        importe: Number(transferencia.importe),
        metodo_pago: "Transferencia",
        detalle: "Transferencia bancaria",
        metodo: "TRANSFERENCIA",
        id: metodosLista.length + 1,
        fecha: new Date().toISOString(),
        id_cliente: id_cliente,
        id_proveedor: null,
        estado: "ACEPTADO",
        tipo: "INGRESO",
        datosTransferencia: {
          importe: transferencia.importe,
          fecha: transferencia.fecha,
          cuenta_origen: transferencia.cuenta_origen,
          cuenta_destino: transferencia.cuenta_destino,
          detalle: "",
          estado: "ACEPTADA",
        },
      },
    ]);
    close();
  };

  const close = () => {
    setCloseModal(false);
    setMetodoPago("none");
  };

  return (
    <form onSubmit={addTransferencia} className="flex flex-col space-y-2 items-start">
      <Titulo text="NUEVA TRANSFERENCIA" />
      <div className="text-xl flex flex-col space-y-2">
        <div className="containerInput">
          <label className="labelInput">Cuenta origen</label>
          <Tippy
            content={errors.cuenta_origen || ""}
            visible={!!errors.cuenta_origen}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              ref={input1Ref}
              onKeyDown={(e) => handleKeyDown(e, input2Ref, null)}
              onChange={handleChange}
              type="text"
              name="cuenta_origen"
              value={transferencia.cuenta_origen}
              className={`input ${errors.cuenta_origen ? "border-red-500" : "border-gray-300"}`}
              placeholder="cuenta.ejemplo.origen"
            />
          </Tippy>
        </div>
        
        <div className="containerInput">
          <label className="labelInput">Cuenta destino</label>
          <Tippy
            content={errors.cuenta_destino || ""}
            visible={!!errors.cuenta_destino}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              ref={input2Ref}
              onKeyDown={(e) => handleKeyDown(e, input3Ref, input1Ref)}
              onChange={handleChange}
              type="text"
              name="cuenta_destino"
              value={transferencia.cuenta_destino}
              className={`input ${errors.cuenta_destino ? "border-red-500" : "border-gray-300"}`}
              placeholder="cuenta.ejemplo.destino"
            />
          </Tippy>
        </div>
        
        <div className="containerInput">
          <label className="labelInput">Importe</label>
          <Tippy
            content={errors.importe || ""}
            visible={!!errors.importe}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
              <p className="text-xl text-white-bg3">$</p>
              <input
                ref={input3Ref}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                  handleKeyDown(e, input4Ref, input2Ref);
                }}
                onChange={handleChange}
                type="number"
                name="importe"
                value={transferencia.importe}
                className={`input ${errors.importe ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ej: 1000"
              />
            </div>
          </Tippy>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button
            className="boton_rojo"
            onClick={close}
            ref={input4Ref}
            onKeyDown={(e) => handleKeyDown(e, null, input3Ref)}
          >
            CANCELAR
          </button>
          <button type="submit" className="boton_verde">
            AGREGAR
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTransferencia;