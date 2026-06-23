# Warattel Academy - Development Guidelines & Enhancements Reference

This file documents the core enhancements, UI/UX rules, and API handling conventions established during the development of Warattel Academy. **Always refer to these guidelines when building new forms or integrating APIs.**

## 1. Form Submissions & UX
- **Action State Tracking**: Never rely solely on Formik's internal `isSubmitting` when handling asynchronous network requests (like React Query mutations). Always use the `isPending` state directly returned from the mutation hook to accurately disable buttons and show loaders.
- **Auto-Scroll to Errors**: Every form must implement an auto-scroll mechanism so that if a user tries to submit an invalid form, the screen smoothly scrolls to the first field with an error. 
  - *Implementation tip:* Use a custom `<ScrollToFieldError />` component inside Formik that listens to `submitCount` and `isValid`.
- **Loading Text**: Use descriptive, context-aware loading text on buttons during submission (e.g., `جاري الإرسال` / `Sending...`) instead of generic "Loading..." (`جار التحميل`).
- **Clear Error Hints**: Never block form submission silently. If custom components (like Path/Course selectors) are required, ensure explicit red error messages pop up alongside them when they are skipped.

## 2. API Feedback & Toast Notifications
- **Toast Notifications**: After *every* API request (success or error), provide user feedback using `sonner` (`toast.success` and `toast.error`).
  - *Toaster Configuration:* Ensure `<Toaster />` is positioned at `"bottom-left"` to respect the RTL flow without covering central content.
  - *Error messages:* Try to extract the exact error message from the backend (e.g., `err.response?.data?.message`).
- **Success Views over Redirects**: When a major flow finishes (like Registration), don't abruptly redirect the user to a blank login page. Instead, gracefully fade in a "Success View" directly within the component (e.g., "Your application is under review") so the user gets closure and understands the next steps.

## 3. Localization & Translation
- **Namespace Awareness**: When a component is wrapped in a specific namespace (e.g., `const t = useTranslations("auth")`), remember that shared/global keys like `validation.required` will break if passed to it directly. Always instantiate a root translator (`const tRoot = useTranslations()`) to resolve global validation errors.
- **Maintain Parity**: Any new UI key (like `"sending"`, `"backToHome"`, or custom success messages) must be added simultaneously to both `ar.json` and `en.json` to prevent Next-Intl missing message crashes.

## 4. API Proxy & Security (Next.js Route Handlers)
- **Multipart/FormData Uploads**: When passing file uploads through the Next.js API proxy to the backend, intercept the request with `await req.formData()`. **Crucially, strip the incoming `content-type` header** before forwarding it using `fetch`. This allows the Node `fetch` API to automatically generate a fresh, mathematically correct `multipart/form-data` boundary.
- **Response Header Stripping**: Always strip `content-encoding` and `content-length` from the backend's response before sending it back to the client. If the backend sends gzipped data, Node's `fetch` automatically decompresses it. Passing the gzip header back down to the browser will cause an `ERR_CONTENT_DECODING_FAILED` network crash.

*Remember: The core philosophy is a Premium UI with robust, informative feedback loops that never leave the user guessing what happened.*
