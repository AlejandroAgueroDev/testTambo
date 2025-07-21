import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import Modal from "../../../../common/Modal";
import NuevoProveedor from "../../../tambo/components/insumos/NuevoProveedor";
import { url } from "../../../../common/URL_SERVER";
import SearchableSelect from "../../../../common/SearchSelect";

const NuevoInsumo = ({ setCloseModal, sectorId, fetchData }) => {
  const [loader, setLoader] = useState(false);
  const [formNewInsumo, setFormNewInsumo] = useState({
    nombre: "",
    precio: 0,
    stock: 0,
    ultimo_ingreso: "",
    id_proveedor: "",
    tipo: "SEMILLA",
    id_sector: "",
  });
  const [proveedores, setProveedores] = useState([]);
  const [showNuevoProv, setShowNuevoProv] = useState(false);
  const [nuevoProv, setNuevoProv] = useState(false);

  useEffect(() => {
    fechachSector();
  }, [nuevoProv]);

  const featchProveedores = async (id) => {
    const { data } = await axios(url + "proveedor?id_sector=" + id);
    const dataParaInput = [];
    data.map((d) => {
      dataParaInput.push({ label: d.nombre_empresa, value: d.id });
    });
    setProveedores(dataParaInput);
  };

  const fechachSector = async () => {
    const { data } = await axios(url + "sector");
    let sector_id;
    data.map((s) => {
      if (s.nombre === "Agricultura") {
        sector_id = s.id;
      }
    });

    featchProveedores(sector_id);
    setFormNewInsumo({ ...formNewInsumo, id_sector: sector_id });
  };

  useEffect(() => {
    fechachSector();
  }, []);


  const handleForm = (e) => {
    const { name, value } = e.target;
    if (name === "precio" || name === "stock") {
      setFormNewInsumo({ ...formNewInsumo, [name]: Number(value) });
    } else {
      setFormNewInsumo({ ...formNewInsumo, [name]: value });
    }
  };

  const handleSelectProv = (v, l) => {
    setFormNewInsumo({ ...formNewInsumo, id_proveedor: v });
  };

  const handleCarga = () => {
    if (
      formNewInsumo.precio <= 0 ||
      formNewInsumo.stock <= 0 ||
      !formNewInsumo.nombre
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para cargar el insumo",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    const dataModificated = {
      ...formNewInsumo,
      ultimo_ingreso: new Date().toISOString(),
    };

    setLoader(true);
    axios
      .post(url + "insumo/", dataModificated)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "¡Nuevo insumo cargado con exito!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(()=>{
          fetchData()
          setCloseModal(false)
        });
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        Swal.fire({
          title:
            error.response.data.error ===
            "Hubo un error en el servidor: Validation error"
              ? "Ya existe un isumo con este nombre, elimine el anterior o cambie el nombre a este"
              : "Hubo un error inesperado, intente nuevamente",
          text:
            error.response.data.error ===
            "Hubo un error en el servidor: Validation error"
              ? ""
              : error,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-1 items-start">
      <div className="w-full flex justify-between">
        <Titulo text={`AGREGAR INSUMO`} />
      </div>

      <div className="w-full space-y-2">
        <div className="containerInput">
          <label className="labelInput">
            Nombre<strong className="text-red-400">*</strong>
          </label>
          <input
            placeholder="Nombre del insumo"
            type="text"
            onChange={handleForm}
            name="nombre"
            value={formNewInsumo.nombre}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">
            Proveedor<strong className="text-red-400">*</strong>
          </label>
          <div className="flex">
            <SearchableSelect
              options={proveedores}
              placeholder="Buscar proveedor"
              onSelect={handleSelectProv}
            />

            <button
              onClick={() => setShowNuevoProv(true)}
              className="boton_verde sm:mt-0"
            >
              NUEVO
            </button>
          </div>
        </div>

        <div className="containerInput">
          <label className="labelInput">
            Precio<strong className="text-red-400">*</strong>
          </label>
          <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
            <p className="text-xl text-white-bg3">$</p>
            <input
              placeholder="Ej: 1000"
              type="number"
              onChange={handleForm}
              value={formNewInsumo.precio || ""}
              name="precio"
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
              className="bg-white-bg2 text-black-comun py-2 px-2 grow text-xl"
            />
          </div>
        </div>

        <div className="containerInput">
          <label className="labelInput">
            Stock<strong className="text-red-400">*</strong>
          </label>
          <input
            onChange={handleForm}
            placeholder="100"
            name="stock"
            value={formNewInsumo.stock || ""}
            type="number"
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
            className="input"
          />
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
      </div>

      {showNuevoProv ? (
        <Modal>
          <NuevoProveedor
            setCloseModal={setShowNuevoProv}
            setNuevoProv={setNuevoProv}
            id_sector={sectorId}
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default NuevoInsumo;
