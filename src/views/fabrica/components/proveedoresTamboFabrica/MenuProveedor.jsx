import { useState } from "react";
import Modal from "../../../../common/Modal";
import CargarNotasCreditoDebitoProv from "./vistas_menu/CargarNotaDeDebitoCreditoProv"
import CargarPagoProv from "./vistas_menu/CargarPagoProv";
import { useNavigate } from "react-router-dom";

const MenuProveedor = ({
  dataProveedor,
  fetch,
}) => {
  const [showNotaCD, setShowNotaCD] = useState(false);
  const [showPago, setShowPago] = useState(false);

  const navigate = useNavigate();
  const handleRowClick = () => {
  navigate(
    `/fabrica/resumen-cuenta-proveedor-tambo/${dataProveedor.id}`,
    {
      state: { proveedor: dataProveedor },
    }
  );
};

  return (
    <>
      {/* Menu */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 p-3 gap-4 sm:gap-y-4 sm:gap-x-10 justify-items-center sm:bg-white-bg mx-auto">
        <button onClick={handleRowClick} className="bg-black-comun px-2 py-3 text-xl shadow-[#A39C9B] shadow-md w-[268px] text-center font-NS font-semibold hover:bg-black-hover cursor-pointer text-white-bg">
          RESUMEN DE CUENTA
        </button>
        <button onClick={() => setShowPago(true)} className="bg-black-comun px-2 py-3 text-xl shadow-[#A39C9B] shadow-md w-[268px] text-center font-NS font-semibold hover:bg-black-hover cursor-pointer text-white-bg">
          CARGAR PAGO
        </button>
        <button onClick={() => setShowNotaCD(true)} className="bg-black-comun px-2 py-3 text-xl shadow-[#A39C9B] shadow-md w-[268px] text-center font-NS font-semibold hover:bg-black-hover cursor-pointer text-white-bg">
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
