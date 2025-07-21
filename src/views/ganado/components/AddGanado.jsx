import { useRef } from "react";
import Titulo from "../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import { BiLoaderAlt } from "react-icons/bi";

const AddGanado = ({ setCloseModal }) => {
    const [loader, setLoader] = useState(false);

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
    const [newGanado, setNewGanado] = useState({
        caravana: "",
        tipo: "",
        fecha_ingreso: "",
        estado: "",
        detalles: "",
        inseminado: false,
    });

    const handleChange = (e) => {
        const p = e.target.name;
        const v = e.target.value;

        if (p == "caravana") {
            setNewGanado({ ...newGanado, [p]: v.toUpperCase() });
        } else {
            setNewGanado({ ...newGanado, [p]: v });
        }
    };

    const handleNewGanado = () => {
        if (!newGanado.caravana || !newGanado.tipo || !newGanado.fecha_ingreso) {
            return Swal.fire({
                title: "Completa los campos necesarios para cargar el animal",
                icon: "warning",
                iconColor: "#D64747",
                confirmButtonColor: "#D64747",
            });
        }

        setLoader(true);
        //! LOGICA DE ENVIO
        axios
            .post(url + "tambo/ganado", newGanado)
            .then(({ data }) => {
                setLoader(false);
                Swal.fire({
                    title: "¡Animal creado correctamente!",
                    icon: "success",
                    iconColor: "#86C394",
                    confirmButtonColor: "#86C394",
                }).then(() => window.location.reload());
            })
            .catch((error) => {
                setLoader(false);
                console.log(error);
                Swal.fire({
                    title: "Ocurrio un error inesperado, intente nuevamente",
                    text:
                        error.message === "Network Error"
                            ? "Contacte con el servicio técnico"
                            : error.response.data.message,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#D64747",
                    icon: "error",
                });
            });
    };

    //? ENVIAR CON ENTER
    const handleKeyDownEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita el comportamiento predeterminado
            handleNewGanado();
        }
    };

    return (
        <div className="flex flex-col space-y-4 items-start sm:w-[450px]">
            <Titulo text="AGREGAR GANADO" />
            <div className="text-xl flex flex-col space-y-1" onKeyDown={handleKeyDownEnter}>
                <div className="flex flex-col w-[450px]">
                    <label className="labelInput">Caravana</label>
                    <input
                        ref={input1Ref}
                        onKeyDown={(e) => handleKeyDown(e, input2Ref, null)}
                        placeholder="A123"
                        onChange={handleChange}
                        type="text"
                        value={newGanado.caravana}
                        name="caravana"
                        className="bg-white-bg2 text-black py-2 px-5 w-full"
                    />
                </div>

                <div className="flex flex-col w-[450px]">
                    <label className="labelInput">Tipo</label>
                    <select name="tipo" onChange={handleChange} className="bg-white-bg2 text-black py-2 px-5 w-full">
                        <option selected disabled>
                            TERNERA / VAQUILLONA / VACA
                        </option>
                        <option>TERNERA</option>
                        <option>VAQUILLONA</option>
                        <option>VACA</option>
                    </select>
                </div>

                <div className="flex flex-col w-[450px]">
                    <label className="labelInput">Fecha ingreso</label>
                    <input
                        ref={input3Ref}
                        onKeyDown={(e) => handleKeyDown(e, input4Ref, input2Ref)}
                        onChange={handleChange}
                        type="date"
                        name="fecha_ingreso"
                        className="bg-white-bg2 text-black py-2 px-5 w-full"
                    />
                </div>

                <div className="flex flex-col w-[450px]">
                    <label className="labelInput">Inseminada</label>
                    <select
                        name="inseminado"
                        onChange={handleChange}
                        value={newGanado.inseminado}
                        className="bg-white-bg2 text-black py-2 px-5 w-full"
                    >
                        <option value={true}>SI</option>
                        <option value={false}>NO</option>
                    </select>
                </div>

                <div className="flex flex-col w-[450px]">
                    <label className="labelInput">Estado</label>
                    <select name="estado" onChange={handleChange} className="bg-white-bg2 text-black py-2 px-5 w-full">
                        <option selected disabled>
                            Seleccionar estado
                        </option>
                        <option>ORDEÑE</option>
                        <option>RECRIA</option>
                        <option>SECA</option>
                        <option>ENGORDE</option>
                        <option>ENFERMA</option>
                        <option>DESCARTADA</option>
                        <option>POST-PARTO</option>
                        <option>LACTANCIA</option>
                        <option>EN CUARENTENA</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-5">
                    <button className="boton_rojo" onClick={() => setCloseModal(false)}>
                        CANCELAR
                    </button>
                    <button
                        ref={input4Ref}
                        onKeyDown={(e) => handleKeyDown(e, null, input3Ref)}
                        onClick={handleNewGanado}
                        className="boton_verde"
                    >
                        {loader ? (
                            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
                        ) : (
                            "CARGAR"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddGanado;
