import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/northeastern")({
  head: () => ({
    meta: [
      { title: "Admissions — Northeastern University" },
      { name: "description", content: "Northeastern Admissions demo with embedded EdVisorly Navigate credit-transfer modal." },
    ],
  }),
  component: () => (
    <iframe
      src="/schools/northeastern.html"
      title="Northeastern Admissions"
      style={{ border: "none", width: "100vw", height: "100vh", display: "block" }}
    />
  ),
});
