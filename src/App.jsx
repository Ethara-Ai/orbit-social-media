import { AppProvider } from "./context/AppContext";
import { ErrorBoundary } from "./components/common";
import SocialMediaDashboard from "./SocialMediaDashboard";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <SocialMediaDashboard />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
