/**
 * Unit Tests for FeaturedSection Component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FeaturedSection from "./FeaturedSection";

// Mock FeaturedPostCard component
vi.mock("./FeaturedPostCard", () => ({
  default: ({ post, index, onClick }) => (
    <div
      data-testid={`featured-post-card-${post.id}`}
      data-index={index}
      onClick={() => onClick(post)}
    >
      {post.title}
    </div>
  ),
}));

// Mock icons
vi.mock("../icons", () => ({
  Fire: ({ className }) => (
    <svg data-testid="fire-icon" className={className} />
  ),
}));

describe("FeaturedSection", () => {
  const mockPosts = [
    {
      id: "1",
      title: "First Featured Post",
      image: "https://example.com/image1.jpg",
      user: { name: "John Doe", avatar: "https://example.com/avatar1.jpg" },
      likes: 1500,
      isLiked: false,
    },
    {
      id: "2",
      title: "Second Featured Post",
      image: "https://example.com/image2.jpg",
      user: { name: "Jane Smith", avatar: "https://example.com/avatar2.jpg" },
      likes: 2500,
      isLiked: true,
    },
  ];

  const defaultProps = {
    posts: mockPosts,
    onPostClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the component", () => {
      render(<FeaturedSection {...defaultProps} />);
      expect(screen.getByText("Trending Now")).toBeInTheDocument();
    });

    it("should render the section title", () => {
      render(<FeaturedSection {...defaultProps} />);
      expect(screen.getByText("Trending Now")).toBeInTheDocument();
    });

    it("should render the fire icon", () => {
      render(<FeaturedSection {...defaultProps} />);
      expect(screen.getByTestId("fire-icon")).toBeInTheDocument();
    });

    it("should render all featured post cards", () => {
      render(<FeaturedSection {...defaultProps} />);
      expect(screen.getByTestId("featured-post-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("featured-post-card-2")).toBeInTheDocument();
    });

    it("should render correct number of post cards", () => {
      render(<FeaturedSection {...defaultProps} />);
      const cards = screen.getAllByTestId(/featured-post-card-/);
      expect(cards).toHaveLength(2);
    });
  });

  describe("FeaturedPostCard props", () => {
    it("should pass correct post to each card", () => {
      render(<FeaturedSection {...defaultProps} />);
      expect(screen.getByText("First Featured Post")).toBeInTheDocument();
      expect(screen.getByText("Second Featured Post")).toBeInTheDocument();
    });

    it("should pass correct index to each card", () => {
      render(<FeaturedSection {...defaultProps} />);
      const firstCard = screen.getByTestId("featured-post-card-1");
      const secondCard = screen.getByTestId("featured-post-card-2");
      expect(firstCard).toHaveAttribute("data-index", "0");
      expect(secondCard).toHaveAttribute("data-index", "1");
    });

    it("should pass onPostClick to each card", () => {
      const onPostClick = vi.fn();
      render(<FeaturedSection {...defaultProps} onPostClick={onPostClick} />);
      const firstCard = screen.getByTestId("featured-post-card-1");
      firstCard.click();
      expect(onPostClick).toHaveBeenCalledTimes(1);
      expect(onPostClick).toHaveBeenCalledWith(mockPosts[0]);
    });
  });

  describe("structure", () => {
    it("should render h2 tag for title", () => {
      render(<FeaturedSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Trending Now");
    });

    it("should have title and icon in same container", () => {
      render(<FeaturedSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      const icon = screen.getByTestId("fire-icon");
      expect(heading).toContainElement(icon);
    });
  });

  describe("styling", () => {
    it("should have mb-8 class on container", () => {
      const { container } = render(<FeaturedSection {...defaultProps} />);
      const section = container.firstChild;
      expect(section).toHaveClass("mb-8");
    });

    it("should have text-lg class on title", () => {
      render(<FeaturedSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("text-lg");
    });

    it("should have font-semibold class on title", () => {
      render(<FeaturedSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("font-semibold");
    });

    it("should have text-slate-900 class on title", () => {
      render(<FeaturedSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("text-slate-900");
    });

    it("should have mb-4 class on title", () => {
      render(<FeaturedSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("mb-4");
    });

    it("should have flex and gap classes on title", () => {
      render(<FeaturedSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("flex");
      expect(heading).toHaveClass("items-center");
      expect(heading).toHaveClass("gap-2");
    });

    it("should have transition-colors class on title", () => {
      render(<FeaturedSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("transition-colors");
    });
  });

  describe("fire icon styling", () => {
    it("should have w-5 h-5 size classes", () => {
      render(<FeaturedSection {...defaultProps} />);
      const icon = screen.getByTestId("fire-icon");
      expect(icon).toHaveClass("w-5");
      expect(icon).toHaveClass("h-5");
    });

    it("should have text-orange-500 color class", () => {
      render(<FeaturedSection {...defaultProps} />);
      const icon = screen.getByTestId("fire-icon");
      expect(icon).toHaveClass("text-orange-500");
    });
  });

  describe("grid layout", () => {
    it("should have grid class on posts container", () => {
      const { container } = render(<FeaturedSection {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });

    it("should have grid-cols-1 for mobile", () => {
      const { container } = render(<FeaturedSection {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid-cols-1");
    });

    it("should have md:grid-cols-2 for medium screens", () => {
      const { container } = render(<FeaturedSection {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("md:grid-cols-2");
    });

    it("should have gap-4 class", () => {
      const { container } = render(<FeaturedSection {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gap-4");
    });
  });

  describe("dark mode classes", () => {
    it("should have dark:text-white class on title", () => {
      render(<FeaturedSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("dark:text-white");
    });
  });

  describe("empty posts array", () => {
    it("should render section with no cards when posts is empty", () => {
      render(<FeaturedSection posts={[]} onPostClick={vi.fn()} />);
      expect(screen.getByText("Trending Now")).toBeInTheDocument();
      expect(
        screen.queryByTestId(/featured-post-card-/),
      ).not.toBeInTheDocument();
    });

    it("should still render grid container when posts is empty", () => {
      const { container } = render(
        <FeaturedSection posts={[]} onPostClick={vi.fn()} />,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("single post", () => {
    it("should render correctly with single post", () => {
      render(<FeaturedSection posts={[mockPosts[0]]} onPostClick={vi.fn()} />);
      expect(screen.getByTestId("featured-post-card-1")).toBeInTheDocument();
      expect(
        screen.queryByTestId("featured-post-card-2"),
      ).not.toBeInTheDocument();
    });
  });

  describe("multiple posts", () => {
    it("should render correctly with many posts", () => {
      const manyPosts = [
        ...mockPosts,
        {
          id: "3",
          title: "Third Post",
          image: "https://example.com/image3.jpg",
          user: { name: "Bob", avatar: "https://example.com/avatar3.jpg" },
          likes: 500,
          isLiked: false,
        },
        {
          id: "4",
          title: "Fourth Post",
          image: "https://example.com/image4.jpg",
          user: { name: "Alice", avatar: "https://example.com/avatar4.jpg" },
          likes: 800,
          isLiked: true,
        },
      ];
      render(<FeaturedSection posts={manyPosts} onPostClick={vi.fn()} />);
      const cards = screen.getAllByTestId(/featured-post-card-/);
      expect(cards).toHaveLength(4);
    });

    it("should pass correct indices for many posts", () => {
      const manyPosts = [
        ...mockPosts,
        {
          id: "3",
          title: "Third Post",
          image: "https://example.com/image3.jpg",
          user: { name: "Bob", avatar: "https://example.com/avatar3.jpg" },
          likes: 500,
          isLiked: false,
        },
      ];
      render(<FeaturedSection posts={manyPosts} onPostClick={vi.fn()} />);
      expect(screen.getByTestId("featured-post-card-1")).toHaveAttribute(
        "data-index",
        "0",
      );
      expect(screen.getByTestId("featured-post-card-2")).toHaveAttribute(
        "data-index",
        "1",
      );
      expect(screen.getByTestId("featured-post-card-3")).toHaveAttribute(
        "data-index",
        "2",
      );
    });
  });

  describe("click handling", () => {
    it("should call onPostClick with correct post when clicking different cards", () => {
      const onPostClick = vi.fn();
      render(<FeaturedSection {...defaultProps} onPostClick={onPostClick} />);

      screen.getByTestId("featured-post-card-1").click();
      expect(onPostClick).toHaveBeenLastCalledWith(mockPosts[0]);

      screen.getByTestId("featured-post-card-2").click();
      expect(onPostClick).toHaveBeenLastCalledWith(mockPosts[1]);

      expect(onPostClick).toHaveBeenCalledTimes(2);
    });
  });

  describe("key prop", () => {
    it("should use post.id as key for each card", () => {
      // This test verifies the component uses unique keys
      // by checking that posts with same content but different IDs render correctly
      const postsWithDuplicateTitles = [
        { ...mockPosts[0], id: "unique-1" },
        { ...mockPosts[0], id: "unique-2", title: "First Featured Post" },
      ];
      render(
        <FeaturedSection
          posts={postsWithDuplicateTitles}
          onPostClick={vi.fn()}
        />,
      );
      expect(
        screen.getByTestId("featured-post-card-unique-1"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("featured-post-card-unique-2"),
      ).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have heading for screen readers", () => {
      render(<FeaturedSection {...defaultProps} />);
      expect(
        screen.getByRole("heading", { name: /Trending Now/i }),
      ).toBeInTheDocument();
    });
  });
});
