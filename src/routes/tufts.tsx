import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tufts")({
  head: () => ({
    meta: [
      { title: "Admissions and Aid — Tufts University" },
      { name: "description", content: "Tufts Admissions demo with embedded EdVisorly Navigate credit-transfer modal." },
    ],
  }),
  component: () => (
    <iframe
      src="/schools/tufts.html"
      title="Tufts Admissions"
      style={{ border: "none", width: "100vw", height: "100vh", display: "block" }}
    />
  ),
});
