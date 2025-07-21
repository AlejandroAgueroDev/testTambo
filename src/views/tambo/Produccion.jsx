import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import CargarProduccion from "./components/produccion/CargarProduccion";
import CargadosRecientemente from "./components/produccion/CargadosRecientemente";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import { useState } from "react";

const Produccion = () => {
    const [recargarDatos, setRecargarDatos] = useState(false);

    return (
        <ContenedorGeneral navText="TAMBO">
            <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="TAMBO | PRODUCCION" />
                <Link to="/tambo" className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            <div className="w-screen md:w-full sm:hidden flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="PRODUCCION" />
                <Link to="/tambo" className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
                <CargarProduccion produccionCargada={()=>setRecargarDatos(prev=>(!prev))}/>

                <div className="hidden sm:block">
                    <BarraSeparadora orientacion="vertical" />
                </div>
                <div className="sm:hidden">
                    <BarraSeparadora orientacion="horizontal" />
                </div>

                <CargadosRecientemente recargarDatos={recargarDatos}/>
            </div>
        </ContenedorGeneral>
    );
};

export default Produccion;
