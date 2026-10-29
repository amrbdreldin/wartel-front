// ============================================================
// llms.txt builder (https://llmstxt.org)
// ============================================================
// Generated from the same i18n messages that render the landing page,
// so AI engines always read content that matches the live site.
// ============================================================

import ar from "@/i18n/messages/ar.json";
import en from "@/i18n/messages/en.json";
import { fetchPublicFaqs, getBaseUrl, SOCIAL_PROFILES } from "./seo";

type Landing = typeof en.landing;

function section(title: string, lines: string[]): string {
  return `## ${title}\n\n${lines.join("\n")}\n`;
}

function programs(l: Landing): string[] {
  return [1, 2, 3, 4].map((n) => {
    const p = l.programs as Record<string, string>;
    return `- **${p[`p${n}Title`]}** (${p[`p${n}Tag`]}): ${p[`p${n}Desc`]}`;
  });
}

function steps(l: Landing): string[] {
  const s = l.timeline as Record<string, string>;
  return [1, 2, 3, 4].map((n) => `${n}. **${s[`s${n}Title`]}**: ${s[`s${n}Desc`]}`);
}

function features(l: Landing): string[] {
  const f = l.features as Record<string, string>;
  return [1, 2, 3, 4, 5].map((n) => `- **${f[`f${n}Title`]}**: ${f[`f${n}Desc`]}`);
}

function achievements(l: Landing): string[] {
  const a = l.achievements as Record<string, string>;
  return ["cohorts", "tajweed", "norania", "grammar", "ijazatQuran", "ijazatMutun", "teachers", "tadabbur", "maqraah", "free"]
    .filter((k) => a[`${k}Title`])
    .map((k) => `- **${a[`${k}Title`]}**: ${a[`${k}Desc`]}`);
}

/** Short index – /llms.txt */
export async function buildLlmsTxt(): Promise<string> {
  const base = await getBaseUrl();
  const l = en.landing;

  return [
    `# Wartel Academy (أكاديمية ورتل)`,
    "",
    `> ${en.seo.home.description}`,
    "",
    `${l.footer.desc} Classes are taught online in Arabic by certified (Ijazah-holding) teachers. Everything, including certificates and Ijazahs, is free of charge.`,
    "",
    "Key facts:",
    "- Type: non-profit, charity-funded online Quran academy",
    "- Audience: women and children (children enrol through a parent account)",
    "- Cost: 100% free (lessons, certificates and Ijazahs)",
    "- Teaching language: Arabic; website available in Arabic and English",
    "- Subjects: Quran memorization (Hifz), Tajweed, Noorani Qaida, Quranic Arabic grammar, Ijazah in Hafs an Asim",
    "",
    section("Main pages", [
      `- [Home (English)](${base}/en): overview, tracks, features and FAQ`,
      `- [الرئيسية (Arabic)](${base}/ar): الصفحة الرئيسية باللغة العربية`,
      `- [Admission criteria](${base}/en/instructions): requirements before registering`,
      `- [Student registration](${base}/en/register): free sign-up for students (women)`,
      `- [Parent registration](${base}/en/register/parent): enrol children through a parent account`,
      `- [Contact us](${base}/en/contact-us): support and enquiries`,
    ]),
    section("Learning tracks", programs(l)),
    section("How to join", steps(l)),
    section("Contact", [
      `- Email: support@warattel.com`,
      ...SOCIAL_PROFILES.map((url) => `- ${url}`),
    ]),
    section("Optional", [
      `- [Full content for LLMs](${base}/llms-full.txt): complete bilingual description, achievements and FAQ`,
      `- [Sitemap](${base}/sitemap.xml)`,
    ]),
  ].join("\n");
}

/** Complete content – /llms-full.txt */
export async function buildLlmsFullTxt(): Promise<string> {
  const base = await getBaseUrl();
  const [faqsEn, faqsAr] = await Promise.all([fetchPublicFaqs("en"), fetchPublicFaqs("ar")]);

  const block = (lang: "en" | "ar", faqs: { question: string; answer: string }[]) => {
    const l = (lang === "en" ? en : ar).landing;
    const labels =
      lang === "en"
        ? { about: "About", tracks: "Learning tracks", steps: "How to join", features: "Platform features", achievements: "Achievements", faq: "Frequently asked questions" }
        : { about: "عن الأكاديمية", tracks: "المسارات التعليمية", steps: "خطوات الالتحاق", features: "مميزات المنصة", achievements: "الإنجازات", faq: "الأسئلة الشائعة" };

    return [
      section(labels.about, [
        `${l.about.title}. ${l.about.desc}`,
        "",
        l.hero.desc,
        "",
        l.footer.desc,
      ]),
      section(labels.tracks, [l.programs.desc, "", ...programs(l)]),
      section(labels.steps, steps(l)),
      section(labels.features, features(l)),
      section(labels.achievements, [l.achievements.description, "", ...achievements(l)]),
      faqs.length > 0
        ? section(labels.faq, faqs.map((f) => `### ${f.question}\n\n${f.answer}\n`))
        : "",
    ].join("\n");
  };

  return [
    await buildLlmsTxt(),
    "---",
    "",
    `# English — ${base}/en`,
    "",
    block("en", faqsEn),
    "---",
    "",
    `# العربية — ${base}/ar`,
    "",
    block("ar", faqsAr),
  ].join("\n");
}
