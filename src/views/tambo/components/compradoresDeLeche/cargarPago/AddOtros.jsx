import { useRef } from "react";
import Titulo from "../../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { Validation } from "../../../../../common/Validation";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const AddOtros = ({
  setCloseModal,
  setMetodosLista,
  metodosLista,
  setMetodoPago,
  id_cliente,
}) => {
  //? DESPAZAMIENTO CON LA FLECHA
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

  const [otros, setOtros] = useState({
    metodo_utilizado: "",
    importe: 0,
  });
  const [errors, setErrors] = useState({});

  const handleChangeForm = (e) => {
    const { value, name } = e.target;
    const errorMsg = Validation(name, value);

    // Bloquear el ingreso de "0" solo para el campo importe
    if (name === "importe" && value === "0") {
      return;
    }
    
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setOtros({ ...otros, [name]: value });
  };

  const addOtrosMetodo = (e) => {
    e.preventDefault();

    if (!otros.metodo_utilizado || !otros.importe) {
      setErrors({})
      return Swal.fire({
        title: "Competa los datos para agregar el metodo",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setMetodosLista([
      ...metodosLista,
      {
        importe: Number(otros.importe),
        detalle: otros.metodo_utilizado,
        id_cliente: id_cliente,
        id_proveedor: null,
        estado: "ACEPTADO",
        tipo: "INGRESO",
        metodo_pago: otros.metodo_utilizado,
        metodo: "OTROS",
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
      onSubmit={addOtrosMetodo}
      className="flex flex-col space-y-2 items-start"
    >
      <Titulo text="OTROS" />
      <div className="w-full space-y-3" >
        <div className="containerInput">
          <label className="labelInput">Especifica el metodo de pago</label>
          <Tippy
            content={errors.metodo_utilizado || ""}
            visible={!!errors.metodo_utilizado}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              ref={input2Ref}
              onKeyDown={(e) => handleKeyDown(e, input3Ref, null)}
              onChange={handleChangeForm}
              type="text"
              name="metodo_utilizado"
              className={`input ${
                errors.metodo_utilizado ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Cobrar a cuenta"
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
                onKeyDown={(e) => handleKeyDown(e, input4Ref, input2Ref)}
                onChange={handleChangeForm}
                type="number"
                name="importe"
                value={otros.importe || ""}
                className={`input ${
                  errors.importe ? "border-red-500" : "border-gray-300"
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
            ref={input4Ref}
            onKeyDown={(e) => handleKeyDown(e, null, input3Ref)}
          >
            AGREGAR
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddOtros;
