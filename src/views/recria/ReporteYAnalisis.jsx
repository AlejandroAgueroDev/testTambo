import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import ReportePartos from "./components/reporteYAnalisis/ReportePartos";
import ReporteComprasYMas from "./components/reporteYAnalisis/ReporteComprasYMas";

const ReporteYAnalisisRecria = () => {
  return (
    <ContenedorGeneral navText="RECRIA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="RECIA | REPORTE Y ANALISIS" />

        <Link to="/recrIa" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
        <ReportePartos />

        <div className="hidden sm:block">
          <BarraSeparadora orientacion="vertical" />
        </div>
        <div className="sm:hidden">
          <BarraSeparadora orientacion="horizontal" />
        </div>

        <ReporteComprasYMas />
      </div>
    </ContenedorGeneral>
  );
};

export default ReporteYAnalisisRecria;
