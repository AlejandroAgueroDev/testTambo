import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import CargarVenta from "./components/venta/CargarVenta";
import { Link } from "react-router-dom";
import UltimosRetiros from "./components/venta/UltimosRetiros";
import BarraSeparadora from "../../common/BarraSeparadora";

const Venta = () => {
    return (
        <ContenedorGeneral navText="TAMBO">
            <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="TAMBO | RETIROS" />
                <Link to="/tambo" className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            <div className="w-screen md:w-full sm:hidden flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="RETIROS" />
                <Link to="/tambo" className="boton_rojo">
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

                <UltimosRetiros />
            </div>
        </ContenedorGeneral>
    );
};

export default Venta;
