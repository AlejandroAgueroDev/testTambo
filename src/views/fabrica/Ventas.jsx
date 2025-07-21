import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import Titulo from "../../common/Titulo";
import CargarVenta from "./components/ventas/CargarVenta";
import Ultimasventas from "./components/ventas/UltimasVentas";

const Ventas = () => {
  return (
    <ContenedorGeneral navText="FABRICA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="FABRICA | VENTA" />
        <Link to="/fabrica" className="boton_rojo">
          VOLVER
        </Link>
      </div>

      <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
        <CargarVenta />

        <div className="hidden sm:block">
          <BarraSeparadora orientacion="vertical" />
        </div>
        <div className="sm:hidden">
          <BarraSeparadora orientacion="horizontal" />
        </div>

        <Ultimasventas />
      </div>
    </ContenedorGeneral>
  );
};

export default Ventas;
