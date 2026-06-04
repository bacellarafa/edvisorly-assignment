import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bu")({
  head: () => ({
    meta: [
      { title: "Admissions Overview — Boston University" },
      { name: "description", content: "Boston University Admissions demo with embedded EdVisorly Navigate credit-transfer modal." },
    ],
  }),
  component: () => (
    <iframe
      src="/schools/bu.html"
      title="Boston University Admissions"
      style={{ border: "none", width: "100vw", height: "100vh", display: "block" }}
    />
  ),
});
