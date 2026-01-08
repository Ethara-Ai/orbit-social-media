/**
 * Unit Tests for ActionButton Component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ActionButton from "./ActionButton";

// Mock icon component for testing
const MockIcon = ({ className }) => (
  <svg data-testid="mock-icon" className={className}>
    <path d="M0 0h24v24H0z" />
  </svg>
);

describe("ActionButton", () => {
  describe("rendering", () => {
    it("should render with children text", () => {
      render(<ActionButton>Click me</ActionButton>);
      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    it("should render as a button element", () => {
      render(<ActionButton>Button</ActionButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render with default props", () => {
      render(<ActionButton>Default</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });
  });

  describe("variants", () => {
    it("should apply primary variant classes by default", () => {
      render(<ActionButton>Primary</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-orange-500");
      expect(button).toHaveClass("text-white");
    });

    it("should apply secondary variant classes", () => {
      render(<ActionButton variant="secondary">Secondary</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-slate-100");
      expect(button).toHaveClass("text-slate-600");
    });

    it("should apply ghost variant classes", () => {
      render(<ActionButton variant="ghost">Ghost</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-transparent");
      expect(button).toHaveClass("text-slate-600");
    });

    it("should apply danger variant classes", () => {
      render(<ActionButton variant="danger">Danger</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-rose-500");
      expect(button).toHaveClass("text-white");
    });

    it("should apply success variant classes", () => {
      render(<ActionButton variant="success">Success</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-emerald-500");
      expect(button).toHaveClass("text-white");
    });

    it("should apply outline-solid variant classes", () => {
      render(<ActionButton variant="outline">Outline</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border");
      expect(button).toHaveClass("border-slate-200");
      expect(button).toHaveClass("bg-white");
    });
  });

  describe("sizes", () => {
    it("should apply medium size classes by default", () => {
      render(<ActionButton>Medium</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-4");
      expect(button).toHaveClass("py-2");
      expect(button).toHaveClass("text-sm");
    });

    it("should apply extra small size classes", () => {
      render(<ActionButton size="xs">XS</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-2");
      expect(button).toHaveClass("py-1");
      expect(button).toHaveClass("text-xs");
    });

    it("should apply small size classes", () => {
      render(<ActionButton size="sm">Small</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-3");
      expect(button).toHaveClass("py-1.5");
      expect(button).toHaveClass("text-sm");
    });

    it("should apply large size classes", () => {
      render(<ActionButton size="lg">Large</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-5");
      expect(button).toHaveClass("py-2.5");
      expect(button).toHaveClass("text-base");
    });

    it("should apply extra large size classes", () => {
      render(<ActionButton size="xl">XL</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-6");
      expect(button).toHaveClass("py-3");
      expect(button).toHaveClass("text-lg");
    });
  });

  describe("rounded-sm styles", () => {
    it("should apply full rounded-sm by default", () => {
      render(<ActionButton>Rounded</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-full");
    });

    it("should apply no rounded-sm when set to none", () => {
      render(<ActionButton rounded="none">No Rounded</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-none");
    });

    it("should apply small rounded-sm", () => {
      render(<ActionButton rounded="sm">Small Rounded</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-xs");
    });

    it("should apply medium rounded-sm", () => {
      render(<ActionButton rounded="md">Medium Rounded</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-md");
    });

    it("should apply large rounded-sm", () => {
      render(<ActionButton rounded="lg">Large Rounded</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-lg");
    });

    it("should apply xl rounded-sm", () => {
      render(<ActionButton rounded="xl">XL Rounded</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-xl");
    });

    it("should apply 2xl rounded-sm", () => {
      render(<ActionButton rounded="2xl">2XL Rounded</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-2xl");
    });
  });

  describe("disabled state", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<ActionButton disabled>Disabled</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should not be disabled by default", () => {
      render(<ActionButton>Enabled</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });

    it("should have disabled cursor class when disabled", () => {
      render(<ActionButton disabled>Disabled</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled:cursor-not-allowed");
    });

    it("should have opacity class when disabled", () => {
      render(<ActionButton disabled>Disabled</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled:opacity-40");
    });
  });

  describe("click handling", () => {
    it("should call onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<ActionButton onClick={handleClick}>Click me</ActionButton>);
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <ActionButton onClick={handleClick} disabled>
          Disabled
        </ActionButton>,
      );
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should handle multiple clicks", () => {
      const handleClick = vi.fn();
      render(<ActionButton onClick={handleClick}>Click me</ActionButton>);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("icon support", () => {
    it("should render icon on the left by default", () => {
      render(<ActionButton icon={MockIcon}>With Icon</ActionButton>);
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("mock-icon");
      expect(icon).toBeInTheDocument();
      // Icon should come before text
      expect(button.firstChild).toContainElement(icon);
    });

    it("should render icon on the right when iconPosition is right", () => {
      render(
        <ActionButton icon={MockIcon} iconPosition="right">
          With Icon
        </ActionButton>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("mock-icon");
      expect(icon).toBeInTheDocument();
      // Icon should come after text
      expect(button.lastChild).toContainElement(icon);
    });

    it("should not render icon when not provided", () => {
      render(<ActionButton>No Icon</ActionButton>);
      expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
    });

    it("should apply correct icon size for md button", () => {
      render(
        <ActionButton icon={MockIcon} size="md">
          Icon
        </ActionButton>,
      );
      const icon = screen.getByTestId("mock-icon");
      expect(icon).toHaveClass("w-5");
      expect(icon).toHaveClass("h-5");
    });

    it("should apply correct icon size for xs button", () => {
      render(
        <ActionButton icon={MockIcon} size="xs">
          Icon
        </ActionButton>,
      );
      const icon = screen.getByTestId("mock-icon");
      expect(icon).toHaveClass("w-3");
      expect(icon).toHaveClass("h-3");
    });

    it("should apply correct icon size for xl button", () => {
      render(
        <ActionButton icon={MockIcon} size="xl">
          Icon
        </ActionButton>,
      );
      const icon = screen.getByTestId("mock-icon");
      expect(icon).toHaveClass("w-6");
      expect(icon).toHaveClass("h-6");
    });
  });

  describe("fullWidth prop", () => {
    it("should not be full width by default", () => {
      render(<ActionButton>Normal</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("w-full");
    });

    it("should be full width when fullWidth is true", () => {
      render(<ActionButton fullWidth>Full Width</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<ActionButton className="custom-class">Custom</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should merge custom className with default classes", () => {
      render(<ActionButton className="my-custom-btn">Custom</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("my-custom-btn");
      expect(button).toHaveClass("font-medium");
      expect(button).toHaveClass("transition-colors");
    });
  });

  describe("base styles", () => {
    it("should have font-medium class", () => {
      render(<ActionButton>Button</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("font-medium");
    });

    it("should have transition-colors class", () => {
      render(<ActionButton>Button</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("transition-colors");
    });

    it("should have cursor-pointer class", () => {
      render(<ActionButton>Button</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("cursor-pointer");
    });

    it("should have flex layout classes", () => {
      render(<ActionButton>Button</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("flex");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
      expect(button).toHaveClass("gap-2");
    });
  });

  describe("combined props", () => {
    it("should handle all props together correctly", () => {
      const handleClick = vi.fn();
      render(
        <ActionButton
          variant="danger"
          size="lg"
          rounded="xl"
          fullWidth
          icon={MockIcon}
          iconPosition="right"
          className="extra-class"
          onClick={handleClick}
        >
          Delete
        </ActionButton>,
      );

      const button = screen.getByRole("button");

      // Variant
      expect(button).toHaveClass("bg-rose-500");

      // Size
      expect(button).toHaveClass("px-5");
      expect(button).toHaveClass("text-base");

      // Rounded
      expect(button).toHaveClass("rounded-xl");

      // Full width
      expect(button).toHaveClass("w-full");

      // Custom class
      expect(button).toHaveClass("extra-class");

      // Icon present
      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();

      // Click handler works
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    });

    it("should handle disabled with variant correctly", () => {
      render(
        <ActionButton variant="success" disabled>
          Disabled Success
        </ActionButton>,
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("bg-emerald-500");
      expect(button).toHaveClass("disabled:opacity-40");
    });
  });

  describe("additional props", () => {
    it("should pass through additional props", () => {
      render(
        <ActionButton data-testid="custom-button" aria-label="Custom action">
          Button
        </ActionButton>,
      );

      const button = screen.getByTestId("custom-button");
      expect(button).toHaveAttribute("aria-label", "Custom action");
    });

    it("should support type attribute", () => {
      render(<ActionButton type="submit">Submit</ActionButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });
  });
});
