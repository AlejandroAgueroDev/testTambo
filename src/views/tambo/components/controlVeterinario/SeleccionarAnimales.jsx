import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { BiLoaderAlt } from "react-icons/bi";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaList } from "react-icons/fa6";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";

const SeleccionarAnimales = ({ setCloseModal, setAnimales, animales }) => {
    const [animalesSelected, setAnimalesSelected] = useState(animales);
    const [tipos, setTipos] = useState([]);
    const [listaAnimales, setListaAnimales] = useState([]);
    const [back, setBack] = useState([]);
    const [selected, setSelected] = useState([]);
    const [configVista, setConfigVista] = useState("list");
    const [loaderData, setLoaderData] = useState(true);

    useEffect(() => {
        axios(url + "tambo/ganado?limit=99999999999").then(({ data }) => {
            setLoaderData(false);
            const dataArray = data.data.map((cargado) => {
                const fecha = cargado.fecha_ingreso.split("T")[0];
                const arrayFecha = fecha.split("-");
                const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
                return { ...cargado, fecha_ingreso: fechaFinal };
            });
            setListaAnimales(dataArray);
            setBack(dataArray);

            const tiposArray = [];
            data.data.forEach((a) => {
                if (!tiposArray.includes(a.tipo)) {
                    tiposArray.push(a.tipo);
                }
            });
            setTipos(tiposArray);
        });
    }, []);

    const handleSelectMultiple = (e) => {
        const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);

        let copiaDeSelected = [];
        if (selectedValues.includes("TODOS")) {
            setSelected(["TODOS", ...tipos]);
            copiaDeSelected = ["TODOS", ...tipos];
        } else {
            if (selectedValues.length === tipos.length) {
                setSelected(["TODOS", ...tipos]);
                copiaDeSelected = ["TODOS", ...tipos];
            } else {
                setSelected(selectedValues);
                copiaDeSelected = selectedValues;
            }
        }

        if (copiaDeSelected.includes("TODOS")) {
            setAnimalesSelected(listaAnimales.map((l) => l.caravana));
        } else {
            const animalesFiltrados = [];
            copiaDeSelected.map((s) => {
                listaAnimales.map((l) => {
                    if (l.tipo === s) {
                        animalesFiltrados.push(l.caravana);
                    }
                });
            });
            setAnimalesSelected(animalesFiltrados);
        }
    };

    const handleCheckboxChange = (tipo) => {
        let copiaDeSelected = [];
        if (tipo === "TODOS") {
            if (selected.includes("TODOS")) {
                setSelected([]); // Deseleccionar todo
            } else {
                setSelected(["TODOS", ...tipos]); // Seleccionar todo
                copiaDeSelected = ["TODOS", ...tipos];
            }
        } else {
            if (selected.includes(tipo)) {
                // Deseleccionar un tipo
                const newSelected = selected.filter((t) => t !== tipo && t !== "TODOS");
                setSelected(newSelected);
                copiaDeSelected = newSelected;
            } else {
                // Seleccionar un tipo
                const newSelected = [...selected, tipo];
                if (newSelected.length === tipos.length) {
                    setSelected(["TODOS", ...tipos]);
                    copiaDeSelected = ["TODOS", ...tipos];
                } else {
                    setSelected(newSelected);
                    copiaDeSelected = newSelected;
                }
            }
        }

        if (copiaDeSelected.includes("TODOS")) {
            setAnimalesSelected(listaAnimales.map((l) => l.caravana));
        } else {
            const animalesFiltrados = [];
            copiaDeSelected.map((s) => {
                listaAnimales.map((l) => {
                    if (l.tipo === s) {
                        animalesFiltrados.push(l.caravana);
                    }
                });
            });
            setAnimalesSelected(animalesFiltrados);
        }
    };

    const handleSelect = (value) => {
        if (animalesSelected.includes(value)) {
            setAnimalesSelected([...animalesSelected].filter((as) => as !== value));

            let tipoDelValue = "";
            listaAnimales.map((la) => {
                if (la.caravana === value) tipoDelValue = la.tipo;
            });

            if (selected.includes(tipoDelValue)) {
                setSelected([...selected].filter((f) => f !== tipoDelValue));
            }

            if (selected.includes("TODOS")) {
                setSelected([...selected].filter((f) => f !== "TODOS" && f !== tipoDelValue));
            }
        } else {
            setAnimalesSelected([...animalesSelected, value]);

            let tipoDelValue = "";
            const caravanasActivas = [];
            listaAnimales.map((la) => {
                caravanasActivas.push(la.caravana);
                if (la.caravana === value) tipoDelValue = la.tipo;
            });

            const caravanasConElTipoTotal = [];
            listaAnimales.map((la) => {
                if (la.tipo === tipoDelValue) caravanasConElTipoTotal.push(la.caravana);
            });

            const caravanasConElTipo = [];
            const seleccionadas = [...animalesSelected, value];
            seleccionadas.map((as) => {
                if (caravanasConElTipoTotal.includes(as)) caravanasConElTipo.push(as.caravana);
            });

            if (caravanasConElTipo.length === caravanasConElTipoTotal.length) {
                setSelected([...selected, tipoDelValue]);
            }

            if ([...animalesSelected, value].length === listaAnimales.length) {
                setSelected(["TODOS", ...tipos]);
            }
        }
    };

    const containsAllElements = (mainArray, subArray) => {
        return subArray.every((element) => mainArray.includes(element));
    };

    const cancelar = () => {
        setCloseModal(false);
    };

    const handleCarga = () => {
        if (!animalesSelected.length) {
            return Swal.fire({
                title: "Seleccione al menos un animal",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        setAnimales(animalesSelected);
        cancelar();
    };

    //buscar
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (search.length > 0) {
            const filtered = listaAnimales.filter((animal) =>
                animal.caravana.toLowerCase().includes(search.toLowerCase())
            );
            setListaAnimales(filtered);
        } else {
            setListaAnimales(back);
        }
    }, [search]);

    return (
        <div className="flex flex-col space-y-2 items-start w-[90vw] xl:w-[70vw]">
            <div className="w-full flex justify-between items-center">
                <div className="flex lg:space-x-5 items-center">
                    <div className="hidden lg:block">
                        <Titulo text="SELECCIONAR ANIMALES" />
                    </div>
                    <div className="block lg:hidden">
                        <Titulo text="SELECCIONAR" />
                    </div>
                    {loaderData ? null : (
                        <div>
                            <div className="space-x-5 hidden md:flex ml-3 lg:ml-0">
                                {tipos.map((tipo) => (
                                    <div key={tipo} className="text-md lg:text-xl space-x-2">
                                        <input
                                            type="checkbox"
                                            name={tipo}
                                            checked={selected.includes(tipo) || selected.includes("TODOS")}
                                            onChange={() => handleCheckboxChange(tipo)}
                                            className="w-4 h-4 text-button-red bg-white-bg2 border-black-comun"
                                        />
                                        <label>{tipo}</label>
                                    </div>
                                ))}
                                <div className="text-md lg:text-xl space-x-2">
                                    <input
                                        type="checkbox"
                                        name="TODOS"
                                        checked={selected.includes("TODOS")}
                                        onChange={() => handleCheckboxChange("TODOS")}
                                        className="w-4 h-4 text-button-red bg-white-bg2 border-black-comun"
                                    />
                                    <label>TODOS</label>
                                </div>
                            </div>
                            <div className="space-x-5 flex md:hidden ml-3 lg:ml-0">
                                <select onChange={handleSelectMultiple} multiple>
                                    <option value="TODOS">TODOS</option>
                                    {tipos.map((t) => (
                                        <option value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
                <div className="space-x-3 flex">
                    <BsFillGrid3X3GapFill
                        onClick={() => setConfigVista("grid")}
                        className={
                            configVista === "grid"
                                ? "bg-button-green p-1 text-3xl"
                                : "hover:bg-button-green_2 p-1 text-3xl cursor-pointer"
                        }
                    />
                    <FaList
                        onClick={() => setConfigVista("list")}
                        className={
                            configVista === "list"
                                ? "bg-button-green p-1 text-3xl"
                                : "hover:bg-button-green_2 p-1 text-3xl cursor-pointer"
                        }
                    />
                </div>
            </div>
            {loaderData ? (
                <LoaderDatos textLoader="Cargando ganado" />
            ) : (
                <div className="h-[55dvh] w-full">
                    {configVista === "list" ? (
                        <div className="h-full w-full scrollbar overflow-auto">
                            <table className="border-separate text-lg w-full text-black-comun">
                                <thead className="sticky top-0 bg-white-bg3 z-10">
                                    <tr className="bg-white-bg3 text-center">
                                        <td className="truncate">Caravana</td>
                                        <td className="truncate">Tipo</td>
                                        <td className="truncate">Fecha de ingreso</td>
                                        <td className="truncate">Estado</td>
                                    </tr>
                                </thead>
                                <tbody className="relative">
                                    {listaAnimales.length ? (
                                        listaAnimales.map((a) => (
                                            <tr
                                                key={a.id}
                                                onClick={() => handleSelect(a.caravana)}
                                                className={
                                                    animalesSelected.includes(a.caravana)
                                                        ? "bg-button-red_hover cursor-pointer text-center"
                                                        : "bg-white-bg2 hover:bg-white-bg_hover cursor-pointer text-center"
                                                }
                                            >
                                                <td>{a.caravana}</td>
                                                <td>{a.tipo}</td>
                                                <td>{a.fecha_ingreso}</td>
                                                <td>{a.estado}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <p className="text-white-bg3 absolute text-md">No hay animales cargados</p>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : listaAnimales.length ? (
                        listaAnimales.map((la) => (
                            <button
                                onClick={() => handleSelect(la.caravana)}
                                className={
                                    animalesSelected.includes(la.caravana) ? "boton_rojo m-2" : "boton_verde m-2"
                                }
                            >
                                {la.caravana}
                            </button>
                        ))
                    ) : (
                        <p className="text-white-bg3 absolute text-md">No hay animales cargados</p>
                    )}
                </div>
            )}

            <div className="w-full flex justify-between">
                <div className="flex">
                    <input
                        value={search}
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white-bg2 text-black py-2 px-3 text-xl w-60"
                        placeholder="Buscar por caravana"
                    />
                    <button onClick={() => setSearch("")} className="boton_rojo">
                        BORRAR
                    </button>
                </div>

                <div className="w-full flex justify-end space-x-3">
                    <button onClick={cancelar} className="boton_rojo">
                        CANCELAR
                    </button>
                    <button onClick={handleCarga} className="boton_verde">
                        CARGAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeleccionarAnimales;
