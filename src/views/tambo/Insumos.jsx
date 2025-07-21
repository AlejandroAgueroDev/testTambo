import TablaInsumos from "./components/insumos/TablaInstumos";
import Titulo from "../../common/Titulo";
import Modal from "../../common/Modal";
import { useEffect, useState } from "react";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import axios from "axios";
import CargarInsumo from "./components/insumos/CargarInsumo";
import NuevoInsumo from "./components/insumos/NuevoInsumo";
import { useParams } from "react-router-dom";
import { url } from "../../common/URL_SERVER";
import LoaderDatos from "../../common/LoaderDatos";
import TablaDocumentos from "./components/insumos/TablaDocumentos";

const Insumos = () => {
    const { sector, origen } = useParams();
    const [loaderData, setLoaderData] = useState(true);
    const [sectorId, setSectorId] = useState("");
    const [iMedicamentos, setIMedicamentos] = useState([]);
    const [iAlimentos, setIAlimentos] = useState([]);
    const [iVarios, setIVarios] = useState([]);
    const [allInstumos, setAllInstumo] = useState([]);

    //! NUEVO INSUMO
    const [addNew, setAddNew] = useState(false);
    const [tipoInsumo, setTipoInsumo] = useState("");

    //! CARGAR INSUMO
    const [cargar, setCargar] = useState(false);
    const [dataInsumo, setDataInsumo] = useState({});

    const handleCargar = (id) => {
        const data = allInstumos.find((i) => i.id === id);
        setDataInsumo(data);
        setCargar(true);
    };

    const handleAddNew = (e, tipo) => {
        e.preventDefault();
        setAddNew(true);
        setTipoInsumo(tipo);
    };

    const arrayHeader = ["Nombre", "Proveedor", "Stock", "Fecha ult. modificación", "Precio"];

    const fetchData = async () => {
        try {
            let id_sector;
            const { data } = await axios(url + "sector");

            const sectorEncontrado = data.find((d) => d.nombre === "Tambos");
            if (sectorEncontrado) {
                id_sector = sectorEncontrado.id;
            }

            if (!id_sector) {
                console.error("No se encontró el id del sector");
                return;
            }

            setSectorId(id_sector);

            // Segunda solicitud: obtener insumos del sector
            const insumoResponse = await axios(url + `insumo/${id_sector}`);
            setLoaderData(false);

            const medicamtos = [];
            const alimentos = [];
            const varios = [];

            insumoResponse.data.data.forEach((i) => {
                if (i.tipo === "OTROS") {
                    varios.push(i);
                } else if (i.tipo === "ALIMENTO") {
                    alimentos.push(i);
                } else if (i.tipo === "MEDICAMENTO") {
                    medicamtos.push(i);
                }
            });

            const arrayInsumosConStock = [];
            const formatData = (items) => {
                const arrayInsumos = [];
                items.map((m) => {
                    m.Proveedors.forEach((p) => {
                        const proveedor = p.ProveedorInsumo;
                        console.log(proveedor);
                        const fechaIngreso =
                            proveedor?.ultimo_ingreso?.split("T")[0].split("-").reverse().join("/") || "-";
                        const stock = proveedor?.stock || 0;

                        arrayInsumosConStock.push({
                            ...m,
                            stock: stock,
                            precio: proveedor.precio || 0,
                            id_proveedor: p.id,
                            fecha: fechaIngreso,
                            prov_nombre: p.nombre_empresa,
                        });

                        arrayInsumos.push([
                            m.nombre,
                            p.nombre_empresa,
                            stock,
                            fechaIngreso,
                            proveedor?.precio || 0,
                            m.id,
                            m.id_sector,
                        ]);
                    });
                });
                return arrayInsumos;
            };
            setAllInstumo(arrayInsumosConStock);
            setIMedicamentos(formatData(medicamtos));
            setIAlimentos(formatData(alimentos));
            setIVarios(formatData(varios));
        } catch (error) {
            console.error("Error en la carga de datos:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ContenedorGeneral navText={origen.toUpperCase()}>
            <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0 mt-1 sm:mt-0 mb-1 sm:mb-0">
                <Titulo text={`${origen.toUpperCase()} | INSUMOS`} />
                <Link to={`/${origen}`} className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            <div className="w-screen md:w-full flex sm:hidden justify-between pl-14 md:pl-0 pr-4 md:pr-0 mt-1 sm:mt-0 mb-1 sm:mb-0">
                <Titulo text="INSUMOS" />
                <Link to={`/${origen}`} className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            {loaderData ? (
                <LoaderDatos textLoader="Cargando insumos..." />
            ) : (
                <div className="h-[100%] w-full scrollbar overflow-auto px-1 py-2 sm:p-2 md:w-auto bg-white-bg2 space-y-5">
                    <TablaInsumos
                        title="MEDICAMENTOS"
                        arrayHeader={arrayHeader}
                        arrayContent={iMedicamentos}
                        placeHolder="No hay medicamentos cargados."
                        hanldeCargar={handleCargar}
                        handleNuevo={handleAddNew}
                    />
                    <TablaInsumos
                        title="ALIMENTOS"
                        arrayHeader={arrayHeader}
                        arrayContent={iAlimentos}
                        placeHolder="No hay alimentos cargados."
                        hanldeCargar={handleCargar}
                        handleNuevo={handleAddNew}
                    />
                    <TablaInsumos
                        title="OTROS"
                        arrayHeader={arrayHeader}
                        arrayContent={iVarios}
                        placeHolder="No hay insumos cargados."
                        hanldeCargar={handleCargar}
                        handleNuevo={handleAddNew}
                    />
                    <TablaDocumentos sectorId={sectorId} />
                </div>
            )}
            <div className="flex justify-end">
                <Link to={`/proveedores/Tambos/${origen === "tambo" ? "tambo" : "recria"}`} className="boton_verde">
                    PROVEEDORES DE INSUMOS
                </Link>
            </div>

            {addNew ? (
                <Modal>
                    <NuevoInsumo
                        setCloseModal={setAddNew}
                        type={tipoInsumo}
                        origen={origen}
                        id_sector={sectorId}
                        getInsumos={fetchData}
                    />
                </Modal>
            ) : null}

            {cargar ? (
                <Modal>
                    <CargarInsumo setCloseModal={setCargar} data={dataInsumo} isTambo={true} />
                </Modal>
            ) : null}
        </ContenedorGeneral>
    );
};

export default Insumos;
