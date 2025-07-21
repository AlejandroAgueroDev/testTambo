import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import Swal from "sweetalert2";
//?COMPONENTS
import NuevaTransferencia from "./NuevaTransferencia";
import Modal from "../../../../common/Modal";
import EditarCuenta from "./EditarCuenta";
import { formatearFecha } from "../../../../common/fornatearFecha";
import { MdEdit, MdDelete } from "react-icons/md";

const TablaTransferencias = ({
  transferencias,
  cuentas,
  cuentaSelecData,
  fetchCuentas,
  setShowAnuladas,
  token,
  fetchData,
}) => {
  const [editarDatos, setEditarDatos] = useState(false);
  const totalImportes = cuentas.reduce(
    (acc, transferencia) => acc + (Number(transferencia.saldo) || 0),
    0
  );

  const [nuevaTrans, setNuevaTrans] = useState(false);
  const nuevaTransferencia = () => {
    setNuevaTrans(true);
  };

  const handleDelete = async (cuenta) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Querés eliminar la cuenta "${cuenta.nombre_cuenta}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D64747",
      cancelButtonColor: "#A3A3A3",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`${url}cuenta/${cuenta.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        Swal.fire({
          title: "¡Eliminada!",
          text: "La cuenta fue eliminada exitosamente.",
          icon: "success",
          confirmButtonColor: "#86C394",
        });

        // Refresca los datos
        fetchCuentas && fetchCuentas();
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        Swal.fire({
          title: "Error",
          text: error.response?.data?.error || "No se pudo eliminar la cuenta.",
          icon: "error",
          confirmButtonColor: "#D64747",
        });
      }
    }
  };

  const handleAnularTransferencia = async (transferencia) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Querés anular la transferencia de $${transferencia.importe}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D64747",
      cancelButtonColor: "#A3A3A3",
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.put(
          `${url}caja/transferencia/${transferencia.id}`,
          { estado: "ANULADA" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        //! restaurar saldo
        const cuenta = cuentas.find(
          (c) =>
            c.id === transferencia.id_origen ||
            c.id === transferencia.id_destino
        );

        await axios.put(`${url}cuenta`, {
          ...cuenta,
          saldo:
            transferencia.tipo === "DEBITO"
              ? cuenta.saldo + Number(transferencia.importe)
              : cuenta.saldo - transferencia.importe,
        });

        fetchData();
        Swal.fire({
          title: "¡Anulada!",
          text: "La transferencia fue anulada exitosamente.",
          icon: "success",
          confirmButtonColor: "#86C394",
        });
        // Refresca los datos
        fetchCuentas && fetchCuentas();
      } catch (error) {
        console.error("Error al anular la transferencia:", error);
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.error ||
            "No se pudo anular la transferencia.",
          icon: "error",
          confirmButtonColor: "#D64747",
        });
      }
    }
  };

  const transferenciasFiltradas = cuentaSelecData?.id
    ? transferencias.filter(
        (t) =>
          t.id_origen === cuentaSelecData.id ||
          t.id_destino === cuentaSelecData.id
      )
    : transferencias;

  return (
    <div className="h-[100%] flex flex-col justify-between p-2 space-y-2">
      {cuentaSelecData.nombre_cuenta ? (
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-start sm:items-end ">
          <div className="flex flex-col w-full sm:w-60">
            <label className="labelInput">Nombre</label>
            <p className="bg-white-bg2 text-black-comun py-2 px-3 text-xl w-full truncate">
              {cuentaSelecData.nombre_cuenta}
            </p>
          </div>

          <div className="flex flex-col w-full sm:w-60">
            <label className="labelInput">CBU o ALIAS</label>
            <p className="bg-white-bg2 text-black-comun py-2 px-3 text-xl w-full truncate">
              {cuentaSelecData.alias_cbu}
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setEditarDatos(true)}
              className="boton_verde flex items-center justify-center gap-2" // Added flex, items-center, justify-center, and gap-2
            >
              <MdEdit className="text-2xl" /> EDITAR
            </button>
            <button
              onClick={() => handleDelete(cuentaSelecData)}
              className="boton_rojo flex items-center justify-center gap-2" // Added flex, items-center, justify-center, and gap-2
            >
              <MdDelete className="text-2xl" /> ELIMINAR
            </button>
          </div>
        </div>
      ) : null}

      <div className="w-full">
        <div className="h-[600px] max-h-[60dvh]">
          <div className="scrollbar overflow-x-auto w-full">
            <table className="border-separate text-lg w-full relative">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-white-bg text-center">
                  <td>Tipo</td>
                  <td>Fecha</td>
                  <td>Cuenta origen</td>
                  <td>Cuenta destino</td>
                  <td>Importe</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {transferenciasFiltradas.length ? (
                  transferenciasFiltradas.map((transferencia) => (
                    <tr
                      key={transferencia.id}
                      className="bg-white-bg2 text-center"
                    >
                      <td className="px-1">{transferencia.tipo}</td>
                      <td className="px-1 w-28">
                        {formatearFecha(transferencia.fecha)}
                      </td>
                      <td className="px-1">{transferencia.nombre_origen}</td>
                      <td className="px-1">{transferencia.nombre_destino}</td>
                      <td className="px-1">
                        $ {transferencia.importe.toLocaleString()}
                      </td>
                      <th
                        onClick={() => handleAnularTransferencia(transferencia)}
                        className="hover:bg-button-red_hover bg-button-red text-white-bg text-xl cursor-pointer w-8 align-middle"
                      >
                        <FaPlus className="m-auto rotate-45" />
                      </th>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Aun no hay transferencias cargadas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button
            onClick={nuevaTransferencia}
            className="boton_verde text-sm sm:text-base"
          >
            NUEVA TRANSFERENCIA
          </button>

          <button
            onClick={() => setShowAnuladas(true)}
            className="boton_rojo text-sm sm:text-base"
          >
            VER ANULADAS
          </button>
        </div>

        <div className="bg-white-bg2 flex flex-col sm:flex-row p-2 space-y-1 sm:space-y-0 sm:space-x-2 items-end sm:items-center border border-gray-500 text-sm sm:text-xl">
          <p className="max-w-72 truncate text-end sm:text-left font-bold">
            SALDO{" "}
            {!cuentaSelecData.nombre_cuenta
              ? "GENERAL"
              : `DE ${cuentaSelecData.nombre_cuenta.toUpperCase()}`}
          </p>

          <strong>
            ${" "}
            {cuentaSelecData.nombre_cuenta
              ? cuentaSelecData.saldo.toLocaleString()
              : totalImportes.toLocaleString()}
          </strong>
        </div>
      </div>

      {nuevaTrans && (
        <Modal>
          <NuevaTransferencia
            setCloseModal={setNuevaTrans}
            cuentas={cuentas}
            token={token}
            fetchData={fetchData}
            fetchCuentas={fetchCuentas}
          />
        </Modal>
      )}

      {editarDatos && (
        <Modal>
          <EditarCuenta
            setCloseModal={setEditarDatos}
            fetchCuentas={fetchCuentas}
            data={cuentaSelecData}
          />
        </Modal>
      )}
    </div>
  );
};

export default TablaTransferencias;
