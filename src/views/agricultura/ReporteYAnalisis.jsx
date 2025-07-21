import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import ReporteLoteEstados from "./components/reporteYAnalisis/ReporteLotesEstado";
import ReporteAgrVarios from "./components/reporteYAnalisis/ReportesAgrVarios";

const ReporteYAnalisisAgricultura = () => {
  return (
    <ContenedorGeneral navText="AGRICULTURA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="AGRICULTURA | REPORTE Y ANALISIS" />

        <Link to="/agricultura" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
        <ReporteLoteEstados />

        <div className="hidden sm:block">
          <BarraSeparadora orientacion="vertical" />
        </div>
        <div className="sm:hidden">
          <BarraSeparadora orientacion="horizontal" />
        </div>

        <ReporteAgrVarios />
      </div>
    </ContenedorGeneral>
  );
};

export default ReporteYAnalisisAgricultura;
