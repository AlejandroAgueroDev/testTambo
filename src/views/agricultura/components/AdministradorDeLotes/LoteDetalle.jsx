import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import DatosLote from "./DatosLote";
import ActualizarEstadoLote from "./ActualizarEstadoLote";
import HistorialActualizaciones from "./HisorialActualizaciones";
import { url } from "../../../../common/URL_SERVER";

const LoteDetalle = () => {
    const [datosLote, setDatosLote] = useState({});
    const [estado, setEstado] = useState("");
    const { id } = useParams();
    const [loader, setLoader] = useState(true);

    const getData = () => {
        setLoader(true);
        axios(url + "agricultura/" + id).then(({ data }) => {
            const formatData = [];
            if (data.EstadoSiembras.length) {
                data.EstadoSiembras.map((e) => {
                    const fechaDesarm = e.fecha.split("T")[0].split("-");
                    formatData.push({ ...e, fechaFormat: `${fechaDesarm[2]}/${fechaDesarm[1]}/${fechaDesarm[0]}` });
                });
                formatData.reverse();
                setEstado(formatData[0].estado);
                setDatosLote({ ...data, EstadoSiembras: formatData });
                setLoader(false);
            } else {
                setDatosLote(data);
                setLoader(false);
            }
        });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <ContenedorGeneral navText="AGRICULTURA">
            <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="AGRICULTURA | ADMINISTRADOR DE LOTES" />
                <Link to="/agricultura/lotes" className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            <div className="w-screen md:w-full sm:hidden flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="ADMINISTRADOR DE LOTES" />
                <Link to="/agricultura/lotes" className="boton_rojo">
                    VOLVER
                </Link>
            </div>

            <div className="h-[79%] md:h-[96%] w-full  pr-4 md:p-0 md:w-auto  space-y-2 p-2">
                <DatosLote dataLote={datosLote} loader={loader} />

                <div className="h-[79%] md:h-[83.5%] flex justify-between scrollbar overflow-auto">
                    <ActualizarEstadoLote data={datosLote} getData={getData} estadoActual={estado} />

                    <HistorialActualizaciones data={datosLote} getData={getData} loader={loader} />
                </div>
            </div>
        </ContenedorGeneral>
    );
};

export default LoteDetalle;
