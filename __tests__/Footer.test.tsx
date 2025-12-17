import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/ui/Footer";

describe("Footer component", () => {
  test("renders PassKeeper brand heading", () => {
    render(<Footer onScrollIntoFeatures={jest.fn()} />);

    const brand = screen.getByText("🔐 PassKeeper");
    expect(brand).toBeInTheDocument();
  });
});
