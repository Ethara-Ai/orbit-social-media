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
  MobileSidebar,
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
    <div className="h-screen w-full bg-slate-100 dark:bg-slate-950 font-['Inter',sans-serif] transition-colors duration-300 overflow-hidden flex flex-col">
      {/* Header - Fixed at top */}
      <Header />

      {/* Mobile Nav Overlay */}
      <MobileNavOverlay />

      {/* Mobile Sidebar Navigation */}
      <MobileSidebar />

      {/* Main Layout Container - Takes remaining height */}
      <div className="flex-1 pt-14 sm:pt-16 overflow-hidden">
        {/* Centered Container */}
        <div className="h-full max-w-[1280px] mx-auto px-4 lg:px-5">
          {/* Three Column Layout */}
          <div className="h-full flex justify-center gap-5 py-3">
            {/* Left Sidebar - Fixed, non-scrollable */}
            <div className="hidden lg:block w-[210px] shrink-0 h-fit max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
              <Sidebar />
            </div>

            {/* Main Content Area - Scrollable */}
            <div className="w-full lg:w-[520px] xl:w-[580px] shrink-0 min-w-0 h-full overflow-y-auto custom-scrollbar pb-4">
              <MainContent />
            </div>

            {/* Right Sidebar - Fixed, non-scrollable */}
            <div className="hidden xl:block w-[280px] shrink-0 h-fit max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Copy Notification Popup */}
      <CopyNotificationPopup />
    </div>
  );
}
