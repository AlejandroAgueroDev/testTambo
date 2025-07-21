import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { url } from "../../common/URL_SERVER";
//?COMPONENTES
import Modal from "../../common/Modal";
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import TablaProductos from "./components/productos/TablaProductos";
import NuevoProducto from "./components/productos/NuevoProducto";
import EditarProducto from "./components/productos/EditarProducto";
import LoaderDatos from "../../common/LoaderDatos";
import AñadirProduccion from "./components/productos/AñadirProduccion";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState(false);
  const [editarProducto, setEditarProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [añadirProduccion, setAñadirProduccion] = useState(false);
  const [sector, setSector] = useState(null);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [litrosFabrica, setLitrosFabrica] = useState(0);

  //? GET de productos
  const fetchProductos = async () => {
    try {
      const { data } = await axios.get(`${url}fabrica/producto`);
      setLoader(false);
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  //?GET de sectores
  const fetchSector = async () => {
    try {
      const { data } = await axios.get(`${url}sector`);
      data.map((sector) => {
        if (sector.nombre === "FabricaQueso") {
          setSector(sector);
        }
      });
    } catch (error) {
      console.error("Error al cargar sector:", error);
    }
  };

  const fetchEquipo = async () => {
    try {
      const { data } = await axios.get(
        `${url}tambo/produccionleche/equipofrio`
      );

      const fabrica = data.find((equipo) => equipo.nombre === "Fabrica");

      if (fabrica) {
        setLitrosFabrica(fabrica.litros);
      } else {
        console.warn("No se encontró un equipo con nombre 'Fabrica'");
        setLitrosFabrica(0);
      }
    } catch (error) {
      console.log("Error al cargar equipo:", error);
    }
  };
  useEffect(() => {
    fetchEquipo();
    fetchProductos();
    fetchSector();
  }, []);

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto);
    setEditarProducto(true);
  };

  const closeModal = () => {
    setAñadirProduccion(false);
  };

  //? DELETE de productos
  const handleDelete = async (producto) => {
    try {
      const result = await Swal.fire({
        title: `¿Quieres eliminar el producto "${producto.nombre}" definitivamente?`,
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No",
        confirmButtonColor: "#86C394",
        denyButtonColor: "#D64747",
      });

      if (result.isConfirmed) {
        await axios.delete(`${url}fabrica/producto/${producto.id}`);
        setProductos((prevProductos) =>
          prevProductos.filter((p) => p.id !== producto.id)
        );
        Swal.fire({
          title: "Producto eliminado",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        });
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      Swal.fire({
        title: "Ocurrió un error inesperado, intente nuevamente",
        text:
          error.message === "Network Error"
            ? "Contacte con el servicio técnico"
            : error,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "error",
      });
    }
  };

  return (
    <ContenedorGeneral navText="FABRICA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="FABRICA | PRODUCTOS" />
        <Link to="/fabrica" className="boton_rojo">
          VOLVER
        </Link>
      </div>

      <div className="h-full w-screen scrollbar overflow-auto pr-4 md:pr-0 md:w-auto">
        {loader ? (
          <LoaderDatos textLoader="Cargando datos" />
        ) : (
          <TablaProductos
            productos={productos}
            onEditar={handleEditar}
            onDelete={handleDelete}
          />
        )}
      </div>

      <div className="flex justify-between w-full flex-col sm:flex-row">
        {/* Botones a la izquierda */}
        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={() => setNuevoProducto(true)}
            className="boton_verde"
          >
            NUEVO PRODUCTO
          </button>
          <button
            onClick={() => setAñadirProduccion(true)}
            className="boton_cian"
          >
            AÑADIR PRODUCCION DIARIA
          </button>
        </div>

        {/* Botón a la derecha */}
        <button
          onClick={() => navigate("/fabrica/ventas")}
          className="boton_verde mt-2 sm:mt-0"
        >
          IR A VENTAS
        </button>
      </div>

      {nuevoProducto && (
        <Modal>
          <NuevoProducto
            litrosFabrica={litrosFabrica}
            setCloseModal={setNuevoProducto}
            sectorID={sector.id}
            getProductos={fetchProductos}
          />
        </Modal>
      )}
      {editarProducto && (
        <Modal>
          <EditarProducto
            setCloseModal={setEditarProducto}
            litrosFabrica={litrosFabrica}
            productoSeleccionado={productoSeleccionado}
            getProductos={fetchProductos}
          />
        </Modal>
      )}

      {añadirProduccion && (
        <Modal>
          <AñadirProduccion
            fetchProductos={fetchProductos}
            productos={productos}
            closeModal={closeModal}
          />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default Productos;
