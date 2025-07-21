import Titulo from "../../common/Titulo";
import Modal from "../../common/Modal";
import { useEffect, useState } from "react";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";
import NuevoInsumo from "./components/insumos/NuevoInsumoAgr";
import { url } from "../../common/URL_SERVER";
import LoaderDatos from "../../common/LoaderDatos";
import Swal from "sweetalert2";
import LoaderModal from "../../common/LoaderModal";
import EditarInsumo from "./components/insumos/EditarInsumos";
import TablaDocumentos from "../tambo/components/insumos/TablaDocumentos";

const InsumosAgricultura = () => {
    const [allInstumos, setAllInstumo] = useState([]);
    const [loaderData, setLoaderData] = useState(true);
    const [idSector, setIdSector] = useState("");
    const [loader, setLoader] = useState(false);

    //! NUEVO INSUMO
    const [addNew, setAddNew] = useState(false);

    //! CARGAR INSUMO
    const [cargar, setCargar] = useState(false);
    const [dataInsumo, setDataInsumo] = useState({});

    const handleCargar = (data) => {
        setDataInsumo(data);
        setCargar(true);
    };

    const fetchData = async () => {
        try {
            let id_sector;

            const { data } = await axios(url + "sector");

            const sectorEncontrado = data.find((d) => d.nombre === "Agricultura");
            if (sectorEncontrado) {
                id_sector = sectorEncontrado.id;
            }

            setIdSector(id_sector);

            if (!id_sector) {
                console.error("No se encontró el id del sector");
                return;
            }
            const insumoResponse = await axios(url + `insumo/${id_sector}`);
            console.log(insumoResponse.data.data);

            const formatData = [];
            insumoResponse.data.data.map((i) => {
                i.Proveedors.forEach((p) => {
                    const proveedor = p.ProveedorInsumo;
                    console.log(proveedor);
                    const fechaIngreso = proveedor?.ultimo_ingreso?.split("T")[0].split("-").reverse().join("/") || "-";
                    const stock = proveedor?.stock || 0;
                    formatData.push({
                        ...i,
                        stock: stock,
                        precio: proveedor.precio || 0,
                        id_proveedor: p.id,
                        fecha: fechaIngreso,
                        prov_nombre: p.nombre_empresa,
                    });
                });
            });

            setLoaderData(false);
            setAllInstumo(formatData);
        } catch (error) {
            console.error("Error en la carga de datos:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (id, nombre, proveedor) => {
        const datos = { id: id, id_sector: idSector };
        Swal.fire({
            title: `¿Quieres eliminar el insumo "${nombre}" del proveedor ${proveedor} definitivamente?`,
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No`,
            confirmButtonColor: "#86C394",
            denyButtonColor: "#D64747",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoader(true);
                axios
                    .delete(url + `insumo?id=${id}&id_sector=${idSector}`, datos)
                    .then(() => {
                        Swal.fire({
                            title: `¡Insumo "${nombre}" eliminado con éxito!`,
                            confirmButtonText: "Aceptar",
                            icon: "success",
                            confirmButtonColor: "#86C394",
                        }).then(() => {
                            setLoader(false);
                            fetchData();
                        });
                    })
                    .catch((error) => {
                        setLoader(false);
                        console.log(error);
                        Swal.fire({
                            title: "Ocurrio un error inesperado, intente nuevamente",
                            text: error.message === "Network Error" ? "Contacte con el servicio técnico" : error,
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#D64747",
                            icon: "error",
                        });
                    });
            } else if (result.isDenied) {
                setLoader(false);
                return;
            }
        });
    };

    return (
        <ContenedorGeneral navText="AGRICULTURA">
            <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="AGRICULTURA | INSUMOS" />

                <Link to={`/agricultura`} className="boton_rojo">
                    VOLVER
                </Link>
            </div>

            <div className="h-[100%] w-full scrollbar overflow-auto pr-4 md:p-2 md:w-auto bg-white-bg2 space-y-2 p-2">
                <div className="w-full flex justify-between">
                    <Titulo text="INSUMOS VARIOS" />
                    <button onClick={() => setAddNew(true)} className="boton_verde ml-4 px-4 py-2 text-white-bg">
                        NUEVO INSUMO
                    </button>
                </div>
                <div className="w-full scrollbar overflow-auto">
                    <div className="h-full max-h-[400px] min-w-[648px]">
                        {loaderData ? (
                            <LoaderDatos textLoader="Cargando insumos" />
                        ) : (
                            <table className="border-separate text-lg w-full relative">
                                <thead className="sticky top-0 bg-white-bg3 z-10">
                                    <tr className="bg-white-bg3 text-center">
                                        <td>Nombre</td>
                                        <td>Proveedor</td>
                                        <td>Stock</td>
                                        <td>Fecha ult. ingreso</td>
                                        <td>Precio</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allInstumos.length ? (
                                        allInstumos[0].message ? (
                                            <tr>
                                                <td colSpan="7" className="text-center text-white-bg3">
                                                    No se encontraron insumos.
                                                </td>
                                            </tr>
                                        ) : (
                                            allInstumos.map((i) => (
                                                <tr key={i} className={`text-center bg-white-bg`}>
                                                    <td>{i.nombre}</td>
                                                    <td>{i.prov_nombre}</td>
                                                    <td>{i.stock}</td>
                                                    <td>{i.fecha}</td>
                                                    <td>$ {i.precio}</td>
                                                    <td
                                                        onClick={() => handleCargar(i)}
                                                        className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8"
                                                    >
                                                        <MdEdit className="mx-auto" />
                                                    </td>
                                                    <td
                                                        onClick={() =>
                                                            handleDelete(i.id, i.nombre, i.Proveedors[0].nombre)
                                                        }
                                                        className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                                                    >
                                                        <MdDelete className="mx-auto" />
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center text-white-bg3">
                                                No se encontraron insumos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <TablaDocumentos sectorId={idSector} />
            </div>
            <div className="flex justify-end">
                <Link to="/proveedores/Agricultura/agricultura" className="boton_verde">
                    PROVEEDORES DE INSUMOS
                </Link>
            </div>

            {addNew ? (
                <Modal>
                    <NuevoInsumo setCloseModal={setAddNew} sectorId={idSector} fetchData={fetchData} />
                </Modal>
            ) : null}

            {loader ? (
                <Modal>
                    <LoaderModal textLoader="Eliminado insumo..." />
                </Modal>
            ) : null}

            {cargar ? (
                <Modal>
                    <EditarInsumo setCloseModal={setCargar} data={dataInsumo} fetchData={fetchData} />
                </Modal>
            ) : null}
        </ContenedorGeneral>
    );
};

export default InsumosAgricultura;
