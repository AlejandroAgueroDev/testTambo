import { useEffect, useRef } from "react";
import Titulo from "../../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../../common/obtenerFecha";

const AddTransferencia = ({
  setCloseModal,
  setMetodosLista,
  metodosLista,
  setMetodoPago,
  id_cliente,
  cuentas,
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
  //?-------------------------------

  const [transferencia, setTransferencia] = useState({
    id_origen: null,
    id_destino: "",
    nombre_origen: "",
    nombre_destino: "",
    importe: 0,
    tipo: "CREDITO",
    fecha: new Date().toISOString(),
  });

  useEffect(() => {}, [transferencia]);

  const handleimporte = (e) => {
    const { name, value } = e.target;

    if (name === "id_destino") {
      setTransferencia({
        ...transferencia,
        id_destino: value,
        nombre_destino: e.target.options[e.target.selectedIndex].text,
      });
    } else {
      setTransferencia({ ...transferencia, [name]: value });
    }
  };

  const addTransferencia = () => {
    if (
      !transferencia.id_destino ||
      !transferencia.importe ||
      !transferencia.nombre_origen
    ) {
      return Swal.fire({
        title: "Competa los datos para agregar la transferencia",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setMetodosLista([
      ...metodosLista,
      {
        importe: transferencia.importe,
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
          ...transferencia,
          detalle: "",
          estado: "ACEPTADA",
        },
      },
    ]);
    close();
  };

  //? ENVIAR CON ENTER
  const handleKeyDownEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita el comportamiento predeterminado
      addTransferencia();
    }
  };

  const close = () => {
    setCloseModal(false);
    setMetodoPago("none");
  };

  return (
    <div className="flex flex-col space-y-2 items-start">
      <Titulo text="NUEVA TRANSFERENCIA" />
      <div
        className="text-xl flex flex-col space-y-2"
        onKeyDown={handleKeyDownEnter}
      >
        <div className="flex flex-col w-[400px]">
          <label className="labelInput">Cuenta origen</label>
          <input
            ref={input1Ref}
            onKeyDown={(e) => handleKeyDown(e, input2Ref, null)}
            onChange={handleimporte}
            type="text"
            name="nombre_origen"
            placeholder="Ej: test.ejemplo"
            className="bg-white-bg2 text-black py-2 px-5"
          />
        </div>
        <div className="flex flex-col w-[400px]">
          <label className="labelInput">Cuenta destino</label>
          <select onChange={handleimporte} name="id_destino" className="input">
            <option selected disabled>
              Seleccionar cuenta
            </option>
            {cuentas.map((cuenta) => (
              <option key={cuenta.id} value={`${cuenta.id}`}>
                {cuenta.nombre_cuenta}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-[400px]">
          <label className="labelInput">Importe</label>
          <div className="flex items-center bg-white-bg2 pl-3 w-full space-x-2 grow">
            <p className="text-xl text-white-bg3">$</p>
          <input
            ref={input3Ref}
            onKeyDown={(e) => handleKeyDown(e, input4Ref, input2Ref)}
            onChange={handleimporte}
            type="number"
            name="importe"
            placeholder="Ej: 1000"
            className="input"
          />
          </div>
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
          <button onClick={addTransferencia} className="boton_verde">
            AGREGAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransferencia;
