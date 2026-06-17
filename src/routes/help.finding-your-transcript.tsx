import { useState, useId } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import edvisorlyLogo from "@/assets/edvisorly-logo.png.asset.json";
import { submitFeedback } from "@/lib/feedback.functions";

const NAVY = "#001b3d";
const SKY = "#4ab4e8";
const SLATE = "#4a5568";

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
  const [bannerVisible, setBannerVisible] = useState(true);
  const bannerId = useId();
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px 80px",
        fontFamily:
          "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        color: NAVY,
        lineHeight: 1.6,
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <a
          href="https://www.edvisorly.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block" }}
        >
          <img
            src={edvisorlyLogo.url}
            alt="EdVisorly"
            style={{ height: 36, width: "auto", display: "block" }}
          />
        </a>
      </div>


      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: SKY,
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
          color: NAVY,
        }}
      >
        How to find your college transcript
      </h1>
      <p style={{ fontSize: 16, color: SLATE, marginBottom: 32 }}>
        Most students can grab their transcript in under two minutes from their student
        portal. Here's exactly where to look and what to upload.
      </p>


      <Section title="What is a transcript?">
        <p>
          Your transcript is the official record of the courses you've taken, the credits
          you earned, and the grades you received. It is issued by your current or previous
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

      <FeedbackSection />

      <div
        style={{
          marginTop: 48,
          paddingTop: 20,
          borderTop: `1px solid ${SKY}33`,
          fontSize: 12,
          color: SLATE,
          textAlign: "center",
        }}
      >
        Powered by{" "}
        <a
          href="https://www.edvisorly.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: NAVY, fontWeight: 700, textDecoration: "none" }}
        >
          EdVisorly
        </a>
      </div>
    </main>
  );
}


function FeedbackSection() {
  const sendFeedback = useServerFn(submitFeedback);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!email.trim()) {
      next.email = "Please enter your email.";
    } else if (!email.includes("@") || !email.includes(".")) {
      next.email = "Please enter a valid email.";
    }
    if (!message.trim()) next.message = "Please enter a message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      await sendFeedback({
        data: {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          page: "help/finding-your-transcript",
        },
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${SKY}33` }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-.01em",
          margin: "0 0 8px",
          color: NAVY,
        }}
      >
        Was this helpful?
      </h2>
      <p style={{ fontSize: 15, color: SLATE, margin: "0 0 20px" }}>
        Let us know if you're still confused or if something is missing. We read every message.
      </p>

      {status === "sent" ? (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: 8,
            background: "#f0f9ff",
            border: `1px solid ${SKY}44`,
            color: NAVY,
            fontSize: 15,
          }}
        >
          Thanks for your feedback — we'll use it to improve this guide.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label
              htmlFor="fb-name"
              style={{ display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }}
            >
              Name
            </label>
            <input
              id="fb-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: `1px solid ${errors.name ? "#e11d48" : "#e2e8f0"}`,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            {errors.name && (
              <span style={{ fontSize: 12, color: "#e11d48", marginTop: 4, display: "block" }}>
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="fb-email"
              style={{ display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }}
            >
              Email
            </label>
            <input
              id="fb-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.edu"
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: `1px solid ${errors.email ? "#e11d48" : "#e2e8f0"}`,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            {errors.email && (
              <span style={{ fontSize: 12, color: "#e11d48", marginTop: 4, display: "block" }}>
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="fb-message"
              style={{ display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }}
            >
              Message
            </label>
            <textarea
              id="fb-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what was confusing or what you'd like to see here..."
              rows={4}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: `1px solid ${errors.message ? "#e11d48" : "#e2e8f0"}`,
                outline: "none",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
            {errors.message && (
              <span style={{ fontSize: 12, color: "#e11d48", marginTop: 4, display: "block" }}>
                {errors.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              alignSelf: "flex-start",
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: NAVY,
              border: "none",
              borderRadius: 6,
              cursor: status === "sending" ? "not-allowed" : "pointer",
              opacity: status === "sending" ? 0.7 : 1,
              fontFamily: "inherit",
            }}
          >
            {status === "sending" ? "Sending…" : "Send feedback"}
          </button>

          {status === "error" && (
            <span style={{ fontSize: 13, color: "#e11d48" }}>
              Something went wrong. Please try again.
            </span>
          )}
        </form>
      )}
    </section>
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
          color: NAVY,
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: 15, color: SLATE }}>{children}</div>
    </section>
  );
}
