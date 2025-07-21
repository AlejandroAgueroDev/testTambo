import Chart from "react-apexcharts";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";

const ReporteLitrosTotales = () => {
    const [año, setAño] = useState(obtenerFechaActual("fecha").split("-")[2]);
    const [añoAnterior, setAñoAnterior] = useState(false);
    const [configuracionGrafico, setConfiguracionGrafico] = useState({
        type: "line",
        height: 400,
        series: [],
        options: {
            chart: {
                zoom: {
                    enabled: false, // Deshabilitar el zoom
                },
            },
            dataLabels: {
                enabled: false,
            },
            colors: ["#86C394"],
            stroke: {
                width: 7, // Grosor de la línea
                curve: "smooth", // Línea suave opcional
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
                min: 1000, // Valor mínimo del eje Y
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
        axios(url + `tambo/produccionleche/estadisticas?year=${año}`).then(({ data }) => {
            const datosArray = Array.from({ length: 12 }, (_, index) => null);

            data.map((d) => {
                datosArray.splice(d.mes - 1, 1, d.totalLitros);
            });
            setConfiguracionGrafico({
                ...configuracionGrafico,
                series: [
                    {
                        name: "Litros",
                        data: datosArray,
                    },
                ],
            });
        });
    }, []);

    useEffect(() => {
        axios(url + `tambo/produccionleche/estadisticas?year=${año}`)
            .then(({ data }) => {
                if (!data.length) {
                    return Swal.fire({
                        title: `No se encontraron registros para el año ${año}`,
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#A1D2AD",
                        iconColor: "#A1D2AD",
                        icon: "question",
                    }).then(() => {
                        setAño(obtenerFechaActual("fecha").split("-")[2]);
                        setAñoInput("");
                    });
                }

                const datosArray = Array.from({ length: 12 }, (_, index) => null);
                data.map((d) => {
                    datosArray.splice(d.mes - 1, 1, d.totalLitros);
                });
                setConfiguracionGrafico({
                    ...configuracionGrafico,
                    series: [
                        {
                            name: "Litros",
                            data: datosArray,
                        },
                    ],
                });
            })
            .catch(() => {
                Swal.fire({
                    title: `Formato de año no valido`,
                    text: "Ingrese el año completo para buscar (ejemplo, 2025)",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#D64747",
                    iconColor: "#D64747",
                    icon: "question",
                }).then(() => {
                    setAño(obtenerFechaActual("fecha").split("-")[2]);
                    setAñoInput("");
                });
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
                <Titulo text={`LITROS POR MES | AÑO ${año}`} />
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

export default ReporteLitrosTotales;
