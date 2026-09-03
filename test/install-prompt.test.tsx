// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, cleanup, fireEvent, screen } from "@testing-library/preact";
import InstallPrompt from "../src/components/InstallPrompt";

afterEach(cleanup);
beforeEach(() => window.localStorage.clear());

/** Dispatch a fake `beforeinstallprompt` with spy-able prompt/userChoice. */
function fireInstallEvent() {
  const event = new Event("beforeinstallprompt") as any;
  event.prompt = vi.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome: "accepted" as const });
  window.dispatchEvent(event);
  return event;
}

describe("InstallPrompt", () => {
  it("renders nothing until the browser offers installation", () => {
    const { container } = render(<InstallPrompt />);
    expect(container.textContent).toBe("");
  });

  it("appears when beforeinstallprompt fires", async () => {
    render(<InstallPrompt />);
    fireInstallEvent();
    expect(await screen.findByText(/works fully offline/i)).toBeTruthy();
  });

  it("calls the deferred prompt when Install is clicked", async () => {
    render(<InstallPrompt />);
    const event = fireInstallEvent();
    fireEvent.click(await screen.findByText("Install"));
    expect(event.prompt).toHaveBeenCalledOnce();
  });

  it("dismisses and remembers the dismissal", async () => {
    render(<InstallPrompt />);
    fireInstallEvent();
    fireEvent.click(await screen.findByText("Not now"));
    expect(screen.queryByText("Install")).toBeNull();
    expect(window.localStorage.getItem("ai101:install-dismissed")).toBe("1");
  });

  it("stays hidden on a later visit once dismissed", async () => {
    window.localStorage.setItem("ai101:install-dismissed", "1");
    render(<InstallPrompt />);
    fireInstallEvent();
    // give the effect a tick
    await Promise.resolve();
    expect(screen.queryByText("Install")).toBeNull();
  });
});
