import { useState } from "react";
import Modal from "../../../common/Modal";
import CargarPago from "./vistas_menu/CargarPago";
import CargarNotasCreditoDebito from "./vistas_menu/CargarNotasCreditoDebito";
import { useNavigate } from "react-router-dom";

const MenuEmpleado = ({ empleado, fetch }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <>
      {/* Menu */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 p-5 lg:p-10 gap-4 sm:gap-y-4 sm:gap-x-10 justify-items-center sm:bg-white-bg mx-auto">
        <button
          className="links"
          onClick={() =>
            navigate(`/empleados/resumenCuentaEmpleado`, {
              state: { empleado },
            })
          }
        >
          RESUMEN DE CUENTA
        </button>

        <button
          className="links"
          onClick={() =>
            handleButtonClick(
              <CargarPago
                closeModal={closeModal}
                empleadoName={empleado.nombre}
                empleado={empleado}
                fetchEmpleados={fetch}
              />
            )
          }
        >
          CARGAR PAGO
        </button>

        <button
          className="links"
          onClick={() =>
            handleButtonClick(
              <CargarNotasCreditoDebito
                closeModal={closeModal}
                empleadoName={empleado.nombre}
                id_afectado={empleado.id}
                fetchEmpleados={fetch}
              />
            )
          }
        >
          NOTA CREDITO/DEBITO
        </button>
      </div>

      {showModal && <Modal onClose={closeModal}>{modalContent}</Modal>}
    </>
  );
};
export default MenuEmpleado;
