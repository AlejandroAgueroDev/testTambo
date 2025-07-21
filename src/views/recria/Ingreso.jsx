import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import CargarIngreso from "./components/ingreso/CargarIngreso";
import IngresosRecientes from "./components/ingreso/IngresosRecientes";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";

const IngresoDeTerneros = () => {
  return (
    <ContenedorGeneral navText="RECRIA">
      <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="RECRIA | INGRESO DE TERNEROS" />
        <Link to="/recria" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-screen md:w-full sm:hidden flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="INGRESO DE TERNEROS" />
        <Link to="/recria" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
        <CargarIngreso />

        <div className="hidden sm:block">
          <BarraSeparadora orientacion="vertical" />
        </div>
        <div className="sm:hidden">
          <BarraSeparadora orientacion="horizontal" />
        </div>

        <IngresosRecientes />
      </div>
    </ContenedorGeneral>
  );
};

export default IngresoDeTerneros;
