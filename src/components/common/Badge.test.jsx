/**
 * Unit Tests for Badge Component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
  describe("rendering", () => {
    it("should render with a count", () => {
      render(<Badge count={5} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should not render when count is 0", () => {
      const { container } = render(<Badge count={0} />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when count is negative", () => {
      const { container } = render(<Badge count={-5} />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when count is null", () => {
      const { container } = render(<Badge count={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when count is undefined", () => {
      const { container } = render(<Badge count={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it('should display "99+" when count exceeds 99', () => {
      render(<Badge count={100} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it('should display "99+" when count is 150', () => {
      render(<Badge count={150} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("should display exact count when count is 99", () => {
      render(<Badge count={99} />);
      expect(screen.getByText("99")).toBeInTheDocument();
    });

    it("should display exact count when count is 1", () => {
      render(<Badge count={1} />);
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("should apply primary variant classes by default", () => {
      render(<Badge count={5} />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("bg-orange-500");
      expect(badge).toHaveClass("text-white");
    });

    it("should apply secondary variant classes", () => {
      render(<Badge count={5} variant="secondary" />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("bg-slate-500");
      expect(badge).toHaveClass("text-white");
    });

    it("should apply danger variant classes", () => {
      render(<Badge count={5} variant="danger" />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("bg-red-500");
      expect(badge).toHaveClass("text-white");
    });

    it("should apply success variant classes", () => {
      render(<Badge count={5} variant="success" />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("bg-emerald-500");
      expect(badge).toHaveClass("text-white");
    });

    it("should apply light variant classes", () => {
      render(<Badge count={5} variant="light" />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("bg-white/20");
      expect(badge).toHaveClass("text-white");
    });
  });

  describe("sizes", () => {
    it("should apply medium size classes by default", () => {
      render(<Badge count={5} />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("text-xs");
      expect(badge).toHaveClass("px-2");
      expect(badge).toHaveClass("min-w-[20px]");
    });

    it("should apply small size classes", () => {
      render(<Badge count={5} size="sm" />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("text-[10px]");
      expect(badge).toHaveClass("px-1.5");
      expect(badge).toHaveClass("min-w-[16px]");
    });

    it("should apply large size classes", () => {
      render(<Badge count={5} size="lg" />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("text-sm");
      expect(badge).toHaveClass("px-2.5");
      expect(badge).toHaveClass("min-w-[24px]");
    });
  });

  describe("animation", () => {
    it("should render as motion.span when animate is true (default)", () => {
      const { container } = render(<Badge count={5} animate={true} />);
      // When animated, framer-motion adds style attributes
      const badge = container.querySelector("span");
      expect(badge).toBeInTheDocument();
    });

    it("should render as regular span when animate is false", () => {
      const { container } = render(<Badge count={5} animate={false} />);
      const badge = container.querySelector("span");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("5");
    });

    it("should still display correct count when not animated", () => {
      render(<Badge count={42} animate={false} />);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it('should still display "99+" when count > 99 and not animated', () => {
      render(<Badge count={200} animate={false} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<Badge count={5} className="custom-class" />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("custom-class");
    });

    it("should merge custom className with default classes", () => {
      render(<Badge count={5} className="my-custom-class" />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("my-custom-class");
      expect(badge).toHaveClass("rounded-full");
      expect(badge).toHaveClass("font-semibold");
    });
  });

  describe("base classes", () => {
    it("should always have rounded-full class", () => {
      render(<Badge count={5} />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("rounded-full");
    });

    it("should always have text-center class", () => {
      render(<Badge count={5} />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("text-center");
    });

    it("should always have font-semibold class", () => {
      render(<Badge count={5} />);
      const badge = screen.getByText("5");
      expect(badge).toHaveClass("font-semibold");
    });
  });

  describe("combined props", () => {
    it("should handle multiple props correctly", () => {
      render(
        <Badge
          count={50}
          variant="danger"
          size="lg"
          animate={false}
          className="extra-class"
        />,
      );
      const badge = screen.getByText("50");
      expect(badge).toHaveClass("bg-red-500");
      expect(badge).toHaveClass("text-sm");
      expect(badge).toHaveClass("extra-class");
    });

    it("should handle edge case count of 99 with all props", () => {
      render(<Badge count={99} variant="success" size="sm" animate={false} />);
      const badge = screen.getByText("99");
      expect(badge).toHaveClass("bg-emerald-500");
      expect(badge).toHaveClass("text-[10px]");
    });
  });
});
