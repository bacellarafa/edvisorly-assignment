import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/help/finding-your-transcript")({
  head: () => ({
    meta: [
      { title: "How to find your college transcript — EdVisorly Help" },
      {
        name: "description",
        content:
          "Step-by-step guide to downloading an unofficial transcript from your student portal so you can upload it for a transfer credit evaluation.",
      },
      { property: "og:title", content: "How to find your college transcript — EdVisorly Help" },
      {
        property: "og:description",
        content:
          "Step-by-step guide to downloading an unofficial transcript from your student portal.",
      },
    ],
  }),
  component: HelpFindingTranscript,
});

function HelpFindingTranscript() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px 80px",
        fontFamily:
          "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        color: "#1a1a1a",
        lineHeight: 1.6,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Link to="/" style={{ fontSize: 13, color: "#6a655d", textDecoration: "none" }}>
          ← Back
        </Link>
      </div>

      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "#8a857d",
          margin: 0,
        }}
      >
        EdVisorly Help
      </p>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "-.02em",
          lineHeight: 1.2,
          margin: "8px 0 16px",
        }}
      >
        How to find your college transcript
      </h1>
      <p style={{ fontSize: 16, color: "#4a4640", marginBottom: 32 }}>
        Most students can grab their transcript in under two minutes from their student
        portal. Here's exactly where to look and what to upload.
      </p>

      <Section title="What is a transcript?">
        <p>
          Your transcript is the official record of the courses you've taken, the credits
          you earned, and the grades you received. It's issued by your current or previous
          college.
        </p>
      </Section>

      <Section title="Unofficial is fine for transfer evaluations">
        <p>
          For a transfer credit evaluation here, an <strong>unofficial transcript</strong>{" "}
          downloaded as a PDF from your student portal is enough. You don't need to order an
          official sealed transcript from your registrar.
        </p>
      </Section>

      <Section title="How to download your transcript">
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li style={{ marginBottom: 8 }}>
            Sign in to your <strong>student portal</strong> (Banner, Workday, Self-Service,
            MyCollege, PeopleSoft, etc.).
          </li>
          <li style={{ marginBottom: 8 }}>
            Open the <strong>Academics</strong> section. Look for{" "}
            <strong>Records</strong>, <strong>Transcripts</strong>,{" "}
            <strong>Grades</strong>, or <strong>Academic History</strong>.
          </li>
          <li style={{ marginBottom: 8 }}>
            Choose <strong>View / Print Unofficial Transcript</strong> and save it as a{" "}
            <strong>PDF</strong>.
          </li>
          <li>
            If your school only shows the transcript on screen, use your browser's{" "}
            <strong>Print → Save as PDF</strong> to capture it.
          </li>
        </ol>
      </Section>

      <Section title="Common student portals">
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li>
            <strong>Banner / Self-Service:</strong> Student → Student Records → Academic
            Transcript.
          </li>
          <li>
            <strong>Workday Student:</strong> Academics → View My Academic History or My
            Grades.
          </li>
          <li>
            <strong>PeopleSoft Campus Solutions:</strong> Student Center → Academics → View
            Unofficial Transcript.
          </li>
          <li>
            <strong>MyCollege / Colleague Self-Service:</strong> Academics → Unofficial
            Transcript.
          </li>
          <li>
            <strong>Canvas / Blackboard:</strong> These are course platforms, not
            registrars — your transcript lives in the student portal, not here.
          </li>
        </ul>
      </Section>

      <Section title="Tips for a clean upload">
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li>Prefer the official PDF from your portal over a phone photo.</li>
          <li>If you have to scan, keep the page flat, well-lit, and unrotated.</li>
          <li>PDF, JPG, or PNG — up to 10 MB.</li>
        </ul>
      </Section>

      <Section title="Is my transcript secure?">
        <p>
          Yes. Your transcript is encrypted in transit and at rest, and is only used to
          evaluate how your credits transfer. We don't share it with anyone outside the
          evaluation.
        </p>
      </Section>

      <Section title="Still stuck?">
        <p>
          Your school's <strong>registrar's office</strong> can walk you through finding
          your transcript in their portal. You can also skip the upload and{" "}
          <strong>enter your courses manually</strong> on the next screen of the
          evaluation.
        </p>
      </Section>

      <div
        style={{
          marginTop: 48,
          paddingTop: 20,
          borderTop: "1px solid rgba(0,0,0,.08)",
          fontSize: 12,
          color: "#8a857d",
          textAlign: "center",
        }}
      >
        Powered by{" "}
        <a
          href="https://www.edvisorly.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1a1a1a", fontWeight: 700, textDecoration: "none" }}
        >
          EdVisorly
        </a>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-.01em",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: 15, color: "#3a3630" }}>{children}</div>
    </section>
  );
}
