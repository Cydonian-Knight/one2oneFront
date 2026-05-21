import styles from "./Features.module.css";
import FeaturesText from "./FeaturesText";
import FeatureSection from "./FeatureSection";

function Features() {
  return (
    <div className={styles.featuresMainContainer} id="caracteristicas">
      <FeaturesText />
      <FeatureSection />
    </div>
  );
}

export default Features;
