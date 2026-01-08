/**
 * Unit Tests for FriendItem Component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FriendItem from "./FriendItem";

// Mock friend data
const mockOnlineFriend = {
  id: "1",
  name: "Alice Johnson",
  avatar: "https://example.com/alice.jpg",
  isOnline: true,
  lastSeen: "2 hours ago",
};

const mockOfflineFriend = {
  id: "2",
  name: "Bob Smith",
  avatar: "https://example.com/bob.jpg",
  isOnline: false,
  lastSeen: "5 minutes ago",
};

describe("FriendItem", () => {
  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    it("should render friend name", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    it("should render avatar with correct alt text", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      const avatar = screen.getByAltText("Alice Johnson");
      expect(avatar).toBeInTheDocument();
    });

    it("should render avatar with correct src", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      const avatar = screen.getByAltText("Alice Johnson");
      expect(avatar).toHaveAttribute("src", mockOnlineFriend.avatar);
    });
  });

  describe("online status", () => {
    it('should display "Online" when friend is online', () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("should display lastSeen when friend is offline", () => {
      render(<FriendItem friend={mockOfflineFriend} index={0} />);
      expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
    });

    it('should not display "Online" for offline friend', () => {
      render(<FriendItem friend={mockOfflineFriend} index={0} />);
      expect(screen.queryByText("Online")).not.toBeInTheDocument();
    });

    it("should show online status indicator for online friend", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const statusIndicator = container.querySelector(".bg-emerald-400");
      expect(statusIndicator).toBeInTheDocument();
    });
  });

  describe("click handling", () => {
    it("should call onClick with friend data when clicked", () => {
      const handleClick = vi.fn();
      render(
        <FriendItem
          friend={mockOnlineFriend}
          index={0}
          onClick={handleClick}
        />,
      );

      const item = screen
        .getByText("Alice Johnson")
        .closest('div[class*="flex items-center"]');
      fireEvent.click(item);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(mockOnlineFriend);
    });

    it("should not throw when clicked without onClick handler", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);

      const item = screen
        .getByText("Alice Johnson")
        .closest('div[class*="flex items-center"]');

      expect(() => {
        fireEvent.click(item);
      }).not.toThrow();
    });

    it("should not call onClick when onClick is undefined", () => {
      const handleClick = vi.fn();
      render(<FriendItem friend={mockOnlineFriend} index={0} />);

      const item = screen
        .getByText("Alice Johnson")
        .closest('div[class*="flex items-center"]');
      fireEvent.click(item);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should handle multiple clicks", () => {
      const handleClick = vi.fn();
      render(
        <FriendItem
          friend={mockOnlineFriend}
          index={0}
          onClick={handleClick}
        />,
      );

      const item = screen
        .getByText("Alice Johnson")
        .closest('div[class*="flex items-center"]');
      fireEvent.click(item);
      fireEvent.click(item);
      fireEvent.click(item);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("styling", () => {
    it("should have flex layout class", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const item = container.querySelector(".flex");
      expect(item).toBeInTheDocument();
    });

    it("should have items-center class", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const item = container.querySelector(".items-center");
      expect(item).toBeInTheDocument();
    });

    it("should have gap-3 class", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const item = container.querySelector(".gap-3");
      expect(item).toBeInTheDocument();
    });

    it("should have padding class", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const item = container.querySelector(".p-2");
      expect(item).toBeInTheDocument();
    });

    it("should have rounded-lg class", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const item = container.querySelector(".rounded-lg");
      expect(item).toBeInTheDocument();
    });

    it("should have hover background class", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const item = container.querySelector(".hover\\:bg-slate-50");
      expect(item).toBeInTheDocument();
    });

    it("should have cursor-pointer class", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const item = container.querySelector(".cursor-pointer");
      expect(item).toBeInTheDocument();
    });

    it("should have transition-colors class", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const item = container.querySelector(".transition-colors");
      expect(item).toBeInTheDocument();
    });

    it("should have horizontal margin class", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const item = container.querySelector(".mx-2");
      expect(item).toBeInTheDocument();
    });
  });

  describe("text styling", () => {
    it("should have font-medium class on name", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      const name = screen.getByText("Alice Johnson");
      expect(name).toHaveClass("font-medium");
    });

    it("should have text-sm class on name", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      const name = screen.getByText("Alice Johnson");
      expect(name).toHaveClass("text-sm");
    });

    it("should have truncate class on name", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      const name = screen.getByText("Alice Johnson");
      expect(name).toHaveClass("truncate");
    });

    it("should have text-slate-900 class on name", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      const name = screen.getByText("Alice Johnson");
      expect(name).toHaveClass("text-slate-900");
    });

    it("should have text-xs class on status", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      const status = screen.getByText("Online");
      expect(status).toHaveClass("text-xs");
    });

    it("should have text-slate-500 class on status", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      const status = screen.getByText("Online");
      expect(status).toHaveClass("text-slate-500");
    });

    it("should have truncate class on status", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      const status = screen.getByText("Online");
      expect(status).toHaveClass("truncate");
    });
  });

  describe("content container", () => {
    it("should have flex-1 class on content container", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const contentContainer = container.querySelector(".flex-1");
      expect(contentContainer).toBeInTheDocument();
    });

    it("should have min-w-0 class for proper truncation", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      const contentContainer = container.querySelector(".min-w-0");
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe("index prop for animation", () => {
    it("should render with index 0", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    it("should render with index 5", () => {
      render(<FriendItem friend={mockOnlineFriend} index={5} />);
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    it("should render with index 10", () => {
      render(<FriendItem friend={mockOnlineFriend} index={10} />);
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });
  });

  describe("different friend data", () => {
    it("should handle long friend names", () => {
      const longNameFriend = {
        ...mockOnlineFriend,
        name: "Very Long Friend Name That Should Be Truncated",
      };
      render(<FriendItem friend={longNameFriend} index={0} />);
      expect(
        screen.getByText("Very Long Friend Name That Should Be Truncated"),
      ).toBeInTheDocument();
    });

    it("should handle empty lastSeen", () => {
      const friendWithEmptyLastSeen = {
        ...mockOfflineFriend,
        lastSeen: "",
      };
      render(<FriendItem friend={friendWithEmptyLastSeen} index={0} />);
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    });

    it("should handle long lastSeen text", () => {
      const friendWithLongLastSeen = {
        ...mockOfflineFriend,
        lastSeen: "Last seen a very long time ago on December 25th, 2023",
      };
      render(<FriendItem friend={friendWithLongLastSeen} index={0} />);
      expect(
        screen.getByText(
          "Last seen a very long time ago on December 25th, 2023",
        ),
      ).toBeInTheDocument();
    });

    it("should handle missing avatar gracefully", () => {
      const friendWithoutAvatar = {
        ...mockOnlineFriend,
        avatar: undefined,
      };
      render(<FriendItem friend={friendWithoutAvatar} index={0} />);
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });
  });

  describe("avatar props", () => {
    it("should pass correct size to Avatar", () => {
      render(<FriendItem friend={mockOnlineFriend} index={0} />);
      // Avatar with size "md" should have w-9 h-9 classes
      const avatar = screen.getByAltText("Alice Johnson");
      expect(avatar).toHaveClass("w-9", "h-9");
    });

    it("should pass showStatus as true to Avatar", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      // When showStatus is true and isOnline is true, status indicator should be visible
      const statusIndicator = container.querySelector(".bg-emerald-400");
      expect(statusIndicator).toBeInTheDocument();
    });

    it("should pass isOnline to Avatar", () => {
      const { container } = render(
        <FriendItem friend={mockOnlineFriend} index={0} />,
      );
      // Online status indicator should be present
      const statusIndicator = container.querySelector(".bg-emerald-400");
      expect(statusIndicator).toBeInTheDocument();
    });
  });

  describe("combined scenarios", () => {
    it("should handle online friend with click handler", () => {
      const handleClick = vi.fn();
      render(
        <FriendItem
          friend={mockOnlineFriend}
          index={0}
          onClick={handleClick}
        />,
      );

      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
      expect(screen.getByText("Online")).toBeInTheDocument();

      const item = screen
        .getByText("Alice Johnson")
        .closest('div[class*="flex items-center"]');
      fireEvent.click(item);

      expect(handleClick).toHaveBeenCalledWith(mockOnlineFriend);
    });

    it("should handle offline friend with click handler", () => {
      const handleClick = vi.fn();
      render(
        <FriendItem
          friend={mockOfflineFriend}
          index={0}
          onClick={handleClick}
        />,
      );

      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
      expect(screen.getByText("5 minutes ago")).toBeInTheDocument();

      const item = screen
        .getByText("Bob Smith")
        .closest('div[class*="flex items-center"]');
      fireEvent.click(item);

      expect(handleClick).toHaveBeenCalledWith(mockOfflineFriend);
    });

    it("should render multiple friend items", () => {
      const handleClick = vi.fn();
      render(
        <>
          <FriendItem
            friend={mockOnlineFriend}
            index={0}
            onClick={handleClick}
          />
          <FriendItem
            friend={mockOfflineFriend}
            index={1}
            onClick={handleClick}
          />
        </>,
      );

      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
      expect(screen.getByText("Online")).toBeInTheDocument();
      expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
    });
  });
});
