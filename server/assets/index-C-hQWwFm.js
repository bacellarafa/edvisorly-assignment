import { jsx } from "react/jsx-runtime";
function SchoolFrame({
  src,
  title
}) {
  return /* @__PURE__ */ jsx("iframe", { src, title, style: {
    border: "none",
    width: "100vw",
    height: "100vh",
    display: "block"
  } });
}
const SplitComponent = () => /* @__PURE__ */ jsx(SchoolFrame, { src: "/schools/tufts.html", title: "Tufts Admissions" });
export {
  SplitComponent as component
};
