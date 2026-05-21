import styles from "./RegisterForm.module.css";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


function RegisterForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password || !user) {
        toast.error("Favor de llenar todos los campos");
        return;
      }
      if (!emailRegex.test(email)) {
        toast.error("Corre Invalido");

        return;
      }
      if (password.length < 6) {
        toast.error("La contraseña debe tener 6 caracteres");

        return;
      }

      const res = await fetch("https://one2onebackend.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username: user, password }),
        credentials: "include",
      });

      const response = await res.json();

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      localStorage.setItem("verificationToken", response.data.token);
      localStorage.setItem("userEmail", email);
      toast.success("¡Registrado Correctamente!");

      navigate("/auth/verify", { state: { email } });
    } catch (error) { }
  };
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className={styles.title}>
        <h1>Crear cuenta</h1>
        <span>Regístrate para comenzar a chatear</span>
      </div>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <label htmlFor="user">Nombre de usuario</label>
        <div className={styles.inputContainer}>
          <User size={18} />
          <input
            id="user"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="tu_username"
            required
          />
        </div>

        <label htmlFor="email">Correo</label>
        <div className={styles.inputContainer}>
          <Mail size={18} />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>
        <label htmlFor="password">Contraseña</label>
        <div className={styles.inputContainer}>
          <Lock size={18} />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••"
          />
          <span onClick={togglePassword} className={styles.eyeIcon}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        <button type="submit" className={styles.button}>
          Registrarse
        </button>
      </form>
      <div className={styles.question}>
        <p>
          ¿Ya tienes cuenta? {""}
          <span onClick={() => navigate("/auth/login")}>Inicia Sesión</span>
        </p>
      </div>
    </>
  );
}

export default RegisterForm;
