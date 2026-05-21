import Navbar from "../../components/LandingPage/Navbar";
import HeroSection from "../../components/LandingPage/HeroSection";
import Features from "../../components/LandingPage/Features";
import Functioning from "../../components/LandingPage/Functioning";
import Security from "../../components/LandingPage/Security";
import Banner from "../../components/LandingPage/Banner";
import Footer from "../../components/LandingPage/Footer";
import styles from "../../components/LandingPage/LandingPageContent.module.css";

function LandingPage() {
  return (
    <>
      <Navbar />
      <div className={styles.landingPageContentContainer}>
        <HeroSection />
        <Features />
        <Functioning />
        <Security />
        <Banner />
      </div>
      <Footer />
    </>
  );
}
export default LandingPage;
