import  { useState } from "react";
import { Link} from "react-router-dom";
import Modal from "../../../../common/Modal";
import CargarNotasCreditoDebito from "./CargarNotasCreditoDebito";
import CargarPago from "./CargarPago";
import { useNavigate } from "react-router-dom";

const MenuCliente = ({ dataCliente, fetch, sector_titulo, sector_nombre }) => {
    const [showNotaCD, setShowNotaCD] = useState(false);
    const [showPago, setShowPago] = useState(false);

    const navigate = useNavigate();
    const handleRowClick = () => {
        navigate(`/resumen-cuenta-cliente/${dataCliente.id}/${sector_titulo}/${sector_nombre}`, {
            state: { cliente: dataCliente },
        });
    };

    return (
        <>
            {/* Menu */}
            <div className="w-full sm:w-[600px] grid grid-cols-1 sm:grid-cols-2 p-5 lg:p-10 gap-4 sm:gap-y-4 sm:gap-x-10 justify-items-center sm:bg-white-bg mx-auto">
                <button onClick={handleRowClick} className="links">
                    RESUMEN DE CUENTA
                </button>
                <button onClick={() => setShowPago(true)} className="links">
                    CARGAR PAGO
                </button>
                <button onClick={() => setShowNotaCD(true)} className="links">
                    NOTA DE CREDITO/DEBITO
                </button>

                <Link to="/caja" className="links">
                    FACTURAR
                </Link>
            </div>

            {/* modales */}
            {showNotaCD && (
                <Modal>
                    <CargarNotasCreditoDebito
                        setCloseModal={setShowNotaCD}
                        tipo_destinatario="CLIENTE"
                        id_afectado={dataCliente.id}
                        fetch={fetch}
                    />
                </Modal>
            )}

            {showPago && (
                <Modal>
                    <CargarPago
                        setCloseModal={setShowPago}
                        id_cliente={dataCliente.id}
                        cliente_nombre={dataCliente.nombre_empresa}
                        fetch={fetch}
                    />
                </Modal>
            )}
        </>
    );
};
export default MenuCliente;
