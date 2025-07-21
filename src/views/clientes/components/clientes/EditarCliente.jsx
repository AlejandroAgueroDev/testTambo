import { BiLoaderAlt } from "react-icons/bi";
import Modal from "../../../../common/Modal";
import Titulo from "../../../../common/Titulo";

const EditarCliente = ({ tempCliente, setShowModal, handleInputChange, handleSave, loader, isTamboCliente=false}) => {
    return (
        <Modal setShowModal={setShowModal}>
            <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0 mb-3">
                <Titulo text="EDITAR CLIENTE" />
            </div>

            <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4 text-xl">
                    <label className="text-xl font-semibold text-white-bg3">Nombre / Empresa</label>
                    <input
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Nombre / Empresa"
                        name="nombre_empresa"
                        value={tempCliente.nombre_empresa}
                        className="bg-white-bg2 text-black py-2 px-5 grow"
                    />
                </div>

                <div className="flex items-center space-x-4 text-xl">
                    <label className="text-xl font-semibold text-white-bg3">Contacto</label>
                    <input
                        onChange={handleInputChange}
                        type="text"
                        placeholder="+55 9 45000000"
                        name="contacto_1"
                        value={tempCliente.contacto_1}
                        className="bg-white-bg2 text-black py-2 px-5 grow"
                    />
                </div>

                <div className="flex items-center space-x-4 text-xl">
                    <label className="text-xl font-semibold text-white-bg3">Localidad</label>
                    <input
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Calchín, Córdoba"
                        name="localidad"
                        value={tempCliente.localidad}
                        className="bg-white-bg2 text-black py-2 px-5 grow"
                    />
                </div>

                <div className="flex items-center space-x-4 text-xl">
                    <label className="text-xl font-semibold text-white-bg3">CUIT/CUIL</label>
                    <input
                        onChange={handleInputChange}
                        type="text"
                        placeholder="20-12345678-9"
                        name="cuit_cuil"
                        value={tempCliente.cuit_cuil}
                        className="bg-white-bg2 text-black py-2 px-5 grow"
                    />
                </div>

                <div className={isTamboCliente ? "hidden" : "flex items-center space-x-4 text-xl"}>
                    <label className="text-xl font-semibold text-white-bg3">Saldo</label>

                    <div className="bg-white-bg2 text-black-comun text-xl pl-3 flex items-center space-x-2 w-full">
                        <p className="font-bold text-white-bg3">$</p>
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="saldo"
                            value={tempCliente.saldo}
                            className="bg-white-bg2 text-black-comun py-2 pl-3 text-xl grow"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                    <button onClick={() => setShowModal(false)} className="boton_rojo">
                        CANCELAR
                    </button>
                    <button onClick={handleSave} className="boton_verde">
                        {loader ? (
                            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
                        ) : (
                            "MODIFICAR"
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditarCliente;
