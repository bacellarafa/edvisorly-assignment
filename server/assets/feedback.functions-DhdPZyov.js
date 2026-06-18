import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./server-CKRh7Hjq.js";
import { z } from "zod";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const submitFeedback_createServerFn_handler = createServerRpc({
  id: "00224a767fab32333348e7dba34873c317271f1f1f6dd290fe2726dfd29964cb",
  name: "submitFeedback",
  filename: "src/lib/feedback.functions.ts"
}, (opts) => submitFeedback.__executeServer(opts));
const submitFeedback = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  message: z.string().min(1).max(2e3),
  page: z.string().max(200).optional()
})).handler(submitFeedback_createServerFn_handler, async ({
  data
}) => {
  console.log("[Feedback received]", {
    name: data.name,
    email: data.email,
    message: data.message,
    page: data.page,
    receivedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  return {
    ok: true
  };
});
export {
  submitFeedback_createServerFn_handler
};
