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
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 font-['Inter',sans-serif] transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Mobile Nav Overlay */}
      <MobileNavOverlay />

      {/* Mobile Sidebar Navigation */}
      <MobileSidebar />

      {/* Main Layout - LinkedIn-style centered container */}
      <div className="pt-14 sm:pt-16 min-h-screen">
        {/* Centered Container */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          {/* Three Column Layout - Centered */}
          <div className="flex justify-center gap-6 py-4">
            {/* Left Sidebar - Sticky */}
            <div className="hidden lg:block w-[225px] flex-shrink-0">
              <div className="sticky top-20">
                <Sidebar />
              </div>
            </div>

            {/* Main Content Area - Fixed Width */}
            <div className="w-full lg:w-[550px] xl:w-[600px] flex-shrink-0 min-w-0">
              <MainContent />
            </div>

            {/* Right Sidebar - Sticky */}
            <div className="hidden xl:block w-[300px] flex-shrink-0">
              <div className="sticky top-20">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Notification Popup */}
      <CopyNotificationPopup />
    </div>
  );
}
