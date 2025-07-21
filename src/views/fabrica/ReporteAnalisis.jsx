import { Link } from "react-router-dom";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import BarraSeparadora from "../../common/BarraSeparadora";
import ReporteCompraVentas from "./components/reporteYAnalisis/ReporteCompraVentas";
import ReporteProductos from "./components/reporteYAnalisis/ReporteProductos";

const ReporteAnalisis = () => {
  return (
    <ContenedorGeneral navText="FABRICA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="FABRICA | REPORTE Y ANALISIS" />

        <Link to="/fabrica" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
        <ReporteCompraVentas />

        <div className="hidden sm:block">
          <BarraSeparadora orientacion="vertical" />
        </div>
        <div className="sm:hidden">
          <BarraSeparadora orientacion="horizontal" />
        </div>

        <ReporteProductos />
      </div>
    </ContenedorGeneral>
  );
};

export default ReporteAnalisis;
