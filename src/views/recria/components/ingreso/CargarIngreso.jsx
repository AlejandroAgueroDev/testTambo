import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { url } from "../../../../common/URL_SERVER";

const CargarIngreso = () => {
    const [ternerosArray, setTernerosArray] = useState(
        Array.from({ length: 100 }, (_, index) => ({
            id: index + 1,
            origen: "", // caravana de la madre o vendedor
            caravana: "", // en el caso de ser hembra
            genero: "", // macho o hembra
            peso: 0, // macho o hembra
            fecha_ingreso: "", // nacimiento o ingreso
        }))
    );

    const [formIngreso, setFormIngreso] = useState({
        tipo: "", //parto o compra/entrega
        importe: 0,
        arrayIngresos: [],
        aclaracion: "",
        usuario_carga: "",
    });
    const [loader, setLoader] = useState(false);

    const [ganadoIns, setGanadoIns] = useState([]);
    useEffect(() => {
        axios(url + "tambo/ganado?limit=9999999999").then(({ data }) => {
            // Mostrar solo animales donde inseminado === true
            const inseminadas = data.data.filter((d) => d.inseminado === true && d.caravana);
            const soloCaravanas = inseminadas.map((d) => d.caravana);
            setGanadoIns(soloCaravanas);
        });
    }, []);

    const handleCanelar = () => {
        setFormIngreso({
            tipo: "", //parto o compra/entrega
            importe: 0,
            arrayIngresos: [],
            aclaracion: "",
            usuario_carga: "",
        });

        setTernerosArray(
            Array.from({ length: 100 }, (_, index) => ({
                id: index + 1,
                origen: "", // caravana de la madre o vendedor
                caravana: "", // en el caso de ser hembra
                genero: "", // macho o hembra
                peso: 0, // macho o hembra
                fecha_ingreso: "", // nacimiento o ingreso
            }))
        );
    };

    const handleChangeForm = (e) => {
        const { name, value } = e.target;

        setFormIngreso({ ...formIngreso, [name]: value });
    };

    useEffect(() => {
        setTernerosArray(
            Array.from({ length: 100 }, (_, index) => ({
                id: index + 1,
                origen: "", // caravana de la madre o vendedor
                caravana: "", // en el caso de ser hembra
                genero: "", // macho o hembra
                peso: 0, // macho o hembra
                fecha_ingreso: "", // nacimiento o ingreso
            }))
        );
    }, [formIngreso.tipo]);

    const handleSubmit = () => {
        if (formIngreso.tipo === "COMPRA" && !formIngreso.importe) {
            return Swal.fire({
                title: "Para cargar una compra, es necesario el importe de la misma",
                text: "Completa el importe para cargar el ingreso.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        if (!formIngreso.tipo || !ternerosArray.length) {
            return Swal.fire({
                title: "Complete los campos necesarios para cargar la producción",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        const arrayUtilizados = [...ternerosArray].filter((item) => item.origen && item.genero && item.fecha_ingreso);

        if (arrayUtilizados.length === 0) {
            return Swal.fire({
                title: "Agregue a la tabla al menos un ternero con los datos necesarios",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        if (formIngreso.tipo === "PARTO") {
            const caravanasError = [];
            arrayUtilizados.forEach((i) => {
                if (!ganadoIns.includes(i.origen)) {
                    caravanasError.push(i.origen);
                }
            });

            if (caravanasError.length) {
                return Swal.fire({
                    title:
                        "Las caravanas: " +
                        caravanasError.join(" ") +
                        " que ingresaste no coinciden con un animal inseminado",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#D64747",
                    icon: "warning",
                });
            }
        }

        const arraySinIds = arrayUtilizados.map((item) => {
            const { id, ...rest } = item;
            return rest;
        });

        let isError = false;
        arraySinIds.map((t) => {
            if (t.genero !== "MACHO" && t.genero !== "HEMBRA") {
                isError = true;
            }
        });

        if (isError) {
            return Swal.fire({
                title: 'El genero para cada ternero solo puede ser "MACHO" O "HEMBRA"',
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }
        const formSub = {
            ...formIngreso,
            fecha_carga: new Date().toISOString().split("T")[0],
            hora_carga: new Date().toTimeString().split(" ")[0],
            arrayIngresos: arraySinIds,
            usuario_carga: localStorage.getItem("user_id"),
            tipo_ingreso: formIngreso.tipo,
        };
        setLoader(true);
        axios
            .post(url + "recria/ingreso", formSub)
            .then((res) => {
                setLoader(false);
                Swal.fire({
                    title: "Ingreso de terneros cargado con éxito",
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

    //! TABLA
    const handleChangeInput = (e) => {
        const id = e.target.id;
        const name = e.target.name;
        const value =
            name === "origen" || name === "caravana" || name === "genero"
                ? e.target.value.toUpperCase()
                : e.target.value;

        const getAnimalId = (id) => {
            return ternerosArray.find((caravana) => caravana.id === Number(id));
        };

        const animalAModificar = getAnimalId(id);

        if (animalAModificar) {
            const animalModificado = { ...animalAModificar, [name]: value };

            setTernerosArray(
                ternerosArray.map((caravana) => (caravana.id === Number(id) ? animalModificado : caravana))
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
                if ((currentIndex + 1) % 5 !== 0) {
                    nextIndex = currentIndex + 1;
                }
                break;
            case "ArrowLeft":
                e.preventDefault();
                if (currentIndex % 5 !== 0) {
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
    }, [ternerosArray]);

    return (
        <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full scrollbar lg:overflow-auto">
            <div className="flex w-full">
                <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">CARGAR INGRESO</h2>
            </div>

            <div className="flex flex-col w-full">
                <label className="text-xl font-semibold text-white-bg3">
                    Tipo de ingreso <strong className="text-red-400">*</strong>
                </label>
                <select
                    name="tipo"
                    onChange={handleChangeForm}
                    className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                    value={formIngreso.tipo}
                >
                    <option disabled value="">
                        Seleccione una opción
                    </option>
                    <option value="PARTO">PARTO</option>
                    <option value="COMPRA">COMPRA</option>
                    <option value="ENTREGA">ENTREGA</option>
                </select>
            </div>

            <div className={`${formIngreso.tipo === "PARTO" ? "flex" : "hidden"} flex-col w-full`}>
                <label className="text-xl font-semibold text-white-bg3">Ganado inseminado</label>
                <div className="w-full flex bg-white-bg2 items-center">
                    <p className="bg-white-bg2 text-black-comun py-2 pl-2 text-xl w-full flex-wrap max-h-40 scrollbar overflow-auto">
                        {ganadoIns.join(", ") || "Sin ganado inseminado"}
                    </p>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <label className={`text-xl font-semibold text-white-bg3 ${formIngreso.tipo ? "block" : "hidden"}`}>
                    Datos por animal (maximo 100) <strong className="text-red-400">*</strong>
                </label>
                <p
                    className={`text-sm text-white-bg3 ${
                        formIngreso.tipo && formIngreso.tipo === "Parto" ? "block" : "hidden"
                    }`}
                >
                    En el caso de que el ternero sea macho no es necesario indicarle caravana
                </p>
                {formIngreso.tipo ? (
                    <div className="w-full scrollbar overflow-auto">
                        <div className="h-full max-h-60">
                            <table className="border-separate text-lg w-full relative" ref={tableRef}>
                                <thead className="sticky top-0 align-bottom  bg-white-bg3 z-10 text-white-bg2">
                                    <tr>
                                        <th className="px-[2px]">
                                            {formIngreso.tipo === "PARTO" ? "Carav. madre" : "Origen"}
                                        </th>
                                        <th className="px-[2px]">Caravana</th>
                                        <th className="px-[2px]">Genero</th>
                                        <th className="px-[2px]">Peso</th>
                                        <th className="px-[2px]">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white-bg">
                                    {ternerosArray.map((gan) => (
                                        <tr key={gan.id}>
                                            <td className="w-32 bg-[#d8c7bb]">
                                                <input
                                                    type="text"
                                                    className={`w-full  ${
                                                        formIngreso.tipo === "PARTO" ? "bg-[#eca0a0]" : "bg-[#b5b6d7]"
                                                    } px-2 text-center rounded-none`}
                                                    value={gan.origen}
                                                    onKeyDown={preventArrowKeyChange}
                                                    id={gan.id}
                                                    onChange={handleChangeInput}
                                                    name="origen"
                                                />
                                            </td>
                                            <td className="max-w-40">
                                                <input
                                                    type="text"
                                                    className="w-full bg-white-bg2 px-2 rounded-none"
                                                    onKeyDown={preventArrowKeyChange}
                                                    onChange={handleChangeInput}
                                                    name="caravana"
                                                    value={gan.caravana}
                                                    id={gan.id}
                                                />
                                            </td>
                                            <td className="max-w-40">
                                                <select
                                                    name="genero"
                                                    className="w-full text-xl bg-white-bg2 rounded-none"
                                                    onKeyDown={preventArrowKeyChange}
                                                    onChange={handleChangeInput}
                                                    id={gan.id}
                                                    value={gan.genero || ""}
                                                >
                                                    <option value="" disabled>
                                                        Seleccionar
                                                    </option>
                                                    <option value="MACHO">Macho</option>
                                                    <option value="HEMBRA">Hembra</option>
                                                </select>
                                            </td>
                                            <td className="max-w-40">
                                                <input
                                                    type="text"
                                                    className="w-full bg-white-bg2 px-1 rounded-none"
                                                    onKeyDown={preventArrowKeyChange}
                                                    onChange={handleChangeInput}
                                                    name="peso"
                                                    value={gan.peso ? gan.peso : ""}
                                                    id={gan.id}
                                                />
                                            </td>
                                            <td className="max-w-40">
                                                <input
                                                    type="date"
                                                    className="w-full bg-white-bg2 px-2 rounded-none"
                                                    onKeyDown={preventArrowKeyChange}
                                                    onChange={handleChangeInput}
                                                    name="fecha_ingreso"
                                                    value={gan.fecha_ingreso}
                                                    id={gan.id}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <tr>
                        <td className="h-60 bg-white-bg2 p-2 text-center flex">
                            Seleccione el tipo de ingreso para completar los datos
                        </td>
                    </tr>
                )}
            </div>

            <div className={`${formIngreso.tipo === "COMPRA" ? "flex" : "hidden"} flex-col w-full`}>
                <label className="text-xl font-semibold text-white-bg3">Importe</label>
                <div className="w-full flex bg-white-bg2 items-center">
                    <p className="text-2xl px-3 text-white-bg3">$</p>
                    <input
                        onChange={handleChangeForm}
                        type="number"
                        value={formIngreso.importe ? formIngreso.importe : ""}
                        name="importe"
                        className="bg-white-bg2 text-black-comun py-2 pl-2 text-xl w-full"
                    />
                </div>
            </div>

            <div className="space-x-2 flex justify-end w-full">
                <button onClick={handleCanelar} className="boton_rojo">
                    CANCELAR
                </button>
                <button onClick={handleSubmit} className="boton_verde w-32">
                    {loader ? <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" /> : "CARGAR"}
                </button>
            </div>
        </div>
    );
};

export default CargarIngreso;
