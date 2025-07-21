import { Link } from "react-router-dom";
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import TablaFacturasEmitidas from "./components/historialDeFacturas/TablaDeFacturasEmitidas";

const HistorialDeFacturas = () => {
    return (
        <ContenedorGeneral navText="CAJA">
            <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="CAJA | HISTORIAL DE FACTURAS" />

                <div className="flex gap-4">
                    <Link to="/caja" className="boton_rojo flex justify-end">
                        VOLVER
                    </Link>
                </div>
            </div>
            <div className="h-full w-full flex flex-col md:flex-row gap-2 md:gap-0">
                <div className="w-full md:grow scrollbar overflow-x-auto">
                    <TablaFacturasEmitidas />
                </div>
            </div>
            <div className="flex justify-between">
                <Link to="/caja/emitir-factura" className="boton_verde">
                    EMITIR FACTURA
                </Link>
            </div>
        </ContenedorGeneral>
    );
};

export default HistorialDeFacturas;
