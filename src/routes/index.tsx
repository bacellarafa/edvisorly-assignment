import { createFileRoute } from "@tanstack/react-router";

function SchoolFrame({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      src={src}
      title={title}
      style={{ border: "none", width: "100vw", height: "100vh", display: "block" }}
    />
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Admissions and Aid — Tufts University" },
      { name: "description", content: "Tufts Admissions demo with embedded EdVisorly Navigate credit-transfer modal." },
    ],
  }),
  component: () => <SchoolFrame src="/schools/tufts.html" title="Tufts Admissions" />,
});
