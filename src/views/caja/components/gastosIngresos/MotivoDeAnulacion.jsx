import Titulo from "../../../../common/Titulo";

const MotivoDeAnulacion = ({ motivo, setMotivo, onAceptar, onCancelar }) => {
  return (
    <div className="flex flex-col space-y-2 items-start w-full">
      <div className="w-full flex justify-between">
        <Titulo text="INGRESAR MOTIVO DE ANULACION" />
      </div>
      <div className="w-full space-y-3">
        <textarea
          className="w-full rounded p-2 h-28 text-lg bg-white-bg2"
          placeholder="Escribí el motivo aquí..."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
        <div className="flex justify-end gap-4 mt-4">
          <button className="boton_rojo" onClick={onCancelar}>
            CANCELAR
          </button>
          <button className="boton_verde" onClick={onAceptar}>
            ACEPTAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotivoDeAnulacion;
