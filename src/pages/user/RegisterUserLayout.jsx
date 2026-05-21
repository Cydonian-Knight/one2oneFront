import { useState } from "react";
import LeftPanel from "../../components/RegisterUserPage/LeftPanel";
import styles from "../../components/RegisterUserPage/RegisterUser.module.css";
import LoginForm from "../../components/RegisterUserPage/LoginForm";
import RegisterForm from "../../components/RegisterUserPage/RegisterForm";
import VerifyForm from "../../components/RegisterUserPage/VerifyForm";
import { Outlet } from "react-router-dom";
import { useIsMobile } from "../../hooks/isMobile";
import BrandHeader from "../../components/RegisterUserPage/BrandHeader";


function RegisterUserLayout() {
  const isMobile = useIsMobile(1060);
  const [view, setView] = useState("login");

  const renderView = () => {
    switch (view) {
      case "login":
        return <LoginForm setView={setView} />;
      case "register":
        return <RegisterForm setView={setView} />;
      case "verify":
        return <VerifyForm setView={setView} />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className={styles.container}>
        {
          isMobile ?
            ""
            :
            <LeftPanel />
        }
        <div className={styles.rightView}>
          {isMobile ? <BrandHeader /> : ""}

          <Outlet />
        </div>
      </div>
    </>
  );
}

export default RegisterUserLayout;
