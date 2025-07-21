import Chart from "react-apexcharts";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";

const ReporteLoteEstados = () => {
    const [datos, setDatos] = useState({});
    const [configuracionGrafico, setConfiguracionGrafico] = useState({
        type: "donut",
        height: 400,
        series: [],
        options: {
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            ],
            labels: [],
            chart: {
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            colors: ["#D64747", "#86C394", "#d6d447", "#979797", "#373737", "#E16D6D", "#bfd2c4", "#A1D2AD", "#f0ee57"],
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
            },
            fill: {
                opacity: 0.8,
            },
            tooltip: {
                theme: "dark",
            },
        },
    });
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        axios(url + "agricultura/").then(({ data }) => {
            const arrayHectareas = [];
            const arrayEstados = [];

            const formatData = [];
            data.map((d) => {
                formatData.push({ ...d, EstadoSiembras: d.EstadoSiembras.reverse() });
            });

            formatData.map((fd) => {
                const estadoActual = fd.EstadoSiembras[0].estado;

                if (!arrayEstados.includes(estadoActual.toUpperCase())) {
                    let contadorDeHectareas = 0;

                    formatData.map((d) => {
                        if (d.EstadoSiembras[0].estado.toLowerCase() === estadoActual.toLowerCase()) {
                            contadorDeHectareas += d.hectareas;
                        }
                    });

                    arrayHectareas.push(contadorDeHectareas);
                    arrayEstados.push(estadoActual.toUpperCase());
                }
            });

            setConfiguracionGrafico({
                ...configuracionGrafico,
                series: arrayHectareas,
                options: { ...configuracionGrafico.options, labels: arrayEstados },
            });
            setLoader(false);
        });
    }, []);

    const handleAñoActual = () => {
        setAño(obtenerFechaActual("fecha").split("-")[0]);
        setAñoAnterior(false);
    };

    const [añoInput, setAñoInput] = useState("");

    return (
        <div className="w-full space-y-2 p-2">
            <div className="flex justify-between">
                <Titulo text="ESTADOS ACTUALES DE LOTES (HECTAREAS)" />
            </div>
            <div className="bg-white-bg2">
                {loader ? (
                    <div className="h-20 flex justify-center items-center">
                        <p>Cargando datos...</p>
                    </div>
                ) : (
                    <Chart {...configuracionGrafico} />
                )}
            </div>
        </div>
    );
};

export default ReporteLoteEstados;
