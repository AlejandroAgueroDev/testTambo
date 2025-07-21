import Titulo from "../../common/Titulo";
import { Link } from "react-router-dom";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import BarraSeparadora from "../../common/BarraSeparadora";

const Recria = () => {
  return (
    <ContenedorGeneral navText="RECRIA">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
            <Titulo text="RECRIA" />
          </div>
          <div className="w-full sm:w-[600px] grid grid-cols-1 sm:grid-cols-2 p-5 lg:p-10 gap-4 sm:gap-y-4 sm:gap-x-10 justify-items-center sm:bg-white-bg mx-auto">
            <Link to="/recria/ingreso" className="links">
              INGRESO DE TERNEROS
            </Link>
            <Link to="/recria/hembras" className="links">
              HEMBRAS
            </Link>
            <Link to="/recria/machos" className="links">
              MACHOS
            </Link>
            <Link to="/control-veterinario/recria" className="links">
              CONTROL VETERINARIO
            </Link>
            <Link to="/tambo/insumos/recria/recria" className="links">
              INSUMOS
            </Link>
            <Link to="/recria/reporte-analisis" className="links">
              REPORTE Y ANALISIS
            </Link>
          </div>
        </div>
        <div className="sm:p-5 text-sm sm:text-lg space-y-2 sm:space-y-5 text-white-bg3 scrollbar overflow-auto">
          <BarraSeparadora orientacion="horizontal" />
          <p>
            En esta sección podrán gestionar la compra y venta de terneros, su
            alimentacion, sus controles veterinarios y los insumos utilizados.
          </p>
        </div>
      </div>
    </ContenedorGeneral>
  );
};

export default Recria;
