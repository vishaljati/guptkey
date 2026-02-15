import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "@/store/store.ts"

function reportErrorToDOM(message: string) {
    try {
        const root = document.getElementById("root");
        if (!root) return;
        const el = document.createElement("div");
        el.style.background = "#2b021f";
        el.style.color = "#ffecec";
        el.style.padding = "16px";
        el.style.fontFamily = "monospace";
        el.style.whiteSpace = "pre-wrap";
        el.style.zIndex = "99999";
        el.innerText = "Runtime Error:\n" + message;
        root.prepend(el);
    } catch (e) {
        // ignore
    }
}

window.addEventListener("error", (e) => {
    // show errors in page to help debugging
    console.error("window.error:", e.error || e.message);
    reportErrorToDOM((e.error && e.error.stack) || String(e.message || e.error || e));
});
window.addEventListener("unhandledrejection", (e) => {
    console.error("unhandledrejection:", e.reason);
    reportErrorToDOM((e.reason && e.reason.stack) || String(e.reason));
});

try {
    createRoot(document.getElementById("root")!).render(
        <Provider store={store}>
            <App />
        </Provider>
    );
} catch (err: any) {
    console.error("Render error:", err);
    reportErrorToDOM(err && (err.stack || err.message) ? (err.stack || err.message) : String(err));
}
