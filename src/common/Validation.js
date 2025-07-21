export const Validation = (name, value) => {
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

    case "nombre":
    case "nombre_servicio":
    case "nombre_aseguradora":
      if (!value.trim()) return "El nombre es obligatorio.";
      if (!letraRegex.test(value))
        return "Solo se permiten letras y espacios entre nombres";
      if (value.length < 3)
        return "El nombre debe tener al menos 3 caracteres.";
      break;

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

    case "tipo":
      if (!value.trim()) return "El campo es obligatorio.";
      if (!letraRegex.test(value))
        return "Solo se permiten letras y espacios entre nombres";
      if (value.length < 3)
        return "El nombre del tipo debe tener al menos 3 caracteres.";
      break;

    case "seccion":
      if (!value.trim()) return "La sección es obligatorio.";
      if (!letraRegex.test(value))
        return "Solo se permiten letras y espacios entre palabras";
      if (value.length < 3)
        return "La sección debe tener al menos 3 caracteres.";
      break;

    case "nombre_banco":
      if (!value.trim()) return "El nombre del banco es obligatorio.";
      if (!letraRegex.test(value))
        return "Solo se permiten letras y espacios entre nombres";
      if (value.length < 3)
        return "El nombre del banco debe tener al menos 3 caracteres.";
      break;

    case "apellido":
      if (!value.trim()) return "El apellido es obligatorio.";
      if (!letraRegex.test(value))
        return "El nombre solo puede contener letras.";
      if (value.length < 3)
        return "El nombre debe tener al menos 3 caracteres.";

      break;

    case "email":
    case "contacto_2":
      if (!value.trim()) return "El campo es obligatorio.";
      // if (!emailRegex.test(value))
      //   return "El email no es válido, debe respetar el formato email.";
      if (value.length < 6) return "Debe tener al menos 6 caracteres.";
      break;

    case "contacto":
      if (!value.trim()) return "El contacto es obligatorio.";
      if (!contactoRegex.test(value))
        return "El contacto solo pueden contener números.";
      if (value.length < 6) return "Debe tener al menos 6 caracteres.";
      break;

    case "contacto_1":
      if (!value.trim()) return "El contacto es obligatorio.";
      // if (!contactoRegex.test(value))
      //   return "El contacto solo pueden contener números.";
      if (value.length < 6) return "Debe tener al menos 6 caracteres.";
      break;

    case "password":
      if (!value.trim()) return "La contraseña es obligatoria.";
      if (value.length < 6) return "Debe tener al menos 6 caracteres.";
      if (!passwordRegex.test(value))
        return "La contraseña debe tener al menos una mayúscula, un número y un símbolo.";
      break;

    case "localidad":
      if (!value.trim()) return "La localidad es obligatoria.";
      if (value.length < 6) return "Debe tener al menos 6 caracteres.";
      break;

    case "dni":
      if (!value.trim()) return "El DNI es obligatorio.";
      if (!dniRegex.test(value))
        return "El DNI debe tener entre 8 y 9 números.";
      break;

    case "cuit_cuil":
      if (!value.trim()) return "El CUIT/CUIL es obligatorio.";
      if (!cuitCuilRegex.test(value))
        return "El CUIT/CUIL debe tener al menos 11 números.";
      break;

    case "cuit":
      if (!value.trim()) return "El CUIT es obligatorio.";
      if (!cuitCuilRegex.test(value))
        return "El CUIT debe tener al menos 11 números.";
      break;

    case "inputGenerico":
    case "metodo_utilizado":
      if (!value.trim()) return "El campo es obligatorio.";
      break;

    //TODO VALIDACIONES DE TIPO BANCO, COMPROMISOS DE PAGOS, PAGOS EVENTUALES, DEPOSITOS, TRANSFERENCIAS

    case "razonSocial":
      if (!value.trim()) return "El campo es obligatorio.";
      if (!letraRegex.test(value))
        return "Solo se permiten letras y espacios entre nombres";
      if (value.length < 3) return "El campo debe tener al menos 3 caracteres.";
      break;

    case "efectivo":
    case "monto":
    case "importe":
    case "precio":
      if (!valueString.trim()) return "El importe es obligatorio.";
      if (isNaN(valueString)) return "El importe debe ser un número.";
      if (Number(valueString) <= 0) return "El importe debe ser mayor a cero.";
      break;

    case "saldo":
      if (!valueString.trim()) return "El saldo es obligatorio.";
      if (isNaN(valueString)) return "El saldo debe ser un número.";
      // if (Number(valueString) <= 0) return "El saldo debe ser mayor a cero.";
      break;

    case "cantidad":
    case "cantidadIngresa":
      if (!valueString.trim()) return "El campo es obligatorio.";
      if (isNaN(valueString)) return "La cantidad debe ser un número.";
      if (Number(valueString) <= 0) return "La cantidad debe ser mayor a cero.";
      break;

    case "numero":
      if (!valueString.trim()) return "El campo es obligatorio.";
      if (isNaN(valueString)) return "La el campo debe ser un número.";
      if (value.length < 6) return "El campo debe tener al menos 6 números.";
      break;

    case "descripcion":
      if (!value.trim()) return "La descripcion es obligatoria.";
      if (!letraRegex.test(value))
        return "Solo se permiten letras y espacios entre nombres";
      if (value.length < 3)
        return "La descripcion debe tener al menos 3 caracteres.";
      break;

    case "numero_cuota":
      if (!valueString.trim()) return "El número de cuota es obligatorio.";
      if (isNaN(valueString)) return "La cuota debe ser un número.";
      if (Number(valueString) <= 0) return "La cuota debe ser mayor a cero.";
      break;

    case "numero_cheque":
      if (!value.trim()) return "El campo es obligatorio";
      if (isNaN(valueString)) return "Solo se permite ingresar números.";
      break;

    case "numero_poliza":
      if (!value.trim()) return "El campo es obligatorio";
      if (isNaN(valueString)) return "Solo se permite ingresar números.";
      if (value.length < 3)
        return "La poliza debe tener al menos 3 caracteres.";
      break;

    case "nombre_cuenta":
    case "banco":
      if (!value.trim()) return "El nombre del banco es obligatorio.";
      if (!letraRegex.test(value))
        return "Solo se permiten letras y espacios entre nombres";
      if (value.length < 3)
        return "El nombre del banco debe tener al menos 3 caracteres.";
      break;

    case "cuenta_origen":
    case "origen":
      if (!value.trim()) return "El nombre de la cuenta es obligatorio.";
      if (value.length < 3) return "El campo debe tener al menos 3 caracteres.";
      break;

    case "cuenta_destino":
      if (!value.trim()) return "El campo es obligatorio.";
      if (value.length < 3) return "El campo debe tener al menos 3 caracteres.";
      break;

    case "cbu_alias":
    case "destino":
      if (!value.trim()) return "El campo es obligatorio.";
      if (value.length < 3) return "El campo debe tener al menos 3 caracteres.";
      // if (!regexCBU.test(value) && !regexAlias.test(value)) {
      //   return "Debe ingresar un CBU válido (22 dígitos) o un ALIAS válido (6-20 caracteres, letras, números, punto o guion medio).";
      // }
      break;

    case "numero_cheque":
      if (!value.trim()) return "Este campo es obligatorio.";
      if (!numberRegex.test(value))
        return "Este campo solo debe contener números.";
      break;

    default:
      return "";
  }
  return "";
};
