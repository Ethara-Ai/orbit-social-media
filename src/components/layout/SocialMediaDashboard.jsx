import { useLoading } from '../../context/providers/ui';

// Import Layout Components
import {
  LoadingScreen,
  Sidebar,
  Header,
  LayoutContainer,
  MainContent,
  MobileNavOverlay,
  RightSidebar,
  CopyNotificationPopup,
  MobileSidebar,
} from './';

// ============================================================================
// Main Dashboard Component
// ============================================================================

export default function SocialMediaDashboard() {
  // Use focused hook for better performance - only re-renders when loading state changes
  const { isLoading } = useLoading();

  // Loading State
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen lg:h-screen w-full bg-slate-100 dark:bg-black font-['Urbanist',sans-serif] transition-colors duration-300 lg:overflow-hidden flex flex-col">
      {/* Header - Fixed at top */}
      <Header />

      {/* Mobile Nav Overlay */}
      <MobileNavOverlay />

      {/* Mobile Sidebar Navigation */}
      <MobileSidebar />

      {/* Main Layout Container - Takes remaining height on desktop, flows naturally on mobile */}
      <main className="pt-14 sm:pt-16 lg:flex-1 lg:overflow-hidden">
        {/* Centered Container - Direct child like header's LayoutContainer */}
        <LayoutContainer className="lg:h-full">
          {/* Three Column Layout */}
          <div className="lg:h-full flex justify-center gap-5 py-3 lg:py-3">
            {/* Left Sidebar - Fixed, non-scrollable (desktop only) */}
            <div className="hidden lg:block w-52.5 shrink-0 h-fit max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
              <Sidebar />
            </div>

            {/* Main Content Area - Scrollable on desktop, natural flow on mobile */}
            <div className="w-full lg:w-130 xl:w-145 shrink-0 min-w-0 lg:h-full lg:overflow-y-auto custom-scrollbar pb-6 lg:pb-4">
              <MainContent />
            </div>

            {/* Right Sidebar - Fixed, non-scrollable (desktop only) */}
            <div className="hidden xl:block w-70 shrink-0 h-fit max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
              <RightSidebar />
            </div>
          </div>
        </LayoutContainer>
      </main>

      {/* Copy Notification Popup */}
      <CopyNotificationPopup />
    </div>
  );
}
