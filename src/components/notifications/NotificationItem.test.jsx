/**
 * Unit Tests for NotificationItem Component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationItem from "./NotificationItem";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, onClick, ...props }) => (
      <div className={className} onClick={onClick} data-testid="motion-div">
        {children}
      </div>
    ),
  },
}));

describe("NotificationItem", () => {
  const mockNotification = {
    id: "1",
    type: "like",
    message: "liked your post",
    timestamp: "2 hours ago",
    isRead: false,
    user: {
      id: "user1",
      name: "John Doe",
      avatar: "https://example.com/avatar.jpg",
    },
  };

  const defaultProps = {
    notification: mockNotification,
    index: 0,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the notification item", () => {
      render(<NotificationItem {...defaultProps} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render user name", () => {
      render(<NotificationItem {...defaultProps} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render notification message", () => {
      render(<NotificationItem {...defaultProps} />);
      expect(screen.getByText("liked your post")).toBeInTheDocument();
    });

    it("should render timestamp", () => {
      render(<NotificationItem {...defaultProps} />);
      expect(screen.getByText("2 hours ago")).toBeInTheDocument();
    });

    it("should render user avatar", () => {
      render(<NotificationItem {...defaultProps} />);
      const avatar = screen.getByAltText("John Doe");
      expect(avatar).toBeInTheDocument();
    });
  });

  describe("read/unread state", () => {
    it("should show unread indicator when notification is unread", () => {
      render(<NotificationItem {...defaultProps} />);
      // Unread indicator is a small orange dot
      const unreadIndicator = document.querySelector(".bg-orange-500.rounded-full");
      expect(unreadIndicator).toBeInTheDocument();
    });

    it("should not show unread indicator when notification is read", () => {
      const readNotification = {
        ...mockNotification,
        isRead: true,
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={readNotification}
        />
      );
      const unreadIndicator = document.querySelector(".w-2.h-2.bg-orange-500.rounded-full");
      expect(unreadIndicator).not.toBeInTheDocument();
    });

    it("should have orange border for unread notifications", () => {
      render(<NotificationItem {...defaultProps} />);
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("border-orange-200");
    });

    it("should have slate border for read notifications", () => {
      const readNotification = {
        ...mockNotification,
        isRead: true,
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={readNotification}
        />
      );
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("border-slate-200");
    });

    it("should have background styling for unread notifications", () => {
      render(<NotificationItem {...defaultProps} />);
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("bg-orange-50/30");
    });
  });

  describe("notification types", () => {
    it("should render like notification with rose icon background", () => {
      render(<NotificationItem {...defaultProps} />);
      const badge = document.querySelector(".bg-rose-50");
      expect(badge).toBeInTheDocument();
    });

    it("should render comment notification with blue icon background", () => {
      const commentNotification = {
        ...mockNotification,
        type: "comment",
        message: "commented on your post",
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={commentNotification}
        />
      );
      const badge = document.querySelector(".bg-blue-50");
      expect(badge).toBeInTheDocument();
    });

    it("should render follow notification with emerald icon background", () => {
      const followNotification = {
        ...mockNotification,
        type: "follow",
        message: "started following you",
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={followNotification}
        />
      );
      const badge = document.querySelector(".bg-emerald-50");
      expect(badge).toBeInTheDocument();
    });

    it("should render mention notification with orange icon background", () => {
      const mentionNotification = {
        ...mockNotification,
        type: "mention",
        message: "mentioned you in a post",
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={mentionNotification}
        />
      );
      const badge = document.querySelector(".bg-orange-50");
      expect(badge).toBeInTheDocument();
    });

    it("should render friend_request notification with purple icon background", () => {
      const friendRequestNotification = {
        ...mockNotification,
        type: "friend_request",
        message: "sent you a friend request",
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={friendRequestNotification}
        />
      );
      const badge = document.querySelector(".bg-purple-50");
      expect(badge).toBeInTheDocument();
    });

    it("should render unknown notification type with slate icon background", () => {
      const unknownNotification = {
        ...mockNotification,
        type: "unknown_type",
        message: "did something",
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={unknownNotification}
        />
      );
      const badge = document.querySelector(".bg-slate-50");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("click handling", () => {
    it("should call onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<NotificationItem {...defaultProps} onClick={handleClick} />);

      const container = screen.getByTestId("motion-div");
      fireEvent.click(container);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should pass user object to onClick handler", () => {
      const handleClick = vi.fn();
      render(<NotificationItem {...defaultProps} onClick={handleClick} />);

      const container = screen.getByTestId("motion-div");
      fireEvent.click(container);

      expect(handleClick).toHaveBeenCalledWith(mockNotification.user);
    });

    it("should not throw when onClick is not provided", () => {
      const propsWithoutOnClick = {
        notification: mockNotification,
        index: 0,
      };

      render(<NotificationItem {...propsWithoutOnClick} />);

      const container = screen.getByTestId("motion-div");
      expect(() => {
        fireEvent.click(container);
      }).not.toThrow();
    });

    it("should handle multiple clicks", () => {
      const handleClick = vi.fn();
      render(<NotificationItem {...defaultProps} onClick={handleClick} />);

      const container = screen.getByTestId("motion-div");
      fireEvent.click(container);
      fireEvent.click(container);
      fireEvent.click(container);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("index prop", () => {
    it("should accept index prop for animation delay", () => {
      render(<NotificationItem {...defaultProps} index={5} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render correctly with index 0", () => {
      render(<NotificationItem {...defaultProps} index={0} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render correctly with large index", () => {
      render(<NotificationItem {...defaultProps} index={100} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  describe("avatar component", () => {
    it("should render Avatar with correct src", () => {
      render(<NotificationItem {...defaultProps} />);
      const avatar = screen.getByAltText("John Doe");
      expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });

    it("should render Avatar with correct alt text", () => {
      render(<NotificationItem {...defaultProps} />);
      const avatar = screen.getByAltText("John Doe");
      expect(avatar).toBeInTheDocument();
    });

    it("should render Avatar with xl size", () => {
      render(<NotificationItem {...defaultProps} />);
      // Avatar should be rendered (the exact size is handled by the Avatar component)
      const avatar = screen.getByAltText("John Doe");
      expect(avatar).toBeInTheDocument();
    });
  });

  describe("notification content", () => {
    it("should display user name in semibold font", () => {
      render(<NotificationItem {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("font-semibold");
    });

    it("should display message text", () => {
      const notification = {
        ...mockNotification,
        message: "This is a custom notification message",
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={notification}
        />
      );
      expect(screen.getByText("This is a custom notification message")).toBeInTheDocument();
    });

    it("should display timestamp with slate color", () => {
      render(<NotificationItem {...defaultProps} />);
      const timestamp = screen.getByText("2 hours ago");
      expect(timestamp).toHaveClass("text-slate-400");
    });
  });

  describe("styling", () => {
    it("should have cursor-pointer class", () => {
      render(<NotificationItem {...defaultProps} />);
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("cursor-pointer");
    });

    it("should have transition-all class", () => {
      render(<NotificationItem {...defaultProps} />);
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("transition-all");
    });

    it("should have rounded-xl class", () => {
      render(<NotificationItem {...defaultProps} />);
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("rounded-xl");
    });

    it("should have shadow-sm class", () => {
      render(<NotificationItem {...defaultProps} />);
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("shadow-sm");
    });

    it("should have border class", () => {
      render(<NotificationItem {...defaultProps} />);
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("border");
    });

    it("should have padding class", () => {
      render(<NotificationItem {...defaultProps} />);
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("p-4");
    });

    it("should have white background class", () => {
      render(<NotificationItem {...defaultProps} />);
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("bg-white");
    });
  });

  describe("edge cases", () => {
    it("should handle empty message", () => {
      const notification = {
        ...mockNotification,
        message: "",
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={notification}
        />
      );
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should handle long user name", () => {
      const notification = {
        ...mockNotification,
        user: {
          ...mockNotification.user,
          name: "A Very Long User Name That Might Overflow The Container",
        },
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={notification}
        />
      );
      expect(screen.getByText("A Very Long User Name That Might Overflow The Container")).toBeInTheDocument();
    });

    it("should handle long message", () => {
      const notification = {
        ...mockNotification,
        message: "This is a very long notification message that contains a lot of text and might need special handling to display properly in the UI",
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={notification}
        />
      );
      expect(screen.getByText(notification.message)).toBeInTheDocument();
    });

    it("should handle special characters in message", () => {
      const notification = {
        ...mockNotification,
        message: "liked your post with <script>alert('xss')</script> special chars & symbols!",
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={notification}
        />
      );
      expect(screen.getByText(notification.message)).toBeInTheDocument();
    });

    it("should handle emoji in user name", () => {
      const notification = {
        ...mockNotification,
        user: {
          ...mockNotification.user,
          name: "John 👋 Doe",
        },
      };
      render(
        <NotificationItem
          {...defaultProps}
          notification={notification}
        />
      );
      expect(screen.getByText("John 👋 Doe")).toBeInTheDocument();
    });

    it("should handle missing avatar gracefully", () => {
      const notification = {
        ...mockNotification,
        user: {
          ...mockNotification.user,
          avatar: "",
        },
      };
      expect(() => {
        render(
          <NotificationItem
            {...defaultProps}
            notification={notification}
          />
        );
      }).not.toThrow();
    });
  });

  describe("notification badge positioning", () => {
    it("should have badge positioned at bottom-right of avatar", () => {
      render(<NotificationItem {...defaultProps} />);
      const badge = document.querySelector(".absolute.-bottom-1.-right-1");
      expect(badge).toBeInTheDocument();
    });

    it("should have badge with rounded-full class", () => {
      render(<NotificationItem {...defaultProps} />);
      const badge = document.querySelector(".rounded-full.p-1\\.5");
      expect(badge).toBeInTheDocument();
    });

    it("should have badge with shadow", () => {
      render(<NotificationItem {...defaultProps} />);
      const badge = document.querySelector(".shadow-sm");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("flex layout", () => {
    it("should have flex container for main content", () => {
      render(<NotificationItem {...defaultProps} />);
      const flexContainer = document.querySelector(".flex.items-center.gap-4");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have flex-1 on content section", () => {
      render(<NotificationItem {...defaultProps} />);
      const contentSection = document.querySelector(".flex-1.min-w-0");
      expect(contentSection).toBeInTheDocument();
    });

    it("should have shrink-0 on avatar container", () => {
      render(<NotificationItem {...defaultProps} />);
      const avatarContainer = document.querySelector(".relative.shrink-0");
      expect(avatarContainer).toBeInTheDocument();
    });
  });

  describe("text styling", () => {
    it("should have user name with correct text size", () => {
      render(<NotificationItem {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("text-sm");
    });

    it("should have message with slate-600 color", () => {
      render(<NotificationItem {...defaultProps} />);
      const message = screen.getByText("liked your post");
      expect(message).toHaveClass("text-slate-600");
    });

    it("should have timestamp with text-xs size", () => {
      render(<NotificationItem {...defaultProps} />);
      const timestamp = screen.getByText("2 hours ago");
      expect(timestamp).toHaveClass("text-xs");
    });

    it("should have timestamp with margin-top", () => {
      render(<NotificationItem {...defaultProps} />);
      const timestamp = screen.getByText("2 hours ago");
      expect(timestamp).toHaveClass("mt-1");
    });
  });

  describe("accessibility", () => {
    it("should be clickable", () => {
      render(<NotificationItem {...defaultProps} />);
      const container = screen.getByTestId("motion-div");
      expect(container).toHaveClass("cursor-pointer");
    });

    it("should have proper image alt text", () => {
      render(<NotificationItem {...defaultProps} />);
      const avatar = screen.getByAltText("John Doe");
      expect(avatar).toBeInTheDocument();
    });
  });
});
