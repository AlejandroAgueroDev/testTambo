import Chart from "react-apexcharts";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";

const ReportePartos = () => {
    const [año, setAño] = useState(obtenerFechaActual("fecha").split("-")[2]);
    const [añoAnterior, setAñoAnterior] = useState(false);
    const [datos, setDatos] = useState({});
    const [configuracionGrafico, setConfiguracionGrafico] = useState({
        type: "bar",
        height: 400,
        series: [],
        options: {
            chart: {
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            colors: ["#D64747", "#86C394"],
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
            },
            markers: {
                size: 4,
                colors: "#A1D2AD",
            },
            xaxis: {
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                },
                labels: {
                    style: {
                        colors: "#252525",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
                categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            },
            yaxis: {
                min: 0, // Valor mínimo del eje Y
                labels: {
                    style: {
                        colors: "#616161",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
            },
            grid: {
                show: true,
                borderColor: "#bcbbbb",
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 5,
                    right: 20,
                },
            },
            fill: {
                opacity: 0.8,
            },
            tooltip: {
                theme: "dark",
            },
        },
    });

    useEffect(() => {
        axios(url + "recria/").then(({ data }) => {
            const contadorMachos = Array(12).fill(0);
            const contadorHembras = Array(12).fill(0);

            let hayAlgo = false;
            // console.log(data);

            data.map((d) => {
                const fecha = d.fecha_ingreso.split("T")[0];
                const mes = parseInt(fecha.split("-")[1], 10) - 1;
                const añoIngreso = fecha.split("-")[0];
                if (d.tipo_ingreso === "PARTO" && añoIngreso === año) {
                    hayAlgo = true;

                    // Filtramos solo PARTO
                    if (d.genero === "MACHO") {
                        contadorMachos[mes] += 1;
                    } else if (d.genero === "HEMBRA") {
                        contadorHembras[mes] += 1;
                    }
                }
            });

            if (!hayAlgo) {
                Swal.fire({
                    title: `No se encontraron registros para el año ${año}`,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#A1D2AD",
                    iconColor: "#A1D2AD",
                    icon: "question",
                });
                setAñoInput("");
                return handleAñoActual();
            } else {
                setConfiguracionGrafico({
                    ...configuracionGrafico,
                    series: [
                        {
                            name: "Hembras",
                            data: contadorHembras,
                        },
                        {
                            name: "Machos",
                            data: contadorMachos,
                        },
                    ],
                });
            }
        });
    }, [año]);

    const handleAñoActual = () => {
        setAño(obtenerFechaActual("fecha").split("-")[2]);
        setAñoAnterior(false);
    };

    const [añoInput, setAñoInput] = useState("");

    return (
        <div className="w-full space-y-2 p-2">
            <div className="flex justify-between">
                <Titulo text={`NACIMIENTOS | AÑO ${año}`} />
            </div>
            <div className="bg-white-bg2">
                <Chart {...configuracionGrafico} />
            </div>
            <div className="flex justify-end">
                {añoAnterior ? (
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            value={añoInput}
                            placeholder="XXXX"
                            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-32"
                            onChange={(e) => setAñoInput(e.target.value)}
                        />
                        <button onClick={() => setAño(añoInput)} className="boton_verde">
                            <FaSearch className="text-center w-7 text-xl" />
                        </button>
                        <button onClick={handleAñoActual} className="boton_verde">
                            {/* <IoClose className="text-center w-7 text-3xl" /> */}
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
};

export default ReportePartos;
