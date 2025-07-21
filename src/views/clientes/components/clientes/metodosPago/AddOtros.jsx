import { useRef } from "react";
import Titulo from "../../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";

const AddOtros = ({ setCloseModal, setMetodosLista, metodosLista, setMetodoPago, id_cliente }) => {
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

    const [otros, setOtros] = useState({
        metodo_utilizado: "",
        importe: 0,
    });

    const handleChangeForm = (e) => {
        const {name, value}=e.target

        setOtros({ ...otros, [name]: value });
    };

    const addOtrosMetodo = () => {
        if (!otros.metodo_utilizado || !otros.importe) {
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

    //? ENVIAR CON ENTER
    const handleKeyDownEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita el comportamiento predeterminado
            addOtrosMetodo();
        }
    };

    const close = () => {
        setCloseModal(false);
        setMetodoPago("none");
    };

    return (
        <div className="flex flex-col space-y-2 items-start">
            <Titulo text="OTROS" />
            <div className="text-xl flex flex-col space-y-2" onKeyDown={handleKeyDownEnter}>
                <div className="flex flex-col w-[400px]">
                    <label className="labelInput">Especifica el metodo de pago</label>
                    <input
                        ref={input2Ref}
                        onKeyDown={(e) => handleKeyDown(e, input3Ref, null)}
                        onChange={handleChangeForm}
                        type="text"
                        name="metodo_utilizado"
                        className="bg-white-bg2 text-black py-2 px-5"
                    />
                </div>

                <div className="flex flex-col w-[400px]">
                    <label className="labelInput">Importe</label>
                    <input
                        ref={input3Ref}
                        onKeyDown={(e) => handleKeyDown(e, input4Ref, input2Ref)}
                        onChange={handleChangeForm}
                        type="number"
                        name="importe"
                        className="bg-white-bg2 text-black py-2 px-5"
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-5">
                    <button className="boton_rojo" onClick={close}>
                        CANCELAR
                    </button>
                    <button
                        onClick={addOtrosMetodo}
                        className="boton_verde"
                        ref={input4Ref}
                        onKeyDown={(e) => handleKeyDown(e, null, input3Ref)}
                    >
                        AGREGAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddOtros;
