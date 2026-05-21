import background from "../../assets/auth-bg.jpg";
import styles from "./BrandHeader.module.css";
import { MessageCircle } from "lucide-react";

function BrandHeader() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <MessageCircle size={30} color="white" />
                </div>
                <p className={styles.brand}>One2One</p>
            </div>
        </>
    );
}

export default BrandHeader;
