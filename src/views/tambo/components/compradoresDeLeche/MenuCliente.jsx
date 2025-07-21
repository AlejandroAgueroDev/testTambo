import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "../../../../common/Modal";
import CargarNotasCreditoDebito from "../../../clientes/components/clientes/CargarNotasCreditoDebito";
import CargarPago from "../../../clientes/components/clientes/CargarPago";
import { useNavigate } from "react-router-dom";

const MenuClienteTambo = ({ dataCliente, fetch, sector_titulo, sector_nombre }) => {
  const [showNotaCD, setShowNotaCD] = useState(false);
  const [showPago, setShowPago] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const handleRowClick = () => {
    navigate(`/tambo/resumen-cuenta/compradores-leche/${id}`, {
        state: { cliente: dataCliente },
    });
  };

  return (
    <>
      {/* Menu */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 p-3 gap-4 sm:gap-y-4 sm:gap-x-10 justify-items-center sm:bg-white-bg mx-auto">
        <button
          onClick={handleRowClick}
          className="bg-black-comun px-2 py-3 text-xl shadow-[#A39C9B] shadow-md w-[268px] text-center font-NS font-semibold hover:bg-black-hover cursor-pointer text-white-bg"
        >
          RESUMEN DE CUENTA
        </button>
        <button
          onClick={() => setShowPago(true)}
          className="bg-black-comun px-2 py-3 text-xl shadow-[#A39C9B] shadow-md w-[268px] text-center font-NS font-semibold hover:bg-black-hover cursor-pointer text-white-bg"
        >
          CARGAR PAGO
        </button>
        <button
          onClick={() => setShowNotaCD(true)}
          className="bg-black-comun px-2 py-3 text-xl shadow-[#A39C9B] shadow-md w-[268px] text-center font-NS font-semibold hover:bg-black-hover cursor-pointer text-white-bg"
        >
          NOTA DE CREDITO/DEBITO
        </button>
      </div>

      {/* modales */}
      {showNotaCD && (
        <Modal>
          <CargarNotasCreditoDebito
            setCloseModal={setShowNotaCD}
            tipo_destinatario="CLIENTE"
            id_afectado={id}
            fetch={fetch}
          />
        </Modal>
      )}

      {showPago && (
        <Modal>
          <CargarPago
            setCloseModal={setShowPago}
            id_cliente={id}
            cliente_nombre={dataCliente.nombre_empresa}
            fetch={fetch}
          />
        </Modal>
      )}
    </>
  );
};
export default MenuClienteTambo;
