import { useEffect } from "react";
import { useState, useRef } from "react";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { url } from "../../../../common/URL_SERVER";
import SeleccionarAnimalesIns from "./SeleccionarAnimalesIns";
import Modal from "../../../../common/Modal";
import { FaPlus } from "react-icons/fa6";

const CargarInseminacion = () => {
    const [insemacionForm, setInseminacionForm] = useState({
        fecha: "",
        hora_carga: "",
        inseminador: "",
        aclaracion: "",
        usuario_carga: "",
        imageBase64: "",
    });
    const [inseminacionesArray, setInseminacionesArray] = useState([]);
    const [selecionarGanado, setSeleccionarGanado] = useState(false);

    const sacarDeLaLista = (id) => {
        setInseminacionesArray((prevArray) => prevArray.filter((item) => item.id !== id));
    };

    // const [inseminacionesArray, setInseminacionesArray] = useState(
    //   Array.from({ length: 100 }, (_, index) => ({
    //     id: index + 1,
    //     caravana: "",
    //     sexado: "",
    //     pajuela: "",
    //   }))
    // );

    const [ganadoIns, setGanadoIns] = useState([]);
    useEffect(() => {
        axios(url + "tambo/ganado?limit=9999999999").then(({ data }) => {
            const inseminadas = data.data.filter((d) => d.inseminado);
            const soloCaravanas = inseminadas.map((d) => d.caravana);
            setGanadoIns(soloCaravanas);
        });
    }, []);

    const [loader, setLoader] = useState(false);

    const handleChangeForm = (e) => {
        const { name, value } = e.target;

        setInseminacionForm({ ...insemacionForm, [name]: value });
    };

    const handleSelectFile = (event) => {
        const file = event.target.files[0]; // Toma el primer archivo seleccionado
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                setInseminacionForm({ ...insemacionForm, imageBase64: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        setInseminacionForm({
            fecha: "",
            hora_carga: "",
            inseminador: "",
            aclaracion: "",
        });

        setInseminacionesArray(
            Array.from({ length: 100 }, (_, index) => ({
                id: index + 1,
                caravana: "",
                sexado: "",
                pajuela: "",
            }))
        );
    };

    //! TABLA
    const handleChangeInput = (e) => {
        const id = e.target.id;
        const p = e.target.name;
        const v = e.target.name !== "pajuela" ? e.target.value.toUpperCase() : e.target.value;

        const getAnimalId = (id) => {
            return inseminacionesArray.find((caravana) => caravana.id === id);
        };

        const animalAModificar = getAnimalId(id);

        if (animalAModificar) {
            const animalModificado = { ...animalAModificar, [p]: v };

            setInseminacionesArray(
                inseminacionesArray.map((caravana) => (caravana.id === id ? animalModificado : caravana))
            );
        }
    };

    const tableRef = useRef(null);
    const handleKeyDown = (e) => {
        const currentElement = document.activeElement;
        const table = tableRef.current;
        if (!table.contains(currentElement)) return;

        const inputs = Array.from(table.querySelectorAll("input"));
        const currentIndex = inputs.indexOf(currentElement);

        if (currentIndex === -1) return;

        let nextIndex;

        switch (e.key) {
            case "ArrowRight":
                e.preventDefault();
                if ((currentIndex + 1) % 3 !== 0) {
                    nextIndex = currentIndex + 1;
                }
                break;
            case "ArrowLeft":
                e.preventDefault();
                if (currentIndex % 3 !== 0) {
                    nextIndex = currentIndex - 1;
                }
                break;
            case "ArrowDown":
                e.preventDefault();
                nextIndex = findNextRowInput(inputs, currentIndex, 1);
                break;
            case "ArrowUp":
                e.preventDefault();
                nextIndex = findNextRowInput(inputs, currentIndex, -1);
                break;
            default:
                return;
        }

        if (nextIndex !== undefined && inputs[nextIndex]) {
            inputs[nextIndex].focus();
        }
    };

    const findNextRowInput = (inputs, currentIndex, direction) => {
        const currentInput = inputs[currentIndex];
        const currentRect = currentInput.getBoundingClientRect();

        const inputsInColumn = inputs.filter((input) => {
            const rect = input.getBoundingClientRect();
            return rect.left === currentRect.left;
        });

        const columnIndex = inputsInColumn.indexOf(currentInput);
        if (columnIndex === -1) return;

        const nextIndex = columnIndex + direction;
        if (nextIndex >= 0 && nextIndex < inputsInColumn.length) {
            return inputs.indexOf(inputsInColumn[nextIndex]);
        }
    };

    const preventArrowKeyChange = (e) => {
        if (["ArrowUp", "ArrowDown"].includes(e.key)) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        const table = tableRef.current;
        if (table) {
            table.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            if (table) {
                table.removeEventListener("keydown", handleKeyDown);
            }
        };
    }, [inseminacionesArray]);

    //! ENVIO DE DATOS
    const envioDeDatos = () => {
        if (!insemacionForm.fecha || !insemacionForm.inseminador || !inseminacionesArray.length) {
            return Swal.fire({
                title: "Complete los datos requeridos para cargar la inseminación",
                icon: "warning",
                iconColor: "#D64747",
                confirmButtonColor: "#D64747",
            });
        }

        const arrayUtilizados = [...inseminacionesArray].filter((item) => item.caravana && item.pajuela && item.sexado);

        const arraySinIds = arrayUtilizados.map((item) => {
            const { id, ...rest } = item;
            return rest;
        });

        const arrayCaravanasYaInseminadas = [];
        arraySinIds.forEach((a) => {
            if (ganadoIns.includes(a.caravana)) {
                arrayCaravanasYaInseminadas.push(a.caravana);
            }
        });

        if (arrayCaravanasYaInseminadas.length) {
            return Swal.fire({
                title: "Las siguientes caravanas ya fueron inseminadas:",
                text: arrayCaravanasYaInseminadas.join(", "),
                icon: "warning",
                iconColor: "#D64747",
                confirmButtonColor: "#D64747",
            });
        }

        const datosFinales = {
            ...insemacionForm,
            fecha_carga: new Date().toISOString().split("T")[0],
            hora_carga: new Date().toTimeString().split(" ")[0],
            arrayGanados: arraySinIds,
        };
        setLoader(true);
        axios
            .post(url + "tambo/ganado/inseminacion", datosFinales)
            .then((res) => {
                setLoader(false);
                Swal.fire({
                    title: "Inseminación cargada con éxito",
                    confirmButtonText: "Aceptar",
                    icon: "success",
                    confirmButtonColor: "#86C394",
                }).then(() => window.location.reload());
            })
            .catch((error) => {
                setLoader(false);
                console.log(error);
                Swal.fire({
                    title: "Ocurrio un error inesperado, intente nuevamente",
                    text: error.message === "Network Error" ? "Contacte con el servicio técnico" : error,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#D64747",
                    icon: "error",
                });
            });
    };

    return (
        <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
            <div className="flex w-full">
                <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">CARGAR INSEMINACION</h2>
            </div>
            <div className="flex w-full justify-between">
                <div className="flex flex-col w-[48%]">
                    <label className="text-xl font-semibold text-white-bg3">
                        Fecha <strong className="text-red-400">*</strong>
                    </label>
                    <input
                        onChange={handleChangeForm}
                        type="date"
                        value={insemacionForm.fecha}
                        name="fecha"
                        className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                    />
                </div>
                <div className="flex flex-col w-[48%]">
                    <label className="text-xl font-semibold text-white-bg3">Hora de carga</label>
                    <p className="bg-white-bg2 text-black-comun py-[9px] px-5 text-xl">{obtenerFechaActual("hora")}</p>
                </div>
            </div>

            <div className="flex w-full justify-between">
                <div className="flex flex-col w-[48%]">
                    <label className="text-xl font-semibold text-white-bg3">
                        Inseminador <strong className="text-red-400">*</strong>
                    </label>
                    <input
                        onChange={handleChangeForm}
                        type="text"
                        value={insemacionForm.inseminador}
                        name="inseminador"
                        placeholder="Nombre del inseminador."
                        className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                    />
                </div>
                <div className="flex flex-col w-[48%]">
                    <label className="text-xl font-semibold text-white-bg3">Adjuntar documento</label>
                    <input
                        onChange={handleSelectFile}
                        type="file"
                        className="bg-white-bg2 text-black-comun py-[5px] px-1 text-xl"
                    />
                </div>
            </div>

            <div className="flex flex-col w-full">
                <label className="text-xl font-semibold text-white-bg3">
                    Datos por animal <strong className="text-red-400">*</strong>
                </label>
                <div className="w-full scrollbar overflow-auto">
                    {inseminacionesArray.length ? (
                        <div className="h-full max-h-48 space-y-2">
                            <table className="border-separate text-lg w-full relative" ref={tableRef}>
                                <thead className="sticky top-0 align-bottom  bg-white-bg3 z-10 text-white-bg2">
                                    <tr>
                                        <th className="px-[2px]">Caravana</th>
                                        <th className="px-[2px]">Sexado (SI/NO)</th>
                                        <th className="px-[2px]">Pajuela</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white-bg">
                                    {inseminacionesArray.map((gan) => (
                                        <tr key={gan.id}>
                                            <td className="w-32 bg-[#d8c7bb]">
                                                <input
                                                    type="text"
                                                    className="w-full bg-[#b5b6d7] px-2 text-center rounded-none"
                                                    value={gan.caravana}
                                                    onKeyDown={preventArrowKeyChange}
                                                    id={gan.id}
                                                    onChange={handleChangeInput}
                                                    name="caravana"
                                                />
                                            </td>
                                            <td className="max-w-40">
                                                <input
                                                    type="text"
                                                    className="w-full bg-white-bg2 px-2 rounded-none"
                                                    onKeyDown={preventArrowKeyChange}
                                                    onChange={handleChangeInput}
                                                    name="sexado"
                                                    value={gan.sexado}
                                                    id={gan.id}
                                                />
                                            </td>
                                            <td className="max-w-40">
                                                <input
                                                    type="text"
                                                    className="w-full bg-white-bg2 px-2 rounded-none"
                                                    onKeyDown={preventArrowKeyChange}
                                                    onChange={handleChangeInput}
                                                    name="pajuela"
                                                    value={gan.pajuela}
                                                    id={gan.id}
                                                />
                                            </td>
                                            <td
                                                onClick={() => sacarDeLaLista(gan.id)}
                                                className="bg-button-red hover:bg-button-red_hover cursor-pointer text-white-bg2"
                                            >
                                                <FaPlus className="mx-auto rotate-45" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex space-x-2">
                                <button onClick={() => setInseminacionesArray([])} className="boton_rojo">
                                    BORRAR TODO
                                </button>
                                <button onClick={() => setSeleccionarGanado(true)} className="boton_verde">
                                    AÑADIR
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setSeleccionarGanado(true)} className="boton_verde">
                            SELECCIONAR ANIMALES
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col w-full">
                <label className="text-xl font-semibold text-white-bg3">Aclaraciones</label>
                <textarea
                    onChange={handleChangeForm}
                    placeholder="Aclaraciones sobre la inseminación"
                    type="number"
                    value={insemacionForm.aclaracion}
                    name="aclaracion"
                    className="bg-white-bg2 text-black-comun py-2 px-5 text-xl max-h-18 min-h-18"
                />
            </div>

            <p className="text-white-bg3 w-full block sm:hidden xl:block">
                - Los campos marcados con <strong className="text-red-400">*</strong> son oblicatorios para cargar la
                producción.
            </p>

            <div className="space-x-2 flex justify-end w-full">
                <button onClick={handleCancel} className="boton_rojo">
                    CANCELAR
                </button>
                <button onClick={envioDeDatos} className="boton_verde w-32">
                    {loader ? <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" /> : "CARGAR"}
                </button>
            </div>

            {selecionarGanado && (
                <Modal>
                    <SeleccionarAnimalesIns
                        setAnimales={setInseminacionesArray}
                        animales={inseminacionesArray}
                        setCloseModal={setSeleccionarGanado}
                    />
                </Modal>
            )}
        </div>
    );
};

export default CargarInseminacion;
