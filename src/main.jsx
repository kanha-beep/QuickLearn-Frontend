import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import App from "./App.jsx";

const currentUrl = new URL(window.location.href);
const redirectTarget = currentUrl.searchParams.get("__redirect");

if (redirectTarget) {
  const decodedTarget = decodeURIComponent(redirectTarget);
  window.history.replaceState(null, "", decodedTarget);
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
