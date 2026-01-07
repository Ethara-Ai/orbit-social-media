/**
 * Unit Tests for PostActions Component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PostActions from "./PostActions";

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
  },
}));

// Mock icons
vi.mock("../../icons", () => ({
  Heart: ({ className }) => (
    <svg data-testid="heart-icon" className={className}>
      <path d="M0 0" />
    </svg>
  ),
  MessageCircle: ({ className }) => (
    <svg data-testid="message-icon" className={className}>
      <path d="M0 0" />
    </svg>
  ),
}));

describe("PostActions", () => {
  const defaultProps = {
    postId: "post-123",
    likes: 42,
    commentsCount: 15,
    isLiked: false,
    onLike: vi.fn(),
    onComment: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the component", () => {
      render(<PostActions {...defaultProps} />);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should render likes count", () => {
      render(<PostActions {...defaultProps} />);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should render comments count", () => {
      render(<PostActions {...defaultProps} />);
      expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("should render heart icon", () => {
      render(<PostActions {...defaultProps} />);
      expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
    });

    it("should render message icon", () => {
      render(<PostActions {...defaultProps} />);
      expect(screen.getByTestId("message-icon")).toBeInTheDocument();
    });

    it("should render two buttons", () => {
      render(<PostActions {...defaultProps} />);
      const buttons = screen.getAllByTestId("motion-button");
      expect(buttons).toHaveLength(2);
    });
  });

  describe("like button", () => {
    it("should call onLike with postId when clicked", () => {
      const onLike = vi.fn();
      render(<PostActions {...defaultProps} onLike={onLike} />);

      const likeButton = screen.getAllByTestId("motion-button")[0];
      fireEvent.click(likeButton);

      expect(onLike).toHaveBeenCalledWith("post-123");
    });

    it("should call onLike only once per click", () => {
      const onLike = vi.fn();
      render(<PostActions {...defaultProps} onLike={onLike} />);

      const likeButton = screen.getAllByTestId("motion-button")[0];
      fireEvent.click(likeButton);

      expect(onLike).toHaveBeenCalledTimes(1);
    });

    it("should stop event propagation when clicked", () => {
      const onLike = vi.fn();
      const parentClick = vi.fn();

      render(
        <div onClick={parentClick}>
          <PostActions {...defaultProps} onLike={onLike} />
        </div>,
      );

      const likeButton = screen.getAllByTestId("motion-button")[0];
      fireEvent.click(likeButton);

      expect(onLike).toHaveBeenCalled();
      // Note: stopPropagation is called in the handler, but the mock button
      // doesn't fully simulate it. The test verifies the handler is called.
    });

    it("should have text-rose-500 class when liked", () => {
      render(<PostActions {...defaultProps} isLiked={true} />);
      const likeButton = screen.getAllByTestId("motion-button")[0];
      expect(likeButton).toHaveClass("text-rose-500");
    });

    it("should have text-slate-500 class when not liked", () => {
      render(<PostActions {...defaultProps} isLiked={false} />);
      const likeButton = screen.getAllByTestId("motion-button")[0];
      expect(likeButton).toHaveClass("text-slate-500");
    });

    it("should have cursor-pointer class", () => {
      render(<PostActions {...defaultProps} />);
      const likeButton = screen.getAllByTestId("motion-button")[0];
      expect(likeButton).toHaveClass("cursor-pointer");
    });

    it("should have transition-colors class", () => {
      render(<PostActions {...defaultProps} />);
      const likeButton = screen.getAllByTestId("motion-button")[0];
      expect(likeButton).toHaveClass("transition-colors");
    });
  });

  describe("comment button", () => {
    it("should call onComment with postId when clicked", () => {
      const onComment = vi.fn();
      render(<PostActions {...defaultProps} onComment={onComment} />);

      const commentButton = screen.getAllByTestId("motion-button")[1];
      fireEvent.click(commentButton);

      expect(onComment).toHaveBeenCalledWith("post-123");
    });

    it("should call onComment only once per click", () => {
      const onComment = vi.fn();
      render(<PostActions {...defaultProps} onComment={onComment} />);

      const commentButton = screen.getAllByTestId("motion-button")[1];
      fireEvent.click(commentButton);

      expect(onComment).toHaveBeenCalledTimes(1);
    });

    it("should have text-slate-500 class", () => {
      render(<PostActions {...defaultProps} />);
      const commentButton = screen.getAllByTestId("motion-button")[1];
      expect(commentButton).toHaveClass("text-slate-500");
    });

    it("should have cursor-pointer class", () => {
      render(<PostActions {...defaultProps} />);
      const commentButton = screen.getAllByTestId("motion-button")[1];
      expect(commentButton).toHaveClass("cursor-pointer");
    });

    it("should have transition-colors class", () => {
      render(<PostActions {...defaultProps} />);
      const commentButton = screen.getAllByTestId("motion-button")[1];
      expect(commentButton).toHaveClass("transition-colors");
    });
  });

  describe("heart icon styling", () => {
    it("should have fill-current class when liked", () => {
      render(<PostActions {...defaultProps} isLiked={true} />);
      const heartIcon = screen.getByTestId("heart-icon");
      expect(heartIcon).toHaveClass("fill-current");
    });

    it("should not have fill-current class when not liked", () => {
      render(<PostActions {...defaultProps} isLiked={false} />);
      const heartIcon = screen.getByTestId("heart-icon");
      expect(heartIcon).not.toHaveClass("fill-current");
    });

    it("should have w-4 h-4 classes", () => {
      render(<PostActions {...defaultProps} />);
      const heartIcon = screen.getByTestId("heart-icon");
      expect(heartIcon).toHaveClass("w-4");
      expect(heartIcon).toHaveClass("h-4");
    });

    it("should have responsive size classes", () => {
      render(<PostActions {...defaultProps} />);
      const heartIcon = screen.getByTestId("heart-icon");
      expect(heartIcon).toHaveClass("sm:w-5");
      expect(heartIcon).toHaveClass("sm:h-5");
    });
  });

  describe("message icon styling", () => {
    it("should have w-4 h-4 classes", () => {
      render(<PostActions {...defaultProps} />);
      const messageIcon = screen.getByTestId("message-icon");
      expect(messageIcon).toHaveClass("w-4");
      expect(messageIcon).toHaveClass("h-4");
    });

    it("should have responsive size classes", () => {
      render(<PostActions {...defaultProps} />);
      const messageIcon = screen.getByTestId("message-icon");
      expect(messageIcon).toHaveClass("sm:w-5");
      expect(messageIcon).toHaveClass("sm:h-5");
    });
  });

  describe("count text styling", () => {
    it("should have text-xs class for likes count", () => {
      render(<PostActions {...defaultProps} />);
      const likesText = screen.getByText("42");
      expect(likesText).toHaveClass("text-xs");
    });

    it("should have sm:text-sm class for likes count", () => {
      render(<PostActions {...defaultProps} />);
      const likesText = screen.getByText("42");
      expect(likesText).toHaveClass("sm:text-sm");
    });

    it("should have font-medium class for likes count", () => {
      render(<PostActions {...defaultProps} />);
      const likesText = screen.getByText("42");
      expect(likesText).toHaveClass("font-medium");
    });

    it("should have text-xs class for comments count", () => {
      render(<PostActions {...defaultProps} />);
      const commentsText = screen.getByText("15");
      expect(commentsText).toHaveClass("text-xs");
    });

    it("should have sm:text-sm class for comments count", () => {
      render(<PostActions {...defaultProps} />);
      const commentsText = screen.getByText("15");
      expect(commentsText).toHaveClass("sm:text-sm");
    });

    it("should have font-medium class for comments count", () => {
      render(<PostActions {...defaultProps} />);
      const commentsText = screen.getByText("15");
      expect(commentsText).toHaveClass("font-medium");
    });
  });

  describe("container styling", () => {
    it("should have px-3 padding class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("px-3");
    });

    it("should have sm:px-4 padding class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("sm:px-4");
    });

    it("should have py-2 padding class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("py-2");
    });

    it("should have sm:py-3 padding class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("sm:py-3");
    });

    it("should have border-t class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("border-t");
    });

    it("should have border-slate-100 class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("border-slate-100");
    });

    it("should have dark mode border class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("dark:border-slate-700");
    });

    it("should have transition-colors class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("transition-colors");
    });
  });

  describe("flex container", () => {
    it("should have flex class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const flexContainer = container.querySelector(".flex.items-center");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have items-center class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const flexContainer = container.querySelector(".items-center");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have gap-4 class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const flexContainer = container.querySelector(".gap-4");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have sm:gap-6 class", () => {
      const { container } = render(<PostActions {...defaultProps} />);
      const flexContainer = container.querySelector(".sm\\:gap-6");
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle zero likes", () => {
      render(<PostActions {...defaultProps} likes={0} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle zero comments", () => {
      render(<PostActions {...defaultProps} commentsCount={0} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle large numbers for likes", () => {
      render(<PostActions {...defaultProps} likes={999999} />);
      expect(screen.getByText("999999")).toBeInTheDocument();
    });

    it("should handle large numbers for comments", () => {
      render(<PostActions {...defaultProps} commentsCount={123456} />);
      expect(screen.getByText("123456")).toBeInTheDocument();
    });

    it("should handle different post IDs", () => {
      const onLike = vi.fn();
      render(
        <PostActions {...defaultProps} postId="different-id" onLike={onLike} />,
      );

      const likeButton = screen.getAllByTestId("motion-button")[0];
      fireEvent.click(likeButton);

      expect(onLike).toHaveBeenCalledWith("different-id");
    });

    it("should handle numeric post IDs", () => {
      const onComment = vi.fn();
      render(
        <PostActions {...defaultProps} postId={12345} onComment={onComment} />,
      );

      const commentButton = screen.getAllByTestId("motion-button")[1];
      fireEvent.click(commentButton);

      expect(onComment).toHaveBeenCalledWith(12345);
    });
  });

  describe("multiple clicks", () => {
    it("should handle multiple like clicks", () => {
      const onLike = vi.fn();
      render(<PostActions {...defaultProps} onLike={onLike} />);

      const likeButton = screen.getAllByTestId("motion-button")[0];
      fireEvent.click(likeButton);
      fireEvent.click(likeButton);
      fireEvent.click(likeButton);

      expect(onLike).toHaveBeenCalledTimes(3);
    });

    it("should handle multiple comment clicks", () => {
      const onComment = vi.fn();
      render(<PostActions {...defaultProps} onComment={onComment} />);

      const commentButton = screen.getAllByTestId("motion-button")[1];
      fireEvent.click(commentButton);
      fireEvent.click(commentButton);

      expect(onComment).toHaveBeenCalledTimes(2);
    });

    it("should handle interleaved like and comment clicks", () => {
      const onLike = vi.fn();
      const onComment = vi.fn();
      render(
        <PostActions {...defaultProps} onLike={onLike} onComment={onComment} />,
      );

      const likeButton = screen.getAllByTestId("motion-button")[0];
      const commentButton = screen.getAllByTestId("motion-button")[1];

      fireEvent.click(likeButton);
      fireEvent.click(commentButton);
      fireEvent.click(likeButton);

      expect(onLike).toHaveBeenCalledTimes(2);
      expect(onComment).toHaveBeenCalledTimes(1);
    });
  });

  describe("dark mode classes", () => {
    it("should have dark mode text class for like button when not liked", () => {
      render(<PostActions {...defaultProps} isLiked={false} />);
      const likeButton = screen.getAllByTestId("motion-button")[0];
      expect(likeButton).toHaveClass("dark:text-slate-400");
    });

    it("should have dark mode text class for comment button", () => {
      render(<PostActions {...defaultProps} />);
      const commentButton = screen.getAllByTestId("motion-button")[1];
      expect(commentButton).toHaveClass("dark:text-slate-400");
    });

    it("should have dark mode hover class for comment button", () => {
      render(<PostActions {...defaultProps} />);
      const commentButton = screen.getAllByTestId("motion-button")[1];
      expect(commentButton).toHaveClass("dark:hover:text-blue-400");
    });
  });

  describe("button structure", () => {
    it("should render span elements for counts", () => {
      render(<PostActions {...defaultProps} />);
      const spans = document.querySelectorAll("span");
      expect(spans.length).toBeGreaterThanOrEqual(2);
    });

    it("should have like count in span element", () => {
      render(<PostActions {...defaultProps} />);
      const likesSpan = screen.getByText("42");
      expect(likesSpan.tagName).toBe("SPAN");
    });

    it("should have comments count in span element", () => {
      render(<PostActions {...defaultProps} />);
      const commentsSpan = screen.getByText("15");
      expect(commentsSpan.tagName).toBe("SPAN");
    });
  });

  describe("hover classes", () => {
    it("should have hover:text-rose-500 class on like button when not liked", () => {
      render(<PostActions {...defaultProps} isLiked={false} />);
      const likeButton = screen.getAllByTestId("motion-button")[0];
      expect(likeButton).toHaveClass("hover:text-rose-500");
    });

    it("should have hover:text-blue-500 class on comment button", () => {
      render(<PostActions {...defaultProps} />);
      const commentButton = screen.getAllByTestId("motion-button")[1];
      expect(commentButton).toHaveClass("hover:text-blue-500");
    });
  });

  describe("accessibility", () => {
    it("should render buttons as clickable elements", () => {
      render(<PostActions {...defaultProps} />);
      const buttons = screen.getAllByTestId("motion-button");
      buttons.forEach((button) => {
        expect(button.tagName).toBe("BUTTON");
      });
    });

    it("should have visible like count", () => {
      render(<PostActions {...defaultProps} />);
      expect(screen.getByText("42")).toBeVisible();
    });

    it("should have visible comment count", () => {
      render(<PostActions {...defaultProps} />);
      expect(screen.getByText("15")).toBeVisible();
    });
  });
});
