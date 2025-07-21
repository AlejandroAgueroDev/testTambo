import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";
import SearchableSelect from "../../../../common/SearchSelect";
import NuevoCliente from "../../../clientes/components/clientes/NuevoCliente";
import Modal from "../../../../common/Modal";

const VenderMachos = ({ setCloseModal }) => {
  const [clientes, setClientes] = useState([]);
  const [sectorId, setSectorId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState(false);

  const [formVenta, setFormVenta] = useState({
    cantidad: 0,
    peso_total: 0,
    precio_kilo: 0,
    comprador: "",
    contacto: "",
    monto: 0,
    tipo_operacion: "VENTA",
    fecha: obtenerFechaActual("dato"),
    genero: "MACHO",
    comprobanteBase64: "",
    id_sector: null,
  });

  //? GET sector
  useEffect(() => {
    const fetchSector = async () => {
      try {
        const { data } = await axios.get(`${url}sector`);
        const sectorRecria = data.find((sector) => sector.nombre === "Recria");
        if (sectorRecria) {
          fetchClientes(sectorRecria.id);
          setSectorId(sectorRecria.id);
          setFormVenta((prev) => ({ ...prev, id_sector: sectorRecria.id }));
        }
      } catch (error) {
        console.error("Error al obtener sector:", error);
      }
    };
    fetchSector();
  }, []);

  //?GET de clientes del sector
  const fetchClientes = async (sector_id) => {
    try {
      const { data } = await axios.get(`${url}cliente/${sector_id}`);
      const formatData = data.map((data) => ({
        label: data.nombre_empresa,
        value: data.id,
      }));
      setClientes(formatData);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const hanldeChangeForm = (e) => {
    const { name, value } = e.target;

    if (name === "peso_total") {
      setFormVenta({
        ...formVenta,
        monto: value * formVenta.precio_kilo,
        [name]: value,
      });
    } else if (name === "precio_kilo") {
      setFormVenta({
        ...formVenta,
        monto: value * formVenta.peso_total,
        [name]: value,
      });
    } else {
      setFormVenta({ ...formVenta, [name]: value });
    }
  };

  const handleSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setFormVenta({ ...formVenta, comprobanteBase64: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  //?POST cargarVenta
  const handleCargarVenta = () => {
    if (
      !formVenta.cantidad ||
      !formVenta.peso_total ||
      !formVenta.precio_kilo ||
      !formVenta.comprador ||
      !formVenta.monto
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para cargar la venta",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
        iconColor: "#D64747",
      });
    }

    setLoader(true);
    axios
      .post(url + "recria/venta", formVenta)
      .then(() => {
        setLoader(false);
        Swal.fire({
          title: "Venta cargada con éxito",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => window.location.reload());
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
        Swal.fire({
          title: "Ocurrió un error inesperado, intente nuevamente",
          text:
            error.message === "Network Error"
              ? "Contacte con el servicio técnico"
              : error.message,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[550px] scrollbar overflow-auto sm:overflow-visible">
      <div className="w-full flex justify-between">
        <Titulo text="VENTA DE TERNEROS" />
      </div>

      <div className="w-full space-y-3">
        <div className="flex w-full justify-between">
          <div className="flex flex-col w-[48%]">
            <label className="text-xl font-semibold text-white-bg3">
              Cantidad <strong className="text-red-400">*</strong>
            </label>
            <input
              onChange={hanldeChangeForm}
              type="number"
              value={formVenta.cantidad || ""}
              placeholder="Ej: 1000"
              name="cantidad"
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
            />
          </div>
          <div className="flex flex-col w-[48%]">
            <label className="text-xl font-semibold text-white-bg3">
              Peso total (KG) <strong className="text-red-400">*</strong>
            </label>
            <input
              onChange={hanldeChangeForm}
              type="number"
              value={formVenta.peso_total || ""}
              placeholder="Ej: 1000"
              name="peso_total"
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Precio por kilo <strong className="text-red-400">*</strong>
          </label>
          <div className="w-full flex bg-white-bg2 items-center">
            <p className="text-2xl px-3 text-white-bg3">$</p>
            <input
              onChange={hanldeChangeForm}
              type="number"
              value={formVenta.precio_kilo || ""}
              placeholder="Ej: 1000"
              name="precio_kilo"
              className="bg-white-bg2 text-black-comun py-2 pl-2 text-xl w-full"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Cliente <strong className="text-red-400">*</strong>
          </label>
          <div className="flex w-full gap-2 items-center">
            <SearchableSelect
              options={clientes}
              placeholder="Buscar cliente"
              onSelect={(value) =>
                setFormVenta({ ...formVenta, comprador: value })
              }
            />
            <button
              onClick={() => setNuevoCliente(true)}
              className="boton_verde"
            >
              NUEVO
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Contacto
          </label>
          <input
            onChange={hanldeChangeForm}
            placeholder="+123456789"
            type="text"
            value={formVenta.contacto}
            name="contacto"
            className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Total <strong className="text-red-400">*</strong>
          </label>
          <div className="w-full flex bg-white-bg2 items-center">
            <p className="text-2xl px-3 text-white-bg3">$</p>
            <input
              onChange={hanldeChangeForm}
              type="number"
              value={formVenta.monto || ""}
              placeholder="Se calculará automáticamente"
              name="monto"
              className="bg-white-bg2 text-black-comun py-2 pl-2 text-xl w-full"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Adjuntar documento (solo imagen)
          </label>
          <input
            onChange={handleSelectFile}
            type="file"
            className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
          />
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={() => setCloseModal(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={handleCargarVenta} className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "FINALIZAR VENTA"
            )}
          </button>
        </div>
      </div>

      {nuevoCliente && (
        <Modal setShowModal={setNuevoCliente}>
          <NuevoCliente
            setShowModal={setNuevoCliente}
            id_sector={sectorId}
            fetchClientes={() => fetchClientes(sectorId)}
          />
        </Modal>
      )}
    </div>
  );
};

export default VenderMachos;
