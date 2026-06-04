import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/umass")({
  head: () => ({
    meta: [
      { title: "Admissions — UMass Amherst" },
      { name: "description", content: "UMass Amherst Admissions demo with embedded EdVisorly Navigate credit-transfer modal." },
    ],
  }),
  component: () => (
    <iframe
      src="/schools/umass.html"
      title="UMass Admissions"
      style={{ border: "none", width: "100vw", height: "100vh", display: "block" }}
    />
  ),
});
