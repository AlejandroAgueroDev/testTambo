import { useRef, useState, useEffect } from "react";
import Titulo from "../../../../../common/Titulo";
import Swal from "sweetalert2";
import { url } from "../../../../../common/URL_SERVER";
import axios from "axios";

const AddTransferencia = ({
  setCloseModal,
  setMetodosLista,
  metodosLista,
  setMetodoPago,
  id_empleado,
}) => {
  //? DESPLAZAMIENTO CON LA FLECHA
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

  const [cuentas, setCuentas] = useState([]);
  const [usarInputCuenta, setUsarInputCuenta] = useState(false); // controla si mostramos input o select

  const fetchCuentas = async () => {
    try {
      const { data } = await axios.get(`${url}cuenta`);
      setCuentas(data);
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  const [transferencia, setTransferencia] = useState({
    id_origen: "",
    alias_origen: "", // nuevo campo para cuando usas input manual
    id_destino: null,
    nombre_origen: "",
    nombre_destino: "",
    importe: "",
    tipo: "DEBITO",
    fecha: new Date().toISOString(),
  });

  const handleimporte = (e) => {
    const { name, value } = e.target;

    if (name === "id_origen") {
      setTransferencia({
        ...transferencia,
        id_origen: value,
        nombre_origen: e.target.options[e.target.selectedIndex].text,
        alias_origen: "", // limpio alias si cambio select
      });
    } else if (name === "alias_origen") {
      setTransferencia({
        ...transferencia,
        alias_origen: value,
        id_origen: "", // limpio id_origen si escribo alias
        nombre_origen: value,
      });
    } else {
      setTransferencia({ ...transferencia, [name]: value });
    }
  };

  const addTransferencia = (e) => {
    e.preventDefault();

    // Validación para cuenta origen (id o alias)
    if (
      (!transferencia.id_origen && !transferencia.alias_origen) ||
      !transferencia.importe ||
      !transferencia.nombre_destino
    ) {
      return Swal.fire({
        title: "Completa los datos para agregar la transferencia",
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
        id_cliente: null,
        id_empleado: id_empleado,
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

  const close = () => {
    setCloseModal(false);
    setMetodoPago("none");
  };

  return (
    <form
      onSubmit={addTransferencia}
      className="flex flex-col space-y-2 items-start"
    >
      <div className="flex justify-between items-center w-full mb-2">
        <Titulo text="NUEVA TRANSFERENCIA" />
        <button
          type="button"
          className="boton_cian"
          onClick={() => setUsarInputCuenta((prev) => !prev)}
        >
          OTRA
        </button>
      </div>

      <div className="text-xl flex flex-col space-y-2 w-full">
        <div className="containerInput">
          <label className="labelInput">Cuenta origen</label>
          {usarInputCuenta ? (
            <input
              type="text"
              name="alias_origen"
              value={transferencia.alias_origen}
              onChange={handleimporte}
              placeholder="Ingresa número o alias de cuenta"
              className="input"
              ref={input1Ref}
            />
          ) : (
            <select
              onChange={handleimporte}
              name="id_origen"
              className="input"
              ref={input1Ref}
              defaultValue=""
            >
              <option disabled value="">
                Seleccionar cuenta
              </option>
              {cuentas.map((cuenta) => (
                <option key={cuenta.id} value={`${cuenta.id}`}>
                  {cuenta.nombre_cuenta}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="containerInput">
          <label className="labelInput">Cuenta destino</label>
          <input
            ref={input2Ref}
            onKeyDown={(e) => handleKeyDown(e, input3Ref, input1Ref)}
            onChange={handleimporte}
            type="text"
            name="nombre_destino"
            className="input"
            placeholder="cuenta.ejemplo.destino"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Importe</label>

          <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
            <p className="text-xl text-white-bg3">$</p>
            <input
              ref={input3Ref}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                handleKeyDown(e, input4Ref, input2Ref);
              }}
              onChange={handleimporte}
              type="number"
              name="importe"
              value={transferencia.importe}
              className="input"
              placeholder="Ej: 1000"
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
          <button type="submit" className="boton_verde">
            AGREGAR
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTransferencia;
