import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import Modal from "./Modal";
import Titulo from "./Titulo";
import BarraSeparadora from "./BarraSeparadora";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { url } from "./URL_SERVER";
import LoaderDatos from "./LoaderDatos";
import Swal from "sweetalert2";

const ContadorTanque = ({ sector }) => {
  const [editar, setEditar] = useState(false);
  const [pasarAFabrica, setPasarAFabria] = useState(false);
  const [loaderDatos, setLoaderDatos] = useState(true);

  const hendleEdit = () => {
    setDatosTanqueEdit(datosTanque);
    setEditar(true);
  };

  const [datosTanque, setDatosTanque] = useState({
    capacidad: 0,
    litros: 0,
  });

  const [datosTanqueEdit, setDatosTanqueEdit] = useState({
    capacidad: 0,
    litros: 0,
  });

  const [litrosAPasar, setLitrosAPasar] = useState(0);

  const handlePasarFabrica = () => {
    if (litrosAPasar === 0) {
      return setPasarAFabria(false);
    }

    if (litrosAPasar < 0) {
      return Swal.fire({
        title: "No puedes pasar a fabrica un numero negativo de litros",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
        iconColor: "#D64747",
      });
    }

    // const litros = litrosAPasar;
    axios
      .post(url + "tambo/produccionleche/equipofrio/paso-fabrica", {
        litros: Number(litrosAPasar),
      })
      .then((data) => {
        Swal.fire({
          title: "Litros pasados a fabrica con éxito",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => {
          setLoaderDatos(true);
          setPasarAFabria(false);
          axios(url + "tambo/produccionleche/equipofrio")
            .then((data) => {
              data.data.map((d) => {
                if (d.nombre === sector) {
                  setDatosTanque({
                    capacidad: d.capacidad,
                    litros: d.litros,
                    id: d.id,
                  });
                  setDatosTanqueEdit({
                    capacidad: d.capacidad,
                    litros: d.litros,
                    id: d.id,
                  });
                  setLoaderDatos(false);
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditar = () => {
    if (
      datosTanque.litros === datosTanqueEdit.litros &&
      datosTanque.capacidad === datosTanqueEdit.capacidad
    ) {
      return setEditar(false);
    }

    if (datosTanqueEdit.litros < 0 || datosTanqueEdit.capacidad < 0) {
      return Swal.fire({
        title: "Los valores deben ser numeros positivos",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
        iconColor: "#D64747",
      });
    }

    axios
      .put(url + "tambo/produccionleche/equipofrio", datosTanqueEdit)
      .then((data) => {
        Swal.fire({
          title: "Datos del tanque editados con éxito",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => {
          setLoaderDatos(true);
          setEditar(false);
          axios(url + "tambo/produccionleche/equipofrio")
            .then((data) => {
              data.data.map((d) => {
                if (d.nombre === sector) {
                  setDatosTanque({
                    capacidad: d.capacidad,
                    litros: d.litros,
                    id: d.id,
                  });
                  setDatosTanqueEdit({
                    capacidad: d.capacidad,
                    litros: d.litros,
                    id: d.id,
                  });
                  setLoaderDatos(false);
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios(url + "tambo/produccionleche/equipofrio")
      .then((data) => {
        data.data.map((d) => {
          if (d.nombre === sector) {
            setDatosTanque({
              capacidad: d.capacidad,
              litros: d.litros,
              id: d.id,
            });
            setDatosTanqueEdit({
              capacidad: d.capacidad,
              litros: d.litros,
              id: d.id,
            });
            setLoaderDatos(false);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="bg-black-comun p-2 flex flex-col space-y-2 items-end sombra">
      {loaderDatos ? (
        <LoaderDatos textLoader="" />
      ) : (
        <p className="text-white-bg2">
          Capacidad de tanque:{" "}
          <strong className=" py-1 px-2 bg-white-bg2 text-black-comun">
            {datosTanque.capacidad} lts
          </strong>
        </p>
      )}
      {loaderDatos ? (
        <LoaderDatos textLoader="" />
      ) : (
        <p className="text-white-bg2">
          Litros en tanque{" "}
          <strong className=" py-1 px-2 bg-white-bg2 text-black-comun">
            {datosTanque.litros} lts
          </strong>
        </p>
      )}

      <div
        className={`flex space-x-2 w-full ${
          sector === "Fabrica" ? "justify-end" : "justify-between"
        }`}
      >
        <button
          onClick={() => setPasarAFabria(true)}
          className={
            sector === "Fabrica"
              ? "hidden"
              : "bg-button-red hover:bg-button-red_hover text-white-bg2 py-2 px-5 text-md"
          }
        >
          PASAR A FABRICA
        </button>
        <button
          onClick={hendleEdit}
          className="bg-button-green hover:bg-button-green_hover px-3 py-3 text-xl text-white-bg2"
        >
          <MdEdit className="mx-auto" />
        </button>
      </div>

      {pasarAFabrica && (
        <Modal>
          <div className="flex flex-col items-start space-y-2 w-72">
            <div className="w-full flex justify-between">
              <Titulo text="PASAR A FABRICA" />
              <button
                onClick={() => setPasarAFabria(false)}
                className="bg-button-red hover:bg-button-red_hover px-3 py-3 text-xl text-white-bg2"
              >
                <IoMdClose className="mx-auto" />
              </button>
            </div>
            <div className="flex space-x-3 items-end">
              <div className="flex flex-col grow">
                <label className="text-xl font-semibold text-white-bg3">
                  Cantidad de litros
                </label>
                <div className="bg-white-bg2 text-black-comun text-xl pr-3 flex items-center space-x-2 w-full">
                  <input
                    type="number"
                    onChange={(e) => setLitrosAPasar(Number(e.target.value))}
                    placeholder={`max ${datosTanque.litros}`}
                    className="bg-white-bg2 text-black-comun py-2 pl-2 text-xl w-full"
                  />
                  <p className="font-bold text-white-bg3">Lts.</p>
                </div>
              </div>
              <button onClick={handlePasarFabrica} className="boton_verde">
                PASAR
              </button>
            </div>
            <BarraSeparadora orientacion="horizontal" />
            <p className="text-wrap w-full text-white-bg3">
              Los litros pasados se veran reflejados en la sección de{" "}
              <strong className="text-button-red font-medium">fabrica</strong>
            </p>
          </div>
        </Modal>
      )}

      {editar && (
        <Modal>
          <div className="flex flex-col items-start space-y-2 w-96">
            <div className="w-full flex justify-between">
              <Titulo text="EDITAR DATOS DE TANQUE" />
              <button
                onClick={() => setEditar(false)}
                className="bg-button-red hover:bg-button-red_hover px-3 py-3 text-xl text-white-bg2"
              >
                <IoMdClose className="mx-auto" />
              </button>
            </div>
            <div className="flex flex-col w-full space-y-3">
              <div className="flex flex-col w-full">
                <label className="text-xl font-semibold text-white-bg3">
                  Capacidad
                </label>
                <div className="bg-white-bg2 text-black-comun text-xl pr-3 flex items-center space-x-2 w-full">
                  <input
                    type="number"
                    value={datosTanqueEdit.capacidad}
                    onChange={(e) =>
                      setDatosTanqueEdit({
                        ...datosTanqueEdit,
                        capacidad: Number(e.target.value),
                      })
                    }
                    className="bg-white-bg2 text-black-comun py-2 pl-2 text-xl w-full"
                  />
                  <p className="font-bold text-white-bg3">Lts.</p>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <label className="text-xl font-semibold text-white-bg3">
                  Litros actuales
                </label>
                <div className="bg-white-bg2 text-black-comun text-xl pr-3 flex items-center space-x-2 w-full">
                  <input
                    type="number"
                    value={datosTanqueEdit.litros}
                    onChange={(e) =>
                      setDatosTanqueEdit({
                        ...datosTanqueEdit,
                        litros: Number(e.target.value),
                      })
                    }
                    className="bg-white-bg2 text-black-comun py-2 pl-2 text-xl w-full"
                  />
                  <p className="font-bold text-white-bg3">Lts.</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleEditar} className="boton_verde">
                  EDITAR
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContadorTanque;
