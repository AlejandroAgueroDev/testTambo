export const Validation2 = (name, value) => {
  const letraRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactoRegex = /^[0-9]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
  const dniRegex = /^\d{8,9}$/;
  const cuitCuilRegex = /^\d{11}$/;
  const genericoRegex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/;
  const numberRegex = /^[0-9]+$/;
  const valueString = String(value || "");
  const regexCBU = /^\d{22}$/;
  const regexAlias = /^[a-zA-Z0-9.-]{6,20}$/;

  switch (name) {
    //TODO VALIDACIONES TIPO PERSONA, AÑADIR CLIENTE, EMPLEADO, PROVEEDOR, PRODUCTO

    case "nombre_empresa":
      if (!value.trim()) return "El nombre es obligatorio.";
      if (value.length < 3)
        return "El nombre debe tener al menos 3 caracteres.";
      break;

    case "localidad":
      if (!value.trim()) return "El campo es obligatorio.";
      if (value.length < 3)
        return "La localidad debe tener al menos 3 caracteres.";
      break;

    case "apellido":
      if (!value.trim()) return "El apellido es obligatorio.";
      if (!letraRegex.test(value))
        return "El nombre solo puede contener letras.";
      if (value.length < 3)
        return "El nombre debe tener al menos 3 caracteres.";

      break;

    case "email":
    case "contacto_1":
      if (!value.trim()) return "El email es obligatorio.";
      if (!emailRegex.test(value))
        return "El email no es válido, debe respetar el formato email.";
      break;

    case "contacto_2":
      if (!value.trim()) return "El contacto es obligatorio.";
      if (!contactoRegex.test(value))
        return "El contacto solo pueden contener números.";
      if (value.length < 6) return "Debe tener al menos 6 caracteres.";
      break;

    case "saldo":
      if (!valueString.trim()) return "El saldo es obligatorio.";
      if (isNaN(valueString)) return "El saldo debe ser un número.";
      // if (Number(valueString) <= 0) return "El saldo debe ser mayor a cero.";
      break;

    default:
      return "";
  }
  return "";
};
