import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import MenuCliente from "./MenuCliente";
import BarraSeparadora from "../../../../common/BarraSeparadora";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import Titulo from "../../../../common/Titulo";
import LoaderModal from "../../../../common/LoaderModal";
import EditarCliente from "./EditarCliente";
import Modal from "../../../../common/Modal";

const VistaDataCliente = () => {
    const nav = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editableCliente, setEditableCliente] = useState({}); // Estado para almacenar los datos del cliente que se pueden editar
    const [tempCliente, setTempCliente] = useState({}); // Estado temporal para almacenar los cambios realizados en el formulario de edición
    const [loader, setLoader] = useState(false);
    const [loaderDatos, setLoaderDatos] = useState(true);
    const [loaderDatosError, setLoaderDatosError] = useState(false);
    const [cliente, setCliente] = useState({});
    const { sector_titulo, sector_nombre, id } = useParams();

    //?GET clientes
    const fetchCliente = async (sector_id) => {
        try {
            const { data } = await axios.get(`${url}cliente/${sector_id}?id_cliente=${id}`);
            setLoaderDatos(false);
            setCliente(data);
            setEditableCliente(data);
            setTempCliente(data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            setLoaderDatosError(true);
        }
    };

    //?GET sector
    const fetchSector = async () => {
        try {
            const { data } = await axios.get(`${url}sector`);
            data.map((sector) => {
                if (sector.nombre === sector_nombre) {
                    fetchCliente(sector.id);
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
        setTempCliente(editableCliente);
        setShowModal(true);
    };

    const handleSave = async () => {
        setLoader(true);
        try {
            await axios.put(`${url}cliente`, tempCliente);
            setEditableCliente(tempCliente);
            setShowModal(false);
            Swal.fire({
                title: "¡Cliente actualizado con éxito!",
                confirmButtonText: "Aceptar",
                icon: "success",
                confirmButtonColor: "#86C394",
            });
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            Swal.fire({
                title: "Error al actualizar cliente",
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
        setTempCliente((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDelete = () => {
        Swal.fire({
            title: `¿Quieres eliminar el cliente "${cliente.nombre_empresa}" definitivamente?`,
            showDenyButton: true,
            confirmButtonText: "Sí",
            denyButtonText: "No",
            confirmButtonColor: "#86C394",
            denyButtonColor: "#D64747",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${url}cliente/${cliente.id}`);
                    Swal.fire({
                        title: "Cliente eliminado",
                        confirmButtonText: "Aceptar",
                        icon: "success",
                        confirmButtonColor: "#86C394",
                    }).then(() => {
                        nav(`/clientes/${sector_nombre}/${sector_titulo}`);
                    });
                } catch (error) {
                    console.error("Error al eliminar cliente:", error);
                    Swal.fire({
                        title: "Error al eliminar cliente",
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
            <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0 ">
                <Titulo text={`CLIENTE | ${cliente.nombre_empresa}`} />
                <Link to={`/clientes/${sector_nombre}/${sector_titulo}`} className="boton_rojo">
                    VOLVER
                </Link>
            </div>

            <div className="flex flex-wrap justify-center items-end p-2 space-x-3 scrollbar overflow-auto sm:overflow-visible">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-5">
                    <div className="flex flex-col">
                        <label className="text-xl font-semibold text-white-bg3">Nombre / Empresa:</label>
                        <input
                            type="text"
                            name="nombre_empresa"
                            value={editableCliente.nombre_empresa || ""}
                            readOnly={!showModal}
                            onChange={handleInputChange}
                            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xl font-semibold text-white-bg3">Contacto:</label>
                        <input
                            type="text"
                            name="contacto_1"
                            value={editableCliente.contacto_1 || ""}
                            readOnly={!showModal}
                            onChange={handleInputChange}
                            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xl font-semibold text-white-bg3">Localidad:</label>
                        <input
                            type="text"
                            name="contacto_2"
                            value={editableCliente.localidad || ""}
                            readOnly={!showModal}
                            onChange={handleInputChange}
                            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xl font-semibold text-white-bg3">CUIT/CUIL:</label>
                        <input
                            type="text"
                            name="cuit_cuil"
                            value={editableCliente.cuit_cuil || ""}
                            readOnly={!showModal}
                            onChange={handleInputChange}
                            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xl font-semibold text-white-bg3">Saldo actual:</label>
                        <div className="bg-white-bg2 text-black-comun text-xl pl-3 flex items-center space-x-2 w-full">
                            <p className="font-bold text-white-bg3">$</p>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                name="saldo"
                                value={editableCliente.saldo || ""}
                                className="bg-white-bg2 text-black-comun py-2 pl-3 text-xl grow"
                            />
                        </div>
                    </div>

                    <div className="flex items-end w-full space-x-2">
                        <button className="boton_verde w-full" onClick={handleEdit}>
                            EDITAR
                        </button>
                        <button className="boton_rojo w-full" onClick={handleDelete}>
                            ELIMINAR
                        </button>
                    </div>
                </div>
            </div>

            <BarraSeparadora orientacion="horizontal" />

            <MenuCliente
                dataCliente={cliente}
                fetch={fetchSector}
                sector_titulo={sector_titulo}
                sector_nombre={sector_nombre}
            />

            {showModal && (
                <EditarCliente
                    tempCliente={tempCliente}
                    setShowModal={setShowModal}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    loader={loader}
                />
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
                                <Link to={`/clientes/${sector_nombre}/${sector_titulo}`} className="boton_verde">
                                    VOLVER A CLIENTES
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <LoaderModal textLoader={"Cargando datos del cliente"} />
                    )}
                </Modal>
            )}
        </ContenedorGeneral>
    );
};

export default VistaDataCliente;
