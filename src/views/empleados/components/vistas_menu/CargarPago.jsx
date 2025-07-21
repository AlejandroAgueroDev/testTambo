import { useState, useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Titulo from "../../../../common/Titulo";
import Modal from "../../../../common/Modal";
import AddEfectivo from "./cargarPago/AddEfectivo";
import AddOtros from "./cargarPago/AddOtros";
import AddTransferencia from "./cargarPago/AddTransferencia";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import AddCheque from "./cargarPago/AddCheque2";

const CargarPago = ({ closeModal, empleado, fetchEmpleados }) => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    id_empleado: empleado.id,
    detalle: "",
    model: "EMPLEADO",
    metodos: [],
    fecha: new Date().toISOString(),
    id_sector: "",
  });
  const [detalle, setDetalle] = useState("");

  //! CONTROLADORES DE MODALES DE METODOS DE PAGO
  const [metodoPago, setMetodoPago] = useState("none");
  const [showModalCheque, setShowModalCheque] = useState(false);
  const [showModalEfectivo, setShowModalEfectivo] = useState(false);
  const [showModalOtros, setShowModalOtros] = useState(false);
  const [showModalTransferencia, setShowModalTransferencia] = useState(false);

  //! GENERAR DETALLE DE PAGO
  const [pagosRealizados, setPagosRealizados] = useState([]);
  useEffect(() => {
    axios(url + "empleado/pago/todo").then(({ data }) => {
      setPagosRealizados(data);
    });
  }, []);

  const handleChangeSelect = (e) => {
    switch (e.target.value) {
      case "CHEQUE":
        setShowModalCheque(true);
        setMetodoPago("CHEQUE");
        break;
      case "EFECTIVO":
        setShowModalEfectivo(true);
        setMetodoPago("EFECTIVO");
        break;
      case "OTROS":
        setShowModalOtros(true);
        setMetodoPago("OTROS");
        break;
      case "TRANSFERENCIA":
        setShowModalTransferencia(true);
        setMetodoPago("TRANSFERENCIA");
        break;
    }
  };

  const [metodosLista, setMetodosLista] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let total = 0;
    metodosLista.map((m) => {
      total += Number(m.importe);
    });
    setTotal(total);
  }, [metodosLista]);

  useEffect(() => {
    const fetchSector = async () => {
      try {
        const { data } = await axios.get(`${url}sector`);
        data.map((sector) => {
          if (sector.nombre === "FabricaQueso") {
            setFormData({ ...formData, id_sector: sector.id });
          }
        });
      } catch (error) {
        console.error("Error al cargar sector:", error);
      }
    };
    fetchSector();
  }, []);

  const hanldeDeleteList = (id) => {
    const newList = metodosLista.filter((m) => m.id !== id);
    setMetodosLista(newList);
  };
  
  const handleSubmit = () => {
    if (!metodosLista.length) {
      return Swal.fire({
        title: "Selecciones al menos un metodo de pago",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
        icon: "warning",
      });
    }

    const dataPago = {
      ...formData,
      detalle: `Pago N°${pagosRealizados.length + 1} | ${detalle || "-"}`,
      metodos: metodosLista,
    };
    setLoader(true);

    axios
      .post(url + "empleado/pago", dataPago)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "¡Pago cargado con éxito!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
          iconColor: "#86C394",
        }).then(() => {
          fetchEmpleados();
          closeModal(false);
        });
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
        return Swal.fire({
          title:
            "Hubo un error inesperado, intentelo luevamente o llame al servicio técnico.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          iconColor: "#D64747",
          icon: "error",
        });
      });
  };

  const chequesYaSeleccionados = metodosLista
  .filter((m) => m.metodo === "CHEQUE" && m.datosCheque?.id_cheque)
  .map((m) => m.datosCheque.id_cheque);

  return (
    <div className="flex flex-col space-y-2 items-start">
      <div className="w-full flex justify-between">
        <Titulo text="CARGAR PAGO" />
      </div>

      <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex flex-col space-y-3 w-[350px] sm:w-[400px]">
          <div className="flex flex-col">
            <label className="labelInput">Detalle</label>
            <textarea
              onChange={(e) => setDetalle(e.target.value)}
              name="detalle"
              placeholder="Detalle del pago."
              cols="30"
              rows="10"
              className="bg-white-bg2 text-black p-2 text-lg min-h-[100px] max-h-[200px] w-full"
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label className="labelInput">Metodo de pago</label>
            <div className="bg-white-bg2 text-black flex items-center space-x-2">
              <select
                onChange={handleChangeSelect}
                name="metodo_pago"
                value={metodoPago}
                className="bg-white-bg2 text-black px-2 text-xl w-full py-2"
              >
                <option value="none" disabled>
                  Seleccionar metodo de pago
                </option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="CHEQUE">Cheque</option>
                <option value="OTROS">Otros</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 w-full sm:w-[400px]">
          <label className="labelInput">Metodos de pago ingresados</label>
          <div className="bg-white-bg2 text-black text-lg h-full w-full">
            <div className="w-full h-[88%] bg-white-bg2 text-lg">
              <table className="border-separate text-lg w-full relative">
                <thead className="sticky top-0 bg-white-bg3 z-10">
                  <tr className="bg-white-bg3 text-white-bg text-center">
                    <td>Metodo pago</td>
                    <td>Importe</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {metodosLista.length ? (
                    metodosLista.map((m, index) => (
                      <tr key={index} className="bg-white-bg">
                        <td className="px-1">{m.metodo_pago}</td>
                        <td className="px-1">
                          ${" "}
                          {Number(m.importe).toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          onClick={() => hanldeDeleteList(m.id)}
                          className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                        >
                          <IoMdClose className="mx-auto" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-white-bg3 pl-2">
                        Agrega metodos de pago
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-end px-3">
              Importe total:{" "}
              <strong className="bg-white-bg2 py-1 px-3">
                ${" "}
                {total.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 w-full">
        <button onClick={() => closeModal(false)} className="boton_rojo">
          CANCELAR
        </button>
        <button onClick={handleSubmit} className="boton_verde">
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "CARGAR"
          )}
        </button>
      </div>

      {/* modales metodos pago */}
      {showModalCheque && (
        <Modal>
          <AddCheque
            setCloseModal={setShowModalCheque}
            setMetodosLista={setMetodosLista}
            metodosLista={metodosLista}
            setMetodoPago={setMetodoPago}
            id_empleado={empleado}
            chequesYaSeleccionados={chequesYaSeleccionados}
          />
        </Modal>
      )}

      {showModalEfectivo && (
        <Modal>
          <AddEfectivo
            setCloseModal={setShowModalEfectivo}
            setMetodosLista={setMetodosLista}
            metodosLista={metodosLista}
            setMetodoPago={setMetodoPago}
            id_empleado={empleado}
          />
        </Modal>
      )}

      {showModalOtros && (
        <Modal>
          <AddOtros
            setCloseModal={setShowModalOtros}
            setMetodosLista={setMetodosLista}
            metodosLista={metodosLista}
            setMetodoPago={setMetodoPago}
            empleado={empleado}
          />
        </Modal>
      )}

      {showModalTransferencia && (
        <Modal>
          <AddTransferencia
            setCloseModal={setShowModalTransferencia}
            setMetodosLista={setMetodosLista}
            metodosLista={metodosLista}
            setMetodoPago={setMetodoPago}
            id_empleado={empleado.id}
          />
        </Modal>
      )}
    </div>
  );
};

export default CargarPago;
