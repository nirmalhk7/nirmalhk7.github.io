describe("analytics utilities", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    document.title = "";
    window.history.pushState({}, "", "/");
    delete (window as Window & { gtag?: unknown }).gtag;
    delete (window as Window & { dataLayer?: unknown[] }).dataLayer;
  });

  it("maps routes to stable page types", async () => {
    const { getRoutePageType } = await import("@/util/analytics");

    expect(getRoutePageType("/")).toBe("home");
    expect(getRoutePageType("/projects")).toBe("projects");
    expect(getRoutePageType("/blog")).toBe("blog_index");
    expect(getRoutePageType("/blog/example-post")).toBe("blog_post");
    expect(getRoutePageType("/resume")).toBe("resume");
    expect(getRoutePageType("/404")).toBe("404");
    expect(getRoutePageType("/design")).toBe("design");
    expect(getRoutePageType("/anything-else")).toBe("other");
  });

  it("sends a GA page_view with page context in production", async () => {
    const gtag = jest.fn();
    (window as Window & { gtag?: typeof gtag }).gtag = gtag;

    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    try {
      const { trackPageView } = await import("@/util/analytics");

      window.history.pushState({}, "", "/projects?filter=ai");
      document.title = "Projects";

      trackPageView("/projects?filter=ai", {
        view_type: "route",
      });

      expect(gtag).toHaveBeenCalledWith(
        "event",
        "page_view",
        expect.objectContaining({
          page_path: "/projects?filter=ai",
          page_type: "projects",
          view_type: "route",
        })
      );
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });
});
