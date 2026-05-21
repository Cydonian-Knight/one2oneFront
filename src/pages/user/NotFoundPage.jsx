
import styles from "../../components/NotFoundPage/NotFoundPage.module.css";
import { MessageCircle, Compass, Search, ArrowLeft, House } from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';



function NotFoundPage() {
    const location = useLocation();
    const navigate = useNavigate();


    return (
        <div className={styles.page}>
            <div className={styles.nameLogoContainer}>
                <div className={styles.navbarImgContainer}>
                    <MessageCircle size={28} color="white" />
                </div>
                <h2>One2One</h2>
            </div>


            <div className={styles.sessionContainer}>
                <div className={styles.compassImgContainer}>
                    <Compass size={40} color="#21b1a3" />
                </div>
                <span className={styles.title404}>
                    404
                </span>
                <span className={styles.title}>
                    Esta no es la conversación que buscabas
                </span>
                <span className={styles.subtitle}>
                    La página o el recurso al que intentaste acceder no existe,
                    ha cambiado o ya no está disponible.
                </span>
                <div className={styles.path}>
                    <Search size={12} color="var(--secondary-color)" />
                    {location.pathname}
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={() => {
                        navigate(-1);
                    }}>
                        <ArrowLeft size={20} />
                        Volver a atrás
                    </button>

                    <button onClick={() => {
                        navigate('/');

                    }}
                        style={{
                            color: "white",
                            background: "var(--primary-gradient)"
                        }}
                    >
                        <House size={20} color={"white"} />
                        Ir al Inicio
                    </button>
                </div>
            </div>
            {/* Gradientes */}

            <div className={styles.circularGradient}
                style={{
                    bottom: "0",
                    right: "0",
                    transform: "translate(50%, 50%)"
                }}>

            </div>
            <div className={styles.circularGradient}
                style={{
                    top: "0",
                    left: "0",
                    transform: "translate(-50%, -50%)"
                }}
            ></div>
            <div className={styles.disclaimer}>Si crees que esto es un error, vuelve al inicio e inténtalo de nuevo.</div>
        </div>

    );
}
export default NotFoundPage;
