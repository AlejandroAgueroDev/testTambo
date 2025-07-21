import { useRef } from "react";
import Titulo from "../../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../../common/obtenerFecha";

const AddChequeIngreso = ({
  setCloseModal,
  setMetodosLista,
  metodosLista,
  setMetodoPago,
  id_cliente,
  cliente_nombre,
}) => {
  //? DESPAZAMIENTO CON LA FLECHA
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input7Ref = useRef(null);

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

  const [chequeData, setChequeData] = useState({
    banco: "",
    numero_cheque: 0,
    fecha_emision: "",
    fecha_pago: "",
    importe: 0,
  });

  const handleChangeForm = (e) => {
    const { name, value } = e.target;

    if (name === "fecha_emision" || name === "fecha_pago") {
      if (!value) return; // Evita setear una fecha vacía
      return setChequeData({ ...chequeData, [name]: value }); // Guarda en formato YYYY-MM-DD
    }

    setChequeData({ ...chequeData, [name]: value });
  };

  const addCheque = () => {
    if (
      !chequeData.banco ||
      !chequeData.numero_cheque ||
      !chequeData.fecha_emision ||
      !chequeData.importe ||
      !chequeData.fecha_pago
    ) {
      return Swal.fire({
        title: "Competa los datos para agregar nuevo cheque",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setMetodosLista([
      ...metodosLista,
      {
        importe: chequeData.importe,
        metodo_pago: "Cheque",
        detalle: `Cheque N° ${chequeData.numero_cheque}`,
        metodo: "CHEQUE",
        id: metodosLista.length + 1,
        fecha: new Date().toISOString(),
        id_cliente: id_cliente,
        id_proveedor: null,
        estado: "ACEPTADO",
        tipo: "INGRESO",
        datosCheque: {
          importe: chequeData.importe,
          estado: "PENDIENTE",
          tipo: "RECIBIDO",
          detalle: `Cheque N° ${chequeData.numero_cheque}`,
          origen: cliente_nombre,
          destino: "Caja",
          banco: chequeData.banco,
          numero_cheque: chequeData.numero_cheque,
          fecha_emision: chequeData.fecha_emision,
          fecha_pago: chequeData.fecha_pago,
        },
      },
    ]);
    close();
  };

  //? ENVIAR CON ENTER
  const handleKeyDownEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita el comportamiento predeterminado
      addCheque();
    }
  };

  const close = () => {
    setCloseModal(false);
    setMetodoPago("none");
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[400px]">
      <Titulo text="NUEVO CHEQUE" />
      <div
        className="text-xl flex flex-col space-y-2"
        onKeyDown={handleKeyDownEnter}
      >
        <div className="flex flex-col w-[400px]">
          <label className="labelInput">
            Banco<strong className="text-red-400">*</strong>
          </label>
          <input
            ref={input2Ref}
            onKeyDown={(e) => handleKeyDown(e, input3Ref, null)}
            onChange={handleChangeForm}
            type="text"
            name="banco"
            placeholder="Ingrese el nombre del banco."
            className="input"
          />
        </div>

        <div className="flex flex-col w-[400px]">
          <label className="labelInput">
            N° de cheque<strong className="text-red-400">*</strong>
          </label>
          <input
            ref={input3Ref}
            onKeyDown={(e) => handleKeyDown(e, input4Ref, input2Ref)}
            onChange={handleChangeForm}
            type="text"
            placeholder="Ingrese el número de cheque."
            name="numero_cheque"
            className="input"
          />
        </div>

        <div className="flex justify-between w-[400px]">
          <div className="flex flex-col w-[195px]">
            <label className="labelInput">
              Fecha de emisión<strong className="text-red-400">*</strong>
            </label>
            <input
              ref={input4Ref}
              onKeyDown={(e) => handleKeyDown(e, input5Ref, input3Ref)}
              onChange={handleChangeForm}
              placeholder="dd/mm/aaaa"
              type="date"
              name="fecha_emision"
              className="input"
            />
          </div>

          <div className="flex flex-col w-[195px]">
            <label className="labelInput">
              Fecha de pago<strong className="text-red-400">*</strong>
            </label>
            <input
              ref={input5Ref}
              onKeyDown={(e) => handleKeyDown(e, input6Ref, input4Ref)}
              onChange={handleChangeForm}
              placeholder="dd/mm/aaaa"
              type="date"
              name="fecha_pago"
              className="input"
            />
          </div>
        </div>

        <div className="flex flex-col w-[400px]">
          <label className="labelInput">
            Importe<strong className="text-red-400">*</strong>
          </label>
          <div className="bg-white-bg2 text-black px-5 flex items-center space-x-2">
            <p className="text-white-bg3 text-xl font-semibold">$</p>
            <input
              ref={input6Ref}
              onKeyDown={(e) => handleKeyDown(e, input7Ref, input5Ref)}
              onChange={handleChangeForm}
              type="number"
              name="importe"
              placeholder="Ej: 1000"
              className="input w-full"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button className="boton_rojo" onClick={close}>
            CANCELAR
          </button>
          <button
            onClick={addCheque}
            className="boton_verde"
            ref={input7Ref}
            onKeyDown={(e) => handleKeyDown(e, null, input6Ref)}
          >
            AGREGAR
          </button>
        </div>
        <p className="text-white-bg3 w-full">
          - Los campos marcados con<strong className="text-red-400">*</strong>{" "}
          son obligatorios.
        </p>
      </div>
    </div>
  );
};

export default AddChequeIngreso;
