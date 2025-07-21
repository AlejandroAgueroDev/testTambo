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

const SeleccionarAnimalesIns = ({ setCloseModal, setAnimales, animales }) => {
    const [animalesSelected, setAnimalesSelected] = useState(animales);
    const [animalesSelectedId, setAnimalesSelectedId] = useState(animales.map((a) => a.id));
    const [tipos, setTipos] = useState([]);
    const [listaAnimales, setListaAnimales] = useState([]);
    const [back, setBack] = useState([]);
    const [selected, setSelected] = useState([]);
    const [configVista, setConfigVista] = useState("list");
    const [loaderData, setLoaderData] = useState(true);

    useEffect(() => {
        axios(url + "tambo/ganado?limit=99999999999").then(({ data }) => {
            setLoaderData(false);
            const dataArray = [];
            data.data.map((cargado) => {
                if (cargado.tipo !== "TERNERA") {
                    const fecha = cargado.fecha_ingreso.split("T")[0];
                    const arrayFecha = fecha.split("-");
                    const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
                    dataArray.push({ ...cargado, fecha_ingreso: fechaFinal, sexado: "", pajuela: "" });
                }
            });
            setListaAnimales(dataArray);
            setBack(dataArray);
            console.log(dataArray);
        });
    }, []);

    const handleSelect = (animal) => {
        if (animal.inseminado) {
            return;
        }

        if (animalesSelectedId.includes(animal.id)) {
            setAnimalesSelectedId([...animalesSelectedId].filter((as) => as !== animal.id));
            setAnimalesSelected([...animalesSelected].filter((as) => as.id !== animal.id));

            // let tipoDelValue = "";
            // listaAnimales.map((la) => {
            //     if (la.caravana === value) tipoDelValue = la.tipo;
            // });

            // if (selected.includes(tipoDelValue)) {
            //     setSelected([...selected].filter((f) => f !== tipoDelValue));
            // }

            // if (selected.includes("TODOS")) {
            //     setSelected([...selected].filter((f) => f !== "TODOS" && f !== tipoDelValue));
            // }
        } else {
            setAnimalesSelectedId([...animalesSelectedId, animal.id]);
            setAnimalesSelected([...animalesSelected, animal]);

            // let tipoDelValue = "";
            // const caravanasActivas = [];
            // listaAnimales.map((la) => {
            //     caravanasActivas.push(la.caravana);
            //     if (la.caravana === value) tipoDelValue = la.tipo;
            // });

            // const caravanasConElTipoTotal = [];
            // listaAnimales.map((la) => {
            //     if (la.tipo === tipoDelValue) caravanasConElTipoTotal.push(la.caravana);
            // });

            // const caravanasConElTipo = [];
            // const seleccionadas = [...animalesSelected, value];
            // seleccionadas.map((as) => {
            //     if (caravanasConElTipoTotal.includes(as)) caravanasConElTipo.push(as.caravana);
            // });

            // if (caravanasConElTipo.length === caravanasConElTipoTotal.length) {
            //     setSelected([...selected, tipoDelValue]);
            // }

            // if ([...animalesSelected, value].length === listaAnimales.length) {
            //     setSelected(["TODOS", ...tipos]);
            // }
        }
    };

    // const containsAllElements = (mainArray, subArray) => {
    //     return subArray.every((element) => mainArray.includes(element));
    // };

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

                    <div className="space-x-2">
                        <strong className="text-button-red_hover px-2 py-1 bg-white-bg2">SELECCIONADA</strong>
                        <strong className="text-button-green_hover px-2 py-1 bg-white-bg2">INSEMINADA</strong>
                    </div>
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
                                        <td className="truncate">Estado</td>
                                    </tr>
                                </thead>
                                <tbody className="relative">
                                    {listaAnimales.length ? (
                                        listaAnimales.map((a) => (
                                            <tr
                                                key={a.id}
                                                onClick={() => handleSelect(a)}
                                                className={
                                                    animalesSelectedId.includes(a.id)
                                                        ? "bg-button-red_hover cursor-pointer text-center"
                                                        : a.inseminado
                                                        ? "bg-button-green_hover text-center"
                                                        : "bg-white-bg2 hover:bg-white-bg_hover cursor-pointer text-center"
                                                }
                                            >
                                                <td>{a.caravana}</td>
                                                <td>{a.tipo}</td>
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
                                onClick={() => handleSelect(la)}
                                className={animalesSelectedId.includes(la.id) ? "boton_rojo m-2" : "boton_verde m-2"}
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

export default SeleccionarAnimalesIns;
