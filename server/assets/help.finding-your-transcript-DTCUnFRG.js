import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
function HelpFindingTranscript() {
  return /* @__PURE__ */ jsxs("main", { style: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "48px 24px 80px",
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    color: "#1a1a1a",
    lineHeight: 1.6
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      marginBottom: 24
    }, children: /* @__PURE__ */ jsx(Link, { to: "/", style: {
      fontSize: 13,
      color: "#6a655d",
      textDecoration: "none"
    }, children: "← Back" }) }),
    /* @__PURE__ */ jsx("p", { style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "#8a857d",
      margin: 0
    }, children: "EdVisorly Help" }),
    /* @__PURE__ */ jsx("h1", { style: {
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: "-.02em",
      lineHeight: 1.2,
      margin: "8px 0 16px"
    }, children: "How to find your college transcript" }),
    /* @__PURE__ */ jsx("p", { style: {
      fontSize: 16,
      color: "#4a4640",
      marginBottom: 32
    }, children: "Most students can grab their transcript in under two minutes from their student portal. Here's exactly where to look and what to upload." }),
    /* @__PURE__ */ jsx(Section, { title: "What is a transcript?", children: /* @__PURE__ */ jsx("p", { children: "Your transcript is the official record of the courses you've taken, the credits you earned, and the grades you received. It's issued by your current or previous college." }) }),
    /* @__PURE__ */ jsx(Section, { title: "Unofficial is fine for transfer evaluations", children: /* @__PURE__ */ jsxs("p", { children: [
      "For a transfer credit evaluation here, an ",
      /* @__PURE__ */ jsx("strong", { children: "unofficial transcript" }),
      " ",
      "downloaded as a PDF from your student portal is enough. You don't need to order an official sealed transcript from your registrar."
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "How to download your transcript", children: /* @__PURE__ */ jsxs("ol", { style: {
      paddingLeft: 20,
      margin: 0
    }, children: [
      /* @__PURE__ */ jsxs("li", { style: {
        marginBottom: 8
      }, children: [
        "Sign in to your ",
        /* @__PURE__ */ jsx("strong", { children: "student portal" }),
        " (Banner, Workday, Self-Service, MyCollege, PeopleSoft, etc.)."
      ] }),
      /* @__PURE__ */ jsxs("li", { style: {
        marginBottom: 8
      }, children: [
        "Open the ",
        /* @__PURE__ */ jsx("strong", { children: "Academics" }),
        " section. Look for",
        " ",
        /* @__PURE__ */ jsx("strong", { children: "Records" }),
        ", ",
        /* @__PURE__ */ jsx("strong", { children: "Transcripts" }),
        ",",
        " ",
        /* @__PURE__ */ jsx("strong", { children: "Grades" }),
        ", or ",
        /* @__PURE__ */ jsx("strong", { children: "Academic History" }),
        "."
      ] }),
      /* @__PURE__ */ jsxs("li", { style: {
        marginBottom: 8
      }, children: [
        "Choose ",
        /* @__PURE__ */ jsx("strong", { children: "View / Print Unofficial Transcript" }),
        " and save it as a",
        " ",
        /* @__PURE__ */ jsx("strong", { children: "PDF" }),
        "."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        "If your school only shows the transcript on screen, use your browser's",
        " ",
        /* @__PURE__ */ jsx("strong", { children: "Print → Save as PDF" }),
        " to capture it."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Common student portals", children: /* @__PURE__ */ jsxs("ul", { style: {
      paddingLeft: 20,
      margin: 0
    }, children: [
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Banner / Self-Service:" }),
        " Student → Student Records → Academic Transcript."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Workday Student:" }),
        " Academics → View My Academic History or My Grades."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "PeopleSoft Campus Solutions:" }),
        " Student Center → Academics → View Unofficial Transcript."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "MyCollege / Colleague Self-Service:" }),
        " Academics → Unofficial Transcript."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Canvas / Blackboard:" }),
        " These are course platforms, not registrars — your transcript lives in the student portal, not here."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Tips for a clean upload", children: /* @__PURE__ */ jsxs("ul", { style: {
      paddingLeft: 20,
      margin: 0
    }, children: [
      /* @__PURE__ */ jsx("li", { children: "Prefer the official PDF from your portal over a phone photo." }),
      /* @__PURE__ */ jsx("li", { children: "If you have to scan, keep the page flat, well-lit, and unrotated." }),
      /* @__PURE__ */ jsx("li", { children: "PDF, JPG, or PNG — up to 10 MB." })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Is my transcript secure?", children: /* @__PURE__ */ jsx("p", { children: "Yes. Your transcript is encrypted in transit and at rest, and is only used to evaluate how your credits transfer. We don't share it with anyone outside the evaluation." }) }),
    /* @__PURE__ */ jsx(Section, { title: "Still stuck?", children: /* @__PURE__ */ jsxs("p", { children: [
      "Your school's ",
      /* @__PURE__ */ jsx("strong", { children: "registrar's office" }),
      " can walk you through finding your transcript in their portal. You can also skip the upload and",
      " ",
      /* @__PURE__ */ jsx("strong", { children: "enter your courses manually" }),
      " on the next screen of the evaluation."
    ] }) }),
    /* @__PURE__ */ jsxs("div", { style: {
      marginTop: 48,
      paddingTop: 20,
      borderTop: "1px solid rgba(0,0,0,.08)",
      fontSize: 12,
      color: "#8a857d",
      textAlign: "center"
    }, children: [
      "Powered by",
      " ",
      /* @__PURE__ */ jsx("a", { href: "https://www.edvisorly.com/", target: "_blank", rel: "noopener noreferrer", style: {
        color: "#1a1a1a",
        fontWeight: 700,
        textDecoration: "none"
      }, children: "EdVisorly" })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("section", { style: {
    marginBottom: 28
  }, children: [
    /* @__PURE__ */ jsx("h2", { style: {
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: "-.01em",
      margin: "0 0 8px"
    }, children: title }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 15,
      color: "#3a3630"
    }, children })
  ] });
}
export {
  HelpFindingTranscript as component
};
