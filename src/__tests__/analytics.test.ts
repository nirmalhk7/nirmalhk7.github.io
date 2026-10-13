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

    const environment = process.env as { NODE_ENV?: string };
    const previousNodeEnv = environment.NODE_ENV;
    environment.NODE_ENV = "production";

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
      environment.NODE_ENV = previousNodeEnv;
    }
  });

  it("queues share commands before the Google tag loads in gtag arguments format", async () => {
    const environment = process.env as { NODE_ENV?: string };
    const previousNodeEnv = environment.NODE_ENV;
    environment.NODE_ENV = "production";
    try {
      const { trackShare } = await import("@/util/analytics");
      trackShare("bluesky", "blog_post", "homelab_architect", {
        share_action: "composer_opened",
      });
      const command = (window as Window & { dataLayer?: IArguments[] }).dataLayer![0];
      expect(Object.prototype.toString.call(command)).toBe("[object Arguments]");
      expect(Array.from(command)).toEqual([
        "event", "share", expect.objectContaining({
          method: "bluesky", content_type: "blog_post", item_id: "homelab_architect",
          share_action: "composer_opened",
        }),
      ]);
    } finally {
      environment.NODE_ENV = previousNodeEnv;
    }
  });
});
