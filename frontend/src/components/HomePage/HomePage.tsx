//components
import Main from "./Main";
import Footer from "./Footer";
import Header from "./Header";
//css
import styles from "./styles/homePage.module.scss";
//types
import { UserDataProps } from "./types/HomePage.types";

const HomePage: React.FC<UserDataProps> = ({ userData, setUserData }) => {
  return (
    <div className={styles.wrapper}>
      <Header userData={userData} setUserData={setUserData} />
      <Main />
      <Footer />
    </div>
  );
};

export default HomePage;
