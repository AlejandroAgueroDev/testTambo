import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NuevoComprador from "./NuevoComprador";
import Modal from "../../../../common/Modal";
import { BiLoaderAlt } from "react-icons/bi";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { url } from "../../../../common/URL_SERVER";

const CargarVenta = () => {
  const [compradores, setCompradores] = useState([]);
  const [nuevoComprador, setNuevoComprador] = useState(false);
  const [compradorCreado, setCompradorCreado] = useState(false);
  const [loader, setLoader] = useState(false);
  const [listrosEnTanque, setLitrosEnTanque] = useState(0);
  const [idSector, setIdeSector] = useState("");
  const [formVenta, setFormVenta] = useState({
    fecha: "",
    hora_retiro: "",
    hora_carga: "",
    fecha_carga: "",
    id_cliente: 0,
    liquidado: false,
    cantidad: 0,
    encargado_retiro: "",
    id_empleado: "",
    estado: "ACTIVO",
    aclaracion: "",
    id_liquidacion: null,
    actaBase64: "",
  });

  const handleSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setFormVenta({ ...formVenta, actaBase64: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    axios(url + "tambo/produccionleche/equipofrio")
      .then((data) => {
        data.data.map((d) => {
          if (d.nombre === "Tambo") {
            setLitrosEnTanque(d.litros);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //! CONTROLADORES PARA FORMULARIO
  const handleForm = (e) => {
    const { name, value } = e.target;

    if (name === "patente_camion") {
      return setFormVenta({ ...formVenta, [name]: value.toUpperCase() });
    }

    setFormVenta({ ...formVenta, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let id_sector;
        // Primera solicitud: obtener sectores
        const { data } = await axios(url + "sector");

        // if (sector === "tambo") {
        const sectorEncontrado = data.find((d) => d.nombre === "Tambos");
        if (sectorEncontrado) {
          id_sector = sectorEncontrado.id; // Aquí debería ser el ID, no el nombre
          setIdeSector(sectorEncontrado.id);
        }
        // }

        if (!id_sector) {
          console.error("No se encontró el id del sector");
          return;
        }

        // if (compradorCreado) {
        const res = await axios(url + `cliente/${id_sector}`);
        res.data && setCompradores(res.data);

        // setCompradorCreado(false);
        // }
      } catch (error) {
        console.error("Error en la carga de datos:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   axios(url + "cliente").then(({ data }) => {
  //     setCompradores(data);
  //   });

  //   setFormVenta({
  //     ...formVenta,
  //     id_empleado: localStorage.getItem("user_id"),
  //   });
  // }, []);

  //! CONTROLAR DE ENVIO DE FOTMULARIO
  const handleSubmit = (e) => {
    e.preventDefault();

    if (Number(formVenta.cantidad) > Number(listrosEnTanque)) {
      return Swal.fire({
        title: "No hay suficientes litros en el tanque",
        text: `Estás intentando cargar ${formVenta.cantidad} litros, pero solo hay ${listrosEnTanque} disponibles.`,
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
      });
    }

    if (
      formVenta.cantidad <= 0 ||
      !formVenta.hora_retiro ||
      !formVenta.id_cliente ||
      !formVenta.encargado_retiro ||
      !formVenta.fecha
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para cargar el retiro",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    const id_usuario = localStorage.getItem("user_id");

    const formSub = {
      ...formVenta,
      hora_carga: obtenerFechaActual("hora"),
      id_empleado: id_usuario,
    };
    setLoader(true);
    axios
      .post(url + "tambo/retiroleche", formSub)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "Retiro cargado con éxito",
          confirmButtonText: "Aceptar",
          icon: "success",
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
              : error,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          icon: "error",
        });
      });
  };

  //! LIMPIAR FORM
  const handleCancel = () => {
    setFormVenta({
      fecha: "",
      hora_retiro: "",
      hora_carga: "",
      id_cliente: 0,
      liquidado: false,
      cantidad: 0,
      encargado_retiro: "",
      usuario_carga: "",
      estado: "ACTIVO",
      aclaracion: "",
      id_liquidacion: null,
    });
  };

  useEffect(() => {
    if (formVenta.id_cliente === "new") {
      setNuevoComprador(true);
    }
  }, [formVenta.id_cliente]);

  //? DESPAZAMIENTO CON LA FLECHA
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);

  const handleKeyDown = (e, nextRef, prevRef) => {
    if (e.key === "ArrowDown" && nextRef) {
      e.preventDefault();
      nextRef.current.focus();
    } else if (e.key === "ArrowUp" && prevRef) {
      e.preventDefault();
      prevRef.current.focus();
    }
  };

  return (
    <div className="w-full md:w-[49%] flex flex-col items-center scrollbar overflow-auto space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
      <div className="flex w-full">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          CARGAR RETIRO
        </h2>
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-between">
        <div className="flex flex-col w-full sm:w-[48%]">
          <label className="text-xl font-semibold text-white-bg3">
            Fecha <strong className="text-red-400">*</strong>
          </label>
          <input
            ref={input1Ref}
            onKeyDown={(e) => handleKeyDown(e, input2Ref, null)}
            onChange={handleForm}
            placeholder="1000 lts"
            type="date"
            value={formVenta.fecha}
            name="fecha"
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-full"
          />
        </div>

        <div className="flex flex-col  w-full sm:w-[48%]">
          <label className="text-xl font-semibold text-white-bg3">
            Comprador <strong className="text-red-400">*</strong>
          </label>
          <select
            onChange={handleForm}
            name="id_cliente"
            value={formVenta.id_cliente}
            className="bg-white-bg2 text-black-comun py-2.5 px-5 text-xl"
          >
            <option disabled value={0}>
              Seleccionar comprador
            </option>
            {compradores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre_empresa}
              </option>
            ))}
            <option
              value="new"
              className="boton_rojo font-semibold text-xl cursor-pointer uppercase"
            >
              Cargar nuevo
            </option>
          </select>
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex flex-col w-[48%]">
          <label className="text-xl font-semibold text-white-bg3">
            Hora de retiro <strong className="text-red-400">*</strong>
          </label>
          <input
            ref={input2Ref}
            onKeyDown={(e) => handleKeyDown(e, input3Ref, input1Ref)}
            onChange={handleForm}
            placeholder="00:00 hs"
            type="time"
            value={formVenta.hora_retiro}
            name="hora_retiro"
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label className="text-xl font-semibold text-white-bg3">
            Hora de carga
          </label>
          <p className="bg-white-bg2 text-black-comun py-2 px-5 text-xl">
            {obtenerFechaActual("hora")}
          </p>
        </div>
      </div>

      {/* <div className="w-full flex flex-col sm:flex-row justify-between"> */}
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-[48%]">
          <label className="text-xl font-semibold text-white-bg3">
            Litros <strong className="text-red-400">*</strong>
          </label>
          <input
            ref={input3Ref}
            onKeyDown={(e) => handleKeyDown(e, input4Ref, input2Ref)}
            onChange={handleForm}
            placeholder="1000 lts"
            type="number"
            value={formVenta.cantidad || ""}
            name="cantidad"
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label className="text-xl font-semibold text-white-bg3">
            Litros en el tanque
          </label>
          <p
            className={`bg-white-bg2 ${
              listrosEnTanque === 0
                ? "text-button-red"
                : formVenta.cantidad > listrosEnTanque
                ? "text-button-red"
                : "text-black-comun"
            } py-2 px-5 text-xl`}
          >
            {listrosEnTanque} Lts.
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Nombre del encargado del retiro{" "}
          <strong className="text-red-400">*</strong>
        </label>
        <input
          ref={input4Ref}
          onKeyDown={(e) => handleKeyDown(e, input5Ref, input3Ref)}
          onChange={handleForm}
          type="text"
          value={formVenta.encargado_retiro}
          name="encargado_retiro"
          className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
        />
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Subir Comprobante
        </label>
        <input
          onChange={handleSelectFile}
          type="file"
          className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
        />
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Aclaraciones
        </label>
        <textarea
          ref={input5Ref}
          onKeyDown={(e) => handleKeyDown(e, null, input4Ref)}
          onChange={handleForm}
          placeholder="Aclaraciones sobre esta producción"
          type="file"
          value={formVenta.aclaracion}
          name="aclaracion"
          className="bg-white-bg2 text-black-comun py-2 px-5 text-xl max-h-20 min-h-20"
        />
      </div>

      <p className="text-white-bg3 w-full">
        - Los campos marcados con <strong className="text-red-400">*</strong>{" "}
        son oblicatorios.
      </p>

      <div className="space-x-2 flex justify-end w-full">
        <button onClick={handleCancel} className="boton_rojo">
          CANCELAR
        </button>
        <button onClick={handleSubmit} className="boton_verde">
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "CARGAR"
          )}
        </button>
      </div>

      {nuevoComprador ? (
        <Modal>
          <NuevoComprador
            setCloseModal={setNuevoComprador}
            setCompradorCreado={setCompradorCreado}
            idSector={idSector}
            setCompradores={setCompradores}
            setForm={setFormVenta}
            form={formVenta}
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default CargarVenta;
