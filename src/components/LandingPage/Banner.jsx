import MainBanner from "./MainBanner";
import styles from "./Banner.module.css";
function Banner() {
  return (
    <div className={styles.container}>
      <MainBanner />
    </div>
  );
}

export default Banner;
