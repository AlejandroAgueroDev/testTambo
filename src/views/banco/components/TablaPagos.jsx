import { HiOutlineBanknotes } from "react-icons/hi2";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaHandHoldingDollar, FaPlus } from "react-icons/fa6";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const TablaPagos = ({ pagos, onEditCheque, onChequeUpdated }) => {
  const [estadosCheques, setEstadosCheques] = useState({});
  const [cuentas, setCuentas] = useState([]);
  const [proveedores, setProveedor] = useState([]);

  const fetchProveedores = async () => {
    try {
      const { data } = await axios(`${url}proveedor`);
      setProveedor(data.proveedor);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  useEffect(() => {
    const initialStates = {};
    pagos.forEach((pago) => {
      initialStates[pago.id] = pago.estado === "COBRADO";
    });
    setEstadosCheques(initialStates);

    //?GET de cuentas
    axios
      .get(`${url}cuenta`)
      .then((res) => setCuentas(res.data))
      .catch((err) => {
        console.error("Error al obtener cuentas", err);
        Swal.fire({
          title: "Error al obtener cuentas",
          icon: "error",
          confirmButtonColor: "#D64747",
        });
      });
  }, [pagos]);

  const handleCambiarEstadoCheque = async (id) => {
    try {
      const estadoActual = estadosCheques[id];

      if (estadoActual) {
        Swal.fire({
          title: `El cheque ya fue "COBRADO"`,
          text: `No se puede volver a marcar como "PENDIENTE"`,
          icon: "warning",
          confirmButtonColor: "#86C394",
        });
        return;
      }

      const confirmCobrado = await Swal.fire({
        title: `¿Marcar cheque como "COBRADO"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#86C394",
        cancelButtonColor: "#D64747",
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (!confirmCobrado.isConfirmed) return;

      const metodo = await Swal.fire({
        title: "¿Cómo se cobró el cheque?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "EFECTIVO",
        denyButtonText: "DEPÓSITO",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#86C394",
        denyButtonColor: "#219ebc",
        cancelButtonColor: "#D64747",
      });

      // Busca el pago correspondiente para obtener id_sector
      const pago = pagos.find((p) => p.id === id);

      // Puedes pedir un detalle personalizado si lo deseas, aquí lo dejo fijo:
      const detalle = "Cobro de cheque";
      const estado = "ACEPTADO";
      const id_sector = pago?.id_sector || null;

      let body = {
        id,
        detalle,
        estado,
        id_sector,
      };

      if (metodo.isConfirmed) {
        // EFECTIVO
        body.tipo_cobro = "EFECTIVO";
      } else if (metodo.isDenied) {
        // DEPOSITO
        const seleccionCuenta = await Swal.fire({
          title: "Seleccioná una cuenta de depósito",
          input: "select",
          inputOptions: cuentas.reduce((acc, cuenta) => {
            acc[cuenta.id] = `${cuenta.nombre_cuenta} - ${cuenta.alias_cbu}`;
            return acc;
          }, {}),
          inputPlaceholder: "Seleccionar cuenta",
          showCancelButton: true,
          confirmButtonColor: "#86C394",
          cancelButtonColor: "#D64747",
        });

        if (!seleccionCuenta.isConfirmed || !seleccionCuenta.value) return;

        body.id_cuenta = seleccionCuenta.value;
        body.tipo_cobro = "DEPOSITO";
      } else {
        return;
      }

      await axios.put(`${url}banco/cheque/cobrado`, body);

      setEstadosCheques((prev) => ({
        ...prev,
        [id]: true,
      }));

      Swal.fire({
        title: "Cheque cobrado exitosamente",
        icon: "success",
        confirmButtonColor: "#86C394",
      });

      onChequeUpdated();
    } catch (error) {
      console.error("Error al marcar como cobrado:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "No se pudo cobrar el cheque",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    }
  };

  const handleAnular = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro de querer anular el cheque?",
        text: "Este cambio no se puede revertir.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#D64747",
        cancelButtonColor: "#A3A3A3",
        confirmButtonText: "Sí, anular",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      await axios.put(`${url}banco/cheque`, {
        id,
        estado: "ANULADO",
      });

      Swal.fire({
        title: "Cheque anulado",
        icon: "success",
        confirmButtonColor: "#86C394",
      });

      onChequeUpdated();
    } catch (error) {
      console.error("Error al anular cheque", error);
      Swal.fire({
        title: "Error al anular",
        text: error.response?.data?.message || "Ocurrió un error inesperado",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    }
  };

  const handleEntregar = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro de querer entregar el cheque?",
        text: "Esta acción no se puede deshacer.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#86C394",
        cancelButtonColor: "#A3A3A3",
        confirmButtonText: "Sí, entregar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      const opcion = await Swal.fire({
        title: "Seleccioná una opción",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "CUENTA REGISTRADA",
        denyButtonText: "ENTREGA CASUAL",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#86C394",
        denyButtonColor: "#219ebc",
        cancelButtonColor: "#D64747",
      });

      // Busca el pago correspondiente para obtener id_sector
      const pago = pagos.find((p) => p.id === id);
      const detalle = "Entrega de cheque";
      const estado = "ACEPTADO";
      const id_sector = pago?.id_sector || null;

      if (opcion.isConfirmed) {
        // CUENTA REGISTRADA (Proveedor)
        const seleccionProveedor = await Swal.fire({
          title: "Seleccioná un proveedor",
          input: "select",
          inputOptions: proveedores.reduce((acc, proveedor) => {
            acc[proveedor.id] = proveedor.nombre_empresa;
            return acc;
          }, {}),
          inputPlaceholder: "Seleccionar proveedor",
          showCancelButton: true,
          confirmButtonColor: "#86C394",
          cancelButtonColor: "#D64747",
        });

        if (!seleccionProveedor.isConfirmed || !seleccionProveedor.value) {
          await Swal.fire({
            title: "Error",
            text: "Debés seleccionar un proveedor para continuar.",
            icon: "warning",
            confirmButtonColor: "#D64747",
          });
          return;
        }

        await axios.put(`${url}banco/cheque/entregado`, {
          id_cheque: id,
          tipo: "PROVEEDOR",
          id_prov: seleccionProveedor.value,
          destino: null,
          detalle,
          estado,
          id_sector,
        });
      } else if (opcion.isDenied) {
        // ENTREGA CASUAL
        const destinatario = await Swal.fire({
          title: "Nombre del destinatario",
          input: "text",
          inputPlaceholder: "Ej: Juan Pérez",
          showCancelButton: true,
          confirmButtonColor: "#86C394",
          cancelButtonColor: "#D64747",
          inputValidator: (value) => {
            if (!value) return "Debés ingresar un destinatario";
          },
        });

        if (!destinatario.isConfirmed || !destinatario.value) return;

        await axios.put(`${url}banco/cheque/entregado`, {
          id_cheque: id,
          tipo: "CASUAL",
          id_prov: null,
          destino: destinatario.value,
          detalle,
          estado,
          id_sector,
        });
      } else {
        return; // Cancelado
      }

      Swal.fire({
        title: "Cheque entregado correctamente",
        icon: "success",
        confirmButtonColor: "#86C394",
      });

      onChequeUpdated();
    } catch (error) {
      console.error("Error al entregar cheque:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo entregar el cheque",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [y, m, d] = dateString.split("T")[0].split("-");
    const localDate = new Date(+y, m - 1, +d);
    return localDate.toLocaleDateString("es-AR");
  };

  return (
    <div className="h-full min-w-[648px] overflex-x-auto scrollbar overflow-auto bg-white-bg">
      <table className="border-separate text-lg w-full relative">
        <thead className="sticky top-0 bg-white-bg3 z-10">
          <tr className="bg-white-bg3 text-white-bg text-center">
            <td>Banco</td>
            <td>Sector</td>
            <td>N° Cheque</td>
            <td>Fecha Emisión</td>
            <td>Fecha Pago</td>
            <td>Origen</td>
            <td>Destino</td>
            <td>Importe ($)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {pagos.length ? (
            pagos.map((pago) => (
              <tr key={pago.id} className="bg-white-bg2">
                <td className="text-center">{pago.banco}</td>
                <td className="text-center">{pago.id_sector || "-"}</td>
                <td className="text-center">{pago.numero_cheque}</td>
                <td className="text-center">
                  {formatDate(pago.fecha_emision)}
                </td>
                <td className="text-center">{formatDate(pago.fecha_pago)}</td>
                <td className="text-center">{pago.origen}</td>
                <td className="text-center">{pago.destino}</td>
                <td className="text-center">$ {pago.importe}</td>
                <Tippy
                  content={"Cambiar estado del cheque"}
                  placement="bottom-end"
                  arrow={true}
                  theme="custom_3"
                >
                  <td className="text-white-bg bg-gray-400 text-2xl cursor-pointer w-8 pl-1">
                    <span
                      onClick={() => handleCambiarEstadoCheque(pago.id)}
                      className={`cursor-pointer ${
                        estadosCheques[pago.id]
                          ? "text-green-600"
                          : "text-gray-700 hover:text-gray-600"
                      }`}
                    >
                      <HiOutlineBanknotes size={24} />
                    </span>
                  </td>
                </Tippy>
                <Tippy
                  content={"Entregar Cheque"}
                  placement="top-end"
                  arrow={true}
                  theme="custom_4"
                >
                  <td className="hover:bg-teal-300 bg-teal-400 text-white-bg text-2xl cursor-pointer w-8 pl-1">
                    <span onClick={() => handleEntregar(pago.id)}>
                      <FaHandHoldingDollar />
                    </span>
                  </td>
                </Tippy>
                <Tippy
                  content={"Anular Cheque"}
                  placement="bottom-end"
                  arrow={true}
                  theme="custom"
                >
                  <td className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8">
                    <FaPlus
                      onClick={() => handleAnular(pago.id)}
                      className="m-auto rotate-45"
                    />
                  </td>
                </Tippy>
                <Tippy
                  content={"Editar Cheque"}
                  placement="top-end"
                  arrow={true}
                  theme="custom_2"
                >
                  <td className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8">
                    <MdEdit
                      className="mx-auto"
                      onClick={() => onEditCheque(pago)}
                    />
                  </td>
                </Tippy>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No hay cheques cargados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaPagos;
