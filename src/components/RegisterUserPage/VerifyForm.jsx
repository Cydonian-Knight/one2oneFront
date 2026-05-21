import {
  Pencil,
  Check,
  X,
  Mail,
  Send,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./VerifyForm.module.css";
import toast from "react-hot-toast";

function VerifyForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialEmail = state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [tempEmail, setTempEmail] = useState(initialEmail);
  const [editing, setEditing] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [vals, setVals] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const estaCompleto = vals.every(v => v.length === 1);

  const manejarCambio = (e, indice) => {
    let valor = e.target.value;
    if (valor.length > 1) {
      valor = valor.slice(-1);
    }

    if (!/^\d*$/.test(valor)) return;

    const nuevaCopia = [...vals];
    nuevaCopia[indice] = valor;
    setVals(nuevaCopia);

    if (valor !== "" && indice < 5) {
      inputsRef.current[indice + 1].focus();
    }
  };

  useEffect(() => {
    if (!state?.email) {
      navigate("/auth/login");
    }
  }, [state, navigate]);

  if (!state?.email) return null;

  const handleEdit = () => {
    setEditing(true);
  };
  const handleSave = async () => {

    if (!tempEmail) {
      toast.error("No se ingreso un correo");
      return;
    }
    if (initialEmail === tempEmail) {
      toast.error("El correo ingresado es igual al anterior")
      setEditing(false);
      return;
    }
    if (!emailRegex.test(tempEmail)) {
      toast.error("Correo inválido.");
      return;
    }

    try {
      const res = await fetch("https://one2onebackend.onrender.com/api/auth/updateEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('verificationToken')}`
        },
        body: JSON.stringify({ email: tempEmail }),
        credentials: "include",
      });

      const response = await res.json();

      console.log(response)
      if (!response.success) {
        toast.error(response.message);
        return;
      }


      localStorage.setItem("userEmail", tempEmail);
      setEmail(tempEmail);
      setEditing(false);
      navigate(".", {
        replace: true,
        state: { email: tempEmail }
      });

    } catch (error) {
      toast.error("Error al actualizar el correo")
    }
  };
  const handleCancel = () => {
    setTempEmail(email);
    setEditing(false);
  };

  const sendCode = async () => {
    try {
      const res = await fetch("https://one2onebackend.onrender.com/api/auth/sendVerificationCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('verificationToken')}`
        },
        credentials: "include",
      });

      const response = await res.json();


      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success("Código enviado de manera exitosa");


    } catch (error) {
      toast.error("Error al enviar codigo: ", error);

    }
  }


  const verifyCode = async (e) => {
    e.preventDefault();
    try {

      if (!estaCompleto) {
        toast.error("No se envio el codigo de manera correcta");
        return;
      }
      console.log(localStorage.getItem('verificationToken'))

      const res = await fetch("https://one2onebackend.onrender.com/api/auth/verifyCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('verificationToken')}`

        },
        body: JSON.stringify({ code: vals.join('') }),
        credentials: "include",
      });



      const response = await res.json();
      console.log(response)

      if (!response.success) {
        toast.error("Credenciales Invalidas");
        return;
      }
      toast.success("Verificacion exitosa");
      navigate("/chat");
    } catch (error) {

    }





  };

  return (
    <>
      <p className={styles.backContent} onClick={() => navigate("/auth/login")}>
        <ArrowLeft size={18} />Volver</p>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          <ShieldCheck size={22} />
        </div>

        <div className={styles.text}>
          <h1>Verificación</h1>
          <span>Confirma tu identidad por correo</span>
        </div>
      </div>
      <p className={styles.description}>
        Enviaremos un código de 6 dígitos a tu correo electrónico para verificar
        tu identidad.
      </p>
      <p className={styles.emailVerify}>Correo de verificación</p>
      <div className={styles.emailContainer}>
        <div
          className={`${styles.inputWrapper} ${editing ? styles.editing : styles.readMode
            }`}
        >
          <Mail size={18} className={styles.iconLeft} />

          {!editing ? (
            <span className={styles.emailText}>{email}</span>
          ) : (
            <input
              type="email"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              className={styles.input}
              autoFocus
            />
          )}

          {!editing ? (
            <>
              <Pencil
                size={18}
                onClick={handleEdit}
                className={styles.iconRight}
              />
              <span onClick={handleEdit} className={styles.change}>
                Cambiar
              </span>
            </>
          ) : (
            <div className={styles.actions}>
              <Check
                size={18}
                onClick={handleSave}
                color="#14b8a6"
                cursor="pointer"
              />
              <X
                size={18}
                onClick={handleCancel}
                color="#14b8a6"
                cursor="pointer"
              />
            </div>
          )}
        </div>
      </div>
      <p className={styles.emailMessage}>
        ¿Te equivocaste de correo? Haz click en "Cambiar" para corregirlo antes
        de solicitar el código.{" "}
      </p>
      <button onClick={sendCode} className={styles.sendCode}>
        <Send size={16} />
        Recibir código por email
      </button>
      <div>
        <p>Ingresa el código de 6 dígitos</p>
      </div>
      <form onSubmit={verifyCode}>
        <div className={styles.inputContainer}>
          {vals.map((num, i) => (
            <>
              <input
                key={i}
                type="text"
                inputMode="numeric"
                value={num}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => manejarCambio(e, i)}
                className={`${styles.inputCode} 
                ${i === 0 || i === 3 ? styles.start : ""}
                ${i === 2 || i === 5 ? styles.end : ""}`}
              />
              {i === 2 ? <div className={styles.slash}>-</div> : ""}
            </>

          ))}
        </div>
        <button
          type="submit"
          disabled={!estaCompleto}
          className={`${styles.verifyCode} ${estaCompleto ? styles.activo : styles.vacio}`}>
          <ShieldCheck size={16} />
          Verificar Código
        </button>
      </form>
    </>
  );
}

export default VerifyForm;
