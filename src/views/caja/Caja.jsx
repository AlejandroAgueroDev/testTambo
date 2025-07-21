import Titulo from "../../common/Titulo";
import { Link } from "react-router-dom";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import BarraSeparadora from "../../common/BarraSeparadora";

const Caja = () => {
    return (
        <ContenedorGeneral navText="CAJA">
            <div className="w-screen md:w-full flex justify-between pl-10 md:pl-0 pr-4 md:pr-0 mt-1 sm:mt-0">
                <Titulo text="CAJA" />
            </div>
            <div className="flex flex-col justify-between h-full scrollbar overflow-auto overflow-x-hidden">
                <div className="relative">
                    <div className="w-full sm:w-[600px] grid grid-cols-1 sm:grid-cols-2 p-5 lg:p-10 gap-4 sm:gap-y-4 sm:gap-x-10 justify-items-center sm:bg-white-bg mx-auto">
                        <Link to="/caja/cargarComprobante" className="links">
                            CARGAR COMPROBANTE
                        </Link>
                        <Link to="/caja/historial-comprobante" className="links">
                            HIST. DE COMPROBANTES
                        </Link>
                        <Link to="/caja/emitir-factura" className="links">
                            EMITIR FACTURA (ARCA)
                        </Link>
                        <Link to="/caja/historial-factura" className="links">
                            HISTORIAL DE FACTURAS
                        </Link>
                        <Link to="/caja/transferencias" className="links">
                            TRANSFERENCIAS
                        </Link>
                        <Link to="/caja/chequera" className="links">
                            CHEQUERA
                        </Link>
                        <Link to="/caja/efectivo" className="links">
                            EFECTIVO
                        </Link>
                        <Link to="/caja/gastos-ingresos" className="links">
                            GASTOS E INGRESOS
                        </Link>
                        <Link to="/caja/compromisoDePago" className="links">
                            COMPROMISO DE PAGO
                        </Link>
                    </div>
                </div>
                <div className="sm:p-5 text-sm space-y-2 sm:space-y-5 text-white-bg3 scrollbar overflow-auto">
                    <BarraSeparadora orientacion="horizontal" />
                    <p>
                        En esta sección podrán gestionar las transferencias realizadas, los gastos e ingresos y los
                        cheques emitidos. Ademas, en el apartado de resumen de cuenta, veras el listado de movimientos
                        realizados.
                    </p>
                </div>
            </div>
        </ContenedorGeneral>
    );
};

export default Caja;
