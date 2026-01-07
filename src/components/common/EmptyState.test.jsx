/**
 * Unit Tests for EmptyState Component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EmptyState from "./EmptyState";

// Mock icon component for testing
const MockIcon = ({ className }) => (
  <svg data-testid="mock-icon" className={className}>
    <path d="M0 0h24v24H0z" />
  </svg>
);

describe("EmptyState", () => {
  describe("rendering", () => {
    it("should render without crashing with no props", () => {
      const { container } = render(<EmptyState />);
      expect(container).toBeInTheDocument();
    });

    it("should render with all props provided", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          icon={MockIcon}
          title="No items found"
          description="Try adding some items"
          action={handleAction}
          actionLabel="Add Item"
        />,
      );

      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
      expect(screen.getByText("No items found")).toBeInTheDocument();
      expect(screen.getByText("Try adding some items")).toBeInTheDocument();
      expect(screen.getByText("Add Item")).toBeInTheDocument();
    });

    it("should have centered text", () => {
      const { container } = render(<EmptyState title="Test" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("text-center");
    });

    it("should have vertical padding", () => {
      const { container } = render(<EmptyState title="Test" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("py-16");
    });
  });

  describe("icon", () => {
    it("should render icon when provided", () => {
      render(<EmptyState icon={MockIcon} />);
      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    });

    it("should not render icon when not provided", () => {
      render(<EmptyState title="No Icon" />);
      expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
    });

    it("should apply default icon className", () => {
      render(<EmptyState icon={MockIcon} />);
      const icon = screen.getByTestId("mock-icon");
      expect(icon).toHaveClass("w-8");
      expect(icon).toHaveClass("h-8");
      expect(icon).toHaveClass("text-slate-400");
    });

    it("should apply custom icon className when provided", () => {
      render(
        <EmptyState icon={MockIcon} iconClassName="w-12 h-12 text-red-500" />,
      );
      const icon = screen.getByTestId("mock-icon");
      expect(icon).toHaveClass("w-12");
      expect(icon).toHaveClass("h-12");
      expect(icon).toHaveClass("text-red-500");
    });

    it("should render icon inside a styled container", () => {
      render(<EmptyState icon={MockIcon} />);
      const icon = screen.getByTestId("mock-icon");
      const container = icon.parentElement;
      expect(container).toHaveClass("w-16");
      expect(container).toHaveClass("h-16");
      expect(container).toHaveClass("mx-auto");
      expect(container).toHaveClass("mb-4");
      expect(container).toHaveClass("rounded-full");
    });

    it("should have flex centering on icon container", () => {
      render(<EmptyState icon={MockIcon} />);
      const icon = screen.getByTestId("mock-icon");
      const container = icon.parentElement;
      expect(container).toHaveClass("flex");
      expect(container).toHaveClass("items-center");
      expect(container).toHaveClass("justify-center");
    });
  });

  describe("title", () => {
    it("should render title when provided", () => {
      render(<EmptyState title="Empty State Title" />);
      expect(screen.getByText("Empty State Title")).toBeInTheDocument();
    });

    it("should not render title when not provided", () => {
      render(<EmptyState description="Only description" />);
      const heading = screen.queryByRole("heading", { level: 3 });
      expect(heading).not.toBeInTheDocument();
    });

    it("should render title as h3 element", () => {
      render(<EmptyState title="Heading Title" />);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("Heading Title");
    });

    it("should have correct title styling", () => {
      render(<EmptyState title="Styled Title" />);
      const title = screen.getByText("Styled Title");
      expect(title).toHaveClass("text-lg");
      expect(title).toHaveClass("font-semibold");
      expect(title).toHaveClass("mb-1");
    });
  });

  describe("description", () => {
    it("should render description when provided", () => {
      render(<EmptyState description="This is a description" />);
      expect(screen.getByText("This is a description")).toBeInTheDocument();
    });

    it("should not render description when not provided", () => {
      render(<EmptyState title="Only title" />);
      // Only title should be present
      expect(screen.getByText("Only title")).toBeInTheDocument();
      // Check that there's no paragraph with slate-500 class for description
      const paragraphs = screen.queryAllByText(/./);
      const descriptionParagraphs = paragraphs.filter(
        (el) => el.tagName === "P" && el.classList.contains("text-slate-500"),
      );
      expect(descriptionParagraphs.length).toBe(0);
    });

    it("should render description as p element", () => {
      render(<EmptyState description="Paragraph description" />);
      const description = screen.getByText("Paragraph description");
      expect(description.tagName).toBe("P");
    });

    it("should have correct description styling", () => {
      render(<EmptyState description="Styled description" />);
      const description = screen.getByText("Styled description");
      expect(description).toHaveClass("text-slate-500");
      expect(description).toHaveClass("text-sm");
    });
  });

  describe("action button", () => {
    it("should render action button when both action and actionLabel are provided", () => {
      const handleAction = vi.fn();
      render(<EmptyState action={handleAction} actionLabel="Click Me" />);
      expect(screen.getByRole("button")).toHaveTextContent("Click Me");
    });

    it("should not render action button when only action is provided", () => {
      const handleAction = vi.fn();
      render(<EmptyState action={handleAction} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should not render action button when only actionLabel is provided", () => {
      render(<EmptyState actionLabel="No Handler" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should not render action button when neither is provided", () => {
      render(<EmptyState title="No Action" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should call action handler when button is clicked", () => {
      const handleAction = vi.fn();
      render(<EmptyState action={handleAction} actionLabel="Perform Action" />);
      fireEvent.click(screen.getByRole("button"));
      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it("should call action handler multiple times on multiple clicks", () => {
      const handleAction = vi.fn();
      render(<EmptyState action={handleAction} actionLabel="Multi Click" />);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handleAction).toHaveBeenCalledTimes(3);
    });

    it("should have correct button styling", () => {
      const handleAction = vi.fn();
      render(<EmptyState action={handleAction} actionLabel="Styled Button" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("mt-4");
      expect(button).toHaveClass("px-4");
      expect(button).toHaveClass("py-2");
      expect(button).toHaveClass("bg-orange-500");
      expect(button).toHaveClass("text-white");
      expect(button).toHaveClass("rounded-full");
    });

    it("should have hover styles on button", () => {
      const handleAction = vi.fn();
      render(<EmptyState action={handleAction} actionLabel="Hover Button" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-orange-600");
    });

    it("should have font styling on button", () => {
      const handleAction = vi.fn();
      render(<EmptyState action={handleAction} actionLabel="Font Button" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-sm");
      expect(button).toHaveClass("font-medium");
    });
  });

  describe("combined props", () => {
    it("should render all elements in correct order", () => {
      const handleAction = vi.fn();
      const { container } = render(
        <EmptyState
          icon={MockIcon}
          title="Complete Empty State"
          description="With all elements"
          action={handleAction}
          actionLabel="Take Action"
        />,
      );

      const wrapper = container.firstChild;
      expect(wrapper).toBeInTheDocument();

      // All elements should be present
      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
      expect(screen.getByText("Complete Empty State")).toBeInTheDocument();
      expect(screen.getByText("With all elements")).toBeInTheDocument();
      expect(screen.getByText("Take Action")).toBeInTheDocument();
    });

    it("should work with only icon and title", () => {
      render(<EmptyState icon={MockIcon} title="Icon and Title Only" />);

      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
      expect(screen.getByText("Icon and Title Only")).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should work with title and description only", () => {
      render(<EmptyState title="Title" description="Description" />);

      expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("should work with icon and action only", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          icon={MockIcon}
          action={handleAction}
          actionLabel="Just Action"
        />,
      );

      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent("Just Action");
    });
  });

  describe("accessibility", () => {
    it("should have semantic heading structure", () => {
      render(<EmptyState title="Accessible Title" />);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it("should have clickable button", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState action={handleAction} actionLabel="Accessible Action" />,
      );
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Accessible Action");
    });
  });

  describe("dark mode support", () => {
    it("should have dark mode classes on icon container", () => {
      render(<EmptyState icon={MockIcon} />);
      const icon = screen.getByTestId("mock-icon");
      const container = icon.parentElement;
      expect(container).toHaveClass("dark:bg-slate-800");
    });

    it("should have dark mode classes on default icon", () => {
      render(<EmptyState icon={MockIcon} />);
      const icon = screen.getByTestId("mock-icon");
      expect(icon).toHaveClass("dark:text-slate-500");
    });

    it("should have dark mode classes on title", () => {
      render(<EmptyState title="Dark Mode Title" />);
      const title = screen.getByText("Dark Mode Title");
      expect(title).toHaveClass("dark:text-slate-200");
    });

    it("should have dark mode classes on description", () => {
      render(<EmptyState description="Dark Mode Description" />);
      const description = screen.getByText("Dark Mode Description");
      expect(description).toHaveClass("dark:text-slate-400");
    });
  });

  describe("transitions", () => {
    it("should have transition classes on icon container", () => {
      render(<EmptyState icon={MockIcon} />);
      const icon = screen.getByTestId("mock-icon");
      const container = icon.parentElement;
      expect(container).toHaveClass("transition-colors");
    });

    it("should have transition classes on title", () => {
      render(<EmptyState title="Transition Title" />);
      const title = screen.getByText("Transition Title");
      expect(title).toHaveClass("transition-colors");
    });

    it("should have transition classes on description", () => {
      render(<EmptyState description="Transition Description" />);
      const description = screen.getByText("Transition Description");
      expect(description).toHaveClass("transition-colors");
    });

    it("should have transition classes on button", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState action={handleAction} actionLabel="Transition Button" />,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("transition-colors");
    });
  });
});
