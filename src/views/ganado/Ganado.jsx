import Titulo from "../../common/Titulo";
import Modal from "../../common/Modal";
import { useEffect, useState } from "react";
import AddGanado from "./components/AddGanado";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import axios from "axios";
import { url } from "../../common/URL_SERVER";
import Paginador from "../../common/Paginador";
import LoaderDatos from "../../common/LoaderDatos";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import EditarAnimal from "./components/EditarAnimal";

const Ganado = () => {
  const [addNew, setAddNew] = useState(false);
  const [ganado, setGanado] = useState([]);
  const [cantidadPaginas, setCantidadPaginas] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loader, setLoader] = useState(true);
  const [endPoint, setEndpoint] = useState(
    `${url}tambo/ganado?page=${paginaActual}&limit=15`
  );
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    setLoader(true);
    const finalEndpoint = isSearch
      ? `${url}tambo/ganado?page=${paginaActual}&limit=15&caravana=${search}`
      : `${url}tambo/ganado?page=${paginaActual}&limit=15`;

    axios(finalEndpoint)
      .then(({ data }) => {
        setCantidadPaginas(data.totalPages);
        setPaginaActual(data.currentPage);
        setLoader(false);
        const ganadoCorregido = data.data.map((g) => ({
          ...g,
          fecha_ingreso: g.fecha_ingreso
            .split("T")[0]
            .split("-")
            .reverse()
            .join("/"),
        }));
        setGanado(ganadoCorregido);
      })
      .catch((error) => {
        setLoader(false);
        if (
          error.response?.data?.message ===
          "No existen registros para los filtros proporcionados."
        ) {
          Swal.fire({
            title: `No se encontraron animales con la caravana ${search}`,
            icon: "question",
            iconColor: "#D64747",
            confirmButtonColor: "#D64747",
          }).then(() => {
            setPaginaActual(1);
            setIsSearch(false);
            setSearch("");
          });
        } else {
          Swal.fire({
            title: "Hubo un error en la busqueda, intente nuevamente",
            icon: "error",
            iconColor: "#D64747",
            confirmButtonColor: "#D64747",
          }).then(() => {
            setPaginaActual(1);
            setIsSearch(false);
            setSearch("");
            setEndpoint(`${url}tambo/ganado?page=${paginaActual}&limit=15`);
          });
        }
      });
  }, [paginaActual, endPoint]);

  const handleAddNew = (e) => {
    e.preventDefault();
    setAddNew(true);
  };

  const handleSearch = (type) => {
    if (type === "search") {
      setIsSearch(true);
      setPaginaActual(1); // Reinicia la paginación a la primera página
      setEndpoint(`${url}tambo/ganado?page=1&limit=15&caravana=${search}`);
    } else {
      setIsSearch(false);
      setPaginaActual(1); // Reinicia la paginación al limpiar la búsqueda
      setEndpoint(`${url}tambo/ganado?page=1&limit=15`);
      setSearch("");
    }
  };

  useEffect(() => {
    if (!endPoint.includes("${" + search + "}")) {
      setIsSearch(false);
    }
  }, [search]);

  //! ELIMINAR
  const handleDelete = (id, caravana) => {
    Swal.fire({
      title: `¿Estas seguro de eliminar el animal con caravana " ${caravana} "?`,
      text: "Si se elimina, se perderan algunos de los registros de este",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      confirmButtonColor: "#D64747",
      iconColor: "#D64747",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${url}tambo/ganado/${id}`).then((res) => {
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

  //! EDITAR
  const handleEdit = (data) => {
    setEditData(data);
    setShowEdit(true);
  };

  return (
    <ContenedorGeneral navText="GANADO">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="GANADO" />

        <div className="hidden md:block">
          <div className="flex space-x-2">
            <div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="bg-white-bg2 text-black py-2 px-3 text-xl w-60"
                placeholder="Buscar por caravana"
              />
            </div>
            <button
              className={`${
                isSearch
                  ? "bg-button-red hover:bg-button-red_hover"
                  : "bg-button-green hover:bg-button-green_hover"
              } px-3 text-white-bg2 text-2xl`}
              onClick={() => handleSearch(isSearch ? "close" : "search")}
            >
              {isSearch ? <IoMdClose /> : <IoSearchSharp />}
            </button>
          </div>
        </div>

        <button
          onClick={handleAddNew}
          className={addNew ? "boton_verde_selected" : "boton_verde"}
        >
          {addNew ? "AGREGANDO" : "AGREGAR"}
        </button>
      </div>

      <div className="md:hidden w-full flex justify-end pr-4">
        <div className="flex space-x-2">
          <div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="bg-white-bg2 text-black py-2 px-3 text-xl w-60"
              placeholder="Buscar por caravana"
            />
          </div>
          <button
            className={`${
              isSearch
                ? "bg-button-red hover:bg-button-red_hover"
                : "bg-button-green hover:bg-button-green_hover"
            } px-3 text-white-bg2 text-2xl`}
            onClick={() => handleSearch(isSearch ? "close" : "search")}
          >
            {isSearch ? <IoMdClose /> : <IoSearchSharp />}
          </button>
        </div>
      </div>

      <div className="h-[79%] md:h-[83.5%] w-screen scrollbar overflow-auto pr-4 md:pr-0 md:w-auto">
        <div>
          <div className="h-full min-w-[648px] overflex-x-auto scrollbar overflow-auto relative">
            <table className="border-separate text-lg w-full relative ">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-white-bg text-center">
                  <td>Caravana</td>
                  <td>Tipo</td>
                  <td>Fecha de ingreso</td>
                  {/* <td>Ult. control veterinario</td> */}
                  <td>Estado</td>
                  <td></td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {loader ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <LoaderDatos textLoader="Cargando ganado" />
                    </td>
                  </tr>
                ) : ganado && ganado.length ? (
                  ganado.map((g) => (
                    <tr key={g.id || g.caravana} className="bg-white-bg2">
                      <td className="px-1">{g.caravana}</td>
                      <td className="px-1">{g.tipo}</td>
                      <td className="px-1">{g.fecha_ingreso}</td>
                      {/* <td className="px-1">{g.fecha_ultimo_control}</td> */}
                      <td className="px-1">{g.estado}</td>
                      <td
                        onClick={() => handleEdit(g)}
                        className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8"
                      >
                        <MdEdit className="mx-auto" />
                      </td>
                      <td
                        onClick={() => handleDelete(g.id, g.caravana)}
                        className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                      >
                        <MdDelete className="mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Aun no hay animales cargados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {loader || cantidadPaginas <= 1 ? null : (
              <div className="pt-1 ">
                <Paginador
                  cantidadPaginas={cantidadPaginas}
                  paginaActual={paginaActual}
                  setPagina={setPaginaActual}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {addNew ? (
        <Modal>
          <AddGanado setCloseModal={setAddNew} />
        </Modal>
      ) : null}

      {showEdit ? (
        <Modal>
          <EditarAnimal setCloseModal={setShowEdit} data={editData} />
        </Modal>
      ) : null}
    </ContenedorGeneral>
  );
};

export default Ganado;
