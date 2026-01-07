import { AppProvider } from "./context/AppContext";
import SocialMediaDashboard from "./SocialMediaDashboard";
import "./App.css";

function App() {
  return (
    <AppProvider>
      <SocialMediaDashboard />
    </AppProvider>
  );
}

export default App;
