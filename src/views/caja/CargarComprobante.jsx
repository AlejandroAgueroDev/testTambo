import { useState, useEffect } from "react";
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import { url } from "../../common/URL_SERVER";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import SearchableSelectParaTable from "./components/cargarComprobante/SearchSelectParaTable";
import SearchableSelectParaProv from "./components/cargarComprobante/SearchSelectParaProv";
import Swal from "sweetalert2";

const CargarComprobante = () => {
  const subAreas = {
    "TAMBO - RECRIA": [
      "Compra de insumos",
      "Compra de terneros",
      "Control veterinario",
      "Inseminación",
      "Arreglos",
      "Otros",
    ],
    AGRICULTURA: [
      "Compra de insumos",
      "Semillas",
      "Fertilizantes",
      "Liquidos",
      "Arreglos",
      "Otros",
    ],
    FABRICA: ["Compra de insumos", "Compra de leche", "Arreglos", "Otros"],
    // CASA: ["Impuestos", "Arreglos", "Otros"],
    EMPLEADOS: ["Sueldo", "Pago de seguro", "Otros"],
    MAQUINARIA: ["Arreglos", "Compra", "Otros"],
    OTROS: "INPUT",
  };
  const tipo_comprobante = ["A", "B", "C", "X (REMITO)"];

  const [formData, setFormData] = useState({
    //! datos del sector
    id_sector_imputado: "",
    sector_nombre: "",
    subarea: "",

    //! datos del comprobante
    tipo_comprobante: "",
    numero_factura: "",
    fecha_emision: "",

    //! datos del emisor
    razon_social: "",
    id_proveedor: "",
    cuit: "",
    otros_datos: "",

    //! productos
    productos: [
      {
        id_producto: "",
        descripcion: "",
        cantidad: "",
        unidad: "",
        precio: "",
        iva: "",
        total: "",
      },
    ],

    //! totales
    total_general: "0",
    total_productos: "0",
    total_tributos: 0,
  });

  const [sectores, setSectores] = useState([]);
  const [discriminaIva, setDioscriminaIva] = useState(true);

  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const response = await axios.get(`${url}sector`);
        const formatSectores = [];
        response.data.map((sector) => {
          if (sector.nombre === "Tambos") {
            formatSectores.push({ ...sector, nombre: "TAMBO - RECRIA" });
          } else if (sector.nombre === "FabricaQueso") {
            formatSectores.push({ ...sector, nombre: "FABRICA" });
          } else if (
            sector.nombre !== "GastoPersonal" &&
            sector.nombre !== "Recria"
          ) {
            formatSectores.push({
              ...sector,
              nombre: sector.nombre.toUpperCase(),
            });
          }
        });

        setSectores(formatSectores);
      } catch (error) {
        console.error("Error fetching sectores:", error);
      }
    };

    fetchSectores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia la subárea, limpia los datos del emisor
    if (name === "subarea") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        razon_social: "",
        id_proveedor: "",
        cuit: "",
        otros_datos: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChangeSector = (e) => {
    const value = e.target.value;
    const text = e.target.options[e.target.selectedIndex].text;

    console.log(value);

    setFormData((prev) => ({
      ...prev,
      id_sector_imputado: value,
      sector_nombre: text,
    }));
  };

  const handleProductoChange = (index, field, value) => {
    const updated = [...formData.productos];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, productos: updated }));
  };

  const addProducto = () => {
    setFormData((prev) => ({
      ...prev,
      productos: [
        ...prev.productos,
        {
          descripcion: "",
          cantidad: "",
          unidad: "",
          precio: "",
          iva: "",
          total: "",
        },
      ],
    }));
  };

  useEffect(() => {
    const nuevosProductos = formData.productos.map((prod) => {
      const cantidad = parseFloat(prod.cantidad) || 0;
      const precio = parseFloat(prod.precio) || 0;
      const iva = parseFloat(prod.iva) || 0;
      const base = cantidad * precio;
      const ivaMonto = (base * iva) / 100;
      const total = base + ivaMonto;
      return { ...prod, total: total.toFixed(2) };
    });

    setFormData((prev) => ({
      ...prev,
      productos: nuevosProductos,
    }));
  }, [JSON.stringify(formData.productos)]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      productos: [],
    }));
  }, [
    JSON.stringify(formData.subarea),
    JSON.stringify(formData.id_sector_imputado),
  ]);

  useEffect(() => {
    const total_productos = formData.productos.reduce(
      (acc, prod) => acc + parseFloat(prod.total || 0),
      0
    );
    const total_general =
      Number(total_productos) + Number(formData.total_tributos);

    setFormData((prev) => ({
      ...prev,
      total_productos: total_productos.toFixed(2),
      total_general: total_general.toFixed(2),
    }));
  }, [
    JSON.stringify(formData.productos),
    JSON.stringify(formData.total_tributos),
  ]);

  const removeProducto = (index) => {
    const nuevos = [...formData.productos];
    nuevos.splice(index, 1);
    setFormData((prev) => ({ ...prev, productos: nuevos }));
  };

  //? POST data
  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${url}caja/cargar-comprobante`,
        formData
      );
      Swal.fire({
        icon: "success",
        title: "¡Comprobante cargado!",
        text: "El comprobante se cargó exitosamente.",
        confirmButtonColor: "#86C394",
      }).then(() => {
        // Limpiar todos los campos
        setFormData({
          id_sector_imputado: "",
          sector_nombre: "",
          subarea: "",
          tipo_comprobante: "",
          numero_factura: "",
          fecha_emision: "",
          razon_social: "",
          id_proveedor: "",
          cuit: "",
          otros_datos: "",
          productos: [
            {
              id_producto: "",
              descripcion: "",
              cantidad: "",
              unidad: "",
              precio: "",
              iva: "",
              total: "",
            },
          ],
          total_general: "0",
          total_productos: "0",
          total_tributos: 0,
        });
      });
    } catch (error) {
      console.log("Error al cargar el comprobrante:", error);
      Swal.fire({
        icon: "error",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
        title: "Error",
        text: "Ocurrió un error al cargar el comprobante.",
      });
    }
  };

  const sectorCompleto = formData.id_sector_imputado && formData.subarea;

  const comprobanteCompleto =
    formData.tipo_comprobante &&
    formData.numero_factura &&
    formData.fecha_emision;

  const emisorCompleto = formData.razon_social && formData.cuit;

  const productosCompletos =
    formData.productos.length > 0 &&
    formData.productos.every(
      (prod) => prod.descripcion && prod.cantidad && prod.unidad && prod.precio
    );

  return (
    <ContenedorGeneral navText="CAJA">
      <div className="w-screen md:w-full flex flex-col md:flex-row justify-between items-center text-center">
        <Titulo text="CAJA | CARGAR COMPROBANTE" />
        <div className="flex gap-4">
          <Link to="/caja" className="boton_rojo flex justify-end">
            VOLVER
          </Link>
        </div>
      </div>

      <div className="w-full h-screen md:h-auto scrollbar overflow-y-auto px-5 pt-3 pb-5 bg-white-bg2">
        <h1 className="text-xl font-semibold text-black-comun mt-2 mb-3">
          DATOS DEL SECTOR
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-3">
          <div className="containerInput">
            <label className="labelInput w-24">
              Sector <strong className="text-red-400">*</strong>
            </label>
            <select
              value={formData.id_sector_imputado}
              onChange={handleChangeSector}
              className="bg-white-bg text-black-comun py-2 px-5 text-xl w-full"
            >
              <option value="" disabled>
                Seleccionar un sector
              </option>
              {sectores.length &&
                sectores.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="containerInput justify-end">
            <label className="labelInput w-40">
              Sub-Areas <strong className="text-red-400">*</strong>
            </label>
            {!formData.sector_nombre ? (
              <p className="bg-white-bg text-white-bg3 py-2 px-5 text-xl w-full">
                Selecciona uno para continuar
              </p>
            ) : formData.sector_nombre === "OTROS" ? (
              <input
                type="text"
                name="subarea"
                value={formData.subarea || ""}
                onChange={handleChange}
                placeholder="Comprobante destinado a..."
                className="bg-white-bg text-black-comun py-2 px-5 text-xl w-full"
              />
            ) : (
              <select
                onChange={handleChange}
                name="subarea"
                className="bg-white-bg text-black-comun py-2 px-5 text-xl w-full"
              >
                <option selected disabled>
                  Seleccionar
                </option>
                {subAreas[formData.sector_nombre].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="containerInput justify-end">
            <p className="text-white-bg3 text-mg text-wrap">
              El valor y los detalles del comprobante se inputarán al sector que
              elijas.
            </p>
          </div>
        </div>

        <div className="px-4 bg-white-bg2">
          <BarraSeparadora color="negro" orientacion="horizontal" />
        </div>

        <h1 className="text-xl font-semibold text-black-comun mt-3">
          DATOS DEL COMPROBANTE
        </h1>
        <div className="grid md:grid-cols-3 gap-3 px-5 pt-3 pb-5 bg-white-bg2">
          <div className="containerInput">
            <label className="labelInput w-[35%]">
              Tipo de comprobante <strong className="text-red-400">*</strong>
            </label>
            <select
              name="tipo_comprobante"
              value={formData.tipo_comprobante}
              onChange={handleChange}
              className="bg-white-bg text-black-comun py-2 px-5 text-xl grow"
              disabled={!sectorCompleto}
            >
              <option value="" disabled>
                Seleccionar
              </option>
              {tipo_comprobante.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <div className="containerInput">
            <label className="labelInput">
              Número de comprobante <strong className="text-red-400">*</strong>
            </label>
            <input
              type="text"
              name="numero_factura"
              value={formData.numero_factura}
              onChange={handleChange}
              placeholder="Ej: 0001-00000001"
              className="bg-white-bg text-black-comun py-2 px-5 text-xl w-full"
              disabled={!sectorCompleto}
            />
          </div>
          <div className="containerInput">
            <label className="labelInput">
              Fecha de emisión <strong className="text-red-400">*</strong>
            </label>
            <input
              type="date"
              name="fecha_emision"
              value={formData.fecha_emision}
              onChange={handleChange}
              className="bg-white-bg text-black-comun py-[7px] px-5 text-xl w-full"
              disabled={!sectorCompleto}
            />
          </div>
        </div>

        <div className="px-4 bg-white-bg2">
          <BarraSeparadora color="negro" orientacion="horizontal" />
        </div>

        <h1 className="text-xl font-semibold text-black-comun mt-3">
          DATOS DEL EMISOR
        </h1>
        <div className="grid md:grid-cols-3 gap-3 px-5 pt-3 pb-5 bg-white-bg2">
          <div className="containerInput">
            <label className="labelInput">
              Razón Social / Nombre<strong className="text-red-400">*</strong>
            </label>
            {formData.subarea === "Compra de insumos" ? (
              <SearchableSelectParaProv
                setFormData={setFormData}
                formData={formData}
                id_sector={formData.id_sector_imputado}
              />
            ) : (
              <input
                type="text"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                placeholder="Ej: Tambo SA"
                className="bg-white-bg text-black-comun py-2 px-5 text-xl w-full"
                disabled={!comprobanteCompleto}
              />
            )}
          </div>
          <div className="containerInput">
            <label className="labelInput">
              CUIT<strong className="text-red-400">*</strong>
            </label>
            <input
              type="number"
              name="cuit"
              value={formData.cuit}
              onChange={handleChange}
              placeholder="20-12345678-1"
              className="bg-white-bg text-black-comun py-2 px-5 text-xl w-full"
              disabled={!comprobanteCompleto}
            />
          </div>
          <div className="containerInput">
            <label className="labelInput">Datos adicionales</label>
            <input
              type="text"
              name="otros_datos"
              value={formData.otros_datos}
              onChange={handleChange}
              placeholder="Otros Datos"
              className="bg-white-bg text-black-comun py-2 px-5 text-xl w-full"
              disabled={!comprobanteCompleto}
            />
          </div>
        </div>

        <div className="px-4 bg-white-bg2 mt-1">
          <BarraSeparadora color="negro" orientacion="horizontal" />
        </div>

        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-black-comun mt-3">
            LISTA DE PRODUCTOS O SERVICIOS
          </h1>
          <div className="mr-5 space-x-2 flex items-center">
            <label className="labelInput">Discriminar IVA</label>

            <div
              onClick={() => setDioscriminaIva(!discriminaIva)}
              className={`w-[42px] h-[22px] rounded-full bg-[#d1d1d1] flex items-center justify-center p-[4px]`}
            >
              <div
                className={`${
                  discriminaIva
                    ? "bg-button-green translate-x-[-10px] duration-100"
                    : "bg-button-red_hover translate-x-[10px] duration-100"
                } w-[18px] h-[18px] rounded-full`}
              ></div>
            </div>
          </div>
        </div>

        <div className="min-h-[150px] max-h-[300px] overflow-auto scrollbar m-5 bg-white-bg2 relative">
          <p
            className={formData.subarea === "Compra de insumos" ? "" : "hidden"}
          >
            <strong>Aclaración:</strong> Si el nombre del insumo que carga en el
            comprobante figura en color{" "}
            <strong className="text-button-red">rojo</strong>, se creara como
            nuevo insumo. En cambio, si selecciona una de las opciones
            existentes, se sumara al stock del seleccionado.
          </p>
          <table className="border-separate text-lg w-full relative">
            <thead className="sticky top-0 bg-white-bg3 z-10">
              <tr className="bg-white-bg3 text-white-bg text-center">
                <th className={discriminaIva ? "w-[40%]" : "w-[50%]"}>
                  Producto / Servicio
                </th>
                <th className="w-[10%]">Cantidad</th>
                <th className="w-[10%]">Unidad</th>
                <th className="w-[13%]">Precio</th>
                {discriminaIva && <th className="w-[10%]">IVA</th>}
                <th className="w-[13%]">Total</th>
                <th className="max-w-8"></th>
              </tr>
            </thead>
            <tbody>
              {formData.productos.map((prod, index) => (
                <tr key={index} className="text-center bg-white-bg">
                  <td>
                    {formData.subarea === "Compra de insumos" ? (
                      <SearchableSelectParaTable
                        formData={formData}
                        setFormData={setFormData}
                        id_sector={formData.id_sector_imputado}
                        index={index}
                      />
                    ) : (
                      <input
                        type="text"
                        className="bg-white-bg text-black px-2 w-full"
                        value={prod.descripcion}
                        onChange={(e) =>
                          handleProductoChange(
                            index,
                            "descripcion",
                            e.target.value
                          )
                        }
                        disabled={!emisorCompleto}
                      />
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="bg-white-bg text-black px-2 w-full"
                      value={prod.cantidad}
                      onChange={(e) =>
                        handleProductoChange(index, "cantidad", e.target.value)
                      }
                      disabled={!emisorCompleto}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="bg-white-bg text-black px-2 w-full"
                      value={prod.unidad}
                      onChange={(e) =>
                        handleProductoChange(index, "unidad", e.target.value)
                      }
                      disabled={!emisorCompleto}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="bg-white-bg text-black px-2 w-full"
                      value={prod.precio}
                      onChange={(e) =>
                        handleProductoChange(index, "precio", e.target.value)
                      }
                      disabled={!emisorCompleto}
                    />
                  </td>
                  {discriminaIva && (
                    <td>
                      <input
                        type="number"
                        className="bg-white-bg text-black px-2 w-full"
                        value={prod.iva}
                        onChange={(e) =>
                          handleProductoChange(index, "iva", e.target.value)
                        }
                        disabled={!emisorCompleto}
                      />
                    </td>
                  )}
                  <td>
                    <span className="bg-white-bg text-black px-2 w-full inline-block text-center">
                      {prod.total && prod.total !== "0.00" ? "$" : ""}{" "}
                      {prod.total && prod.total !== "0.00" ? prod.total : "-"}
                    </span>
                  </td>
                  <td
                    onClick={() => removeProducto(index)}
                    className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                  >
                    <FaPlus className="m-auto rotate-45" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="boton_verde mt-2"
            onClick={addProducto}
            disabled={!emisorCompleto}
          >
            + Agregar fila
          </button>
        </div>

        <div className="px-4 bg-white-bg2 mt-1">
          <BarraSeparadora color="negro" orientacion="horizontal" />
        </div>

        <h1 className="text-xl font-semibold text-black-comun mt-3">TOTALES</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-5 pt-3 pb-5 bg-white-bg2 items-end">
          <div className="containerInput w-full">
            <label className="labelInput ">Importe Productos</label>
            <div className="flex items-center bg-white-bg pl-3 w-full">
              <span className="text-xl text-white-bg3">$</span>
              <input
                type="number"
                className="bg-white-bg text-black-comun py-2 px-2 text-xl w-full flex-1 min-w-0"
                value={formData.total_productos}
                disabled
              />
            </div>
          </div>

          <div className="containerInput w-full">
            <label className="labelInput">Importe Otros Tributos</label>
            <div className="flex items-center bg-white-bg pl-3 w-full">
              <span className="text-xl text-white-bg3">$</span>
              <input
                type="number"
                className="bg-white-bg text-black-comun py-2 px-2 text-xl w-full flex-1 min-w-0"
                value={formData.total_tributos}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    total_tributos: e.target.value || 0,
                  }))
                }
              />
            </div>
          </div>

          <div className="containerInput w-full">
            <label className="labelInput">Importe Total General</label>
            <div className="flex items-center bg-white-bg pl-3 w-full">
              <span className="text-xl text-white-bg3">$</span>
              <input
                type="number"
                className="bg-white-bg text-black-comun py-2 px-2 text-xl w-full flex-1 min-w-0"
                value={formData.total_general}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="boton_verde" onClick={handleSubmit}>
            CARGAR COMPROBANTE
          </button>
        </div>
      </div>
    </ContenedorGeneral>
  );
};

export default CargarComprobante;
