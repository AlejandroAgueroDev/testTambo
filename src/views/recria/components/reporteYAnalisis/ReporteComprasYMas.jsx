import Titulo from "../../../../common/Titulo";
import { useState, useEffect } from "react";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";

export default function ReporteComprasYMas() {
    const [año, setAño] = useState(obtenerFechaActual("fecha").split("-")[2]);
    const [añoAnterior, setAñoAnterior] = useState(false);
    const [añoInput, setAñoInput] = useState("");
    const [cantidadComprados, setCantidadComprados] = useState(0);
    const [cantidadEntrega, setCantidadEntrega] = useState(0);
    const [loader, setLoader] = useState(true);
    const [cantidadVentas, setCantidadVentas] = useState(0);
    const [loaderVentas, setLoaderVentas] = useState(true);

    useEffect(() => {
        setLoader(true);
        setLoaderVentas(true);

        axios(url + "recria/").then(({ data }) => {
            let hayAlgo = false;
            let contadorCompras = 0;
            let contadorEntregas = 0;

            data.map((d) => {
                const añoIngreso = d.fecha_ingreso.split("-")[0];
                if (añoIngreso === año && d.tipo_ingreso === "COMPRA") {
                    hayAlgo = true;
                    contadorCompras += 1;
                } else if (añoIngreso === año && d.tipo_ingreso === "ENTREGA") {
                    hayAlgo = true;
                    contadorEntregas += 1;
                }
            });
            setLoader(false);
            setCantidadComprados(contadorCompras);
            setCantidadEntrega(contadorEntregas);
        });

        axios(url + "recria/macho").then(({ data }) => {
            let contadorVentas = 0;

            if (data.message !== "Todavia no tiene terneros") {
                data.movimientos.map((mov) => {
                    const fechaDesarm = mov.fecha.split("T")[0].split("-");
                    const añoData = fechaDesarm[0];

                    if (año === añoData && mov.tipo_movimiento === "VENTA") {
                        contadorVentas += mov.terneros_afectados;
                    }
                });
            }
            setLoaderVentas(false);
            setCantidadVentas(contadorVentas);
        });
    }, [año]);

    const handleAñoActual = () => {
        setAño(obtenerFechaActual("fecha").split("-")[2]);
        setAñoAnterior(false);
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
                <p className="text-lg font-semibold text-white-bg3">Cantidad de compras realizadas:</p>
                {loader ? (
                    <LoaderDatos textLoader="Cargando datos..." />
                ) : (
                    <p className="text-lg font-semibold text-black-comun">
                        {cantidadComprados} {cantidadComprados === 1 ? "compra." : "compras."}
                    </p>
                )}
            </div>

            <div className="bg-white-bg2 flex flex-col p-2">
                <p className="text-lg font-semibold text-white-bg3">Cantidad de entregas recibidas:</p>
                {loader ? (
                    <LoaderDatos textLoader="Cargando datos..." />
                ) : (
                    <p className="text-lg font-semibold text-black-comun">
                        {cantidadEntrega} {cantidadEntrega === 1 ? "entrega." : "entregas."}
                    </p>
                )}
            </div>

            <div className="bg-white-bg2 flex flex-col p-2">
                <p className="text-lg font-semibold text-white-bg3">Cantidad de ventas de machos:</p>
                {loaderVentas ? (
                    <LoaderDatos textLoader="Cargando datos..." />
                ) : (
                    <p className="text-lg font-semibold text-black-comun">
                        {cantidadVentas} {cantidadVentas === 1 ? "venta." : "ventas."}
                    </p>
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