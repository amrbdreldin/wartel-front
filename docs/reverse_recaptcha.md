# Reversing reCAPTCHA Bypass Logic

If you want to re-enable reCAPTCHA in the project in the future, follow these steps to undo the bypass modifications:

## 1. Upstream API Proxy Route
In the API proxy file [route.ts](file:///d:/programming/volunteering/warattel-academy/src/app/api/proxy/[...path]/route.ts), restore the original logic inside the `verifyRecaptcha` function:

```diff
-async function verifyRecaptcha(token: string): Promise<boolean> {
-  // reCAPTCHA bypassed
-  return true;
-}
+async function verifyRecaptcha(token: string): Promise<boolean> {
+  if (process.env.NODE_ENV !== "production") {
+    console.warn(`[proxy] Skipping reCAPTCHA verification in development. Token received: ${token ? "yes" : "no"}`);
+    return true;
+  }
+
+  if (!token) return false;
+
+  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
+  if (!secretKey) {
+    console.error("[proxy] Missing RECAPTCHA_SECRET_KEY in environment variables.");
+    return false;
+  }
+
+  try {
+    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
+      method: "POST",
+      headers: {
+        "Content-Type": "application/x-www-form-urlencoded",
+      },
+      body: new URLSearchParams({
+        secret: secretKey,
+        response: token,
+      }),
+    });
+
+    const data = await response.json();
+    if (!data.success) {
+      console.error("[proxy] reCAPTCHA siteverify returned success: false", data["error-codes"]);
+      return false;
+    }
+
+    // reCAPTCHA v3 score threshold check (default 0.5)
+    if (typeof data.score === "number" && data.score < 0.5) {
+      console.warn(`[proxy] reCAPTCHA v3 score below threshold: ${data.score}`);
+      return false;
+    }
+
+    return true;
+  } catch (err) {
+    console.error("[proxy] reCAPTCHA validation request failed:", err);
+    return false;
+  }
+}
```

---

## 2. Client-side reCAPTCHA Utility
In [recaptcha.ts](file:///d:/programming/volunteering/warattel-academy/src/utils/recaptcha.ts), restore script loading and execution wrappers to load the actual Google reCAPTCHA v3 API:

```diff
-export const loadRecaptchaScript = (siteKey: string): Promise<void> => {
-  return Promise.resolve();
-};
-
-/**
- * Executes reCAPTCHA v3 and returns a verification token.
- */
-export const executeRecaptcha = async (action: string): Promise<string> => {
-  return "";
-};
+export const loadRecaptchaScript = (siteKey: string): Promise<void> => {
+  return new Promise((resolve) => {
+    if (typeof window === "undefined") {
+      resolve();
+      return;
+    }
+
+    if (window.grecaptcha && window.grecaptcha.execute) {
+      resolve();
+      return;
+    }
+
+    const existingScript = document.getElementById("recaptcha-v3-script");
+    if (existingScript) {
+      const interval = setInterval(() => {
+        if (window.grecaptcha && window.grecaptcha.execute) {
+          clearInterval(interval);
+          resolve();
+        }
+      }, 50);
+      return;
+    }
+
+    const script = document.createElement("script");
+    script.id = "recaptcha-v3-script";
+    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
+    script.async = true;
+    script.defer = true;
+    script.onload = () => {
+      if (window.grecaptcha) {
+        window.grecaptcha.ready(() => {
+          resolve();
+        });
+      } else {
+        resolve();
+      }
+    };
+    script.onerror = () => {
+      console.error("Failed to load reCAPTCHA v3 script");
+      resolve();
+    };
+    document.body.appendChild(script);
+  });
+};
+
+export const executeRecaptcha = async (action: string): Promise<string> => {
+  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
+  if (!siteKey) {
+    console.warn("reCAPTCHA site key is missing in environment variables");
+    return "";
+  }
+
+  await loadRecaptchaScript(siteKey);
+
+  if (window.grecaptcha && window.grecaptcha.execute) {
+    try {
+      const token = await window.grecaptcha.execute(siteKey, { action });
+      return token;
+    } catch (error) {
+      console.error("Error executing reCAPTCHA v3:", error);
+      return "";
+    }
+  }
+
+  return "";
+};
```

---

## 3. Disclaimers Rendering
Uncomment the reCAPTCHA disclaimer markup in the following files:
1. [OngoingLoginModal.tsx](file:///d:/programming/volunteering/warattel-academy/src/components/common/OngoingLoginModal.tsx)
2. [LoginForm.tsx](file:///d:/programming/volunteering/warattel-academy/src/app/[locale]/(auth)/login/_components/LoginForm.tsx)
3. [RegisterForm.tsx](file:///d:/programming/volunteering/warattel-academy/src/app/[locale]/(auth)/register/_components/RegisterForm.tsx)
4. [ParentRegisterForm.tsx](file:///d:/programming/volunteering/warattel-academy/src/app/[locale]/(auth)/register/_components/ParentRegisterForm.tsx)
