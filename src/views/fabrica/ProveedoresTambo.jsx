import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { url } from "../../common/URL_SERVER";
import axios from "axios";
//?COMPONENTES
import Modal from "../../common/Modal";
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import TablaProveedores from "./components/proveedoresTamboFabrica/TablaProveedores";
import AñadirProveedor from "./components/proveedoresTamboFabrica/AñadirProveedor";
import LoaderDatos from "../../common/LoaderDatos";

const ProveedoresTamboFabrica = () => {
    const [addNew, setAddNew] = useState(false);
    const [proveedores, setProveedores] = useState([]);
    const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [loader, setLoader] = useState(true);

    //?GET de proveedores
    const fetchProveedores = async () => {
        try {
            const { data } = await axios.get(`${url}proveedor`);
            const proveedoresArray = Array.isArray(data.tamboProveedor) ? data.tamboProveedor : [];
            setLoader(false);
            setProveedores(proveedoresArray);
            setProveedoresFiltrados(proveedoresArray);
        } catch (error) {
            console.error("Error al cargar proveedores de tambo:", error);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    const handleAddNew = (e) => {
        e.preventDefault();
        setAddNew(true);
    };

    const handleSearch = (type) => {
        if (type === "search") {
            setIsSearch(true);
            const searchLower = search.toLowerCase();
            const filtered = proveedores.filter((proveedor) => {
                const nombre = proveedor.nombre ? proveedor.nombre.toLowerCase() : "";
                const localidad = proveedor.localidad ? proveedor.localidad.toLowerCase() : "";
                return nombre.includes(searchLower) || localidad.includes(searchLower);
            });
            setProveedoresFiltrados(filtered);
        } else {
            setIsSearch(false);
            setProveedoresFiltrados(proveedores);
            setSearch("");
        }
    };
    return (
        <ContenedorGeneral navText="FABRICA">
            <div className="w-screen md:w-full flex justify-between items-center pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="LISTA DE PROVEEDORES DE TAMBO" />

                <div className="hidden md:block">
                    <div className="flex space-x-2">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            className="bg-white-bg2 text-black py-2 px-3 text-xl w-96"
                            placeholder="Buscar por nombre o localidad"
                        />
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

                <div className="flex gap-4">
                    <Link to="/fabrica" className="boton_rojo flex justify-end">
                        VOLVER
                    </Link>
                </div>
            </div>

            <div className="md:hidden w-full flex justify-end pr-4">
                <div className="flex space-x-2">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        className="bg-white-bg2 text-black py-2 px-3 text-xl w-60"
                        placeholder="Buscar por nombre o localidad"
                    />
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

            <div className="h-[100%] w-screen scrollbar overflow-auto pr-4 md:pr-0 md:w-auto">
                {loader ? (
                    <LoaderDatos textLoader="Cargando datos" />
                ) : (
                    <TablaProveedores proveedores={proveedoresFiltrados} />
                )}
            </div>

            <div>
                <button onClick={handleAddNew} className={addNew ? "boton_verde_selected" : "boton_verde"}>
                    {addNew ? "AÑADIENDO PROVEEDOR DE TAMBO" : "AÑADIR PROVEEDOR DE TAMBO"}
                </button>
            </div>

            {addNew ? (
                <Modal>
                    <AñadirProveedor setCloseModal={setAddNew} getProveedores={fetchProveedores} />
                </Modal>
            ) : null}
        </ContenedorGeneral>
    );
};

export default ProveedoresTamboFabrica;
