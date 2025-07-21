import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import * as yup from "yup";
import { url } from "../../common/URL_SERVER";
//?COMPONENTES
import BarraSeparadora from "../../common/BarraSeparadora";
import Titulo from "../../common/Titulo";
import InputForm from "../../common/InputForm";

// Definir el esquema de validación
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Correo electrónico no válido")
    .required("El correo electrónico es obligatorio"),
  password: yup
    .string()
    .required("La contraseña es obligatoria"),
});

const Login = () => {
  const [loader, setLoader] = useState(false);
  const nav = useNavigate();
  const [formLogin, setFormLogin] = useState({ email: "", password: "" });
  const handleFormLogin = (e) => {
    const { name, value } = e.target;

    setFormLogin({ ...formLogin, [name]: value });
  };

  const sendLogin = () => {
    // Validar los datos antes de enviarlos
    loginSchema
      .validate(formLogin)
      .then(() => {
        setLoader(true);
        axios
          .post(url + "user/login", formLogin)
          .then(({ data }) => {

            if (data.token) {
              const sector = data.email.split("@")[1].split(".")[0];

              localStorage.setItem("sectorUser", sector);

              localStorage.setItem("token", JSON.stringify(data.token));

              localStorage.setItem("user_id", JSON.stringify(data.userId));
              
              localStorage.setItem(
                "isAdmin",
                JSON.stringify(data.isAdmin || false)
              );
              localStorage.setItem("sector", JSON.stringify(data.sector || ""));
              setLoader(false);
              Swal.fire({
                timer: 2500,
                title: "Inicio de sesión exitoso",
                icon: "success",
                showConfirmButton: false,
                iconColor: "#86C394",
              });

              setTimeout(() => {
                nav("/home");
              }, 2500);
            }
          })
          .catch(() => {
            setLoader(false);
            Swal.fire({
              title: "Datos incorrectos",
              text: "Verifique los datos y pruebe nuevamente.",
              icon: "error",
              confirmButtonColor: "#D64747",
              iconColor: "#D64747",
            });
          });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error de validación",
          text: err.errors.join(", "),
          icon: "error",
          confirmButtonColor: "#D64747",
          iconColor: "#D64747",
        });
      });
  };

  const handleServicio = () => {
    Swal.fire({
      title: "Contacto de servicio técnico.",
      text: "Joaquin: 3533498996, Gonzalo: 1161159151, Alejandro: 3865386688",
      icon: "none",
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#D64747",
    });
  };

  //? ENVIAR CON ENTER
  const handleKeyDownEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita el comportamiento predeterminado
      sendLogin();
    }
  };

  return (
    <div className="">
      <div className="w-[400px] mt-32 mx-auto bg-white-bg2 p-4">
        <div className="flex">
          <Titulo text="INICIAR SESION" />
        </div>

        <div className="space-y-3 w-full" onKeyDown={handleKeyDownEnter}>
          <InputForm
            label="Usuario"
            placeHolder="Nombre de usuario"
            hanlder={handleFormLogin}
            nameInput="email"
            type="text"
          />

          <InputForm
            label="Contraseña"
            placeHolder="••••••••"
            hanlder={handleFormLogin}
            nameInput="password"
            type="password"
          />

          <div className="flex justify-end">
            <button onClick={sendLogin} className="boton_verde">
              {loader ? (
                <BiLoaderAlt className="animate-spin text-black-comun text-center h-7 w-[67px]" />
              ) : (
                "ENTRAR"
              )}
            </button>
          </div>

          <BarraSeparadora orientacion="horizontal" />

          <p className="w-80 text-black-hover">
            ¿Problemas para iniciar sesión?{" "}
            <button
              onClick={handleServicio}
              className="text-button-red_hover cursor-pointer hover:underline"
            >
              contactar a servicio técnico
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
