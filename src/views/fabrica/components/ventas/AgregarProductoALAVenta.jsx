import Titulo from "../../../../common/Titulo";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "../../../../common/Modal";
import SearchableSelect from "../../../../common/SearchSelect";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import NuevoProducto from "../productos/NuevoProducto";

const AgregarProductoALaVenta = ({
    setCloseModal,
    productos,
    setProductos,
    listaDePrecios,
    setProductosCompraNombres,
    productosCompraNombres,
}) => {
    const [formProducto, setFormProducto] = useState({
        id_producto: "",
        cantidad: 1,
        precio: 0,
        nombre: "",
    });
    const [insumosUtilizados, setInsumosUtilizados] = useState([]);
    const [showAgregarInsumo, setShowAgregarInsumo] = useState(false);
    const [productosExistentes, setProductosExistentes] = useState([]);
    const [productosAllDatos, setProductosAllDatos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [sector, setSector] = useState(null);

    //?GET de productos
    const fetchProductos = async () => {
        try {
            const { data } = await axios.get(`${url}fabrica/producto`);
            setProductosAllDatos(data);
            const dataFormat = [];
            data.map((d) => {
                dataFormat.push({ label: d.nombre, value: d.id });
            });
            setProductosExistentes(dataFormat);
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

    useEffect(() => {
        fetchProductos();
        fetchSector();
    }, []);

    const selectProducto = (value, label) => {
        if (productosCompraNombres.includes(value)) {
            Swal.fire({
                title: "Ya has seleccionado este producto",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                iconColor: "#D64747",
                icon: "warning",
            }).then(() => {
                setCloseModal(false);
            });
        }

        const producto = productosAllDatos.find((p) => p.id === value);
        if (listaDePrecios === "REVENTA") {
            setFormProducto({
                ...formProducto,
                nombre: label,
                id_producto: value,
                precio: producto.precio_reventa,
            });
        } else if (listaDePrecios === "COMERCIO") {
            setFormProducto({
                ...formProducto,
                nombre: label,
                id_producto: value,
                precio: producto.precio_comercio,
            });
        } else {
            setFormProducto({
                ...formProducto,
                nombre: label,
                id_producto: value,
                precio: producto.precio_consumidor_final,
            });
        }
    };

    const handleForm = (e) => {
        const { name, value } = e.target;

        if (name === "precio" && value === "0") {
            return;
        }

        if (name === "importe_unidad_usd") {
            if (formProducto.cotizacion) {
                setFormProducto({
                    ...formProducto,
                    [name]: value,
                    importe_unidad_ars: value * formProducto.cotizacion,
                });
            } else {
                setFormProducto({ ...formProducto, [name]: value });
            }
        } else if (name === "cotizacion") {
            if (formProducto.importe_unidad_usd) {
                setFormProducto({
                    ...formProducto,
                    [name]: value,
                    importe_unidad_ars: value * formProducto.importe_unidad_usd,
                });
            } else {
                setFormProducto({ ...formProducto, [name]: value });
            }
        } else {
            setFormProducto({ ...formProducto, [name]: value });
        }
    };

    const handleCarga = async () => {
        if (!formProducto.id_producto || !formProducto.cantidad || !formProducto.precio) {
            Swal.fire({
                title: "Complete todos los datos para agregar el producto a la lista",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                iconColor: "#D64747",
                icon: "warning",
            });

            return;
        }

        setProductos([...productos, formProducto]);
        setProductosCompraNombres([...productosCompraNombres, formProducto.id]);
        setCloseModal(false);
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-[380px] font-NS sm:w-[450px]">
            <div className="w-full flex justify-between">
                <Titulo text="AGREGAR PRODUCTO A LA VENTA" />
            </div>

            <div className="w-full space-y-3">
                <div className="flex flex-col w-full">
                    <label className="labelInput">Nombre</label>
                    <div className="flex w-full">
                        <SearchableSelect
                            options={productosExistentes}
                            placeholder="Buscar producto"
                            onSelect={selectProducto}
                        />

                        <button onClick={() => setShowModal(true)} className="boton_verde sm:mt-0">
                            NUEVO
                        </button>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <label className="labelInput">Cantidad</label>
                    <input
                        type="number"
                        placeholder="0"
                        onChange={handleForm}
                        name="cantidad"
                        value={formProducto.cantidad || ""}
                        className="input"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label className="labelInput">Precio por unidad </label>
                    <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
                        <p className="text-xl text-white-bg3">$</p>
                        <input
                            type="number"
                            placeholder="0"
                            onChange={handleForm}
                            name="precio"
                            value={formProducto.precio || ""}
                            className="input"
                        />
                    </div>
                </div>
            </div>

            {/* botones */}
            <div className="w-full flex justify-end space-x-3 pt-2">
                <button onClick={() => setCloseModal(false)} className="boton_rojo">
                    CANCELAR
                </button>
                <button onClick={handleCarga} className="boton_verde">
                    AGREGAR
                </button>
            </div>

            {/* modal agregar insumo */}
            {showAgregarInsumo && (
                <Modal>
                    <AgregarInsumoAProducto
                        setCloseModal={setShowAgregarInsumo}
                        insumos={insumosUtilizados}
                        setInsumos={setInsumosUtilizados}
                    />
                </Modal>
            )}

            {showModal && sector && (
                <Modal setCloseModal={setShowModal}>
                    <NuevoProducto setCloseModal={setShowModal} sectorID={sector.id} getProductos={fetchProductos} />
                </Modal>
            )}
        </div>
    );
};

export default AgregarProductoALaVenta;
