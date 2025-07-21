import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "../../../../common/Modal";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";
import SearchableSelect from "../../../../common/SearchSelect";
import { FaPlus } from "react-icons/fa6";
import AgregarProductoALaVenta from "./AgregarProductoALAVenta";
import NuevoCliente from "../../../clientes/components/clientes/NuevoCliente";
import Factura from "./Factura";
import Remito from "./Remito";
import FacturacionDesdeVenta from "./FacturacionDesdeVenta";

const CargarVenta = () => {
  const [loader, setLoader] = useState(false);
  const [formVenta, setFormVenta] = useState({
    monto: 0,
    arrayObjsVenta: [],
    id_cliente: "",
    nombre_cliente: "",
    fecha: new Date().toISOString(),
    tipo: "INGRESO",
    detalle: "",
  });
  const [addProduct, setAddProduct] = useState(false);
  const [productosCompra, setProductosCompra] = useState([]);
  const [productosCompraNombres, setProductosCompraNombres] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [listaPrecios, setListaPrecios] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const [sectorId, setSectorId] = useState(null);
  const [ventaPendiente, setVentaPendiente] = useState(null);
  const [selectKey, setSelectKey] = useState(0);
  const [modalState, setModalState] = useState({
    factura: false,
    remito: false,
  });
  const [clientesDatas, setClientesDatas] = useState([]);

  useEffect(() => {
    setSelectKey((prev) => prev + 1);
  }, [clientes]);

  const closeModal = (modalType) => {
    setModalState((prev) => ({ ...prev, [modalType]: false }));
  };

  //?GET de clientes
  const fetchClientes = async (sector_id) => {
    try {
      const { data } = await axios.get(`${url}cliente/${sector_id}`);

      const formatData = [];
      data.map((d) => {
        formatData.push({ label: d.nombre_empresa, value: d.id });
      });
      setClientes(formatData);
      setClientesDatas(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  //?GET sector
  useEffect(() => {
    const fetchSector = async () => {
      try {
        const { data } = await axios.get(`${url}sector`);
        data.map((sector) => {
          if (sector.nombre === "FabricaQueso") {
            fetchClientes(sector.id);
            setSectorId(sector.id);
          }
        });
      } catch (error) {
        console.error("Error al obtener sector:", error);
      }
    };
    fetchSector();
  }, []);

  //?POST de venta
  const handleSubmitVenta = async () => {
    if (!formVenta.id_cliente || !productosCompra.length) {
      return Swal.fire({
        title: "Faltan completar datos obligatorios",
        text: "Asegurate de haber seleccionado un cliente, una hora y al menos un producto.",
        icon: "warning",
        confirmButtonColor: "#D64747",
      });
    }

    const dataVenta = {
      ...formVenta,
      arrayObjsVenta: productosCompra,
      isConsumidorFinal:
        formVenta.nombre_cliente === "CONSUMIDOR FINAL" ? true : false,
    };

    const result = await Swal.fire({
      title: "¿Qué desea hacer?",
      text: "Seleccione una opción para continuar.",
      icon: "question",
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "FACTURAR",
      // denyButtonText: "GENERAR REMITO",
      cancelButtonText: "SOLO CARGAR VENTA",
      confirmButtonColor: "#274c77",
      // denyButtonColor: "#40798c",
      cancelButtonColor: "#86C394",
    });

    if (result.isConfirmed) {
      //todo FACTURAR
      // setLoader(true);
      // await axios.post(`${url}fabrica/ventaproducto`, dataVenta);
      // Swal.fire({
      //     title: "¡Venta cargada exitosamente!",
      //     icon: "success",
      //     confirmButtonText: "Aceptar",
      //     confirmButtonColor: "#86C394",
      // })
      //     .then(() => {
      //         window.location.reload();
      //     })
      //     .catch((err) => {
      //         console.error("Error al recargar la página:", err);
      //         setLoader(false);
      //         Swal.fire({
      //             title: "Error al cargar la venta",
      //             text: error.message || "Intenta nuevamente",
      //             icon: "error",
      //             confirmButtonColor: "#D64747",
      //         });
      //     });

      setVentaPendiente(dataVenta);
      setModalState({ ...modalState, factura: true });
    } else if (result.isDenied) {
      //todo REMITO
      //! ANULADO POR AHORA
      setVentaPendiente(dataVenta);
      setModalState({ ...modalState, remito: true });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      //todo NO HACER NADA → ejecutar POST normalmente
      try {
        setLoader(true);
        const dataVenta = {
          ...formVenta,
          datosFacturacion: { numero: null },
          arrayObjsVenta: productosCompra,
          isConsumidorFinal:
            formVenta.nombre_cliente === "CONSUMIDOR FINAL" ? true : false,
        };
        console.log(dataVenta);
        const resVenta = await axios.post(
          `${url}fabrica/ventaproducto`,
          dataVenta
        );
        // console.log(resVenta);
        Swal.fire({
          title: "¡Venta cargada exitosamente!",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#86C394",
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error al cargar venta:", error);
        Swal.fire({
          title: "Error al cargar la venta",
          text: error.message || "Intenta nuevamente",
          icon: "error",
          confirmButtonColor: "#D64747",
        });
      } finally {
        setLoader(false);
      }
    }
  };

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormVenta({ ...formVenta, [name]: value });
  };

  const showAñadirProducto = () => {
    if (!listaPrecios) {
      return Swal.fire({
        title:
          "Seleccione una lista de precios para poder cargar los productos",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
        icon: "warning",
      });
    }

    setAddProduct(true);
  };

  const sacarDeLaLista = (id) => {
    setProductosCompra(
      productosCompra.filter((product) => product.id_producto !== id)
    );
    setProductosCompraNombres(
      productosCompraNombres.filter((product) => product !== id)
    );
  };

  useEffect(() => {
    let contador = 0;
    productosCompra.forEach((product) => {
      contador += Number(product.precio) * Number(product.cantidad);
    });
    setFormVenta({ ...formVenta, monto: contador });
  }, [productosCompra]);

  useEffect(() => {
    if (productosCompra.length) {
      //?GET de productos
      axios.get(`${url}fabrica/producto`).then(({ data }) => {
        setProductosCompra(
          productosCompra.map((product) => {
            const producto = data.find((d) => d.id === product.id);

            if (listaPrecios === "REVENTA") {
              return { ...product, precio: producto.precio_reventa };
            } else if (listaPrecios === "COMERCIO") {
              return { ...product, precio: producto.precio_comercio };
            } else {
              return { ...product, precio: producto.precio_consumidor_final };
            }
          })
        );
      });
    }
  }, [listaPrecios]);

  const handleCancelarVenta = () => {
    setFormVenta({
      monto: 0,
      hora_retiro: "",
      fecha: new Date(),
      arrayObjsVenta: [],
      id_cliente: "",
      id_sector: "",
      metodosPago: [],
      tipo: "INGRESO",
      detalle: "",
      model: "",
      datosFacturacion: "",
    });
    setProductosCompra([]);
    setProductosCompraNombres([]);
    setListaPrecios("");
    setVentaPendiente(null);
    setModalState({ factura: false, remito: false });
    setSelectKey((prev) => prev + 1);
  };

  return (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
      <div className="flex w-full">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          CARGAR VENTA
        </h2>
      </div>

      <div className="w-full flex flex-col items-center space-y-2 scrollbar overflow-y-auto sm:max-h-[70dvh] max-h-[45dvh]">
        <div className="flex flex-col w-full">
          <label className="labelInput">
            Cliente <strong className="text-red-400">*</strong>
          </label>
          <div className="flex w-full z-20">
            <SearchableSelect
              key={`client-select-${selectKey}`}
              options={clientes}
              placeholder="Buscar cliente"
              onSelect={(value, name) =>
                setFormVenta({
                  ...formVenta,
                  id_cliente: value,
                  nombre_cliente: name,
                })
              }
            />

            <button
              onClick={() => setNuevoCliente(true)}
              className="boton_verde sm:mt-0"
            >
              NUEVO
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Lista de precios <strong className="text-red-400">*</strong>
          </label>
          <select
            value={listaPrecios}
            onChange={(e) => setListaPrecios(e.target.value)}
            className="bg-white-bg2 text-black-comun py-[10px] px-5 text-xl"
          >
            <option value="" disabled>
              Seleccionar una lista
            </option>
            <option value="REVENTA">Reventa</option>
            <option value="COMERCIO">Comercio</option>
            <option value="CONSUMIDOR FINAL">Consumidor final</option>
          </select>
        </div>

        <div className="flex flex-col w-full relative">
          <label className="text-xl font-semibold text-white-bg3">
            Productos <strong className="text-red-400">*</strong>
          </label>
          <div className="w-full scrollbar overflow-auto bg-white-bg2">
            <div className="h-48 bg-white-bg2 relative">
              <table className="border-separate text-lg w-full">
                <thead className="sticky top-0 align-bottom bg-white-bg3 z-10 text-white-bg2">
                  <tr>
                    <th className="px-[2px] w-60 truncate">Nombre</th>
                    <th className="px-[2px]">Cantidad</th>
                    <th className="px-[2px]">Precio unidad</th>
                    <th
                      onClick={showAñadirProducto}
                      className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-8 align-middle"
                    >
                      <FaPlus className="m-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white-bg">
                  {!productosCompra.length ? (
                    <tr>
                      <td colSpan="7" className="text-center text-white-bg3">
                        Agrega productos a la venta
                      </td>
                    </tr>
                  ) : (
                    productosCompra.map((p) => (
                      <tr key={p.id}>
                        <th className="font-medium px-[2px] w-60 truncate">
                          {p.nombre}
                        </th>
                        <th className="px-[2px] font-medium">{p.cantidad}</th>
                        <th className="px-[2px] font-medium">{p.precio}</th>
                        <th
                          onClick={() => sacarDeLaLista(p.id)}
                          className="hover:bg-button-red_hover bg-button-red text-white-bg text-xl cursor-pointer w-8 align-middle"
                        >
                          <FaPlus className="m-auto rotate-45" />
                        </th>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot
                  className={
                    productosCompra.length
                      ? "bg-white-bg_hover sticky bottom-0"
                      : "hidden"
                  }
                >
                  <tr>
                    <th className="px-[2px] w-60 truncate bg-white-bg2"></th>
                    <th className="px-[2px]">Total</th>
                    <th className="px-[2px]">$ {formVenta.monto}</th>
                    <th className="bg-white-bg2"></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Aclaraciones de la venta
          </label>
          <textarea
            placeholder="Detalles o acalaraciones extas sobre esta venta"
            type="number"
            value={formVenta.detalle}
            name="detalle"
            onChange={handleForm}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl max-h-20 min-h-20"
          />
        </div>
      </div>

      <div className="space-x-2 flex justify-end w-full mt-2">
        <button onClick={handleCancelarVenta} className="boton_rojo">
          CANCELAR
        </button>
        <button onClick={handleSubmitVenta} className="boton_verde">
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "CARGAR"
          )}
        </button>
      </div>
      <p className="text-white-bg3 w-full">
        - Los campos marcados con <strong className="text-red-400">*</strong>{" "}
        son oblicatorios.
      </p>

      {addProduct && (
        <Modal>
          <AgregarProductoALaVenta
            setCloseModal={setAddProduct}
            productos={productosCompra}
            setProductos={setProductosCompra}
            listaDePrecios={listaPrecios}
            setProductosCompraNombres={setProductosCompraNombres}
            productosCompraNombres={productosCompraNombres}
          />
        </Modal>
      )}

      {nuevoCliente && (
        <Modal setShowModal={setNuevoCliente}>
          <NuevoCliente
            setShowModal={setNuevoCliente}
            id_sector={sectorId}
            fetchClientes={() => fetchClientes(sectorId)}
          />
        </Modal>
      )}

      {modalState.factura && (
        <Modal>
          <FacturacionDesdeVenta
            id_cliente={formVenta.id_cliente}
            productos={productosCompra}
            setShowModal={setModalState}
            clientesDatas={clientesDatas}
            formVenta={{
              ...formVenta,
              arrayObjsVenta: productosCompra,
              isConsumidorFinal:
                formVenta.nombre_cliente === "CONSUMIDOR FINAL" ? true : false,
            }}
          />
        </Modal>
      )}

      {modalState.remito && (
        <Modal onClose={() => closeModal("remito")}>
          <Remito
            onCancel={() => closeModal("remito")}
            onSubmit={() => {
              closeModal("remito");
              handleCancelarVenta();
            }}
            venta={ventaPendiente}
          />
        </Modal>
      )}
    </div>
  );
};

export default CargarVenta;
