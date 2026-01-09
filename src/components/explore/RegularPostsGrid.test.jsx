/**
 * Unit Tests for RegularPostsGrid Component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RegularPostsGrid from "./RegularPostsGrid";

// Mock ExplorePostCard component
vi.mock("./ExplorePostCard", () => ({
  default: ({ post, index, onClick }) => (
    <div
      data-testid={`explore-post-card-${post.id}`}
      data-index={index}
      onClick={() => onClick(post)}
    >
      {post.title}
    </div>
  ),
}));

describe("RegularPostsGrid", () => {
  const mockPosts = [
    {
      id: "1",
      title: "First Post",
      image: "https://example.com/image1.jpg",
      user: { name: "John Doe", avatar: "https://example.com/avatar1.jpg" },
      likes: 100,
      isLiked: false,
    },
    {
      id: "2",
      title: "Second Post",
      image: "https://example.com/image2.jpg",
      user: { name: "Jane Smith", avatar: "https://example.com/avatar2.jpg" },
      likes: 200,
      isLiked: true,
    },
    {
      id: "3",
      title: "Third Post",
      image: "https://example.com/image3.jpg",
      user: { name: "Bob Wilson", avatar: "https://example.com/avatar3.jpg" },
      likes: 300,
      isLiked: false,
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
      render(<RegularPostsGrid {...defaultProps} />);
      expect(screen.getByText("Browse All")).toBeInTheDocument();
    });

    it("should render the section title", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      expect(screen.getByText("Browse All")).toBeInTheDocument();
    });

    it("should render all post cards", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      expect(screen.getByTestId("explore-post-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("explore-post-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("explore-post-card-3")).toBeInTheDocument();
    });

    it("should render correct number of post cards", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      const cards = screen.getAllByTestId(/explore-post-card-/);
      expect(cards).toHaveLength(3);
    });

    it("should render post titles", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      expect(screen.getByText("First Post")).toBeInTheDocument();
      expect(screen.getByText("Second Post")).toBeInTheDocument();
      expect(screen.getByText("Third Post")).toBeInTheDocument();
    });
  });

  describe("ExplorePostCard props", () => {
    it("should pass correct post to each card", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      expect(screen.getByText("First Post")).toBeInTheDocument();
      expect(screen.getByText("Second Post")).toBeInTheDocument();
      expect(screen.getByText("Third Post")).toBeInTheDocument();
    });

    it("should pass correct index to each card", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      expect(screen.getByTestId("explore-post-card-1")).toHaveAttribute(
        "data-index",
        "0",
      );
      expect(screen.getByTestId("explore-post-card-2")).toHaveAttribute(
        "data-index",
        "1",
      );
      expect(screen.getByTestId("explore-post-card-3")).toHaveAttribute(
        "data-index",
        "2",
      );
    });

    it("should pass onPostClick to each card", () => {
      const onPostClick = vi.fn();
      render(<RegularPostsGrid {...defaultProps} onPostClick={onPostClick} />);
      const firstCard = screen.getByTestId("explore-post-card-1");
      firstCard.click();
      expect(onPostClick).toHaveBeenCalledTimes(1);
      expect(onPostClick).toHaveBeenCalledWith(mockPosts[0]);
    });
  });

  describe("structure", () => {
    it("should render h2 tag for title", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Browse All");
    });

    it("should render as fragment with two child divs", () => {
      const { container } = render(<RegularPostsGrid {...defaultProps} />);
      const children = container.children;
      expect(children).toHaveLength(2);
    });
  });

  describe("title styling", () => {
    it("should have text-lg class on title", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("text-lg");
    });

    it("should have font-semibold class on title", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("font-semibold");
    });

    it("should have text-slate-900 class on title", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("text-slate-900");
    });

    it("should have mb-4 class on title", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("mb-4");
    });
  });

  describe("title container styling", () => {
    it("should have mb-6 class on title container", () => {
      const { container } = render(<RegularPostsGrid {...defaultProps} />);
      const titleContainer = container.firstChild;
      expect(titleContainer).toHaveClass("mb-6");
    });
  });

  describe("grid layout", () => {
    it("should have grid class on posts container", () => {
      const { container } = render(<RegularPostsGrid {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });

    it("should have grid-cols-2 for mobile", () => {
      const { container } = render(<RegularPostsGrid {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid-cols-2");
    });

    it("should have sm:grid-cols-3 for small screens", () => {
      const { container } = render(<RegularPostsGrid {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("sm:grid-cols-3");
    });

    it("should have lg:grid-cols-4 for large screens", () => {
      const { container } = render(<RegularPostsGrid {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-4");
    });

    it("should have gap-3 class", () => {
      const { container } = render(<RegularPostsGrid {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gap-3");
    });
  });

  describe("dark mode classes", () => {
    it("should have dark:text-white class on title", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("dark:text-white");
    });
  });

  describe("empty posts array", () => {
    it("should render section with no cards when posts is empty", () => {
      render(<RegularPostsGrid posts={[]} onPostClick={vi.fn()} />);
      expect(screen.getByText("Browse All")).toBeInTheDocument();
      expect(
        screen.queryByTestId(/explore-post-card-/),
      ).not.toBeInTheDocument();
    });

    it("should still render grid container when posts is empty", () => {
      const { container } = render(
        <RegularPostsGrid posts={[]} onPostClick={vi.fn()} />,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });

    it("should render empty grid with correct classes", () => {
      const { container } = render(
        <RegularPostsGrid posts={[]} onPostClick={vi.fn()} />,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid-cols-2");
      expect(grid).toHaveClass("gap-3");
    });
  });

  describe("single post", () => {
    it("should render correctly with single post", () => {
      render(<RegularPostsGrid posts={[mockPosts[0]]} onPostClick={vi.fn()} />);
      expect(screen.getByTestId("explore-post-card-1")).toBeInTheDocument();
      expect(
        screen.queryByTestId("explore-post-card-2"),
      ).not.toBeInTheDocument();
    });

    it("should pass index 0 for single post", () => {
      render(<RegularPostsGrid posts={[mockPosts[0]]} onPostClick={vi.fn()} />);
      expect(screen.getByTestId("explore-post-card-1")).toHaveAttribute(
        "data-index",
        "0",
      );
    });
  });

  describe("multiple posts", () => {
    it("should render correctly with many posts", () => {
      const manyPosts = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Post ${i + 1}`,
        image: `https://example.com/image${i + 1}.jpg`,
        user: {
          name: `User ${i + 1}`,
          avatar: `https://example.com/avatar${i + 1}.jpg`,
        },
        likes: (i + 1) * 100,
        isLiked: i % 2 === 0,
      }));
      render(<RegularPostsGrid posts={manyPosts} onPostClick={vi.fn()} />);
      const cards = screen.getAllByTestId(/explore-post-card-/);
      expect(cards).toHaveLength(12);
    });

    it("should pass correct indices for many posts", () => {
      const manyPosts = Array.from({ length: 5 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Post ${i + 1}`,
        image: `https://example.com/image${i + 1}.jpg`,
        user: {
          name: `User ${i + 1}`,
          avatar: `https://example.com/avatar${i + 1}.jpg`,
        },
        likes: 100,
        isLiked: false,
      }));
      render(<RegularPostsGrid posts={manyPosts} onPostClick={vi.fn()} />);

      for (let i = 0; i < 5; i++) {
        expect(
          screen.getByTestId(`explore-post-card-${i + 1}`),
        ).toHaveAttribute("data-index", `${i}`);
      }
    });
  });

  describe("click handling", () => {
    it("should call onPostClick with correct post when clicking different cards", () => {
      const onPostClick = vi.fn();
      render(<RegularPostsGrid {...defaultProps} onPostClick={onPostClick} />);

      screen.getByTestId("explore-post-card-1").click();
      expect(onPostClick).toHaveBeenLastCalledWith(mockPosts[0]);

      screen.getByTestId("explore-post-card-2").click();
      expect(onPostClick).toHaveBeenLastCalledWith(mockPosts[1]);

      screen.getByTestId("explore-post-card-3").click();
      expect(onPostClick).toHaveBeenLastCalledWith(mockPosts[2]);

      expect(onPostClick).toHaveBeenCalledTimes(3);
    });

    it("should not call onPostClick when no card is clicked", () => {
      const onPostClick = vi.fn();
      render(<RegularPostsGrid {...defaultProps} onPostClick={onPostClick} />);
      expect(onPostClick).not.toHaveBeenCalled();
    });
  });

  describe("key prop", () => {
    it("should use post.id as key for each card", () => {
      const postsWithDuplicateTitles = [
        { ...mockPosts[0], id: "unique-1" },
        { ...mockPosts[0], id: "unique-2", title: "First Post" },
      ];
      render(
        <RegularPostsGrid
          posts={postsWithDuplicateTitles}
          onPostClick={vi.fn()}
        />,
      );
      expect(
        screen.getByTestId("explore-post-card-unique-1"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("explore-post-card-unique-2"),
      ).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have heading for screen readers", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      expect(
        screen.getByRole("heading", { name: "Browse All" }),
      ).toBeInTheDocument();
    });

    it("should have semantic heading level", () => {
      render(<RegularPostsGrid {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle posts with special characters in title", () => {
      const specialPosts = [
        {
          ...mockPosts[0],
          id: "special",
          title: "Post with <special> & characters!",
        },
      ];
      render(<RegularPostsGrid posts={specialPosts} onPostClick={vi.fn()} />);
      expect(
        screen.getByText("Post with <special> & characters!"),
      ).toBeInTheDocument();
    });

    it("should handle posts with emoji in title", () => {
      const emojiPosts = [
        {
          ...mockPosts[0],
          id: "emoji",
          title: "Amazing Post 🎉🚀",
        },
      ];
      render(<RegularPostsGrid posts={emojiPosts} onPostClick={vi.fn()} />);
      expect(screen.getByText("Amazing Post 🎉🚀")).toBeInTheDocument();
    });

    it("should handle posts with long titles", () => {
      const longTitlePosts = [
        {
          ...mockPosts[0],
          id: "long",
          title:
            "This is a very long title that should still render correctly in the grid",
        },
      ];
      render(<RegularPostsGrid posts={longTitlePosts} onPostClick={vi.fn()} />);
      expect(
        screen.getByText(
          "This is a very long title that should still render correctly in the grid",
        ),
      ).toBeInTheDocument();
    });

    it("should handle undefined onPostClick gracefully", () => {
      expect(() => {
        render(<RegularPostsGrid posts={mockPosts} onPostClick={undefined} />);
      }).not.toThrow();
    });
  });

  describe("responsive grid behavior", () => {
    it("should have responsive column classes in correct order", () => {
      const { container } = render(<RegularPostsGrid {...defaultProps} />);
      const grid = container.querySelector(".grid");
      const classNames = grid.className;

      expect(classNames).toContain("grid-cols-2");
      expect(classNames).toContain("sm:grid-cols-3");
      expect(classNames).toContain("lg:grid-cols-4");
    });
  });
});
