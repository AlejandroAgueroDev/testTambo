import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Titulo from "../../../../common/Titulo";
import { MdHistory } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Modal from "../../../../common/Modal";
import EditarAnimal from "./EditarAnimal";
import { url } from "../../../../common/URL_SERVER";
import axios from "axios";
import LoaderDatos from "../../../../common/LoaderDatos";
import Swal from "sweetalert2";

const DataAnimalesTambo = ({ animalSeleccionado }) => {
  const [showEdit, setShowEdit] = useState(false);

  const [inseminaciones, setInsemianciones] = useState([]);
  const [loaderTablaInseminacion, setLoaderTablaInseminacion] = useState(true);

  const [controlesVet, setControlesVet] = useState([]);
  const [loaderTablaContVet, setLoaderTablaContVet] = useState(true);
  const [showActa, setShowActa] = useState(false);
  const [dataActa, setDataActa] = useState({ url: "", fecha: "" });
  const handleShowActa = (url, fecha) => {
    setDataActa({ url, fecha });
    setShowActa(true);
  };

  const [controlesProd, setControlesProd] = useState([]);
  const [loaderTablaControProd, setLoaderTablaControProd] = useState(true);

  useEffect(() => {
    //! PRODUCCION
    setLoaderTablaControProd(true);
    axios(url + "tambo/control?page=1&limit=10000").then(({ data }) => {
      setLoaderTablaControProd(false);
      const dataFormat = [];
      data.data.map((d) => {
        const fecha = d.createdAt.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
        d.Lotes.map((l) => {
          l.ControlLecheros.map((cl) => {
            dataFormat.push({
              fecha: fechaFinal,
              litros: cl.total,
              caravana: cl.caravana,
            });
          });
        });
      });
      const controlesParticipes = [];
      dataFormat.map((df) => {
        if (df.caravana === animalSeleccionado.caravana) {
          controlesParticipes.push(df);
        }
      });
      setControlesProd(controlesParticipes);
    });

    //! INSEMIANCION
    setLoaderTablaInseminacion(true);
    axios(url + "tambo/ganado/inseminacion/").then(({ data }) => {
      setLoaderTablaInseminacion(false);
      const inseminaciones = data.data.map((i) => {
        const fecha = i.fecha.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
        return {
          ...i,
          fecha: fechaFinal,
        };
      });

      const inseminacionesParticipes = [];
      inseminaciones.map((df) => {
        if (df.caravana === animalSeleccionado.caravana) {
          inseminacionesParticipes.push(df);
        }
      });
      setInsemianciones(inseminacionesParticipes);
    });

    //! VETERINARIO
    setLoaderTablaContVet(true);
    axios(url + "tambo/controlveterinario")
      .then(({ data }) => {
        setLoaderTablaContVet(false);
        const controles = [];
        data.map((cargado) => {
          const fecha = cargado.createdAt.split("T")[0];
          const arrayFecha = fecha.split("-");
          const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;

          cargado.Ganados.map((g) => {
            controles.push({
              caravana: g.caravana,
              fecha: fechaFinal,
              veterinario: cargado.veterinario,
              aclaracion: cargado.detalle,
              url: cargado.acta_url,
            });
          });
        });
        const contVetParticipes = [];
        controles.map((df) => {
          if (df.caravana === animalSeleccionado.caravana) {
            contVetParticipes.push(df);
          }
        });
        setControlesVet(contVetParticipes);
      })
      .catch((error) => console.log(error));
  }, [animalSeleccionado]);

  const handleDelete = () => {
    Swal.fire({
      title: `¿Estas seguro de dar de baja al animal con caravana ${animalSeleccionado.caravana}?`,
      text: "Si es asi, se perderan algunos de los registros de este",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      confirmButtonColor: "#D64747",
      iconColor: "#D64747",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${url}tambo/ganado/${animalSeleccionado.id}`)
          .then((res) => {
            Swal.fire({
              title: "Animal eliminado",
              icon: "success",
              iconColor: "#86C394",
              confirmButtonColor: "#86C394",
            }).then(() => {
              window.location.reload();
            });
          });
      } else {
        return;
      }
    });
  };

  return animalSeleccionado ? (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 bg-white-bg h-full scrollbar overflow-auto">
      <div className="w-full flex flex-col items-start bg-white-bg2 p-2 space-y-1">
        <div className="flex w-full justify-between">
          <Titulo text="DATOS BASICOS" />
          <button
            onClick={() => setShowEdit(true)}
            className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-12"
          >
            <MdEdit className="mx-auto text-2xl" />
          </button>
        </div>
        <div className="flex items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Caravana:
          </label>
          <p className=" text-black-comun p-2 text-xl grow">
            {animalSeleccionado.caravana}
          </p>
        </div>
        <div className="flex items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">Tipo:</label>
          <p className=" text-black-comun p-2 text-xl grow">
            {animalSeleccionado.tipo}
          </p>
        </div>
        <div className="flex items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Fecha de ingreso:
          </label>
          <p className=" text-black-comun p-2 text-xl grow">
            {animalSeleccionado.fecha_ingreso_forma}
          </p>
        </div>
        <div className="flex items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Estado:
          </label>
          <p className=" text-black-comun p-2 text-xl grow">
            {animalSeleccionado.estado}
          </p>
        </div>
        <div
          className={`${
            animalSeleccionado.detalles ? "flex" : "hidden"
          } flex-col w-full`}
        >
          <label className="text-xl font-semibold text-white-bg3">
            Observaciones:
          </label>
          <p className=" text-black-comun text-xl grow">
            {animalSeleccionado.detalles}
          </p>
        </div>

        <div className="pt-2 flex justify-end w-full">
          <button onClick={handleDelete} className="boton_rojo">
            DAR DE BAJA
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col items-start bg-white-bg2 p-2 space-y-1">
        <Titulo text="CONTROL DE PRODUCCION" />
        <table className="border-separate text-lg w-full">
          <thead className=" bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Fecha</td>
              <td>Litros</td>
            </tr>
          </thead>
          <tbody>
            {loaderTablaControProd ? (
              <LoaderDatos textLoader="Cargando datos..." />
            ) : controlesProd.length ? (
              controlesProd.map((g, index) => (
                <tr key={index} className="bg-white-bg">
                  <td className="px-1">{g.fecha}</td>
                  <td className="px-1">{g.litros}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Sin datos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full flex flex-col items-start bg-white-bg2 p-2 space-y-1">
        <Titulo text="INSEMINACION" />
        <table className="border-separate text-lg w-full">
          <thead className=" bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Fecha</td>
              <td>Sexado</td>
              <td>Pajuela</td>
            </tr>
          </thead>
          <tbody>
            {loaderTablaInseminacion ? (
              <LoaderDatos textLoader="Cargando datos..." />
            ) : inseminaciones.length ? (
              inseminaciones.map((g) => (
                <tr key={g.id} className="bg-white-bg">
                  <td className="px-1">{g.fecha}</td>
                  <td className="px-1">{g.sexado}</td>
                  <td className="px-1">{g.pajuela}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Sin datos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full flex flex-col items-start bg-white-bg2 p-2 space-y-1">
        <Titulo text="CONTROL VETERINARIO" />
        <table className="border-separate text-lg w-full">
          <thead className=" bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Fecha</td>
              <td>Veterinario</td>
              <td>Detalle</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {loaderTablaContVet ? (
              <LoaderDatos textLoader="Cargando datos..." />
            ) : controlesVet.length ? (
              controlesVet.map((g) => (
                <tr key={g.id} className="bg-white-bg">
                  <td className="px-1">{g.fecha}</td>
                  <td className="px-1 max-w-32 truncate">{g.veterinario}</td>
                  <td className="px-1 max-w-32 truncate">{g.aclaracion}</td>
                  <td
                    className="hover:bg-button-green_hover
                                     bg-button-green text-white-bg text-xl cursor-pointer w-8"
                    onClick={() => handleShowActa(g.url, g.fecha)}
                  >
                    <FaNewspaper className="mx-auto" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Sin datos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showEdit ? (
        <Modal>
          <EditarAnimal setCloseModal={setShowEdit} data={animalSeleccionado} />
        </Modal>
      ) : null}

      {showActa ? (
        <Modal>
          <div className="flex flex-col space-y-2 items-start w-[90vw] sm:w-[500px] max-h-[90dvh]">
            <div className="w-full flex justify-between">
              <Titulo text={`ACTA CONTROL | ${dataActa.fecha}`} />
              <button className="boton_rojo" onClick={() => setShowActa(false)}>
                VOLVER
              </button>
            </div>
            <div className="max-h-[78dvh] scrollbar overflow-auto">
              <img
                src={dataActa.url}
                alt="Acta de control veterinario"
                className="w-full"
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  ) : (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 bg-white-bg h-full scrollbar overflow-auto">
      <p className="text-white-bg3 text-xl">
        Selecciona uno para ver sus detalles.
      </p>
    </div>
  );
};

export default DataAnimalesTambo;
