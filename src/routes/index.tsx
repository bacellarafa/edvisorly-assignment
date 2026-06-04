import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Transfer Admissions — Tufts University" },
      { name: "description", content: "Tufts Transfer Admissions embedded preview." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/navigateembedded.html"
      title="Navigate Embedded Preview"
      style={{ border: "none", width: "100vw", height: "100vh", display: "block" }}
    />
  );
}
