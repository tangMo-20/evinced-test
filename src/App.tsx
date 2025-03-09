import styles from "./App.module.scss";
import { Header } from "./components/Header/Header";
import { ScanResults } from "./screens/ScanResults/ScanResults";

// Required to add at least a general layout for header/footer
function App() {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.content}>
        <ScanResults />
      </div>
    </div>
  );
}

export default App;
