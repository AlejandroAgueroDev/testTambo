import { useEffect, useRef } from "react";
import Titulo from "../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import { BiLoaderAlt } from "react-icons/bi";

const EditarAnimal = ({ setCloseModal, data }) => {
  const [loader, setLoader] = useState(false);

  //? DESPAZAMIENTO CON LA FLECHA
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);

  const handleKeyDown = (e, nextRef, prevRef) => {
    if (e.key === "ArrowDown" && nextRef) {
      e.preventDefault();
      nextRef.current.focus();
    } else if (e.key === "ArrowUp" && prevRef) {
      e.preventDefault();
      prevRef.current.focus();
    }
  };
  const [formEdit, setFormEdit] = useState(data);

  useEffect(() => {
    const fechaArray = data.fecha_ingreso.split("/");
    const fechaFormat = `${fechaArray[2]}-${fechaArray[1]}-${fechaArray[0]}`;
    setFormEdit({ ...data, fecha_ingreso: fechaFormat });
  }, []);

  const handleChange = (e) => {
    const p = e.target.name;
    const v = e.target.value;

    if (p == "caravana") {
      setFormEdit({ ...formEdit, [p]: v.toUpperCase() });
    } else {
      setFormEdit({ ...formEdit, [p]: v });
    }
  };

  const handleformEdit = () => {
    if (!formEdit.caravana || !formEdit.tipo || !formEdit.fecha_ingreso) {
      return Swal.fire({
        title: "Completa los campos necesarios para cargar el animal",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setLoader(true);
    //! LOGICA DE ENVIO
    axios
      .put(url + "tambo/ganado", formEdit)
      .then(({ data }) => {
        setLoader(false);
        Swal.fire({
          title: "¡Datos del animal actualizados correctamente!",
          icon: "success",
          iconColor: "#86C394",
          confirmButtonColor: "#86C394",
        }).then(() => window.location.reload());
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        Swal.fire({
          title: "Ocurrio un error inesperado, intente nuevamente",
          text:
            error.message === "Network Error"
              ? "Contacte con el servicio técnico"
              : error.response.data.message,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          icon: "error",
        });
      });
  };

  //? ENVIAR CON ENTER
  const handleKeyDownEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita el comportamiento predeterminado
      handleformEdit();
    }
  };

  return (
    <div>
      <div className="w-full flex justify-between">
        <Titulo text={`EDITAR ANIMAL | ${data.caravana}`} />
      </div>
      <div
        className="flex flex-col space-y-2 items-start scrollbar overflow-auto w-[350px] sm:w-[500px] sm:overflow-visible"
        onKeyDown={handleKeyDownEnter}
      >
        <div className="containerInput">
          <label className="labelInput">Caravana</label>
          <input
            ref={input1Ref}
            onKeyDown={(e) => handleKeyDown(e, input2Ref, null)}
            placeholder="A123"
            onChange={handleChange}
            type="text"
            value={formEdit.caravana}
            name="caravana"
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Tipo</label>
          <select
            value={formEdit.tipo}
            name="tipo"
            onChange={handleChange}
            className="input"
          >
            <option selected disabled>
              TERNERA / VAQUILLONA / VACA
            </option>
            <option>TERNERA</option>
            <option>VAQUILLONA</option>
            <option>VACA</option>
          </select>
        </div>

        <div className="containerInput">
          <label className="labelInput">Fecha ingreso</label>
          <input
            ref={input3Ref}
            onKeyDown={(e) => handleKeyDown(e, input4Ref, input2Ref)}
            onChange={handleChange}
            type="date"
            name="fecha_ingreso"
            value={formEdit.fecha_ingreso}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Estado</label>
          <select
            value={formEdit.estado}
            name="estado"
            onChange={handleChange}
            className="input"
          >
            <option>ORDEÑE</option>
            <option>RECRIA</option>
            <option>SECA</option>
            <option>ENGORDE</option>
            <option>ENFERMA</option>
            <option>DESCARTADA</option>
            <option>POST-PARTO</option>
            <option>LACTANCIA</option>
            <option>EN CUARENTENA</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button className="boton_rojo" onClick={() => setCloseModal(false)}>
            CANCELAR
          </button>
          <button
            ref={input4Ref}
            onKeyDown={(e) => handleKeyDown(e, null, input3Ref)}
            onClick={handleformEdit}
            className="boton_verde"
          >
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "EDITAR"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarAnimal;
