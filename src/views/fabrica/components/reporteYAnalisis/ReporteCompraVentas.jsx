import Chart from "react-apexcharts";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";

const ReporteCompraVentas = () => {
    const [año, setAño] = useState(obtenerFechaActual("fecha").split("-")[2]);
    const [añoAnterior, setAñoAnterior] = useState(false);
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [añoInput, setAñoInput] = useState("");

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${url}fabrica/ventaproducto`);
                setVentas(data);

                // Procesar datos para el gráfico
                procesarDatosGrafico(data);
            } catch (error) {
                console.error("Error al obtener ventas:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron cargar los datos de ventas",
                    icon: "error",
                    confirmButtonColor: "#D64747",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchVentas();
    }, [año]);

    const procesarDatosGrafico = (ventas) => {
        // Agrupar ventas por mes
        const ventasPorMes = Array(12).fill(0);
        ventas.forEach((venta) => {
            const añoVenta = venta.fecha.split("T")[0].split("-")[0];
            if (añoVenta === año) {
                const mesVenta = venta.fecha.split("T")[0].split("-")[1];
                const mesSinCero = mesVenta[0] === "0" ? mesVenta[1] : mesVenta; // Eliminar el cero inicial si existe
                ventasPorMes[mesSinCero - 1] += venta.monto;
            }
        });
        console.log(ventasPorMes);

        setConfiguracionGrafico((prev) => ({
            ...prev,
            series: [
                {
                    name: "IMPORTE",
                    data: ventasPorMes,
                },
            ],
        }));
    };

    const [configuracionGrafico, setConfiguracionGrafico] = useState({
        type: "bar",
        height: 400,
        series: [
            {
                name: "Ventas",
                data: [],
            },
        ],
        options: {
            chart: {
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            colors: ["#4CAF50"], // Solo verde
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
            },
            markers: {
                size: 4,
                colors: ["#4CAF50"],
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
                min: 0,
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
                y: {
                    formatter: function (value) {
                        return (value === 1 ? "$ " : "$ ") +value  ;
                    },
                },
            },
        },
    });

    const handleAñoActual = () => {
        setAño(obtenerFechaActual("fecha").split("-")[2]);
        setAñoAnterior(false);
    };

    const handleBuscarAño = () => {
        if (!añoInput || añoInput.length !== 4) {
            return Swal.fire({
                title: "Año inválido",
                text: "Por favor ingrese un año válido (4 dígitos)",
                icon: "warning",
                confirmButtonColor: "#D64747",
            });
        }
        setAño(añoInput);
        setAñoAnterior(false);
    };

    return (
        <div className="w-full space-y-2 p-2">
            <div className="flex justify-between">
                <Titulo text={`INGRESOS POR VENTAS | AÑO ${año}`} />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-white-bg3">Cargando datos...</p>
                </div>
            ) : (
                <>
                    <div className="bg-white-bg2">
                        <Chart {...configuracionGrafico} />
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
                </>
            )}
        </div>
    );
};

export default ReporteCompraVentas;
