import { useNavigate } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";

const NavBar = ({ section }) => {
  const [showMenu, setShowMenu] = useState(false);
  const nav = useNavigate();

  const sector = window.localStorage.getItem("sectorUser");

  const sections =
    sector === "administracion"
      ? [
          "HOME",
          "CAJA",
          "BANCO",
          "SEGUROS",
          "EMPLEADOS",
          "FABRICA",
          "GANADO",
          "TAMBO",
          "RECRIA",
          "AGRICULTURA",
          "CASA",
        ]
      : sector === "tambo"
      ? ["HOME", "GANADO", "TAMBO", "RECRIA"]
      : sector === "recria"
      ? ["HOME", "GANADO", "TAMBO", "RECRIA"]
      : sector === "fabrica"
      ? ["HOME", "FABRICA"]
      : ["HOME", "AGRICULTURA"];

  return (
    <div className="font-NS relative">
      <div
        className={`flex items-start space-x-5 absolute duration-150 top-0 z-50 h-screen md:bg-black-comun ${
          showMenu
            ? "left-0 pr-5 bg-black-comun bg-opacity-90 md:md:bg-black-comun"
            : "-left-[153px] md:-left-[150px]"
        }`}
      >
        <div>
          <ul className="space-y-2 pt-5 xl:hidden">
            {sections.map((sm) => (
              <li
                onClick={() => nav(`/${sm === "HOME" ? "" : sm.toLowerCase()}`)}
                key={sm}
                className={`${
                  section === sm
                    ? "bg-button-green_2"
                    : "bg-white-bg2 hover:bg-button-green_hover hover:translate-x-4 cursor-pointer duration-150"
                }  px-3 py-3 flex justify-center sombra`}
              >
                {sm}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="flex xl:hidden p-2.5 md:p-2 justify-center bg-white-bg3 hover:bg-button-green_hover cursor-pointer duration-150 mt-3 sm:mt-2 md:mt-5"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? (
            <IoCloseSharp className="text-2xl" />
          ) : (
            <IoMenuSharp className="text-2xl" />
          )}
        </div>
      </div>

      {/* xl */}
      <ul className="space-y-2 pt-5 hidden xl:block">
        {sections.map((sm) => (
          <li
            onClick={() => nav(`/${sm === "HOME" ? "" : sm.toLowerCase()}`)}
            key={sm}
            className={`${
              section === sm
                ? "bg-button-green_2"
                : "bg-white-bg2 hover:bg-button-green_hover hover:translate-x-4 cursor-pointer duration-150"
            }  px-3 py-3 flex justify-center sombra`}
          >
            {sm}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavBar;
