import Titulo from "../../../../common/Titulo";
import { useState, useRef, useEffect } from "react";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Modal from "../../../../common/Modal";
import CrearLote from "./CrearLote";
import Swal from "sweetalert2";
import GenerarInforme from "./GenerarInforma";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { useParams } from "react-router-dom";

const CargarControlProduccion = () => {
    //! LOTES
    const [newLote, setNewLote] = useState(false);
    const [lotesName, setLotesName] = useState([]);
    const [lotes, setLotes] = useState({});

    const [loteActualData, setLoteActualData] = useState([]);
    const [loteSelected, setLoteSelected] = useState("");

    useEffect(() => {
        const dataDeLoteSeleccionado = lotes[loteSelected] ? lotes[loteSelected].controlesArray : [];
        setLoteActualData(dataDeLoteSeleccionado);
    }, [loteSelected]);

    useEffect(() => {
        setLotes({
            ...lotes,
            [loteSelected]: {
                ...lotes[loteSelected],
                controlesArray: loteActualData,
            },
        });
    }, [loteActualData]);

    const { key } = useParams();
    useEffect(() => {
        if (key) {
            const valoresString = localStorage.getItem(key);
            if (valoresString) {
                try {
                    const valores = JSON.parse(valoresString);

                    if (valores.data && typeof valores.data === "object") {
                        setLotes(valores.data);

                        const name = [];
                        for (const n in valores.data) {
                            name.push(n);
                        }

                        setLotesName(name.filter((n) => n));
                    }
                } catch (error) {
                    console.error("Error al parsear los valores del localStorage:", error);
                }
            }
            //    else {
            //     console.warn(
            //       `No se encontró un valor en localStorage para la clave: ${key}`
            //     );
            //   }
        }
    }, []);
    const handleDeleteLote = (e, name) => {
        e.preventDefault();

        Swal.fire({
            title: `¿Quieres eliminar el lote ${name}?`,
            text: "No se conservaran los cambios realizados en el mismo",
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No`,
            confirmButtonColor: "#86C394",
            denyButtonColor: "#D64747",
        }).then((result) => {
            if (result.isConfirmed) {
                if (name === loteSelected) {
                    setLoteSelected("");
                }
                setLotesName([...lotesName].filter((n) => n !== name));
                delete lotes[name];
            } else if (result.isDenied) {
                return;
            }
        });
    };

    const handleChangeInput = (e) => {
        const id = e.target.id;
        const p = e.target.name;
        const v = e.target.value;

        const getAnimalId = (id) => {
            return loteActualData.find((caravana) => caravana.id === Number(id));
        };

        const animalAModificar = getAnimalId(id);

        if (animalAModificar) {
            let animalModificado;
            if (p === "observacion" || p === "caravana") {
                animalModificado = { ...animalAModificar, [p]: v };
            } else {
                animalModificado = { ...animalAModificar, [p]: Number(v) };
            }
            const total = Number(animalModificado.litros_ordeñe1) + Number(animalModificado.litros_ordeñe2);
            const animalModificadoTotal = { ...animalModificado, total: total };

            setLoteActualData(
                loteActualData.map((caravana) => (caravana.id === Number(id) ? animalModificadoTotal : caravana))
            );
        }
    };

    //! CONTROLAR HORAS
    const handleHoras = (e) => {
        const p = e.target.name;
        const v = e.target.value;

        setLotes({ ...lotes, [loteSelected]: { ...lotes[loteSelected], [p]: v } });
    };

    //! MOVIMEINTO CON FLECHAS
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
                if ((currentIndex + 1) % 4 !== 0) {
                    nextIndex = currentIndex + 1;
                }
                break;
            case "ArrowLeft":
                e.preventDefault();
                if (currentIndex % 4 !== 0) {
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
    }, [loteSelected]);

    //! CONTROLADOR DE ENVIO DE INFO
    const [showGenInforme, setShowGenInforme] = useState(false);
    const [lotesArray, setLotesArray] = useState([]);

    const handleShowGenInfo = () => {
        const verificarHoras = Object.values(lotes).every(
            (obj) =>
                Object.entries(obj)
                    .filter(([key]) => key.includes("hora")) // Filtrar propiedades con "hora"
                    .every(([, value]) => value !== "") // Verificar que no estén vacías
        );
        if (!verificarHoras) {
            return Swal.fire({
                title: "¡Debes especificar los horarios de inicio y fin de ordeñe para cada lote!",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        const lotesCorreccion = [];

        for (const lote in lotes) {
            if (lotes[lote].controlesArray.length) {
                const arrayControlesCorreccion = lotes[lote].controlesArray.filter(
                    (item) => item.caravana && item.total > 0
                );
                lotesCorreccion.push({
                    ...lotes[lote],
                    controlesArray: arrayControlesCorreccion,
                });
            }
        }

        const lotesSinId = lotesCorreccion.map((item) => ({
            ...item,
            controlesArray: item.controlesArray.map((control) => {
                const { id, ...rest } = control; // Elimina la propiedad id
                return rest;
            }),
        }));

        setLotesArray(lotesSinId);

        setShowGenInforme(true);
    };

    //! CONTROLADOR DE CANCELAR
    const nav = useNavigate();

    const handleCancel = () => {
        if (!lotesName.length) {
            return nav("/tambo/control-produccion");
        }

        Swal.fire({
            title: `¡Estas por salir del control de producción!`,
            text: "¿Deseas guardar los cambios hechos hasta el momento?",
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No`,
            confirmButtonColor: "#86C394",
            denyButtonColor: "#D64747",
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                if (key) {
                    localStorage.removeItem(key);
                }

                const hora = obtenerFechaActual("hora");
                const fecha = obtenerFechaActual("fecha");
                const nombreGuardado = `controlproduccion_${hora}_${fecha}`;

                const objetoGuardar = {
                    fecha: fecha,
                    cantidad_lotes: lotesName.length,
                    data: lotes,
                };

                localStorage.setItem(nombreGuardado, JSON.stringify(objetoGuardar));

                Swal.fire({
                    title: "¡Datos de control de producción guardados con exito!",
                    text: "Podras seguir editando estos datos ingresando desde la sección inferior de control de producción",
                    confirmButtonText: "Aceptar",
                    icon: "success",
                    confirmButtonColor: "#86C394",
                    allowOutsideClick: false,
                }).then(() => nav("/tambo/control-produccion"));
            } else if (result.isDenied) {
                nav("/tambo");
            }
        });
    };

    return (
        <ContenedorGeneral navText="TAMBO">
            <div className="w-screen md:w-full flex justify-between pt-1 sm:pt-0 pl-10 sm:pl-14 md:pl-0 pr-4 md:pr-0">
                <div className="hidden sm:block">
                    <Titulo text="CONTROL DE PRODUCCION" />
                </div>
                <div className="block sm:hidden">
                    <Titulo text="CONTROL PRODUCCION" />
                </div>

                <div className="hidden md:flex space-x-3 items-center">
                    <button
                        onClick={() => setNewLote(true)}
                        className="bg-button-green hover:bg-button-green_hover px-4 py-3 text-xl text-white-bg2 flex items-center justify-center space-x-2"
                    >
                        <FaPlus className="ml-2" />
                    </button>
                    {/* pestañas */}
                    {lotesName.map((ln) => (
                        <button
                            key={ln}
                            onClick={() => setLoteSelected(ln)}
                            className={` ${
                                loteSelected === ln ? "bg-white-bg2" : "bg-white-bg3 hover:bg-white-bg_hover"
                            } px-4 py-2 text-xl text-black-comun flex items-center space-x-2`}
                        >
                            {ln}
                            <MdDelete
                                className="hover:text-button-red_hover"
                                onClick={(e) => handleDeleteLote(e, ln)}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {loteSelected ? (
                <div className="h-full w-full scrollbar overflow-auto p-2 sm:pr-4 md:p-2 md:w-auto bg-white-bg2 space-y-2 flex flex-col justify-between">
                    <div className="w-full">
                        <div className="flex pb-2 justify-between md:hidden">
                            <div className="flex space-x-2">
                                <select
                                    className="bg-white-bg2 text-black-comun py-2.5 px-5 text-xl p-2"
                                    onChange={(e) => setLoteSelected(e.target.value)}
                                    value={loteSelected}
                                >
                                    <option value="" disabled>
                                        Seleccionar
                                    </option>
                                    {lotesName.map((l) => (
                                        <option key={l} value={l}>
                                            {l}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={(e) => handleDeleteLote(e, loteSelected)}
                                    className="bg-button-red hover:bg-button-red_hover px-4 py-3 text-xl text-white-bg2"
                                >
                                    <MdDelete />
                                </button>
                            </div>
                            <button
                                onClick={() => setNewLote(true)}
                                className="bg-button-green hover:bg-button-green_hover px-4 py-3 text-xl text-white-bg2"
                            >
                                <FaPlus />
                            </button>
                        </div>

                        <div className="w-full scrollbar overflow-auto">
                            <div className="h-full max-h-[75vh]">
                                <table className="border-separate text-lg w-full relative" ref={tableRef}>
                                    <thead className="sticky top-0 align-bottom bg-white-bg3 z-10 text-white-bg2">
                                        <tr>
                                            <th className="px-[2px]">CARAVANA</th>
                                            <th className="px-[2px]">
                                                <div className="flex flex-col items-center ">
                                                    1º ORDEÑE{" "}
                                                    <div className="flex space-x-2 text-md">
                                                        <p>De</p>
                                                        <input
                                                            onChange={handleHoras}
                                                            type="time"
                                                            name="hora_inicio_ordeñe1"
                                                            value={lotes[loteSelected].hora_inicio_ordeñe1}
                                                            className="bg-white-bg text-black-comun px-1 text-sm"
                                                        />
                                                        <p>a</p>
                                                        <input
                                                            onChange={handleHoras}
                                                            type="time"
                                                            name="hora_fin_ordeñe1"
                                                            value={lotes[loteSelected].hora_fin_ordeñe1}
                                                            className="bg-white-bg text-black-comun px-1 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th className="px-[2px]">
                                                <div className="flex flex-col items-center ">
                                                    2º ORDEÑE{" "}
                                                    <div className="flex space-x-2 text-md">
                                                        <p>De</p>
                                                        <input
                                                            onChange={handleHoras}
                                                            type="time"
                                                            name="hora_inicio_ordeñe2"
                                                            value={lotes[loteSelected].hora_inicio_ordeñe2}
                                                            className="bg-white-bg text-black-comun px-1 text-sm"
                                                        />
                                                        <p>a</p>
                                                        <input
                                                            onChange={handleHoras}
                                                            type="time"
                                                            name="hora_fin_ordeñe2"
                                                            value={lotes[loteSelected].hora_fin_ordeñe2}
                                                            className="bg-white-bg text-black-comun px-1 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th className="px-[2px]">TOTAL</th>
                                            <th className="px-[2px]">OBSERVACION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white-bg">
                                        {loteActualData.map((gan) => (
                                            <tr key={gan.id}>
                                                <td className="px-[2px] w-32 bg-[#d8c7bb]">
                                                    <input
                                                        type="text"
                                                        className="w-full bg-[#d8c7bb] px-2 text-center rounded-none"
                                                        value={gan.caravana}
                                                        onKeyDown={preventArrowKeyChange}
                                                        id={gan.id}
                                                        onChange={handleChangeInput}
                                                        name="caravana"
                                                    />
                                                </td>
                                                <td className="max-w-40">
                                                    <input
                                                        type="number"
                                                        className="w-full bg-white-bg px-2 rounded-none"
                                                        onKeyDown={preventArrowKeyChange}
                                                        onChange={handleChangeInput}
                                                        name="litros_ordeñe1"
                                                        value={gan.litros_ordeñe1 ? gan.litros_ordeñe1 : ""}
                                                        id={gan.id}
                                                    />
                                                </td>
                                                <td className="max-w-40">
                                                    <input
                                                        type="number"
                                                        className="w-full bg-white-bg px-2 rounded-none"
                                                        onKeyDown={preventArrowKeyChange}
                                                        onChange={handleChangeInput}
                                                        name="litros_ordeñe2"
                                                        value={gan.litros_ordeñe2 ? gan.litros_ordeñe2 : ""}
                                                        id={gan.id}
                                                    />
                                                </td>
                                                <td className="px-2 bg-[#b5b6d7]">{gan.total}</td>
                                                <td className="bg-[#d8c7bb]">
                                                    <input
                                                        type="text"
                                                        className="w-full bg-[#d8c7bb] px-2 text-start rounded-none"
                                                        value={gan.observacion.toUpperCase()}
                                                        onKeyDown={preventArrowKeyChange}
                                                        onChange={handleChangeInput}
                                                        name="observacion"
                                                        id={gan.id}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-between">
                        <button className="boton_rojo" onClick={handleCancel}>
                            SALIR
                        </button>

                        <button onClick={handleShowGenInfo} className="boton_verde hidden sm:block">
                            GENERAR INFORME Y FINALIZAR
                        </button>
                        <button onClick={handleShowGenInfo} className="boton_verde block sm:hidden">
                            GENERAR INFORME
                        </button>
                    </div>
                </div>
            ) : (
                <div className="h-full w-full scrollbar overflow-auto p-2 sm:pr-4 md:p-2 md:w-auto bg-white-bg2 space-y-2 flex flex-col justify-between">
                    <div>
                        <div className="flex pb-2 justify-between md:hidden">
                            <div className="flex space-x-2">
                                <select
                                    className="bg-white-bg2 text-black-comun py-2.5 px-5 text-xl p-2"
                                    onChange={(e) => setLoteSelected(e.target.value)}
                                    value={loteSelected}
                                >
                                    <option value="" disabled>
                                        Seleccionar
                                    </option>
                                    {lotesName.map((l) => (
                                        <option value={l}>{l}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => setNewLote(true)}
                                className="bg-button-green hover:bg-button-green_hover px-4 py-3 text-xl text-white-bg2 flex items-center justify-center space-x-2"
                            >
                                Crear LOTE <FaPlus className="ml-2" />
                            </button>
                        </div>
                        <p className=" text-white-bg3 py-2 text-xl">
                            Cree un lote para cargar el control de produccion o seleccione uno de los creados.
                        </p>
                    </div>
                    <div className="w-full flex justify-between">
                        <button className="boton_rojo" onClick={handleCancel}>
                            SALIR
                        </button>

                        <button onClick={handleShowGenInfo} className="boton_verde hidden sm:block">
                            GENERAR INFORME Y FINALIZAR
                        </button>
                        <button onClick={handleShowGenInfo} className="boton_verde block sm:hidden">
                            GENERAR INFORME
                        </button>
                    </div>
                </div>
            )}

            {newLote ? (
                <Modal>
                    <CrearLote
                        setCloseModal={setNewLote}
                        setLotesName={setLotesName}
                        lotesName={lotesName}
                        setLotes={setLotes}
                        lotes={lotes}
                        setActual={setLoteSelected}
                        lotesActuales={lotesName}
                    />
                </Modal>
            ) : null}

            {showGenInforme ? (
                <Modal>
                    <GenerarInforme setCloseModal={setShowGenInforme} lotesArray={lotesArray} claveLocalStorage={key} />
                </Modal>
            ) : null}
        </ContenedorGeneral>
    );
};

export default CargarControlProduccion;
