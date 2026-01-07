/**
 * Unit Tests for UserProfileCard Component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UserProfileCard from "./UserProfileCard";

// Mock user data
const mockUser = {
  id: "1",
  name: "John Doe",
  username: "@johndoe",
  profession: "Software Engineer",
  location: "San Francisco, CA",
};

const mockAvatar = "https://example.com/avatar.jpg";

describe("UserProfileCard", () => {
  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });

    it("should render user name", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render user profession", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });

    it("should render avatar image", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      const avatar = screen.getByAltText(mockUser.name);
      expect(avatar).toBeInTheDocument();
    });

    it("should render with default stats when not provided", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      expect(screen.getByText("142")).toBeInTheDocument();
      expect(screen.getByText("24.7K")).toBeInTheDocument();
      expect(screen.getByText("318")).toBeInTheDocument();
    });

    it("should render with custom stats when provided", () => {
      const customStats = {
        posts: 500,
        followers: "100K",
        following: 1000,
      };
      render(
        <UserProfileCard
          user={mockUser}
          avatar={mockAvatar}
          stats={customStats}
        />,
      );
      expect(screen.getByText("500")).toBeInTheDocument();
      expect(screen.getByText("100K")).toBeInTheDocument();
      expect(screen.getByText("1000")).toBeInTheDocument();
    });
  });

  describe("stats section", () => {
    it("should render Posts label", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      expect(screen.getByText("Posts")).toBeInTheDocument();
    });

    it("should render Followers label", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      expect(screen.getByText("Followers")).toBeInTheDocument();
    });

    it("should render Following label", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      expect(screen.getByText("Following")).toBeInTheDocument();
    });

    it("should display stats in a 3-column grid", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      const grid = container.querySelector(".grid-cols-3");
      expect(grid).toBeInTheDocument();
    });

    it("should handle numeric stats", () => {
      const numericStats = {
        posts: 0,
        followers: 999,
        following: 50,
      };
      render(
        <UserProfileCard
          user={mockUser}
          avatar={mockAvatar}
          stats={numericStats}
        />,
      );
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("999")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("should handle string stats (formatted numbers)", () => {
      const stringStats = {
        posts: "1.2K",
        followers: "5.5M",
        following: "2.3K",
      };
      render(
        <UserProfileCard
          user={mockUser}
          avatar={mockAvatar}
          stats={stringStats}
        />,
      );
      expect(screen.getByText("1.2K")).toBeInTheDocument();
      expect(screen.getByText("5.5M")).toBeInTheDocument();
      expect(screen.getByText("2.3K")).toBeInTheDocument();
    });
  });

  describe("click handling", () => {
    it("should call onClick when card is clicked", () => {
      const handleClick = vi.fn();
      render(
        <UserProfileCard
          user={mockUser}
          avatar={mockAvatar}
          onClick={handleClick}
        />,
      );

      const card = screen
        .getByText(mockUser.name)
        .closest('div[class*="rounded-2xl"]');
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not throw when clicked without onClick handler", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);

      const card = screen
        .getByText(mockUser.name)
        .closest('div[class*="rounded-2xl"]');

      expect(() => {
        fireEvent.click(card);
      }).not.toThrow();
    });

    it("should have cursor-pointer class", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      const card = container.querySelector(".cursor-pointer");
      expect(card).toBeInTheDocument();
    });
  });

  describe("animated prop", () => {
    it("should render with animation by default", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      // When animated, the component uses motion.div which adds style attributes
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    it("should render without animation when animated is false", () => {
      const { container } = render(
        <UserProfileCard
          user={mockUser}
          avatar={mockAvatar}
          animated={false}
        />,
      );
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    it("should still be clickable when not animated", () => {
      const handleClick = vi.fn();
      render(
        <UserProfileCard
          user={mockUser}
          avatar={mockAvatar}
          onClick={handleClick}
          animated={false}
        />,
      );

      const card = screen
        .getByText(mockUser.name)
        .closest('div[class*="rounded-2xl"]');
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("avatar", () => {
    it("should render Avatar component with correct props", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      const avatar = screen.getByAltText(mockUser.name);
      expect(avatar).toHaveAttribute("src", mockAvatar);
    });

    it("should show online status indicator", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      // Avatar should have showStatus and isOnline props
      const statusIndicator = container.querySelector(".bg-emerald-400");
      expect(statusIndicator).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have rounded-2xl class", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      const card = container.querySelector(".rounded-2xl");
      expect(card).toBeInTheDocument();
    });

    it("should have gradient background", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      const card = container.querySelector(".bg-gradient-to-br");
      expect(card).toBeInTheDocument();
    });

    it("should have padding", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      const card = container.querySelector(".p-4");
      expect(card).toBeInTheDocument();
    });

    it("should have margin bottom", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      const card = container.querySelector(".mb-6");
      expect(card).toBeInTheDocument();
    });

    it("should have border styling", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      const card = container.querySelector(".border");
      expect(card).toBeInTheDocument();
    });
  });

  describe("dark mode support", () => {
    it("should have dark mode classes on card", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      const card = container.querySelector(".dark\\:from-slate-800");
      expect(card).toBeInTheDocument();
    });

    it("should have dark mode classes on user name", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      const name = screen.getByText(mockUser.name);
      expect(name).toHaveClass("dark:text-white");
    });

    it("should have dark mode classes on profession", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      const profession = screen.getByText(mockUser.profession);
      expect(profession).toHaveClass("dark:text-slate-400");
    });

    it("should have transition-colors class for smooth theme changes", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      const name = screen.getByText(mockUser.name);
      expect(name).toHaveClass("transition-colors");
    });
  });

  describe("text truncation", () => {
    it("should truncate long user name", () => {
      const longNameUser = {
        ...mockUser,
        name: "Very Long User Name That Should Be Truncated",
      };
      render(<UserProfileCard user={longNameUser} avatar={mockAvatar} />);
      const name = screen.getByText(longNameUser.name);
      expect(name).toHaveClass("truncate");
    });

    it("should truncate long profession", () => {
      const longProfessionUser = {
        ...mockUser,
        profession: "Senior Principal Staff Software Engineer at Google",
      };
      render(<UserProfileCard user={longProfessionUser} avatar={mockAvatar} />);
      const profession = screen.getByText(longProfessionUser.profession);
      expect(profession).toHaveClass("truncate");
    });
  });

  describe("StatItem styling", () => {
    it("should have white background on stat items", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      const statItems = container.querySelectorAll(".bg-white");
      expect(statItems.length).toBeGreaterThan(0);
    });

    it("should have rounded corners on stat items", () => {
      const { container } = render(
        <UserProfileCard user={mockUser} avatar={mockAvatar} />,
      );
      const statItems = container.querySelectorAll(".rounded-lg");
      expect(statItems.length).toBeGreaterThan(0);
    });

    it("should have proper font styling on stat values", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      const statValue = screen.getByText("142");
      expect(statValue).toHaveClass("font-bold");
      expect(statValue).toHaveClass("text-sm");
    });

    it("should have proper font styling on stat labels", () => {
      render(<UserProfileCard user={mockUser} avatar={mockAvatar} />);
      const statLabel = screen.getByText("Posts");
      expect(statLabel).toHaveClass("text-slate-500");
    });
  });

  describe("combined props", () => {
    it("should handle all props together", () => {
      const handleClick = vi.fn();
      const customStats = {
        posts: 999,
        followers: "50K",
        following: 200,
      };

      render(
        <UserProfileCard
          user={mockUser}
          avatar={mockAvatar}
          onClick={handleClick}
          stats={customStats}
          animated={true}
        />,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.profession)).toBeInTheDocument();
      expect(screen.getByText("999")).toBeInTheDocument();
      expect(screen.getByText("50K")).toBeInTheDocument();
      expect(screen.getByText("200")).toBeInTheDocument();

      const card = screen
        .getByText(mockUser.name)
        .closest('div[class*="rounded-2xl"]');
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
