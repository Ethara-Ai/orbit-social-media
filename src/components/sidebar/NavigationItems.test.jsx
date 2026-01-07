/**
 * Unit Tests for NavigationItems Component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NavigationItems from "./NavigationItems";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    button: ({ children, className, onClick, ...props }) => (
      <button className={className} onClick={onClick} data-testid="nav-button">
        {children}
      </button>
    ),
  },
}));

// Mock Badge component
vi.mock("../common/Badge", () => ({
  default: ({ count, variant, className }) => (
    <span
      data-testid="badge"
      data-count={count}
      data-variant={variant}
      className={className}
    >
      {count}
    </span>
  ),
}));

// Mock icons
const MockIcon = ({ className }) => (
  <svg data-testid="nav-icon" className={className}>
    <path d="M0 0" />
  </svg>
);

describe("NavigationItems", () => {
  const mockNavItems = [
    { id: "feed", label: "Feed", icon: MockIcon },
    { id: "explore", label: "Explore", icon: MockIcon },
    { id: "messages", label: "Messages", icon: MockIcon },
    { id: "notifications", label: "Notifications", icon: MockIcon },
  ];

  const defaultProps = {
    navItems: mockNavItems,
    activeTab: "feed",
    setActiveTab: vi.fn(),
    notificationCount: 5,
    totalUnreadMessages: 3,
    markNotificationsAsRead: vi.fn(),
    onNavigate: vi.fn(),
    isMobile: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the component", () => {
      render(<NavigationItems {...defaultProps} />);
      expect(screen.getByText("Feed")).toBeInTheDocument();
    });

    it("should render all navigation items", () => {
      render(<NavigationItems {...defaultProps} />);
      expect(screen.getByText("Feed")).toBeInTheDocument();
      expect(screen.getByText("Explore")).toBeInTheDocument();
      expect(screen.getByText("Messages")).toBeInTheDocument();
      expect(screen.getByText("Notifications")).toBeInTheDocument();
    });

    it("should render correct number of buttons", () => {
      render(<NavigationItems {...defaultProps} />);
      const buttons = screen.getAllByTestId("nav-button");
      expect(buttons).toHaveLength(4);
    });

    it("should render icons for each item", () => {
      render(<NavigationItems {...defaultProps} />);
      const icons = screen.getAllByTestId("nav-icon");
      expect(icons).toHaveLength(4);
    });

    it("should render with empty nav items", () => {
      render(<NavigationItems {...defaultProps} navItems={[]} />);
      const buttons = screen.queryAllByTestId("nav-button");
      expect(buttons).toHaveLength(0);
    });
  });

  describe("active state", () => {
    it("should apply active styles to the active tab", () => {
      render(<NavigationItems {...defaultProps} activeTab="feed" />);
      const feedButton = screen.getByText("Feed").closest("button");
      expect(feedButton).toHaveClass("bg-orange-500");
      expect(feedButton).toHaveClass("text-white");
    });

    it("should apply inactive styles to non-active tabs", () => {
      render(<NavigationItems {...defaultProps} activeTab="feed" />);
      const exploreButton = screen.getByText("Explore").closest("button");
      expect(exploreButton).toHaveClass("text-slate-600");
    });

    it("should apply shadow class to active tab", () => {
      render(<NavigationItems {...defaultProps} activeTab="feed" />);
      const feedButton = screen.getByText("Feed").closest("button");
      expect(feedButton).toHaveClass("shadow-lg");
      expect(feedButton).toHaveClass("shadow-orange-500/25");
    });

    it("should apply hover classes to inactive tabs", () => {
      render(<NavigationItems {...defaultProps} activeTab="feed" />);
      const exploreButton = screen.getByText("Explore").closest("button");
      expect(exploreButton).toHaveClass("hover:bg-slate-100");
    });

    it("should change active state when different tab is active", () => {
      render(<NavigationItems {...defaultProps} activeTab="explore" />);
      const exploreButton = screen.getByText("Explore").closest("button");
      const feedButton = screen.getByText("Feed").closest("button");

      expect(exploreButton).toHaveClass("bg-orange-500");
      expect(feedButton).not.toHaveClass("bg-orange-500");
    });
  });

  describe("click handling", () => {
    it("should call setActiveTab when a nav item is clicked", () => {
      const setActiveTab = vi.fn();
      render(<NavigationItems {...defaultProps} setActiveTab={setActiveTab} />);

      fireEvent.click(screen.getByText("Explore"));
      expect(setActiveTab).toHaveBeenCalledWith("explore");
    });

    it("should call onNavigate when provided", () => {
      const onNavigate = vi.fn();
      render(<NavigationItems {...defaultProps} onNavigate={onNavigate} />);

      fireEvent.click(screen.getByText("Feed"));
      expect(onNavigate).toHaveBeenCalled();
    });

    it("should not throw when onNavigate is not provided", () => {
      expect(() => {
        render(<NavigationItems {...defaultProps} onNavigate={undefined} />);
        fireEvent.click(screen.getByText("Feed"));
      }).not.toThrow();
    });

    it("should call markNotificationsAsRead when notifications is clicked", () => {
      const markNotificationsAsRead = vi.fn();
      render(
        <NavigationItems
          {...defaultProps}
          markNotificationsAsRead={markNotificationsAsRead}
        />
      );

      fireEvent.click(screen.getByText("Notifications"));
      expect(markNotificationsAsRead).toHaveBeenCalled();
    });

    it("should not call markNotificationsAsRead for other tabs", () => {
      const markNotificationsAsRead = vi.fn();
      render(
        <NavigationItems
          {...defaultProps}
          markNotificationsAsRead={markNotificationsAsRead}
        />
      );

      fireEvent.click(screen.getByText("Feed"));
      fireEvent.click(screen.getByText("Explore"));
      fireEvent.click(screen.getByText("Messages"));

      expect(markNotificationsAsRead).not.toHaveBeenCalled();
    });

    it("should handle multiple clicks", () => {
      const setActiveTab = vi.fn();
      render(<NavigationItems {...defaultProps} setActiveTab={setActiveTab} />);

      fireEvent.click(screen.getByText("Feed"));
      fireEvent.click(screen.getByText("Explore"));
      fireEvent.click(screen.getByText("Messages"));

      expect(setActiveTab).toHaveBeenCalledTimes(3);
      expect(setActiveTab).toHaveBeenNthCalledWith(1, "feed");
      expect(setActiveTab).toHaveBeenNthCalledWith(2, "explore");
      expect(setActiveTab).toHaveBeenNthCalledWith(3, "messages");
    });
  });

  describe("notification badge", () => {
    it("should show notification badge when notificationCount > 0", () => {
      render(<NavigationItems {...defaultProps} notificationCount={5} />);
      const badges = screen.getAllByTestId("badge");
      const notificationBadge = badges.find(
        (badge) => badge.getAttribute("data-count") === "5"
      );
      expect(notificationBadge).toBeInTheDocument();
    });

    it("should not show notification badge when notificationCount is 0", () => {
      render(<NavigationItems {...defaultProps} notificationCount={0} />);
      const badges = screen.getAllByTestId("badge");
      const notificationBadge = badges.find(
        (badge) => badge.getAttribute("data-count") === "0"
      );
      expect(notificationBadge).toBeUndefined();
    });

    it("should show danger variant for notification badge when inactive", () => {
      render(
        <NavigationItems
          {...defaultProps}
          activeTab="feed"
          notificationCount={5}
        />
      );
      const badges = screen.getAllByTestId("badge");
      const notificationBadge = badges.find(
        (badge) => badge.getAttribute("data-count") === "5"
      );
      expect(notificationBadge).toHaveAttribute("data-variant", "danger");
    });

    it("should show light variant for notification badge when active", () => {
      render(
        <NavigationItems
          {...defaultProps}
          activeTab="notifications"
          notificationCount={5}
        />
      );
      const badges = screen.getAllByTestId("badge");
      const notificationBadge = badges.find(
        (badge) => badge.getAttribute("data-count") === "5"
      );
      expect(notificationBadge).toHaveAttribute("data-variant", "light");
    });
  });

  describe("messages badge", () => {
    it("should show messages badge when totalUnreadMessages > 0", () => {
      render(<NavigationItems {...defaultProps} totalUnreadMessages={3} />);
      const badges = screen.getAllByTestId("badge");
      const messagesBadge = badges.find(
        (badge) => badge.getAttribute("data-count") === "3"
      );
      expect(messagesBadge).toBeInTheDocument();
    });

    it("should not show messages badge when totalUnreadMessages is 0", () => {
      render(<NavigationItems {...defaultProps} totalUnreadMessages={0} />);
      const badges = screen.getAllByTestId("badge");
      const messagesBadge = badges.find(
        (badge) => badge.getAttribute("data-count") === "0"
      );
      expect(messagesBadge).toBeUndefined();
    });

    it("should show primary variant for messages badge when inactive", () => {
      render(
        <NavigationItems
          {...defaultProps}
          activeTab="feed"
          totalUnreadMessages={3}
        />
      );
      const badges = screen.getAllByTestId("badge");
      const messagesBadge = badges.find(
        (badge) => badge.getAttribute("data-count") === "3"
      );
      expect(messagesBadge).toHaveAttribute("data-variant", "primary");
    });

    it("should show light variant for messages badge when active", () => {
      render(
        <NavigationItems
          {...defaultProps}
          activeTab="messages"
          totalUnreadMessages={3}
        />
      );
      const badges = screen.getAllByTestId("badge");
      const messagesBadge = badges.find(
        (badge) => badge.getAttribute("data-count") === "3"
      );
      expect(messagesBadge).toHaveAttribute("data-variant", "light");
    });
  });

  describe("badge positioning", () => {
    it("should have ml-auto class on badges", () => {
      render(<NavigationItems {...defaultProps} />);
      const badges = screen.getAllByTestId("badge");
      badges.forEach((badge) => {
        expect(badge).toHaveClass("ml-auto");
      });
    });
  });

  describe("styling", () => {
    it("should have space-y-1 class on nav container", () => {
      const { container } = render(<NavigationItems {...defaultProps} />);
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("space-y-1");
    });

    it("should have mb-6 class on nav container", () => {
      const { container } = render(<NavigationItems {...defaultProps} />);
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("mb-6");
    });

    it("should have w-full class on buttons", () => {
      render(<NavigationItems {...defaultProps} />);
      const button = screen.getByText("Feed").closest("button");
      expect(button).toHaveClass("w-full");
    });

    it("should have flex layout on buttons", () => {
      render(<NavigationItems {...defaultProps} />);
      const button = screen.getByText("Feed").closest("button");
      expect(button).toHaveClass("flex");
      expect(button).toHaveClass("items-center");
    });

    it("should have gap-3 class on buttons", () => {
      render(<NavigationItems {...defaultProps} />);
      const button = screen.getByText("Feed").closest("button");
      expect(button).toHaveClass("gap-3");
    });

    it("should have padding classes on buttons", () => {
      render(<NavigationItems {...defaultProps} />);
      const button = screen.getByText("Feed").closest("button");
      expect(button).toHaveClass("px-4");
      expect(button).toHaveClass("py-3");
    });

    it("should have rounded-xl class on buttons", () => {
      render(<NavigationItems {...defaultProps} />);
      const button = screen.getByText("Feed").closest("button");
      expect(button).toHaveClass("rounded-xl");
    });

    it("should have transition-all class on buttons", () => {
      render(<NavigationItems {...defaultProps} />);
      const button = screen.getByText("Feed").closest("button");
      expect(button).toHaveClass("transition-all");
    });

    it("should have cursor-pointer class on buttons", () => {
      render(<NavigationItems {...defaultProps} />);
      const button = screen.getByText("Feed").closest("button");
      expect(button).toHaveClass("cursor-pointer");
    });
  });

  describe("icon styling", () => {
    it("should apply w-5 h-5 classes to icons", () => {
      render(<NavigationItems {...defaultProps} />);
      const icons = screen.getAllByTestId("nav-icon");
      icons.forEach((icon) => {
        expect(icon).toHaveClass("w-5");
        expect(icon).toHaveClass("h-5");
      });
    });
  });

  describe("label styling", () => {
    it("should have font-medium class on labels", () => {
      render(<NavigationItems {...defaultProps} />);
      const label = screen.getByText("Feed");
      expect(label).toHaveClass("font-medium");
    });

    it("should have text-sm class on labels", () => {
      render(<NavigationItems {...defaultProps} />);
      const label = screen.getByText("Feed");
      expect(label).toHaveClass("text-sm");
    });
  });

  describe("dark mode classes", () => {
    it("should have dark mode classes for inactive buttons", () => {
      render(<NavigationItems {...defaultProps} activeTab="feed" />);
      const exploreButton = screen.getByText("Explore").closest("button");
      expect(exploreButton).toHaveClass("dark:text-slate-300");
      expect(exploreButton).toHaveClass("dark:hover:bg-slate-800");
    });
  });

  describe("mobile mode", () => {
    it("should accept isMobile prop", () => {
      expect(() => {
        render(<NavigationItems {...defaultProps} isMobile={true} />);
      }).not.toThrow();
    });

    it("should render correctly in mobile mode", () => {
      render(<NavigationItems {...defaultProps} isMobile={true} />);
      expect(screen.getByText("Feed")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle single nav item", () => {
      const singleItem = [{ id: "feed", label: "Feed", icon: MockIcon }];
      render(<NavigationItems {...defaultProps} navItems={singleItem} />);
      expect(screen.getByText("Feed")).toBeInTheDocument();
    });

    it("should handle large notification count", () => {
      render(<NavigationItems {...defaultProps} notificationCount={999} />);
      const badges = screen.getAllByTestId("badge");
      const notificationBadge = badges.find(
        (badge) => badge.getAttribute("data-count") === "999"
      );
      expect(notificationBadge).toBeInTheDocument();
    });

    it("should handle large messages count", () => {
      render(<NavigationItems {...defaultProps} totalUnreadMessages={500} />);
      const badges = screen.getAllByTestId("badge");
      const messagesBadge = badges.find(
        (badge) => badge.getAttribute("data-count") === "500"
      );
      expect(messagesBadge).toBeInTheDocument();
    });

    it("should handle special characters in label", () => {
      const specialItems = [
        { id: "test", label: "Test & More <Items>", icon: MockIcon },
      ];
      render(<NavigationItems {...defaultProps} navItems={specialItems} />);
      expect(screen.getByText("Test & More <Items>")).toBeInTheDocument();
    });

    it("should handle emoji in label", () => {
      const emojiItems = [
        { id: "test", label: "Feed 🔥", icon: MockIcon },
      ];
      render(<NavigationItems {...defaultProps} navItems={emojiItems} />);
      expect(screen.getByText("Feed 🔥")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should render buttons as clickable elements", () => {
      render(<NavigationItems {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should have visible labels", () => {
      render(<NavigationItems {...defaultProps} />);
      expect(screen.getByText("Feed")).toBeVisible();
      expect(screen.getByText("Explore")).toBeVisible();
      expect(screen.getByText("Messages")).toBeVisible();
      expect(screen.getByText("Notifications")).toBeVisible();
    });
  });

  describe("both badges visible", () => {
    it("should show both notification and messages badges when both have counts", () => {
      render(
        <NavigationItems
          {...defaultProps}
          notificationCount={5}
          totalUnreadMessages={3}
        />
      );
      const badges = screen.getAllByTestId("badge");
      expect(badges).toHaveLength(2);
    });

    it("should show no badges when both counts are 0", () => {
      render(
        <NavigationItems
          {...defaultProps}
          notificationCount={0}
          totalUnreadMessages={0}
        />
      );
      const badges = screen.queryAllByTestId("badge");
      expect(badges).toHaveLength(0);
    });
  });
});
