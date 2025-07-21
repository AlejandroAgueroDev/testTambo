import Chart from "react-apexcharts";
import Titulo from "../../../../common/Titulo";
import { useState, useEffect } from "react";
import { url } from "../../../../common/URL_SERVER";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import axios from "axios";
import Swal from "sweetalert2";
import LoaderDatos from "../../../../common/LoaderDatos";
import { FaSearch } from "react-icons/fa";

export default function ReporteCompraVenta() {
    const [litrosTotal, setLitrosTotal] = useState(0);
    const [loaderLitros, setLoaderLitros] = useState(true);

    const [controlesProduccion, setControlesProduccion] = useState(0);
    const [loaderContrProd, setLoaderContProd] = useState(true);

    const [controlesVeterinarios, setControlesVeterinarios] = useState(0);
    const [loaderContVet, setLoaderContVet] = useState(true);

    const [inseminaciones, setInseminaciones] = useState(0);
    const [loaderIns, setLoaderIns] = useState(true);

    const [año, setAño] = useState(obtenerFechaActual("fecha").split("-")[2]);
    const [añoAnterior, setAñoAnterior] = useState(false);
    const [añoInput, setAñoInput] = useState("");

    useEffect(() => {
        // LITROS TOTALES
        setLoaderLitros(true);
        axios(url + `tambo/produccionleche/estadisticas?year=${año}`)
            .then(({ data }) => {
                setLoaderLitros(false);
                let litros = 0;
                data.map((d) => {
                    litros += d.totalLitros;
                });
                setLitrosTotal(litros);
            })
            .catch(() => {
                setLoaderLitros(false);
                Swal.fire({
                    title: "Error obteniendo datos de producción",
                    icon: "error",
                    confirmButtonColor: "#D64747",
                });
            });

        // CONTROL DE PRODUCCION
        setLoaderContProd(true);
        axios(url + "tambo/control?page=1&limit=500")
            .then(({ data }) => {
                setLoaderContProd(false);
                const dataFormat = data.data.map((d) => {
                    const fecha = d.createdAt.split("T")[0];
                    const arrayFecha = fecha.split("-");
                    const fechaFinal = arrayFecha[0];
                    return {
                        ...d,
                        año: fechaFinal,
                    };
                });

                let contadorControlesAño = 0;
                dataFormat.map((d) => {
                    if (d.año === año) {
                        contadorControlesAño += 1;
                    }
                });
                setControlesProduccion(contadorControlesAño);
            })
            .catch(() => {
                setLoaderContProd(false);
                Swal.fire({
                    title: "Error obteniendo datos de control de producción",
                    icon: "error",
                    confirmButtonColor: "#D64747",
                });
            });

        // INSEMINACIONES
        setLoaderIns(true);
        axios(url + "tambo/ganado/inseminacion/")
            .then(({ data }) => {
                setLoaderIns(false);
                const inseminacionesFormat = data.data.map((inseminaciones) => {
                    const fecha = inseminaciones.fecha.split("T")[0];
                    const arrayFecha = fecha.split("-");
                    const fechaFinal = arrayFecha[0];
                    return { ...inseminaciones, año: fechaFinal };
                });

                let contadorInseminaciones = 0;
                inseminacionesFormat.map((i) => {
                    if (i.año === año) {
                        contadorInseminaciones += 1;
                    }
                });

                setInseminaciones(contadorInseminaciones);
            })
            .catch(() => {
                setLoaderIns(false);
                Swal.fire({
                    title: "Error obteniendo datos de inseminación",
                    icon: "error",
                    confirmButtonColor: "#D64747",
                });
            });

        // CONTROLES VETERINARIOS
        setLoaderContVet(true);
        axios(url + "tambo/controlveterinario")
            .then(({ data }) => {
                setLoaderContVet(false);
                const recientes = data.map((cargado) => {
                    const fecha = cargado.createdAt.split("T")[0];
                    const arrayFecha = fecha.split("-");
                    const fechaFinal = arrayFecha[0];
                    return {
                        ...cargado,
                        año: fechaFinal,
                    };
                });

                let contadorContVet = 0;
                recientes.map((i) => {
                    if (i.año === año) {
                        contadorContVet += 1;
                    }
                });

                setControlesVeterinarios(contadorContVet);
            })
            .catch(() => {
                setLoaderContVet(false);
                Swal.fire({
                    title: "Error obteniendo datos de control veteriario",
                    icon: "error",
                    confirmButtonColor: "#D64747",
                });
            });
    }, [año]);

    const handleAñoActual = () => {
        setAño(obtenerFechaActual("fecha").split("-")[2]);
        setAñoAnterior(false);
        setAñoInput("");
    };

    const handleBuscarAño = () => {
        if (!añoInput || añoInput.length !== 4) {
            Swal.fire({
                title: "Año inválido",
                text: "Por favor ingrese un año válido (4 dígitos)",
                icon: "warning",
                confirmButtonColor: "#D64747",
            });
            return;
        }
        setAño(añoInput);
        setAñoAnterior(false);
    };

    return (
        <div className="w-full space-y-2 p-2">
            <div className="flex justify-between">
                <Titulo text={`REPORTES VARIOS | AÑO ${año}`} />
            </div>

            <div className="bg-white-bg2 flex flex-col p-2">
                <p className="text-lg font-semibold text-white-bg3">Cantidad de controles veterinarios realizados:</p>
                {loaderContVet ? (
                    <LoaderDatos textLoader="Cargando datos..." />
                ) : (
                    <p className="text-lg font-semibold text-black-comun">
                        {controlesVeterinarios} {controlesVeterinarios === 1 ? "control." : "controles."}
                    </p>
                )}
            </div>

            <div className="bg-white-bg2 flex flex-col p-2">
                <p className="text-lg font-semibold text-white-bg3">Cantidad de vacas inseminadas:</p>
                {loaderIns ? (
                    <LoaderDatos textLoader="Cargando datos..." />
                ) : (
                    <p className="text-lg font-semibold text-black-comun">
                        {inseminaciones} {inseminaciones === 1 ? "inseminación." : "inseminaciones."}
                    </p>
                )}
            </div>

            <div className="bg-white-bg2 flex flex-col p-2">
                <p className="text-lg font-semibold text-white-bg3">Cantidad de controles de produccion realizados:</p>
                {loaderContrProd ? (
                    <LoaderDatos textLoader="Cargando datos..." />
                ) : (
                    <p className="text-lg font-semibold text-black-comun">
                        {controlesProduccion} {controlesProduccion === 1 ? "control." : "controles."}
                    </p>
                )}
            </div>

            <div className="bg-white-bg2 flex flex-col p-2">
                <p className="text-lg font-semibold text-white-bg3">Cantidad de litros ordeñados:</p>
                {loaderLitros ? (
                    <LoaderDatos textLoader="Cargando datos..." />
                ) : (
                    <p className="text-lg font-semibold text-black-comun">{litrosTotal} lts.</p>
                )}
            </div>

            <div className="flex justify-end">
                {añoAnterior ? (
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            value={añoInput}
                            placeholder="AAAA"
                            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-32"
                            onChange={(e) => setAñoInput(e.target.value)}
                            min="2000"
                            max="2099"
                        />
                        <button onClick={handleBuscarAño} className="boton_verde">
                            <FaSearch className="text-center w-7 text-xl" />
                        </button>
                        <button onClick={handleAñoActual} className="boton_verde">
                            AÑO ACTUAL
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setAñoAnterior(true)} className="boton_verde">
                        BUSCAR AÑO ANTERIOR
                    </button>
                )}
            </div>
        </div>
    );
}