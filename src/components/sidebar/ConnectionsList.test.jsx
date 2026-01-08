/**
 * Unit Tests for ConnectionsList Component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConnectionsList from "./ConnectionsList";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    button: ({ children, className, onClick }) => (
      <button
        className={className}
        onClick={onClick}
        data-testid="motion-button"
      >
        {children}
      </button>
    ),
    div: ({ children, className, onClick }) => (
      <div className={className} onClick={onClick} data-testid="motion-div">
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock icons
vi.mock("../icons", () => ({
  Users: ({ className }) => (
    <svg data-testid="users-icon" className={className}>
      <path d="M0 0" />
    </svg>
  ),
  ChevronDown: ({ className }) => (
    <svg data-testid="chevron-icon" className={className}>
      <path d="M0 0" />
    </svg>
  ),
}));

// Mock Avatar component
vi.mock("../common/Avatar", () => ({
  default: ({ src, alt, size, isOnline, showStatus, className }) => (
    <img
      src={src}
      alt={alt}
      data-testid="avatar"
      data-size={size}
      data-is-online={isOnline}
      data-show-status={showStatus}
      className={className}
    />
  ),
}));

describe("ConnectionsList", () => {
  const mockFriends = [
    {
      id: "friend-1",
      name: "Alice Smith",
      avatar: "https://example.com/alice.jpg",
      isOnline: true,
      lastSeen: "2 hours ago",
    },
    {
      id: "friend-2",
      name: "Bob Johnson",
      avatar: "https://example.com/bob.jpg",
      isOnline: false,
      lastSeen: "5 minutes ago",
    },
    {
      id: "friend-3",
      name: "Carol Williams",
      avatar: "https://example.com/carol.jpg",
      isOnline: true,
      lastSeen: "Online",
    },
  ];

  const defaultProps = {
    friends: mockFriends,
    showFriends: true,
    setShowFriends: vi.fn(),
    onFriendClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the component", () => {
      render(<ConnectionsList {...defaultProps} />);
      expect(screen.getByText("Connections")).toBeInTheDocument();
    });

    it("should render connections header", () => {
      render(<ConnectionsList {...defaultProps} />);
      expect(screen.getByText("Connections")).toBeInTheDocument();
    });

    it("should render users icon", () => {
      render(<ConnectionsList {...defaultProps} />);
      expect(screen.getByTestId("users-icon")).toBeInTheDocument();
    });

    it("should render chevron icon", () => {
      render(<ConnectionsList {...defaultProps} />);
      expect(screen.getByTestId("chevron-icon")).toBeInTheDocument();
    });

    it("should render friends count badge", () => {
      render(<ConnectionsList {...defaultProps} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should render all friend items when expanded", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      expect(screen.getByText("Carol Williams")).toBeInTheDocument();
    });

    it("should not render friend items when collapsed", () => {
      render(<ConnectionsList {...defaultProps} showFriends={false} />);
      expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
      expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
    });

    it("should render avatars for all friends when expanded", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const avatars = screen.getAllByTestId("avatar");
      expect(avatars).toHaveLength(3);
    });
  });

  describe("toggle behavior", () => {
    it("should call setShowFriends when header is clicked", () => {
      const setShowFriends = vi.fn();
      render(
        <ConnectionsList {...defaultProps} setShowFriends={setShowFriends} />,
      );

      fireEvent.click(screen.getByText("Connections"));
      expect(setShowFriends).toHaveBeenCalled();
    });

    it("should toggle from true to false when clicked", () => {
      const setShowFriends = vi.fn();
      render(
        <ConnectionsList
          {...defaultProps}
          showFriends={true}
          setShowFriends={setShowFriends}
        />,
      );

      fireEvent.click(screen.getByText("Connections"));
      expect(setShowFriends).toHaveBeenCalledWith(false);
    });

    it("should toggle from false to true when clicked", () => {
      const setShowFriends = vi.fn();
      render(
        <ConnectionsList
          {...defaultProps}
          showFriends={false}
          setShowFriends={setShowFriends}
        />,
      );

      fireEvent.click(screen.getByText("Connections"));
      expect(setShowFriends).toHaveBeenCalledWith(true);
    });

    it("should handle multiple toggle clicks", () => {
      const setShowFriends = vi.fn();
      render(
        <ConnectionsList
          {...defaultProps}
          showFriends={true}
          setShowFriends={setShowFriends}
        />,
      );

      fireEvent.click(screen.getByText("Connections"));
      fireEvent.click(screen.getByText("Connections"));
      fireEvent.click(screen.getByText("Connections"));

      expect(setShowFriends).toHaveBeenCalledTimes(3);
    });
  });

  describe("friend click handling", () => {
    it("should call onFriendClick when a friend is clicked", () => {
      const onFriendClick = vi.fn();
      render(
        <ConnectionsList
          {...defaultProps}
          showFriends={true}
          onFriendClick={onFriendClick}
        />,
      );

      fireEvent.click(screen.getByText("Alice Smith"));
      expect(onFriendClick).toHaveBeenCalledWith(mockFriends[0]);
    });

    it("should pass the correct friend object to onFriendClick", () => {
      const onFriendClick = vi.fn();
      render(
        <ConnectionsList
          {...defaultProps}
          showFriends={true}
          onFriendClick={onFriendClick}
        />,
      );

      fireEvent.click(screen.getByText("Bob Johnson"));
      expect(onFriendClick).toHaveBeenCalledWith(mockFriends[1]);
    });

    it("should handle clicking different friends", () => {
      const onFriendClick = vi.fn();
      render(
        <ConnectionsList
          {...defaultProps}
          showFriends={true}
          onFriendClick={onFriendClick}
        />,
      );

      fireEvent.click(screen.getByText("Alice Smith"));
      fireEvent.click(screen.getByText("Carol Williams"));

      expect(onFriendClick).toHaveBeenCalledTimes(2);
      expect(onFriendClick).toHaveBeenNthCalledWith(1, mockFriends[0]);
      expect(onFriendClick).toHaveBeenNthCalledWith(2, mockFriends[2]);
    });

    it("should not throw when onFriendClick is not provided", () => {
      expect(() => {
        render(
          <ConnectionsList
            {...defaultProps}
            showFriends={true}
            onFriendClick={undefined}
          />,
        );
        fireEvent.click(screen.getByText("Alice Smith"));
      }).not.toThrow();
    });
  });

  describe("online status display", () => {
    it("should display Online for online friends", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const onlineStatuses = screen.getAllByText("Online");
      expect(onlineStatuses.length).toBeGreaterThan(0);
    });

    it("should display lastSeen for offline friends", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
    });

    it("should pass isOnline prop to Avatar", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const avatars = screen.getAllByTestId("avatar");

      // First friend is online
      expect(avatars[0]).toHaveAttribute("data-is-online", "true");
      // Second friend is offline
      expect(avatars[1]).toHaveAttribute("data-is-online", "false");
    });

    it("should pass showStatus as true to Avatar", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const avatars = screen.getAllByTestId("avatar");
      avatars.forEach((avatar) => {
        expect(avatar).toHaveAttribute("data-show-status", "true");
      });
    });
  });

  describe("friends count", () => {
    it("should display correct count for multiple friends", () => {
      render(<ConnectionsList {...defaultProps} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should display 0 for empty friends list", () => {
      render(<ConnectionsList {...defaultProps} friends={[]} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should display 1 for single friend", () => {
      render(<ConnectionsList {...defaultProps} friends={[mockFriends[0]]} />);
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should display large count correctly", () => {
      const manyFriends = Array.from({ length: 50 }, (_, i) => ({
        id: `friend-${i}`,
        name: `Friend ${i}`,
        avatar: `https://example.com/friend${i}.jpg`,
        isOnline: i % 2 === 0,
        lastSeen: "Recently",
      }));
      render(<ConnectionsList {...defaultProps} friends={manyFriends} />);
      expect(screen.getByText("50")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have border-t class on container", () => {
      const { container } = render(<ConnectionsList {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("border-t");
    });

    it("should have border-slate-100 class on container", () => {
      const { container } = render(<ConnectionsList {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("border-slate-100");
    });

    it("should have dark:border-slate-700 class on container", () => {
      const { container } = render(<ConnectionsList {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("dark:border-slate-700");
    });

    it("should have pt-4 class on container", () => {
      const { container } = render(<ConnectionsList {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("pt-4");
    });

    it("should have transition-colors class on container", () => {
      const { container } = render(<ConnectionsList {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("transition-colors");
    });
  });

  describe("header button styling", () => {
    it("should have w-full class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const button = screen.getByTestId("motion-button");
      expect(button).toHaveClass("w-full");
    });

    it("should have flex layout", () => {
      render(<ConnectionsList {...defaultProps} />);
      const button = screen.getByTestId("motion-button");
      expect(button).toHaveClass("flex");
      expect(button).toHaveClass("items-center");
    });

    it("should have justify-between class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const button = screen.getByTestId("motion-button");
      expect(button).toHaveClass("justify-between");
    });

    it("should have rounded-xl class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const button = screen.getByTestId("motion-button");
      expect(button).toHaveClass("rounded-xl");
    });

    it("should have hover:bg-slate-50 class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const button = screen.getByTestId("motion-button");
      expect(button).toHaveClass("hover:bg-slate-50");
    });

    it("should have transition-colors class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const button = screen.getByTestId("motion-button");
      expect(button).toHaveClass("transition-colors");
    });

    it("should have transition-colors class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const button = screen.getByTestId("motion-button");
      expect(button).toHaveClass("transition-colors");
    });
  });

  describe("icon styling", () => {
    it("should have w-5 h-5 classes on users icon", () => {
      render(<ConnectionsList {...defaultProps} />);
      const usersIcon = screen.getByTestId("users-icon");
      expect(usersIcon).toHaveClass("w-5");
      expect(usersIcon).toHaveClass("h-5");
    });

    it("should have w-4 h-4 classes on chevron icon", () => {
      render(<ConnectionsList {...defaultProps} />);
      const chevronIcon = screen.getByTestId("chevron-icon");
      expect(chevronIcon).toHaveClass("w-4");
      expect(chevronIcon).toHaveClass("h-4");
    });

    it("should have text-slate-500 class on users icon", () => {
      render(<ConnectionsList {...defaultProps} />);
      const usersIcon = screen.getByTestId("users-icon");
      expect(usersIcon).toHaveClass("text-slate-500");
    });

    it("should have text-slate-400 class on chevron icon", () => {
      render(<ConnectionsList {...defaultProps} />);
      const chevronIcon = screen.getByTestId("chevron-icon");
      expect(chevronIcon).toHaveClass("text-slate-400");
    });
  });

  describe("label styling", () => {
    it("should have font-medium class on label", () => {
      render(<ConnectionsList {...defaultProps} />);
      const label = screen.getByText("Connections");
      expect(label).toHaveClass("font-medium");
    });

    it("should have text-sm class on label", () => {
      render(<ConnectionsList {...defaultProps} />);
      const label = screen.getByText("Connections");
      expect(label).toHaveClass("text-sm");
    });

    it("should have text-slate-700 class on label", () => {
      render(<ConnectionsList {...defaultProps} />);
      const label = screen.getByText("Connections");
      expect(label).toHaveClass("text-slate-700");
    });

    it("should have dark:text-slate-300 class on label", () => {
      render(<ConnectionsList {...defaultProps} />);
      const label = screen.getByText("Connections");
      expect(label).toHaveClass("dark:text-slate-300");
    });

    it("should have transition-colors class on label", () => {
      render(<ConnectionsList {...defaultProps} />);
      const label = screen.getByText("Connections");
      expect(label).toHaveClass("transition-colors");
    });
  });

  describe("count badge styling", () => {
    it("should have text-xs class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("text-xs");
    });

    it("should have text-slate-400 class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("text-slate-400");
    });

    it("should have bg-slate-100 class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("bg-slate-100");
    });

    it("should have rounded-full class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("rounded-full");
    });

    it("should have px-2 py-0.5 padding", () => {
      render(<ConnectionsList {...defaultProps} />);
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("px-2");
      expect(badge).toHaveClass("py-0.5");
    });

    it("should have transition-colors class", () => {
      render(<ConnectionsList {...defaultProps} />);
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("transition-colors");
    });
  });

  describe("friend item styling", () => {
    it("should have flex layout on friend item", () => {
      const { container } = render(
        <ConnectionsList {...defaultProps} showFriends={true} />,
      );
      const friendItems = container.querySelectorAll(
        ".flex.items-center.gap-3",
      );
      expect(friendItems.length).toBeGreaterThan(0);
    });

    it("should have gap-3 class on friend item", () => {
      const { container } = render(
        <ConnectionsList {...defaultProps} showFriends={true} />,
      );
      const friendItems = container.querySelectorAll(".gap-3");
      expect(friendItems.length).toBeGreaterThan(0);
    });

    it("should have rounded-lg class on friend item", () => {
      const { container } = render(
        <ConnectionsList {...defaultProps} showFriends={true} />,
      );
      const friendItems = container.querySelectorAll(".rounded-lg");
      expect(friendItems.length).toBeGreaterThan(0);
    });

    it("should have hover:bg-slate-50 class on friend item", () => {
      const { container } = render(
        <ConnectionsList {...defaultProps} showFriends={true} />,
      );
      const friendItems = container.querySelectorAll(".hover\\:bg-slate-50");
      expect(friendItems.length).toBeGreaterThan(0);
    });

    it("should have transition-colors class on friend item", () => {
      const { container } = render(
        <ConnectionsList {...defaultProps} showFriends={true} />,
      );
      const friendItems = container.querySelectorAll(".transition-colors");
      expect(friendItems.length).toBeGreaterThan(0);
    });

    it("should have cursor-pointer class on connection item", () => {
      const { container } = render(
        <ConnectionsList {...defaultProps} showFriends={true} />,
      );
      const connectionItems = container.querySelectorAll(".cursor-pointer");
      expect(connectionItems.length).toBeGreaterThan(0);
    });
  });

  describe("friend name styling", () => {
    it("should have font-medium class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const name = screen.getByText("Alice Smith");
      expect(name).toHaveClass("font-medium");
    });

    it("should have text-slate-900 class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const name = screen.getByText("Alice Smith");
      expect(name).toHaveClass("text-slate-900");
    });

    it("should have dark:text-white class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const name = screen.getByText("Alice Smith");
      expect(name).toHaveClass("dark:text-white");
    });

    it("should have truncate class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const name = screen.getByText("Alice Smith");
      expect(name).toHaveClass("truncate");
    });

    it("should have text-sm class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const name = screen.getByText("Alice Smith");
      expect(name).toHaveClass("text-sm");
    });

    it("should have transition-colors class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const name = screen.getByText("Alice Smith");
      expect(name).toHaveClass("transition-colors");
    });
  });

  describe("status text styling", () => {
    it("should have text-xs class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const status = screen.getByText("5 minutes ago");
      expect(status).toHaveClass("text-xs");
    });

    it("should have text-slate-500 class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const status = screen.getByText("5 minutes ago");
      expect(status).toHaveClass("text-slate-500");
    });

    it("should have dark:text-slate-400 class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const status = screen.getByText("5 minutes ago");
      expect(status).toHaveClass("dark:text-slate-400");
    });

    it("should have truncate class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const status = screen.getByText("5 minutes ago");
      expect(status).toHaveClass("truncate");
    });

    it("should have transition-colors class", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const status = screen.getByText("5 minutes ago");
      expect(status).toHaveClass("transition-colors");
    });
  });

  describe("edge cases", () => {
    it("should handle empty friends list", () => {
      render(
        <ConnectionsList {...defaultProps} friends={[]} showFriends={true} />,
      );
      expect(screen.getByText("Connections")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle long friend names", () => {
      const longNameFriend = [
        {
          id: "long-name",
          name: "A Very Long Friend Name That Should Be Truncated",
          avatar: "https://example.com/avatar.jpg",
          isOnline: true,
          lastSeen: "Online",
        },
      ];
      render(
        <ConnectionsList
          {...defaultProps}
          friends={longNameFriend}
          showFriends={true}
        />,
      );
      expect(
        screen.getByText("A Very Long Friend Name That Should Be Truncated"),
      ).toBeInTheDocument();
    });

    it("should handle special characters in friend names", () => {
      const specialNameFriend = [
        {
          id: "special",
          name: "John & Jane <Doe>",
          avatar: "https://example.com/avatar.jpg",
          isOnline: true,
          lastSeen: "Online",
        },
      ];
      render(
        <ConnectionsList
          {...defaultProps}
          friends={specialNameFriend}
          showFriends={true}
        />,
      );
      expect(screen.getByText("John & Jane <Doe>")).toBeInTheDocument();
    });

    it("should handle emoji in friend names", () => {
      const emojiFriend = [
        {
          id: "emoji",
          name: "Friend 👋",
          avatar: "https://example.com/avatar.jpg",
          isOnline: true,
          lastSeen: "Online",
        },
      ];
      render(
        <ConnectionsList
          {...defaultProps}
          friends={emojiFriend}
          showFriends={true}
        />,
      );
      expect(screen.getByText("Friend 👋")).toBeInTheDocument();
    });

    it("should handle missing avatar gracefully", () => {
      const noAvatarFriend = [
        {
          id: "no-avatar",
          name: "No Avatar",
          avatar: "",
          isOnline: true,
          lastSeen: "Online",
        },
      ];
      expect(() => {
        render(
          <ConnectionsList
            {...defaultProps}
            friends={noAvatarFriend}
            showFriends={true}
          />,
        );
      }).not.toThrow();
    });

    it("should handle undefined lastSeen for offline friend", () => {
      const noLastSeenFriend = [
        {
          id: "no-last-seen",
          name: "No Last Seen",
          avatar: "https://example.com/avatar.jpg",
          isOnline: false,
          lastSeen: undefined,
        },
      ];
      expect(() => {
        render(
          <ConnectionsList
            {...defaultProps}
            friends={noLastSeenFriend}
            showFriends={true}
          />,
        );
      }).not.toThrow();
    });
  });

  describe("avatar configuration", () => {
    it("should pass md size to Avatar", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const avatars = screen.getAllByTestId("avatar");
      avatars.forEach((avatar) => {
        expect(avatar).toHaveAttribute("data-size", "md");
      });
    });

    it("should pass correct src to Avatar", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const avatars = screen.getAllByTestId("avatar");
      expect(avatars[0]).toHaveAttribute(
        "src",
        "https://example.com/alice.jpg",
      );
      expect(avatars[1]).toHaveAttribute("src", "https://example.com/bob.jpg");
      expect(avatars[2]).toHaveAttribute(
        "src",
        "https://example.com/carol.jpg",
      );
    });

    it("should pass correct alt to Avatar", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      const avatars = screen.getAllByTestId("avatar");
      expect(avatars[0]).toHaveAttribute("alt", "Alice Smith");
      expect(avatars[1]).toHaveAttribute("alt", "Bob Johnson");
      expect(avatars[2]).toHaveAttribute("alt", "Carol Williams");
    });
  });

  describe("scrollable list", () => {
    it("should have max-h-60 class on list container when expanded", () => {
      const { container } = render(
        <ConnectionsList {...defaultProps} showFriends={true} />,
      );
      const listContainer = container.querySelector(".max-h-60");
      expect(listContainer).toBeInTheDocument();
    });

    it("should have overflow-y-auto class on list container", () => {
      const { container } = render(
        <ConnectionsList {...defaultProps} showFriends={true} />,
      );
      const listContainer = container.querySelector(".overflow-y-auto");
      expect(listContainer).toBeInTheDocument();
    });

    it("should have custom-scrollbar class on list container", () => {
      const { container } = render(
        <ConnectionsList {...defaultProps} showFriends={true} />,
      );
      const listContainer = container.querySelector(".custom-scrollbar");
      expect(listContainer).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have clickable header button", () => {
      render(<ConnectionsList {...defaultProps} />);
      const button = screen.getByTestId("motion-button");
      expect(button.tagName).toBe("BUTTON");
    });

    it("should have visible connection label", () => {
      render(<ConnectionsList {...defaultProps} />);
      expect(screen.getByText("Connections")).toBeVisible();
    });

    it("should have visible friend names when expanded", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      expect(screen.getByText("Alice Smith")).toBeVisible();
      expect(screen.getByText("Bob Johnson")).toBeVisible();
      expect(screen.getByText("Carol Williams")).toBeVisible();
    });

    it("should have accessible avatar images with alt text", () => {
      render(<ConnectionsList {...defaultProps} showFriends={true} />);
      expect(screen.getByAltText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByAltText("Bob Johnson")).toBeInTheDocument();
      expect(screen.getByAltText("Carol Williams")).toBeInTheDocument();
    });
  });
});
