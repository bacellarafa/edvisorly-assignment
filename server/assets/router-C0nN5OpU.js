import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
const appCss = "/assets/styles-YGQ8rgZ9.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$6 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Edvisorly Navigate" },
      { name: "description", content: "This prototype follows Jordan — a community college student checking whether her credits transfer to Tufts before she applies. Tap DEMO to explore each scenario" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Edvisorly Navigate" },
      { property: "og:description", content: "This prototype follows Jordan — a community college student checking whether her credits transfer to Tufts before she applies. Tap DEMO to explore each scenario" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Edvisorly Navigate" },
      { name: "twitter:description", content: "This prototype follows Jordan — a community college student checking whether her credits transfer to Tufts before she applies. Tap DEMO to explore each scenario" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/247fda48-6979-48b8-8ed2-7a8e8444d5da/id-preview-add6219d--821d546f-6104-4880-a0b0-68da72a5e9f2.lovable.app-1780603856601.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/247fda48-6979-48b8-8ed2-7a8e8444d5da/id-preview-add6219d--821d546f-6104-4880-a0b0-68da72a5e9f2.lovable.app-1780603856601.png" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$6.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const $$splitComponentImporter$5 = () => import("./umass-ClB3bEUU.js");
const Route$5 = createFileRoute("/umass")({
  head: () => ({
    meta: [{
      title: "Admissions — UMass Amherst"
    }, {
      name: "description",
      content: "UMass Amherst Admissions demo with embedded EdVisorly Navigate credit-transfer modal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./tufts-D8X7kox8.js");
const Route$4 = createFileRoute("/tufts")({
  head: () => ({
    meta: [{
      title: "Admissions and Aid — Tufts University"
    }, {
      name: "description",
      content: "Tufts Admissions demo with embedded EdVisorly Navigate credit-transfer modal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./northeastern-BXJSP1_H.js");
const Route$3 = createFileRoute("/northeastern")({
  head: () => ({
    meta: [{
      title: "Admissions — Northeastern University"
    }, {
      name: "description",
      content: "Northeastern Admissions demo with embedded EdVisorly Navigate credit-transfer modal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./bu-CYTs8K_e.js");
const Route$2 = createFileRoute("/bu")({
  head: () => ({
    meta: [{
      title: "Admissions Overview — Boston University"
    }, {
      name: "description",
      content: "Boston University Admissions demo with embedded EdVisorly Navigate credit-transfer modal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-C-hQWwFm.js");
const Route$1 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Admissions and Aid — Tufts University"
    }, {
      name: "description",
      content: "Tufts Admissions demo with embedded EdVisorly Navigate credit-transfer modal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./help.finding-your-transcript-DTCUnFRG.js");
const Route = createFileRoute("/help/finding-your-transcript")({
  head: () => ({
    meta: [{
      title: "How to find your college transcript — EdVisorly Help"
    }, {
      name: "description",
      content: "Step-by-step guide to downloading an unofficial transcript from your student portal so you can upload it for a transfer credit evaluation."
    }, {
      property: "og:title",
      content: "How to find your college transcript — EdVisorly Help"
    }, {
      property: "og:description",
      content: "Step-by-step guide to downloading an unofficial transcript from your student portal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UmassRoute = Route$5.update({
  id: "/umass",
  path: "/umass",
  getParentRoute: () => Route$6
});
const TuftsRoute = Route$4.update({
  id: "/tufts",
  path: "/tufts",
  getParentRoute: () => Route$6
});
const NortheasternRoute = Route$3.update({
  id: "/northeastern",
  path: "/northeastern",
  getParentRoute: () => Route$6
});
const BuRoute = Route$2.update({
  id: "/bu",
  path: "/bu",
  getParentRoute: () => Route$6
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
const HelpFindingYourTranscriptRoute = Route.update({
  id: "/help/finding-your-transcript",
  path: "/help/finding-your-transcript",
  getParentRoute: () => Route$6
});
const rootRouteChildren = {
  IndexRoute,
  BuRoute,
  NortheasternRoute,
  TuftsRoute,
  UmassRoute,
  HelpFindingYourTranscriptRoute
};
const routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
