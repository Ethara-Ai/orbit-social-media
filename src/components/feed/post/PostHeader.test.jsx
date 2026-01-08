/**
 * Unit Tests for PostHeader Component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PostHeader from "./PostHeader";

// Mock the Avatar component
vi.mock("../../common/Avatar", () => ({
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

describe("PostHeader", () => {
  const mockUser = {
    name: "John Doe",
    avatar: "https://example.com/avatar.jpg",
    isOnline: true,
  };

  const defaultProps = {
    user: mockUser,
    timestamp: "2 hours ago",
  };

  describe("rendering", () => {
    it("should render the component", () => {
      render(<PostHeader {...defaultProps} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render user name", () => {
      render(<PostHeader {...defaultProps} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render timestamp", () => {
      render(<PostHeader {...defaultProps} />);
      expect(screen.getByText("2 hours ago")).toBeInTheDocument();
    });

    it("should render avatar", () => {
      render(<PostHeader {...defaultProps} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toBeInTheDocument();
    });
  });

  describe("avatar", () => {
    it("should pass correct src to Avatar", () => {
      render(<PostHeader {...defaultProps} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });

    it("should pass correct alt to Avatar", () => {
      render(<PostHeader {...defaultProps} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveAttribute("alt", "John Doe");
    });

    it("should pass md size to Avatar", () => {
      render(<PostHeader {...defaultProps} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveAttribute("data-size", "md");
    });

    it("should pass isOnline prop to Avatar", () => {
      render(<PostHeader {...defaultProps} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveAttribute("data-is-online", "true");
    });

    it("should pass showStatus as true to Avatar", () => {
      render(<PostHeader {...defaultProps} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveAttribute("data-show-status", "true");
    });

    it("should handle offline user", () => {
      const offlineUser = { ...mockUser, isOnline: false };
      render(<PostHeader {...defaultProps} user={offlineUser} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveAttribute("data-is-online", "false");
    });

    it("should apply correct className to Avatar", () => {
      render(<PostHeader {...defaultProps} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveClass("w-9");
      expect(avatar).toHaveClass("h-9");
      expect(avatar).toHaveClass("shrink-0");
    });
  });

  describe("user name styling", () => {
    it("should have font-semibold class", () => {
      render(<PostHeader {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("font-semibold");
    });

    it("should have text-slate-900 class", () => {
      render(<PostHeader {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("text-slate-900");
    });

    it("should have truncate class for overflow handling", () => {
      render(<PostHeader {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("truncate");
    });

    it("should have transition-colors class", () => {
      render(<PostHeader {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("transition-colors");
    });
  });

  describe("timestamp styling", () => {
    it("should have text-slate-500 class", () => {
      render(<PostHeader {...defaultProps} />);
      const timestamp = screen.getByText("2 hours ago");
      expect(timestamp).toHaveClass("text-slate-500");
    });

    it("should have transition-colors class", () => {
      render(<PostHeader {...defaultProps} />);
      const timestamp = screen.getByText("2 hours ago");
      expect(timestamp).toHaveClass("transition-colors");
    });
  });

  describe("layout", () => {
    it("should have padding classes on container", () => {
      const { container } = render(<PostHeader {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("px-4");
      expect(wrapper).toHaveClass("py-3");
    });

    it("should have flex layout for content", () => {
      const { container } = render(<PostHeader {...defaultProps} />);
      const flexContainer = container.querySelector(".flex.items-center.gap-2");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have flex-1 on content area", () => {
      const { container } = render(<PostHeader {...defaultProps} />);
      const contentArea = container.querySelector(".flex-1.min-w-0");
      expect(contentArea).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle long user name", () => {
      const longNameUser = {
        ...mockUser,
        name: "This Is A Very Long User Name That Should Be Truncated",
      };
      render(<PostHeader {...defaultProps} user={longNameUser} />);
      expect(
        screen.getByText(
          "This Is A Very Long User Name That Should Be Truncated",
        ),
      ).toBeInTheDocument();
    });

    it("should handle empty timestamp", () => {
      render(<PostHeader {...defaultProps} timestamp="" />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should handle special characters in user name", () => {
      const specialCharUser = {
        ...mockUser,
        name: "John & Jane <Doe>",
      };
      render(<PostHeader {...defaultProps} user={specialCharUser} />);
      expect(screen.getByText("John & Jane <Doe>")).toBeInTheDocument();
    });

    it("should handle emoji in user name", () => {
      const emojiUser = {
        ...mockUser,
        name: "John 👋 Doe",
      };
      render(<PostHeader {...defaultProps} user={emojiUser} />);
      expect(screen.getByText("John 👋 Doe")).toBeInTheDocument();
    });

    it("should handle missing avatar gracefully", () => {
      const noAvatarUser = {
        ...mockUser,
        avatar: "",
      };
      expect(() => {
        render(<PostHeader {...defaultProps} user={noAvatarUser} />);
      }).not.toThrow();
    });

    it("should handle undefined isOnline", () => {
      const noStatusUser = {
        name: "John Doe",
        avatar: "https://example.com/avatar.jpg",
      };
      expect(() => {
        render(<PostHeader {...defaultProps} user={noStatusUser} />);
      }).not.toThrow();
    });

    it("should handle relative timestamps", () => {
      render(<PostHeader {...defaultProps} timestamp="Just now" />);
      expect(screen.getByText("Just now")).toBeInTheDocument();
    });

    it("should handle absolute timestamps", () => {
      render(<PostHeader {...defaultProps} timestamp="Jan 1, 2024" />);
      expect(screen.getByText("Jan 1, 2024")).toBeInTheDocument();
    });
  });

  describe("dark mode classes", () => {
    it("should have dark mode class for user name", () => {
      render(<PostHeader {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("dark:text-white");
    });

    it("should have dark mode class for timestamp", () => {
      render(<PostHeader {...defaultProps} />);
      const timestamp = screen.getByText("2 hours ago");
      expect(timestamp).toHaveClass("dark:text-slate-400");
    });
  });

  describe("responsive classes", () => {
    it("should have padding classes on container", () => {
      const { container } = render(<PostHeader {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("px-4");
      expect(wrapper).toHaveClass("py-3");
    });

    it("should have responsive gap classes", () => {
      const { container } = render(<PostHeader {...defaultProps} />);
      const flexContainer = container.querySelector(".gap-2.sm\\:gap-2\\.5");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have responsive text sizes for user name", () => {
      render(<PostHeader {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("text-xs");
      expect(userName).toHaveClass("sm:text-sm");
    });

    it("should have responsive text sizes for timestamp", () => {
      render(<PostHeader {...defaultProps} />);
      const timestamp = screen.getByText("2 hours ago");
      expect(timestamp.className).toMatch(/text-\[10px\]/);
      expect(timestamp).toHaveClass("sm:text-xs");
    });

    it("should have responsive avatar sizes", () => {
      render(<PostHeader {...defaultProps} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveClass("sm:w-11");
      expect(avatar).toHaveClass("sm:h-11");
    });
  });

  describe("structure", () => {
    it("should render h3 tag for user name", () => {
      render(<PostHeader {...defaultProps} />);
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveTextContent("John Doe");
    });

    it("should render p tag for timestamp", () => {
      render(<PostHeader {...defaultProps} />);
      const timestamp = screen.getByText("2 hours ago");
      expect(timestamp.tagName).toBe("P");
    });
  });
});
