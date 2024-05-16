//components
import Main from "./Main";
import Footer from "./Footer";
import Header from "./Header";
//css
import styles from "./styles/homePage.module.scss";
//types
import { UserDataProps } from "./types/HomePage.types";

const HomePage: React.FC<{
  userData: UserDataProps;
}> = ({ userData }) => {
  return (
    <div className={styles.wrapper}>
      <Header userData={userData} />
      <Main />
      <Footer />
    </div>
  );
};

export default HomePage;
