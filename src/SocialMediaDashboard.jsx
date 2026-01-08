import { useUI } from "./context/AppContext";

// Import Layout Components
import {
  LoadingScreen,
  Sidebar,
  Header,
  MainContent,
  MobileNavOverlay,
  RightSidebar,
  CopyNotificationPopup,
} from "./components/layout";

// ============================================================================
// Main Dashboard Component
// ============================================================================

export default function SocialMediaDashboard() {
  const { isLoading } = useUI();

  // Loading State
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-slate-50 dark:bg-slate-950 font-['Inter',sans-serif] transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Mobile Nav Overlay */}
      <MobileNavOverlay />

      {/* Main Layout */}
      <div className="pt-14 sm:pt-16 flex min-h-screen w-full max-w-[100vw] overflow-x-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <MainContent />

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Copy Notification Popup */}
      <CopyNotificationPopup />
    </div>
  );
}
