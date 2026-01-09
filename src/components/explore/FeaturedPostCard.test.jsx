/**
 * Unit Tests for FeaturedPostCard Component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FeaturedPostCard from "./FeaturedPostCard";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    article: ({
      children,
      className,
      onClick,
      onKeyDown,
      role,
      tabIndex,
      initial,
      animate,
      transition,
      whileHover,
      ...props
    }) => (
      <article
        className={className}
        onClick={onClick}
        onKeyDown={onKeyDown}
        role={role}
        tabIndex={tabIndex}
        data-testid="motion-article"
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
        data-while-hover={JSON.stringify(whileHover)}
        {...props}
      >
        {children}
      </article>
    ),
  },
}));

// Mock icons
vi.mock("../icons", () => ({
  Heart: ({ className }) => (
    <svg data-testid="heart-icon" className={className} />
  ),
}));

describe("FeaturedPostCard", () => {
  const mockPost = {
    id: "1",
    image: "https://example.com/image.jpg",
    title: "Amazing Featured Post",
    user: {
      name: "John Doe",
      avatar: "https://example.com/avatar.jpg",
    },
    likes: 1500,
    isLiked: false,
  };

  const defaultProps = {
    post: mockPost,
    index: 0,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the component", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      expect(screen.getByText("Amazing Featured Post")).toBeInTheDocument();
    });

    it("should render the post title", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      expect(screen.getByText("Amazing Featured Post")).toBeInTheDocument();
    });

    it("should render the user name", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render the post image", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const postImage = images.find(
        (img) => img.getAttribute("alt") === "Amazing Featured Post",
      );
      expect(postImage).toBeInTheDocument();
      expect(postImage).toHaveAttribute("src", "https://example.com/image.jpg");
    });

    it("should render the user avatar", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const avatarImage = images.find(
        (img) => img.getAttribute("alt") === "John Doe",
      );
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage).toHaveAttribute(
        "src",
        "https://example.com/avatar.jpg",
      );
    });

    it("should render the likes count", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      expect(screen.getByText("1,500")).toBeInTheDocument();
    });

    it("should render the heart icon", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
    });
  });

  describe("likes formatting", () => {
    it("should format likes with locale formatting", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      // Use toLocaleString to match the component's formatting
      expect(screen.getByText((1500).toLocaleString())).toBeInTheDocument();
    });

    it("should handle large like counts", () => {
      const postWithManyLikes = {
        ...mockPost,
        likes: 1000000,
      };
      render(<FeaturedPostCard {...defaultProps} post={postWithManyLikes} />);
      // Use toLocaleString to match the component's locale-specific formatting
      expect(screen.getByText((1000000).toLocaleString())).toBeInTheDocument();
    });

    it("should handle zero likes", () => {
      const postWithZeroLikes = {
        ...mockPost,
        likes: 0,
      };
      render(<FeaturedPostCard {...defaultProps} post={postWithZeroLikes} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle small like counts without commas", () => {
      const postWithFewLikes = {
        ...mockPost,
        likes: 42,
      };
      render(<FeaturedPostCard {...defaultProps} post={postWithFewLikes} />);
      expect(screen.getByText("42")).toBeInTheDocument();
    });
  });

  describe("liked state", () => {
    it("should apply liked styles when post is liked", () => {
      const likedPost = {
        ...mockPost,
        isLiked: true,
      };
      render(<FeaturedPostCard {...defaultProps} post={likedPost} />);
      const heartIcon = screen.getByTestId("heart-icon");
      expect(heartIcon).toHaveClass("fill-current");
      expect(heartIcon).toHaveClass("text-rose-400");
    });

    it("should not apply liked styles when post is not liked", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const heartIcon = screen.getByTestId("heart-icon");
      expect(heartIcon).not.toHaveClass("fill-current");
      expect(heartIcon).not.toHaveClass("text-rose-400");
    });
  });

  describe("click handling", () => {
    it("should call onClick with post when clicked", () => {
      const onClick = vi.fn();
      render(<FeaturedPostCard {...defaultProps} onClick={onClick} />);
      const article = screen.getByTestId("motion-article");
      fireEvent.click(article);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(mockPost);
    });

    it("should call onClick when Enter key is pressed", () => {
      const onClick = vi.fn();
      render(<FeaturedPostCard {...defaultProps} onClick={onClick} />);
      const article = screen.getByTestId("motion-article");
      fireEvent.keyDown(article, { key: "Enter" });
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(mockPost);
    });

    it("should not call onClick when other keys are pressed", () => {
      const onClick = vi.fn();
      render(<FeaturedPostCard {...defaultProps} onClick={onClick} />);
      const article = screen.getByTestId("motion-article");
      fireEvent.keyDown(article, { key: "Space" });
      expect(onClick).not.toHaveBeenCalled();
    });

    it("should not call onClick when Tab key is pressed", () => {
      const onClick = vi.fn();
      render(<FeaturedPostCard {...defaultProps} onClick={onClick} />);
      const article = screen.getByTestId("motion-article");
      fireEvent.keyDown(article, { key: "Tab" });
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("should have role button", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      expect(article).toHaveAttribute("role", "button");
    });

    it("should have tabIndex 0 for keyboard navigation", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      expect(article).toHaveAttribute("tabIndex", "0");
    });

    it("should have alt text on post image", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const postImage = images.find(
        (img) => img.getAttribute("alt") === "Amazing Featured Post",
      );
      expect(postImage).toHaveAttribute("alt", "Amazing Featured Post");
    });

    it("should have alt text on avatar image", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const avatarImage = images.find(
        (img) => img.getAttribute("alt") === "John Doe",
      );
      expect(avatarImage).toHaveAttribute("alt", "John Doe");
    });
  });

  describe("structure", () => {
    it("should render h3 tag for title", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("Amazing Featured Post");
    });

    it("should render span tag for user name", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName.tagName).toBe("SPAN");
    });

    it("should render article element", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      expect(screen.getByTestId("motion-article")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have cursor-pointer class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      expect(article).toHaveClass("cursor-pointer");
    });

    it("should have relative positioning", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      expect(article).toHaveClass("relative");
    });

    it("should have rounded-2xl class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      expect(article).toHaveClass("rounded-2xl");
    });

    it("should have overflow-hidden class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      expect(article).toHaveClass("overflow-hidden");
    });

    it("should have h-64 height class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      expect(article).toHaveClass("h-64");
    });

    it("should have group class for hover effects", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      expect(article).toHaveClass("group");
    });
  });

  describe("image styling", () => {
    it("should have object-cover class on post image", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const postImage = images.find(
        (img) => img.getAttribute("alt") === "Amazing Featured Post",
      );
      expect(postImage).toHaveClass("object-cover");
    });

    it("should have transition-transform class for hover effect", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const postImage = images.find(
        (img) => img.getAttribute("alt") === "Amazing Featured Post",
      );
      expect(postImage).toHaveClass("transition-transform");
    });

    it("should have group-hover:scale-105 class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const postImage = images.find(
        (img) => img.getAttribute("alt") === "Amazing Featured Post",
      );
      expect(postImage).toHaveClass("group-hover:scale-105");
    });

    it("should have duration-500 for transition", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const postImage = images.find(
        (img) => img.getAttribute("alt") === "Amazing Featured Post",
      );
      expect(postImage).toHaveClass("duration-500");
    });
  });

  describe("avatar styling", () => {
    it("should have rounded-full class on avatar", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const avatarImage = images.find(
        (img) => img.getAttribute("alt") === "John Doe",
      );
      expect(avatarImage).toHaveClass("rounded-full");
    });

    it("should have ring-2 class on avatar", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const avatarImage = images.find(
        (img) => img.getAttribute("alt") === "John Doe",
      );
      expect(avatarImage).toHaveClass("ring-2");
    });

    it("should have w-8 h-8 size classes on avatar", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const avatarImage = images.find(
        (img) => img.getAttribute("alt") === "John Doe",
      );
      expect(avatarImage).toHaveClass("w-8");
      expect(avatarImage).toHaveClass("h-8");
    });
  });

  describe("title styling", () => {
    it("should have text-white class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveClass("text-white");
    });

    it("should have font-bold class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveClass("font-bold");
    });

    it("should have text-lg class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveClass("text-lg");
    });

    it("should have leading-tight class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveClass("leading-tight");
    });
  });

  describe("animation props", () => {
    it("should have initial opacity 0 and y 20", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      const initial = JSON.parse(article.getAttribute("data-initial"));
      expect(initial.opacity).toBe(0);
      expect(initial.y).toBe(20);
    });

    it("should animate to opacity 1 and y 0", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      const animate = JSON.parse(article.getAttribute("data-animate"));
      expect(animate.opacity).toBe(1);
      expect(animate.y).toBe(0);
    });

    it("should have transition delay based on index", () => {
      render(<FeaturedPostCard {...defaultProps} index={2} />);
      const article = screen.getByTestId("motion-article");
      const transition = JSON.parse(article.getAttribute("data-transition"));
      expect(transition.delay).toBe(0.2);
    });

    it("should have whileHover scale 1.01", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const article = screen.getByTestId("motion-article");
      const whileHover = JSON.parse(article.getAttribute("data-while-hover"));
      expect(whileHover.scale).toBe(1.01);
    });

    it("should calculate correct delay for different indices", () => {
      render(<FeaturedPostCard {...defaultProps} index={5} />);
      const article = screen.getByTestId("motion-article");
      const transition = JSON.parse(article.getAttribute("data-transition"));
      expect(transition.delay).toBe(0.5);
    });
  });

  describe("image error handling", () => {
    it("should set fallback src on post image error", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const postImage = images.find(
        (img) => img.getAttribute("alt") === "Amazing Featured Post",
      );
      fireEvent.error(postImage);
      expect(postImage).toHaveAttribute(
        "src",
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
      );
    });

    it("should set fallback src on avatar image error", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const images = screen.getAllByRole("img");
      const avatarImage = images.find(
        (img) => img.getAttribute("alt") === "John Doe",
      );
      fireEvent.error(avatarImage);
      expect(avatarImage).toHaveAttribute(
        "src",
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
      );
    });
  });

  describe("placeholder handling", () => {
    it("should use placeholder for missing post image", () => {
      const postWithoutImage = {
        ...mockPost,
        image: null,
      };
      render(<FeaturedPostCard {...defaultProps} post={postWithoutImage} />);
      const images = screen.getAllByRole("img");
      const postImage = images.find(
        (img) => img.getAttribute("alt") === "Amazing Featured Post",
      );
      expect(postImage).toHaveAttribute("src", "/placeholder.svg");
    });

    it("should use placeholder for missing avatar", () => {
      const postWithoutAvatar = {
        ...mockPost,
        user: {
          ...mockPost.user,
          avatar: null,
        },
      };
      render(<FeaturedPostCard {...defaultProps} post={postWithoutAvatar} />);
      const images = screen.getAllByRole("img");
      const avatarImage = images.find(
        (img) => img.getAttribute("alt") === "John Doe",
      );
      expect(avatarImage).toHaveAttribute("src", "/placeholder.svg");
    });
  });

  describe("edge cases", () => {
    it("should handle long title", () => {
      const postWithLongTitle = {
        ...mockPost,
        title:
          "This is a very long title that should still be displayed correctly in the component",
      };
      render(<FeaturedPostCard {...defaultProps} post={postWithLongTitle} />);
      expect(
        screen.getByText(
          "This is a very long title that should still be displayed correctly in the component",
        ),
      ).toBeInTheDocument();
    });

    it("should handle long user name", () => {
      const postWithLongName = {
        ...mockPost,
        user: {
          ...mockPost.user,
          name: "Alexander Bartholomew Wellington III",
        },
      };
      render(<FeaturedPostCard {...defaultProps} post={postWithLongName} />);
      expect(
        screen.getByText("Alexander Bartholomew Wellington III"),
      ).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      const postWithSpecialChars = {
        ...mockPost,
        title: "Post with <special> & characters!",
      };
      render(
        <FeaturedPostCard {...defaultProps} post={postWithSpecialChars} />,
      );
      expect(
        screen.getByText("Post with <special> & characters!"),
      ).toBeInTheDocument();
    });

    it("should handle emoji in title", () => {
      const postWithEmoji = {
        ...mockPost,
        title: "Amazing Post 🎉🚀",
      };
      render(<FeaturedPostCard {...defaultProps} post={postWithEmoji} />);
      expect(screen.getByText("Amazing Post 🎉🚀")).toBeInTheDocument();
    });

    it("should handle index 0 correctly", () => {
      render(<FeaturedPostCard {...defaultProps} index={0} />);
      const article = screen.getByTestId("motion-article");
      const transition = JSON.parse(article.getAttribute("data-transition"));
      expect(transition.delay).toBe(0);
    });
  });

  describe("gradient overlay", () => {
    it("should render gradient overlay div", () => {
      const { container } = render(<FeaturedPostCard {...defaultProps} />);
      const overlay = container.querySelector(".bg-linear-to-t");
      expect(overlay).toBeInTheDocument();
    });

    it("should have absolute positioning on overlay", () => {
      const { container } = render(<FeaturedPostCard {...defaultProps} />);
      const overlay = container.querySelector(".absolute.inset-0");
      expect(overlay).toBeInTheDocument();
    });
  });

  describe("content positioning", () => {
    it("should have content at bottom", () => {
      const { container } = render(<FeaturedPostCard {...defaultProps} />);
      const content = container.querySelector(".absolute.bottom-0");
      expect(content).toBeInTheDocument();
    });

    it("should have padding on content", () => {
      const { container } = render(<FeaturedPostCard {...defaultProps} />);
      const content = container.querySelector(".p-5");
      expect(content).toBeInTheDocument();
    });
  });

  describe("user name styling", () => {
    it("should have text-white class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("text-white");
    });

    it("should have text-sm class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("text-sm");
    });

    it("should have font-medium class", () => {
      render(<FeaturedPostCard {...defaultProps} />);
      const userName = screen.getByText("John Doe");
      expect(userName).toHaveClass("font-medium");
    });
  });
});
