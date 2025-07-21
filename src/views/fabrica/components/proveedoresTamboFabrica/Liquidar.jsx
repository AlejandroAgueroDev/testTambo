import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import Modal from "../../../../common/Modal";
import CargarPagoProv from "./vistas_menu/CargarPagoProv";

const Liquidar = ({
  setCloseModal,
  retirosNoLiquidados = [],
  fetchRetiros,
  id_proveedor,
}) => {
  const [loader, setLoader] = useState(false);
  const [formLiquidacion, setFormLiquidacion] = useState({
    precio_litro: "",
    importe_total: "",
    importe_blanco: "",
    importe_negro: "",
    fecha: "",
    arrayIdRetiros: [],
    id_sector: "",
    tipo: "EGRESO",
    estado: "ACEPTADO",
    metodosPago: [],
    imagenBase64: "",
    litros: 0,
    modelo: "CompraLeche",
  });
  const [totalLitros, setTotalLitros] = useState(0);
  const [showModalPago, setShowModalPago] = useState(false);

  const fetchSector = async () => {
    try {
      const { data } = await axios.get(`${url}sector`);
      const sectorFabricaQueso = data.find(
        (sector) => sector.nombre === "FabricaQueso"
      );
      if (sectorFabricaQueso) {
        setFormLiquidacion((prev) => ({
          ...prev,
          id_sector: sectorFabricaQueso.id,
        }));
      }
    } catch (error) {
      console.log("Error al traer los sectores:", error);
    }
  };

  useEffect(() => {
    fetchSector();
  }, []);

  const handleForm = (e) => {
    const { name, value } = e.target;

    if (["precio_litro"].includes(name) && value === "0") {
      return;
    }

    setFormLiquidacion({ ...formLiquidacion, [name]: value });
  };

  const handleSeleccionRetiro = (retiroId, cantidad) => {
    setFormLiquidacion((prev) => {
      const arrayIdRetiros = prev.arrayIdRetiros.includes(retiroId)
        ? prev.arrayIdRetiros.filter((id) => id !== retiroId)
        : [...prev.arrayIdRetiros, retiroId];

      return {
        ...prev,
        arrayIdRetiros,
      };
    });

    setTotalLitros((prev) => {
      return formLiquidacion.arrayIdRetiros.includes(retiroId)
        ? prev - cantidad
        : prev + cantidad;
    });
  };

  useEffect(() => {
    const importeTotal = formLiquidacion.precio_litro * totalLitros;
    setFormLiquidacion((prev) => ({ ...prev, importe_total: importeTotal }));
  }, [formLiquidacion.precio_litro, totalLitros]);

  const handleCarga = async () => {
    if (
      !formLiquidacion.precio_litro ||
      !formLiquidacion.importe_total ||
      !formLiquidacion.fecha
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para completar la liquidación",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    const sumaImportes =
      Number(formLiquidacion.importe_blanco) +
      Number(formLiquidacion.importe_negro);

    if (sumaImportes !== Number(formLiquidacion.importe_total)) {
      return Swal.fire({
        title: "La suma de los importes no coincide",
        text: "El importe con recibo más el importe sin recibo debe ser igual al importe total.",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    }

    const datosLiquidacion = {
      ...formLiquidacion,
      litros: totalLitros,
      importe_blanco: formLiquidacion.importe_blanco || 0,
      importe_negro: formLiquidacion.importe_negro || 0,
    };

    await axios.post(url + "tambo/retiroleche/liquidacion", datosLiquidacion);

    Swal.fire({
      title: "¡Retiros liquidados!",
      text: "¿Desea cargar un pago?",
      confirmButtonText: "Cargar pago",
      cancelButtonText: "Volver a datos del proveedor",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#86C394",
      iconColor: "#86C394",
    }).then((res) => {
      if (res.isConfirmed) {
        setShowModalPago(true);
      } else {
        window.location.reload();
      }
    });
  };

  const handleClosePago = (cerrarTodo = false) => {
    setShowModalPago(false);
    if (cerrarTodo) setCloseModal(false);
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[95vw] lg:w-[800px]">
      <div className="w-full flex justify-between">
        <Titulo text={`LIQUIDAR COMPRA`} />
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-3 max-h-[87dvh] scrollbar overflow-auto">
          <div className="w-full lg:w-[50%] space-y-1">
            <div className="flex flex-col w-full">
              <label className="text-xl font-semibold text-white-bg3">
                Fecha <strong className="text-red-400">*</strong>
              </label>
              <input
                placeholder="Nombre empresa"
                type="date"
                onChange={handleForm}
                name="fecha"
                value={formLiquidacion.fecha}
                className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-full grow"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xl font-semibold text-white-bg3">
                Precio por litro <strong className="text-red-400">*</strong>
              </label>
              <input
                placeholder="Ej: 1000"
                type="number"
                onChange={handleForm}
                name="precio_litro"
                value={formLiquidacion.precio_litro}
                className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xl font-semibold text-white-bg3">
                Total litros
              </label>
              <p className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow">
                {totalLitros}
              </p>
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xl font-semibold text-white-bg3">
                Importe total <strong className="text-red-400">*</strong>
              </label>
              <input
                placeholder="Se sumara automaticamente"
                type="number"
                disabled
                onChange={handleForm}
                name="importe_total"
                value={formLiquidacion.importe_total || ""}
                className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
              />
            </div>

            <div className="flex w-full justify-between">
              <div className="flex flex-col w-[48%]">
                <label className="text-xl font-semibold text-white-bg3">
                  Importe con recibo <strong className="text-red-400">*</strong>
                </label>
                <input
                  onChange={handleForm}
                  type="number"
                  value={formLiquidacion.importe_blanco}
                  name="importe_blanco"
                  onKeyDown={(e) => {
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Ej: 1000"
                  className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                />
              </div>
              <div className="flex flex-col w-[48%]">
                <label className="text-xl font-semibold text-white-bg3">
                  Importe sin recibo <strong className="text-red-400">*</strong>
                </label>
                <input
                  onChange={handleForm}
                  type="number"
                  value={formLiquidacion.importe_negro}
                  name="importe_negro"
                  onKeyDown={(e) => {
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Ej: 1200"
                  className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[50%] max-h-[433px]">
            <label className="text-xl font-semibold text-white-bg3">
              Seleccione los retiros a liquidar{" "}
              <strong className="text-red-400">*</strong>
            </label>
            <div className="h-[92%] w-full scrollbar overflow-auto">
              <table className="border-separate text-lg w-full text-black-comun">
                <thead className="sticky top-0 bg-white-bg3 z-10">
                  <tr className="bg-white-bg3 text-center">
                    <td>Fecha</td>
                    <td>Hora</td>
                    <td>Litros</td>
                  </tr>
                </thead>
                <tbody className="relative">
                  {retirosNoLiquidados.length ? (
                    retirosNoLiquidados.map((retiro) => (
                      <tr
                        onClick={() =>
                          handleSeleccionRetiro(retiro.id, retiro.cantidad)
                        }
                        key={retiro.id}
                        className={`${
                          formLiquidacion.arrayIdRetiros.includes(retiro.id)
                            ? "bg-button-red hover:bg-button-red_hover text-white-bg2"
                            : "bg-white-bg2 hover:bg-white-bg_hover"
                        } cursor-pointer text-center`}
                      >
                        <td>
                          {new Date(retiro.fecha_muestra).toLocaleDateString(
                            "es-AR"
                          )}
                        </td>
                        <td>{retiro.hora_retiro}</td>
                        <td>{retiro.cantidad}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-4 text-gray-500"
                      >
                        No se encontraron retiros sin liquidar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={() => setCloseModal(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={handleCarga} className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "CARGAR"
            )}
          </button>
        </div>
        <p className="text-white-bg3 w-full">
          - Los campos marcados con<strong className="text-red-400">*</strong>{" "}
          son obligatorios.
        </p>
      </div>

      {showModalPago && (
        <Modal>
          <CargarPagoProv
            isLiquidar={true}
            setCloseModal={handleClosePago}
            totalALiquidar={formLiquidacion.importe_total}
            id_proveedor={id_proveedor}
            isLiquidacion={true}
            fetch={fetchRetiros}
          />
        </Modal>
      )}
    </div>
  );
};

export default Liquidar;
