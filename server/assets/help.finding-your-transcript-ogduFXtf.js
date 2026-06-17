import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
const url = "/__l5e/assets-v1/a26826d8-9a2f-46b2-b47b-c667f1d93004/edvisorly-logo.png";
const edvisorlyLogo = {
  url
};
const NAVY = "#001b3d";
const SKY = "#4ab4e8";
const SLATE = "#4a5568";
function HelpFindingTranscript() {
  return /* @__PURE__ */ jsxs("main", { style: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "48px 24px 80px",
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    color: NAVY,
    lineHeight: 1.6
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      marginBottom: 32
    }, children: /* @__PURE__ */ jsx("a", { href: "https://www.edvisorly.com/", target: "_blank", rel: "noopener noreferrer", style: {
      display: "inline-block"
    }, children: /* @__PURE__ */ jsx("img", { src: edvisorlyLogo.url, alt: "EdVisorly", style: {
      height: 36,
      width: "auto",
      display: "block"
    } }) }) }),
    /* @__PURE__ */ jsx("div", { style: {
      marginBottom: 24
    }, children: /* @__PURE__ */ jsx(Link, { to: "/", style: {
      fontSize: 13,
      color: SLATE,
      textDecoration: "none"
    }, children: "← Back" }) }),
    /* @__PURE__ */ jsx("p", { style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: SKY,
      margin: 0
    }, children: "EdVisorly Help" }),
    /* @__PURE__ */ jsx("h1", { style: {
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: "-.02em",
      lineHeight: 1.2,
      margin: "8px 0 16px",
      color: NAVY
    }, children: "How to find your college transcript" }),
    /* @__PURE__ */ jsx("p", { style: {
      fontSize: 16,
      color: SLATE,
      marginBottom: 32
    }, children: "Most students can grab their transcript in under two minutes from their student portal. Here's exactly where to look and what to upload." }),
    /* @__PURE__ */ jsx(Section, { title: "What is a transcript?", children: /* @__PURE__ */ jsx("p", { children: "Your transcript is the official record of the courses you've taken, the credits you earned, and the grades you received. It is issued by your current or previous college." }) }),
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
      borderTop: `1px solid ${SKY}33`,
      fontSize: 12,
      color: SLATE,
      textAlign: "center"
    }, children: [
      "Powered by",
      " ",
      /* @__PURE__ */ jsx("a", { href: "https://www.edvisorly.com/", target: "_blank", rel: "noopener noreferrer", style: {
        color: NAVY,
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
      margin: "0 0 8px",
      color: NAVY
    }, children: title }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 15,
      color: SLATE
    }, children })
  ] });
}
export {
  HelpFindingTranscript as component
};
