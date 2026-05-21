import styles from "./LoginForm.module.css";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Lock } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";


function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Favor de llenar todos los campos");
        return;
      }
      if (!emailRegex.test(email)) {
        toast.error("Correo Electrónico No Válido");
        return;
      }
      if (password.length < 6) {
        toast.error("La contraseña debe contener por lo menos 6 caracteres");
        return;
      }

      const res = await fetch("https://one2onebackend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });



      const response = await res.json();

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      if (response.success && response.data.needsVerification) {
        localStorage.setItem("verificationToken", response.data.token);
        localStorage.setItem("userEmail", email);
        console.log("Cuenta no verificada, redirigiendo...");
        navigate("/auth/verify", { state: { email } });
        return;
      }

      if (response.data.user.username === "admin") {
        toast.success("¡Bienvenido de Vuelta Administrador!");
        navigate("/admin");
        return;
      }

      toast.success("¡Bienvenido de Vuelta!");

      navigate("/chat");
    } catch (error) {

    }





  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <div className={styles.title}>
        <h1>Bienvenido de vuelta</h1>
        <span>Inicia sesión para continuar</span>
      </div>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
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
          Iniciar Sesión
        </button>
      </form>
      <div className={styles.question}>
        <p>
          ¿No tienes cuenta?{"  "}
          <span onClick={() => navigate("/auth/register")}>Regístrate</span>
        </p>
      </div>
    </>
  );
}

export default LoginForm;
