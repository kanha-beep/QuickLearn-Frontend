import { useEffect, useRef, useState } from "react";
import { api } from "../../api.js";

let loader;
function loadGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!loader) loader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    const timer = setTimeout(fail, 15000);
    function fail() {
      clearTimeout(timer);
      script.remove();
      loader = undefined;
      reject(new Error("Unable to load Google"));
    }
    script.onload = () => { clearTimeout(timer); resolve(); };
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return loader;
}

export default function GoogleSignIn({ disabled, onCredential }) {
  const container = useRef(null);
  const callback = useRef(onCredential);
  const blocked = useRef(disabled);
  const [status, setStatus] = useState("Loading Google sign-in...");
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  useEffect(() => { callback.current = onCredential; blocked.current = disabled; });
  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    const element = container.current;
    // Sequential initialization avoids an abandoned StrictMode request replacing the nonce cookie.
    loadGoogle().then(async () => {
      if (cancelled) return;
      const { data } = await api.get("/api/auth/google/challenge");
      if (cancelled) return;
      window.google.accounts.id.initialize({
        client_id: clientId, nonce: data.nonce, auto_select: false,
        callback: ({ credential }) => {
          if (!cancelled && !blocked.current) callback.current(credential);
        },
      });
      window.google.accounts.id.renderButton(element, {
        theme: "outline", size: "large", text: "continue_with", shape: "pill",
        width: Math.min(element.clientWidth || 300, 400),
      });
      setStatus("");
    }).catch(() => {
      if (!cancelled) setStatus("Google sign-in is unavailable. Use email and password or refresh to retry.");
    });
    return () => { cancelled = true; element?.replaceChildren(); };
  }, [clientId]);
  return (
    <div className="mb-4 text-center">
      {!clientId ? <>
        <button type="button" disabled className="w-full rounded-full border border-slate-300 px-4 py-2 text-slate-400">Continue with Google</button>
        <p className="mt-2 text-xs text-slate-500">Google sign-in will be available soon.</p>
      </> : <>
        <div ref={container} inert={disabled} className={`flex justify-center ${disabled ? "opacity-50" : ""}`} />
        {status && <p role="status" className="mt-2 text-sm text-slate-500">{status}</p>}
      </>}
      <div className="mt-4 text-xs text-slate-400">or continue with email</div>
    </div>
  );
}
