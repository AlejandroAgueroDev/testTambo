import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";
import BarraSeparadora from "../../../../common/BarraSeparadora";

const EditarProducto = ({
  setCloseModal,
  productoSeleccionado,
  getProductos,
  litrosFabrica,
}) => {
  const [loader, setLoader] = useState(false);
  const [formProducto, setFormProducto] = useState(productoSeleccionado);
  const [cantidadAjuste, setCantidadAjuste] = useState(0);

  const handleForm = (e) => {
    const { value, name } = e.target;

    setFormProducto({ ...formProducto, [name]: value });
  };

  const handleCantidadAjuste = (e) => {
    setCantidadAjuste(Number(e.target.value)); // Convertimos a número
  };

  const handleUpdate = async () => {
    const nuevoStock = formProducto.stock + cantidadAjuste;

    if (
      !formProducto.stock ||
      !formProducto.nombre ||
      !formProducto.precio_reventa ||
      !formProducto.precio_comercio ||
      !formProducto.precio_consumidor_final ||
      !formProducto.litro_variedad ||
      formProducto.masa_sin_elaborar == null ||
      formProducto.masa_sin_elaborar === ""
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para actualizar el producto",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    if (nuevoStock < 0) {
      return Swal.fire({
        title: "El stock no puede ser negativo",
        text: "Verifique la cantidad ingresada/saliente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "error",
      });
    }

    // Calcular litros requeridos después del ajuste
    const litrosRequeridos = formProducto.litro_variedad;
    if (litrosRequeridos > litrosFabrica) {
      return Swal.fire({
        title: "Capacidad de litros en tanque insuficiente.",
        html: `No puede editar la cantidad de litros del producto por ${litrosRequeridos} Litros. Ya que solo hay ${litrosFabrica} Litros disponibles.<br><br>Reduzca la cantidad de producto o los litros por variedad.`,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#D64747",
        icon: "error",
      });
    }

    setLoader(true);

    try {
      //? PUT de productos
      // const { ultima_venta, ultimo_ingreso, ...productoActualizado } = formProducto;
      const { ...productoActualizado } = formProducto;
      productoActualizado.stock = nuevoStock;

      const { data } = await axios.put(
        `${url}fabrica/producto/`,
        productoActualizado
      );
      setLoader(false);

      const result = await Swal.fire({
        title: "¡Producto actualizado con éxito!",
        confirmButtonText: "Aceptar",
        icon: "success",
        confirmButtonColor: "#86C394",
      });

      if (result.isConfirmed) {
        setCloseModal(false);
        getProductos();
      }
    } catch (error) {
      setLoader(false);
      console.error("Error al actualizar el producto:", error);
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
    }
  };

  const cancelar = () => {
    setCloseModal(false);
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[500px] ">
      <div className="w-full flex justify-between">
        <Titulo text={`EDITAR PRODUCTO`} />
      </div>
      {/* Contenedor de los Input */}
      <div className="w-full space-y-3 scrollbar max-h-[60dvh] overflow-auto sm:max-h-none sm:overflow-visible">
        <div className="containerInput">
          <label className="labelInput">Nombre</label>
          <input
            placeholder="Nombre del producto"
            type="text"
            onChange={handleForm}
            name="nombre"
            value={formProducto.nombre}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Stock Actual</label>
          <input
            type="number"
            onChange={handleForm}
            name="stock"
            value={formProducto.stock}
            className="input"
            readOnly
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Ingreso/Egreso</label>
          <input
            type="number"
            placeholder="Ingrese + para sumar o - para restar"
            onChange={handleCantidadAjuste}
            name="stock"
            value={cantidadAjuste || ""}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Precio Reventa</label>
          <input
            type="number"
            onChange={handleForm}
            name="precio_reventa"
            value={formProducto.precio_reventa}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Precio Comercio</label>
          <input
            type="number"
            onChange={handleForm}
            name="precio_comercio"
            value={formProducto.precio_comercio}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Consumidor Final</label>
          <input
            type="number"
            onChange={handleForm}
            name="precio_consumidor_final"
            value={formProducto.precio_consumidor_final}
            className="input"
          />
        </div>
        <div className="containerInput">
          <label className="labelInput">Litros por Varidad L</label>
          <input
            type="number"
            onChange={handleForm}
            name="litro_variedad"
            value={formProducto.litro_variedad}
            className="input"
          />
        </div>
        <div className="containerInput">
          <label className="labelInput">Mas sin Elaborar KG</label>
          <input
            type="number"
            onChange={handleForm}
            name="masa_sin_elaborar"
            value={formProducto.masa_sin_elaborar}
            className="input"
          />
        </div>
      </div>
      <div className="w-full flex justify-end space-x-3">
        <button onClick={cancelar} className="boton_rojo">
          CANCELAR
        </button>
        <button onClick={handleUpdate} className="boton_verde">
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "ACTUALIZAR"
          )}
        </button>
      </div>
      <BarraSeparadora orientacion="horizontal" />
      <div>
        <label className="font-NS text-black-comun text-base">
          Tenga en cuenta que{" "}
          <strong className="font-semibold text-button-red">
            el stock no puede ser negativo.
          </strong>
        </label>
      </div>
    </div>
  );
};

export default EditarProducto;
