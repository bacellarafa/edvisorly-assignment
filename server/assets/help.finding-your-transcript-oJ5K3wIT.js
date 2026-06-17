import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { useRouter, isRedirect } from "@tanstack/react-router";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "./server-TpGiz5c2.js";
import { z } from "zod";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
function useServerFn(serverFn) {
  const router = useRouter();
  return React.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
const url = "/__l5e/assets-v1/a26826d8-9a2f-46b2-b47b-c667f1d93004/edvisorly-logo.png";
const edvisorlyLogo = {
  url
};
var createSsrRpc = (functionId) => {
  const url2 = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url: url2,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const submitFeedback = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  message: z.string().min(1).max(2e3),
  page: z.string().max(200).optional()
})).handler(createSsrRpc("00224a767fab32333348e7dba34873c317271f1f1f6dd290fe2726dfd29964cb"));
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
    /* @__PURE__ */ jsx("div", { style: {
      padding: "12px 16px",
      borderRadius: 8,
      background: "#f0f9ff",
      border: `1px solid ${SKY}44`,
      fontSize: 14,
      color: NAVY,
      marginBottom: 32,
      lineHeight: 1.5
    }, children: "Done here? Close this tab or switch back to your original tab to continue with the Upload step." }),
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
    /* @__PURE__ */ jsx(FeedbackSection, {}),
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
function FeedbackSection() {
  const sendFeedback = useServerFn(submitFeedback);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const validate = () => {
    const next = {};
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      await sendFeedback({
        data: {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          page: "help/finding-your-transcript"
        }
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };
  return /* @__PURE__ */ jsxs("section", { style: {
    marginTop: 48,
    paddingTop: 32,
    borderTop: `1px solid ${SKY}33`
  }, children: [
    /* @__PURE__ */ jsx("h2", { style: {
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: "-.01em",
      margin: "0 0 8px",
      color: NAVY
    }, children: "Was this helpful?" }),
    /* @__PURE__ */ jsx("p", { style: {
      fontSize: 15,
      color: SLATE,
      margin: "0 0 20px"
    }, children: "Let us know if you're still confused or if something is missing. We read every message." }),
    status === "sent" ? /* @__PURE__ */ jsx("div", { style: {
      padding: "16px 20px",
      borderRadius: 8,
      background: "#f0f9ff",
      border: `1px solid ${SKY}44`,
      color: NAVY,
      fontSize: 15
    }, children: "Thanks for your feedback — we'll use it to improve this guide." }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "fb-name", style: {
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: NAVY,
          marginBottom: 6
        }, children: "Name" }),
        /* @__PURE__ */ jsx("input", { id: "fb-name", type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Your name", style: {
          width: "100%",
          padding: "10px 12px",
          fontSize: 14,
          borderRadius: 6,
          border: `1px solid ${errors.name ? "#e11d48" : "#e2e8f0"}`,
          outline: "none",
          fontFamily: "inherit"
        } }),
        errors.name && /* @__PURE__ */ jsx("span", { style: {
          fontSize: 12,
          color: "#e11d48",
          marginTop: 4,
          display: "block"
        }, children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "fb-email", style: {
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: NAVY,
          marginBottom: 6
        }, children: "Email" }),
        /* @__PURE__ */ jsx("input", { id: "fb-email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.edu", style: {
          width: "100%",
          padding: "10px 12px",
          fontSize: 14,
          borderRadius: 6,
          border: `1px solid ${errors.email ? "#e11d48" : "#e2e8f0"}`,
          outline: "none",
          fontFamily: "inherit"
        } }),
        errors.email && /* @__PURE__ */ jsx("span", { style: {
          fontSize: 12,
          color: "#e11d48",
          marginTop: 4,
          display: "block"
        }, children: errors.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "fb-message", style: {
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: NAVY,
          marginBottom: 6
        }, children: "Message" }),
        /* @__PURE__ */ jsx("textarea", { id: "fb-message", value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Tell us what was confusing or what you'd like to see here...", rows: 4, style: {
          width: "100%",
          padding: "10px 12px",
          fontSize: 14,
          borderRadius: 6,
          border: `1px solid ${errors.message ? "#e11d48" : "#e2e8f0"}`,
          outline: "none",
          fontFamily: "inherit",
          resize: "vertical"
        } }),
        errors.message && /* @__PURE__ */ jsx("span", { style: {
          fontSize: 12,
          color: "#e11d48",
          marginTop: 4,
          display: "block"
        }, children: errors.message })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: status === "sending", style: {
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
        fontFamily: "inherit"
      }, children: status === "sending" ? "Sending…" : "Send feedback" }),
      status === "error" && /* @__PURE__ */ jsx("span", { style: {
        fontSize: 13,
        color: "#e11d48"
      }, children: "Something went wrong. Please try again." })
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
