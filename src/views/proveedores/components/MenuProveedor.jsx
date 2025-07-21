import { useState } from "react";
import Modal from "../../../common/Modal";
import CargarNotasCreditoDebitoProv from "./CargarNotaDeDebitoCreditoProv";
import CargarPagoProv from "./CargarPagoProv";
import { useNavigate } from "react-router-dom";

const MenuProveedor = ({
  dataProveedor,
  fetch,
  sector_titulo,
  sector_nombre,
}) => {
  const [showNotaCD, setShowNotaCD] = useState(false);
  const [showPago, setShowPago] = useState(false);

  const navigate = useNavigate();
  const handleRowClick = () => {
    navigate(
      `/resumen-cuenta-proveedor/${dataProveedor.id}/${sector_titulo}/${sector_nombre}`,
      {
        state: { proveedor: dataProveedor },
      }
    );
  };

  return (
    <>
      {/* Menu */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 p-5 lg:p-10 gap-4 sm:gap-y-4 sm:gap-x-10 justify-items-center sm:bg-white-bg mx-auto">
        <button onClick={handleRowClick} className="links">
          RESUMEN DE CUENTA
        </button>
        <button onClick={() => setShowPago(true)} className="links">
          CARGAR PAGO
        </button>
        <button onClick={() => setShowNotaCD(true)} className="links">
          NOTA DE CREDITO/DEBITO
        </button>
      </div>

      {/* modales */}
      {showNotaCD && (
        <Modal>
          <CargarNotasCreditoDebitoProv
            setCloseModal={setShowNotaCD}
            tipo_destinatario="PROVEEDOR"
            id_afectado={dataProveedor.id}
            fetch={fetch}
          />
        </Modal>
      )}

      {showPago && (
        <Modal>
          <CargarPagoProv
            setCloseModal={setShowPago}
            id_proveedor={dataProveedor.id}
            fetch={fetch}
          />
        </Modal>
      )}
    </>
  );
};
export default MenuProveedor;
