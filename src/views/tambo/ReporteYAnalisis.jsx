import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import ReporteLitrosTotales from "./components/reporteYAnalisis/ReporteLitrosTotales";
import ReporteCompraVenta from "./components/reporteYAnalisis/ReporteCompraVenta";

const ReporteYAnalisis = () => {
    return (
        <ContenedorGeneral navText="TAMBO">
            <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="TAMBO | REPORTE Y ANALISIS" />
                <Link to="/tambo" className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            <div className="w-screen md:w-full sm:hidden flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="REPORTE Y ANALISIS" />
                <Link to="/tambo" className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
                <ReporteLitrosTotales />

                <div className="hidden sm:block">
                    <BarraSeparadora orientacion="vertical" />
                </div>
                <div className="sm:hidden">
                    <BarraSeparadora orientacion="horizontal" />
                </div>

                <ReporteCompraVenta />
            </div>
        </ContenedorGeneral>
    );
};

export default ReporteYAnalisis;
