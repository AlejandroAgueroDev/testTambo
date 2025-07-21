import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../common/URL_SERVER";
import Swal from "sweetalert2";

//? COMPONENTES
import ContenedorGeneral from "../../common/ContenedorGeneral";
import Modal from "../../common/Modal";
import Titulo from "../../common/Titulo";
import NuevoInsumo from "../tambo/components/insumos/NuevoInsumo";
import LoaderDatos from "../../common/LoaderDatos";
import CargarInsumo from "../tambo/components/insumos/CargarInsumo";
import TablaInsumos from "./components/insumos/TablaInsumos";
import TablaDocumentos from "../tambo/components/insumos/TablaDocumentos";

const InsumosFabrica = () => {
  const [allInsumos, setAllInsumos] = useState([]);
  const [loaderData, setLoaderData] = useState(true);
  const { sector } = useParams();
  const [idSector, setIdSector] = useState("");

  //! NUEVO INSUMO
  const [addNew, setAddNew] = useState(false);
  const [tipoInsumo, setTipoInsumo] = useState("");

  //! EDITAR INSUMO
  const [editar, setEditar] = useState(false);
  const [dataInsumo, setDataInsumo] = useState({});

  const handleAddNew = (e, tipo) => {
    e.preventDefault();
    setAddNew(true);
    setTipoInsumo(tipo);
  };

  //?GET sector
  const obtenerIdSector = async () => {
    const { data } = await axios(url + "sector");
    const sectorEncontrado = data.find((d) => d.nombre === "FabricaQueso");

    return sectorEncontrado?.id;
  };

  const formatearInsumos = (insumos) =>
    insumos.map((m) => {
      let obj = {};
      m.Proveedors.forEach((p) => {
        const proveedor = p.ProveedorInsumo;
        const fechaIngreso = proveedor?.ultimo_ingreso
          ? new Date(proveedor.ultimo_ingreso).toLocaleDateString("es-AR")
          : "-";

        const stock = proveedor?.stock || 0;
        obj = {
          ...m,
          stock: stock,
          precio: proveedor.precio || 0,
          id_proveedor: p.id,
          fecha: fechaIngreso,
          prov_nombre: p.nombre_empresa,
        };
      });
      return obj;
      // const proveedor = m.Proveedors[0]?.ProveedorInsumo;
      // const fechaIngreso = proveedor?.ultimo_ingreso?.split("T")[0] || "-";
      // const [year, month, day] = fechaIngreso !== "-" ? fechaIngreso.split("-") : ["", "", ""];
      // const fechaFinal = fechaIngreso !== "-" ? `${day}/${month}/${year}` : "-";

      // return {
      //     ...m,
      //     stock: proveedor?.stock || 0,
      //     precio: proveedor?.precio || 0,
      //     id_proveedor: m.Proveedors[0]?.id,
      //     fechaIngreso: fechaFinal,
      // };
    });

  //?GET de insumos
  const fetchInsumos = async () => {
    try {
      const id_sector = await obtenerIdSector();
      if (!id_sector) return console.error("No se encontró el id del sector");
      setIdSector(id_sector);
      const { data } = await axios(url + `insumo/${id_sector}`);

      setLoaderData(false);

      const insumosFabrica = formatearInsumos(data.data);
      console.log(insumosFabrica);

      setAllInsumos(insumosFabrica);
    } catch (error) {
      console.error("Error en la carga de datos:", error);
    }
  };

  useEffect(() => {
    fetchInsumos();
    setIdSector(obtenerIdSector());
  }, [sector]); // Usar 'sector' como dependencia para que se actualice al cambiar

  const handleEdit = (insumo) => {
    setDataInsumo(insumo);
    setEditar(true);
  };

  //?DELETE de insumos
  const handleDelete = async (id, nombre, id_sector) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de eliminar el insumo ${nombre}?`,
      text: "Si se elimina, se perderán todos los registros de este insumo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      confirmButtonColor: "#D64747",
      iconColor: "#D64747",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.delete(
          `${url}insumo?id_sector=${id_sector}&id=${id}`
        );

        Swal.fire({
          title: "Insumo eliminado",
          icon: "success",
          iconColor: "#86C394",
          confirmButtonColor: "#86C394",
        }).then(() => {
          setAllInsumos((prevInsumos) =>
            prevInsumos.filter((insumo) => insumo.id !== id)
          );
        });
      } catch (error) {
        console.error("Error al eliminar el insumo:", error);
        Swal.fire({
          title: "Error al eliminar",
          text: "Ocurrió un error al intentar eliminar el insumo.",
          icon: "error",
          confirmButtonColor: "#D64747",
        });
        console.error(error);
      }
    }
  };

  return (
    <ContenedorGeneral navText="FABRICA">
      <div className="flex flex-col h-full space-y-2">
        <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
          <Titulo text="FABRICA | INSUMOS" />
          <Link to={`/fabrica`} className="boton_rojo">
            VOLVER
          </Link>
        </div>
        {loaderData ? (
          <LoaderDatos textLoader="Cargando insumos..." />
        ) : (
          <div className="h-[100%] w-full px-1 py-2 sm:p-2 md:w-auto bg-white-bg2 space-y-5">
            <TablaInsumos
              insumos={allInsumos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              title="INSUMOS VARIOS"
              onAddNew={handleAddNew}
            />
            <TablaDocumentos sectorId={idSector} />
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Link to="/proveedores/FabricaQueso/fabrica" className="boton_cian">
          PROVEEDORES DE INSUMOS
        </Link>
      </div>

      {/* Modales */}
      {addNew && (
        <Modal>
          <NuevoInsumo
            setCloseModal={setAddNew}
            type={tipoInsumo}
            origen="fabrica"
            getInsumos={fetchInsumos}
            id_sector={idSector}
          />
        </Modal>
      )}

      {editar && (
        <Modal>
          <CargarInsumo
            setCloseModal={setEditar}
            data={dataInsumo}
            getInsumos={fetchInsumos}
          />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default InsumosFabrica;
