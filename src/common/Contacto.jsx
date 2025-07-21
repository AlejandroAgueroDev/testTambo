import Titulo from "../common/Titulo";
import DatosSoporte from "../common/DatosSoporte.json";
import { IoLogoWhatsapp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

const Contacto = ({ onClose }) => {
  const {
    email,
    phoneJoaquin,
    phoneGonzalo,
    phoneAlejandro,
    whatsappMessageJoaquin,
    whatsappMessageGonzalo,
    whatsappMessageAlejandro,
  } = DatosSoporte.supportContacts;
  return (
    <div className="flex flex-col space-y-4 items-start w-[300px]">
      <Titulo text="CONTACTANOS" />
      <div className="text-xl flex flex-col mx-auto space-y-3">
        {/* <div className="flex items-center space-x-3">
          <label className="text-xl font-semibold text-white-bg3">
            Contactar por:
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() =>
                window.open(
                  `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
                  "_blank"
                )
              }
              className="flex items-center space-x-2 bg-green-400 text-white px-4 py-2 hover:bg-green-300 transition-colors"
            >
              <MdEmail className="text-2xl " />
              <span>Email</span>
            </button>
          </div>
        </div> */}
        {/*//? JOAQUIN */}
        <div className="flex items-center space-x-3">
          <label className="text-xl font-semibold text-white-bg3">
            Contactar a Joaquin:
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${phoneJoaquin}?text=${encodeURIComponent(
                    whatsappMessageJoaquin
                  )}`,
                  "_blank"
                )
              }
              className="flex items-center space-x-2 bg-green-400 text-white px-4 py-2 hover:bg-green-300 transition-colors"
            >
              <IoLogoWhatsapp className="text-2xl text-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
        {/*//? GONZALO */}
        <div className="flex items-center space-x-3">
          <label className="text-xl font-semibold text-white-bg3">
            Contactar a Gonzalo:
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${phoneGonzalo}?text=${encodeURIComponent(
                    whatsappMessageGonzalo
                  )}`,
                  "_blank"
                )
              }
              className="flex items-center space-x-2 bg-green-400 text-white px-4 py-2 hover:bg-green-300 transition-colors"
            >
              <IoLogoWhatsapp className="text-2xl text-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
        {/*//? ALEJANDRO */}
        <div className="flex items-center space-x-3">
          <label className="text-xl font-semibold text-white-bg3">
            Contactar a Alejandro:
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${phoneAlejandro}?text=${encodeURIComponent(
                    whatsappMessageAlejandro
                  )}`,
                  "_blank"
                )
              }
              className="flex items-center space-x-2 bg-green-400 text-white px-4 py-2 hover:bg-green-300 transition-colors"
            >
              <IoLogoWhatsapp className="text-2xl text-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button onClick={() => onClose(false)} className="boton_rojo">
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
export default Contacto;
