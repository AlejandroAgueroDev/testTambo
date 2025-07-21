import { useState } from "react";
import Modal from "../../../../common/Modal";
import Historial from "../../../../common/Historial";

const UltimosRetiros = () => {
    const [showHistorial, setShowHistorial] = useState(false);

    const arrayHeader = ["Fecha de retiro", "Tambo", "Litros", "Aclaraciones"];

    const arrayContent = [
        ["12/12/2012", "Tambo 2", "1000", "aclaraciones del retiro"],
        ["12/12/2012", "Tambo 2", "1000", "aclaraciones del retiro"],
        ["12/12/2012", "Tambo 2", "1000", "aclaraciones del retiro"],
        ["12/12/2012", "Tambo 2", "1000", "aclaraciones del retiro"],
        ["12/12/2012", "Tambo 2", "1000", "aclaraciones del retiro"],
        ["12/12/2012", "Tambo 2", "1000", "aclaraciones del retiro"],
    ];

    return (
        <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 p-2 xl:p-5 bg-white-bg h-full">
            <div className="flex w-full">
                <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">ULTIMOS RETIROS</h2>
            </div>
            <div className="h-[83%] w-full scrollbar overflow-auto">
                <table className="border-separate text-lg w-full text-black-comun">
                    <thead className="sticky top-0 bg-white-bg3 z-10">
                        <tr className="bg-white-bg3 text-center">
                            <td>Fecha</td>
                            <td>Tambo</td>
                            <td>Litros</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white-bg2 text-center">
                            <td>12/12/2012</td>
                            <td>Tambo 2</td>
                            <td>1000</td>
                        </tr>
                        <tr className="bg-white-bg2 text-center">
                            <td>12/12/2012</td>
                            <td>Tambo 2</td>
                            <td>1000</td>
                        </tr>
                        <tr className="bg-white-bg2 text-center">
                            <td>12/12/2012</td>
                            <td>Tambo 2</td>
                            <td>1000</td>
                        </tr>
                        <tr className="bg-white-bg2 text-center">
                            <td>12/12/2012</td>
                            <td>Tambo 2</td>
                            <td>1000</td>
                        </tr>
                        <tr className="bg-white-bg2 text-center">
                            <td>12/12/2012</td>
                            <td>Tambo 2</td>
                            <td>1000</td>
                        </tr>
                        <tr className="bg-white-bg2 text-center">
                            <td>12/12/2012</td>
                            <td>Tambo 2</td>
                            <td>1000</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="space-x-2 flex justify-end w-full">
                <button onClick={() => setShowHistorial(true)} className="boton_verde">
                    VER HISTORIAL DE RETIROS
                </button>
            </div>

            {showHistorial ? (
                <Modal>
                    <Historial
                        setCloseModal={setShowHistorial}
                        title="HISTORIAL DE RETIROS"
                        arrayHeader={arrayHeader}
                        arrayContent={arrayContent}
                        placeHolder="Aun no se cargaron retiros."
                    />
                </Modal>
            ) : null}
        </div>
    );
};

export default UltimosRetiros;
