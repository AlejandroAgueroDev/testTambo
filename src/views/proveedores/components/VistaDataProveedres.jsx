import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import { MdEdit, MdDelete } from "react-icons/md";
//?COMPONENTS
import MenuProveedor from "./MenuProveedor";
import BarraSeparadora from "../../../common/BarraSeparadora";
import ContenedorGeneral from "../../../common/ContenedorGeneral";
import Titulo from "../../../common/Titulo";
import LoaderModal from "../../../common/LoaderModal";
import EditarProveedor from "./EditarProveedor";
import Modal from "../../../common/Modal";

const VistaDataProveedores = () => {
    const nav = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editableProveedor, setEditableProveedor] = useState({
        nombre_empresa: "",
        contacto_1: "",
        contacto_2: "",
        localidad: "",
        isTamboProveedor: true,
    }); // Estado para almacenar los datos del cliente que se pueden editar
    const [tempProveedor, setTempProveedor] = useState({}); // Estado temporal para almacenar los cambios realizados en el formulario de edición
    const [loader, setLoader] = useState(false);
    const [loaderDatos, setLoaderDatos] = useState(true);
    const [loaderDatosError, setLoaderDatosError] = useState(false);
    const [proveedor, setProveedor] = useState({});
    const { sector_titulo, sector_nombre, id } = useParams();

    //?GET PROVEEDOR
    const fetchProveedor = async () => {
        try {
            const { data } = await axios.get(`${url}proveedor/${id}`, { id });
            setLoaderDatos(false);
            setProveedor(data.proveedor);
            setEditableProveedor(data.proveedor);
            setTempProveedor(data.proveedor);
        } catch (error) {
            console.error("Error al obtener proveedores:", error);
            setLoaderDatosError(true);
        }
    };

    //?GET sector
    const fetchSector = async () => {
        try {
            const { data } = await axios.get(`${url}sector`);
            data.map((sector) => {
                if (sector.nombre === sector_nombre) {
                    fetchProveedor(sector.id);
                }
            });
        } catch (error) {
            console.error("Error al obtener sector:", error);
        }
    };
    useEffect(() => {
        fetchSector();
    }, []);

    const handleEdit = () => {
        setTempProveedor(editableProveedor);
        setShowModal(true);
    };

    const handleSave = async (editableProveedor) => {
        setLoader(true);

        try {
            const proveedorToUpdate = {
                id: editableProveedor.id,
                nombre_empresa: editableProveedor.nombre_empresa,
                contacto_1: editableProveedor.contacto_1,
                localidad: editableProveedor.localidad,
                saldo: editableProveedor.saldo || 0, // Asegura un valor por defecto
                isTamboProveedor: false, // O false según corresponda
            };
            const { data } = await axios.put(`${url}proveedor`, proveedorToUpdate);
            const updatedData = {
                ...data.proveedor,
                isTamboProveedor: true,
            };

            setEditableProveedor(updatedData);
            setProveedor(updatedData);
            setShowModal(false);
            Swal.fire({
                title: "¡Proveedor actualizado con éxito!",
                confirmButtonText: "Aceptar",
                icon: "success",
                confirmButtonColor: "#86C394",
            });
        } catch (error) {
            console.error("Error al actualizar proveedor:", error);
            Swal.fire({
                title: "Error al actualizar proveedor",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
            });
        } finally {
            setLoader(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempProveedor((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDelete = () => {
        Swal.fire({
            title: `¿Quieres eliminar el proveedor "${proveedor.nombre_empresa}" definitivamente?`,
            showDenyButton: true,
            confirmButtonText: "Sí",
            denyButtonText: "No",
            confirmButtonColor: "#86C394",
            denyButtonColor: "#D64747",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${url}cliente/${proveedor.id}`);
                    Swal.fire({
                        title: "Proveedor eliminado",
                        confirmButtonText: "Aceptar",
                        icon: "success",
                        confirmButtonColor: "#86C394",
                    }).then(() => {
                        nav(`/proveedores/${sector_nombre}/${sector_titulo}`);
                    });
                } catch (error) {
                    console.error("Error al eliminar proveedor:", error);
                    Swal.fire({
                        title: "Error al eliminar proveedor",
                        text: error.message,
                        icon: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#D64747",
                    });
                }
            }
        });
    };

    return (
        <ContenedorGeneral navText={sector_titulo.toUpperCase()}>
            <div className="w-screen md:w-full flex md:justify-between md:pl-0 md:pr-0 justify-center items-center pl-14 pr-4 text-center space-x-3">
                <Titulo text={`PROVEEDOR | ${proveedor.nombre_empresa}`} />
                <Link to={`/proveedores/${sector_nombre}/${sector_titulo}`} className="boton_rojo">
                    VOLVER
                </Link>
            </div>

            <div className="flex flex-wrap justify-center items-end p-2 space-x-3 overflow-auto sm:overflow-visible scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-5">
                    <div className="flex flex-col">
                        <label className="text-xl font-semibold text-white-bg3">Nombre / Empresa:</label>
                        <input
                            disabled
                            type="text"
                            name="nombre_empresa"
                            value={editableProveedor.nombre_empresa}
                            readOnly={!showModal}
                            onChange={handleInputChange}
                            className="input"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xl font-semibold text-white-bg3">Contacto:</label>
                        <input
                            disabled
                            type="text"
                            name="contacto_1"
                            value={editableProveedor.contacto_1 || "-"}
                            readOnly={!showModal}
                            onChange={handleInputChange}
                            className="input"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xl font-semibold text-white-bg3">Localidad:</label>
                        <input
                            disabled
                            type="text"
                            name="contacto_2"
                            value={editableProveedor.localidad}
                            readOnly={!showModal}
                            onChange={handleInputChange}
                            className="input"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xl font-semibold text-white-bg3">Saldo actual:</label>
                        <div className="bg-white-bg2 text-black-comun text-xl pl-3 flex items-center space-x-2 w-full">
                            <p className="font-bold text-white-bg3">$</p>
                            <input
                                disabled
                                onChange={handleInputChange}
                                type="text"
                                name="saldo"
                                value={editableProveedor.saldo}
                                className="bg-white-bg2 text-black-comun py-2 pl-3 text-xl grow"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center h-12 space-x-3 mt-6 mr-40">
                        <button
                            className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-12"
                            onClick={handleEdit}
                        >
                            <MdEdit className="mx-auto" />
                        </button>
                        <button
                            className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-12"
                            onClick={handleDelete}
                        >
                            <MdDelete className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>

            <BarraSeparadora orientacion="horizontal" />

            <MenuProveedor
                dataProveedor={proveedor}
                fetch={fetchSector}
                sector_titulo={sector_titulo}
                sector_nombre={sector_nombre}
            />

            {showModal && (
                <Modal>
                    <EditarProveedor
                        proveedor={tempProveedor}
                        setShowModal={setShowModal}
                        handleInputChange={handleInputChange}
                        handleSave={handleSave}
                        loader={loader}
                    />
                </Modal>
            )}

            {loaderDatos && (
                <Modal>
                    {loaderDatosError ? (
                        <div className="w-[400px] flex flex-col space-y-3 justify-center">
                            <p className="text-2xl text-black-comun flex flex-col items-center justify-center ">
                                <strong className="text-button-red text-bold">Ocurrio un error inesperado.</strong> Si
                                el error persiste, llame a servicio técnico.
                            </p>
                            <div className="flex w-full justify-center">
                                <Link to={`/proveedores/${sector_nombre}/${sector_titulo}`} className="boton_verde">
                                    VOLVER A PROVEEDORES
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <LoaderModal textLoader={"Cargando datos del proveedor"} />
                    )}
                </Modal>
            )}
        </ContenedorGeneral>
    );
};

export default VistaDataProveedores;
