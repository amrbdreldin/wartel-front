import type { SeoPageDefinition } from "./types";

// Steps mirror the real flow: /instructions?type=… → /register (name, age, WhatsApp,
// password, track, recitation audio, consent) → review → placement.
// Parents: /register/parent → log in → "Add New Child" or link an existing child by PIN.
// Contacts = SOCIAL_PROFILES in src/lib/seo.ts.

const TELEGRAM = "https://t.me/+_mhvkTv6CH44MWFk";
const WHATSAPP = "https://wa.me/201229449474";

export const howToRegisterPage: SeoPageDefinition = {
  key: "register",
  path: "/how-to-register",
  kind: "landing",
  related: ["women", "kids", "free"],
  content: {
    ar: {
      keyword: "طريقة التسجيل في أكاديمية ورتل",
      title: "طريقة التسجيل في أكاديمية ورتل | خطوات ورابط مباشر",
      description:
        "طريقة التسجيل في أكاديمية ورتل خطوة بخطوة: الرابط المباشر، تسجيل ولي الأمر، عدد الحصص، والتواصل عبر واتساب وتلغرام. التسجيل مجاني، سجّل الآن.",
      h1: "طريقة التسجيل في أكاديمية ورتل خطوة بخطوة",
      linkLabel: "طريقة التسجيل",
      lead:
        "طريقة التسجيل في أكاديمية ورتل بسيطة ومجانية: اقرأ شروط القبول ووافق عليها، ثم املأ نموذج التسجيل وأرسل تلاوة صوتية قصيرة، وبعد مراجعتها يُتواصل معك وتُسكَّن في الحلقة المناسبة. أما الأطفال فيسجّلهم ولي الأمر من خلال حساب ولي الأمر.",
      sections: [
        {
          h2: "كيف أسجل في أكاديمية ورتل؟",
          blocks: [
            {
              type: "p",
              text: "التسجيل يتم بالكامل من الموقع ولا يحتاج إلى أكثر من دقائق. تمرّ الطالبة بأربع مراحل: الاطلاع على الضوابط، وتعبئة النموذج، وتحديد المستوى، ثم الالتحاق بالحلقة. هذه الخطوات بالتفصيل:",
            },
            {
              type: "ol",
              items: [
                "افتحي [صفحة شروط القبول](/instructions?type=student) واقرئي تعليمات قسم النساء بعناية، ثم اضغطي «أوافق».",
                "في نموذج التسجيل أدخلي الاسم الكامل، والعمر، ورقم الواتساب، وكلمة المرور، واختاري المسار المناسب.",
                "سجّلي تلاوة قصيرة من المتصفح مباشرة أو ارفعي ملفاً صوتياً، فهي التي يُحدَّد بها مستواك.",
                "أرسلي الطلب، وسيظهر لكِ أن طلبكِ قيد المراجعة؛ ثم يُتواصل معكِ بالنتيجة وتفاصيل الحلقة.",
              ],
            },
            {
              type: "p",
              text: "استخدمي رقم واتساب تستطيعين الرد عليه، لأنه وسيلة التواصل معكِ، ولأن الأكاديمية تشترط استخدام الرقم نفسه في جميع الاختبارات والاستمارات.",
            },
          ],
        },
        {
          h2: "الرابط المباشر للتسجيل",
          blocks: [
            {
              type: "ul",
              items: [
                "تسجيل الطالبات (النساء): [رابط التسجيل المباشر](/register?type=student)",
                "تسجيل ولي الأمر (للأطفال): [رابط تسجيل ولي الأمر](/register/parent)",
                "شروط القبول قبل التسجيل: [صفحة شروط القبول](/instructions)",
              ],
            },
            {
              type: "p",
              text: "ننصح بقراءة شروط القبول قبل فتح النموذج، لأن الموافقة عليها جزء من طلب التسجيل، ومعرفتها مسبقاً تساعدك على اختيار موعد ومسار تستطيع الالتزام بهما.",
            },
          ],
        },
        {
          h2: "هل التسجيل مجاني؟",
          blocks: [
            {
              type: "p",
              text: "نعم، التسجيل مجاني بالكامل. أكاديمية ورتل أكاديمية خيرية غير ربحية، فلا توجد رسوم تسجيل ولا اشتراك شهري ولا رسوم على الشهادات أو الإجازات. تفاصيل ذلك في صفحة [تحفيظ القرآن أونلاين مجانا](/free-quran-memorization).",
            },
          ],
        },
        {
          h2: "الأسعار",
          blocks: [
            {
              type: "p",
              text: "لا توجد أسعار ولا باقات في أكاديمية ورتل؛ كل الأنشطة مجانية، بما فيها الحلقات ودروس التجويد والاختبارات والشهادات والإجازات، لأن الأكاديمية ممولة من الدعم الخيري والتبرعات. إذا طلب منك أحد مبلغاً باسم الأكاديمية فتواصل مع الدعم عبر القنوات الرسمية المذكورة أدناه.",
            },
          ],
        },
        {
          h2: "كم حصة في الأسبوع؟",
          blocks: [
            {
              type: "p",
              text: "في قسم النساء: حلقة حفظ واحدة أسبوعياً مع المعلمة، ودرسا تجويد يومي الأحد والأربعاء الساعة الثامنة مساءً بتوقيت مصر لدراسة «تحفة الأطفال» و«المقدمة الجزرية»، إضافة إلى تسميع يومي قصير مع الرفيقة القرآنية ضمن نظام التمام.",
            },
            {
              type: "p",
              text: "وفي قسم الأطفال: حلقة في موعد ثابت يحضرها الطفل مع أمه، وتمام يومي تحت إشرافها، وحلقات تجويد مبسّطة. تفاصيل أكثر في [تحفيظ القرآن أونلاين للنساء](/quran-for-women) و[تحفيظ القرآن أونلاين للأطفال](/quran-for-kids).",
            },
            { type: "todo", text: "راجعوا عدد الحصص الأسبوعية لقسم الأطفال ومدة كل حصة، وأضيفوها هنا." },
          ],
        },
        {
          h2: "ليس لدي حساب، ماذا أفعل؟",
          blocks: [
            {
              type: "p",
              text: "إذا وصلت إلى صفحة تسجيل الدخول وليس لديك حساب، فأنت تحتاج إلى التسجيل أولاً. اختر «سجل كطالبة (نساء)» أو «أنشئ حساب ولي أمر (أطفال)» من صفحة تسجيل الدخول، أو استخدم الروابط المباشرة أعلاه. بعد قبول طلب الطالبة تستخدم رقم الهاتف وكلمة المرور اللذين سجّلت بهما للدخول إلى لوحة التحكم.",
            },
            {
              type: "p",
              text: "أما إن كان لديك حساب ونسيت كلمة المرور، فاستخدم خيار استعادة كلمة المرور من صفحة تسجيل الدخول بدلاً من إنشاء حساب جديد.",
            },
          ],
        },
        {
          h2: "التسجيل لولي الأمر",
          blocks: [
            {
              type: "p",
              text: "الأطفال لا يسجّلون بأنفسهم، بل يسجّلهم ولي الأمر عبر بوابة أولياء الأمور:",
            },
            {
              type: "ol",
              items: [
                "اقرأ [تعليمات قسم الأطفال](/instructions?type=parent) ووافق عليها.",
                "أنشئ [حساب ولي الأمر](/register/parent) بالاسم ورقم الواتساب وكلمة المرور.",
                "سجّل الدخول واختر «إضافة ابن/ــة جديد» وأدخل بيانات الطفل؛ يُراجَع الطلب ثم يُسكَّن الطفل في حلقة مناسبة.",
                "إن كان لطفلك حساب طالب مسبقاً فاختر «ربط حساب ابن/ــة جديد» وأدخل كود الربط (PIN) من ملفه الشخصي.",
              ],
            },
            {
              type: "p",
              text: "من البوابة نفسها تتابع حضور أبنائك ودرجاتهم فور تسجيلها.",
            },
          ],
        },
        {
          h2: "هل يوجد تلغرام أو واتساب للتواصل؟",
          blocks: [
            {
              type: "p",
              text: "نعم. يمكنك التواصل مع الأكاديمية أو متابعة أخبارها عبر القنوات الرسمية التالية:",
            },
            {
              type: "ul",
              items: [
                `واتساب: [راسلنا على واتساب](${WHATSAPP})`,
                `تلغرام: [قناة أكاديمية ورتل على تلغرام](${TELEGRAM})`,
                "صفحة [تواصل معنا](/contact-us) على الموقع.",
              ],
            },
            {
              type: "p",
              text: "كما تصل للطالبات إشعارات المنصة عبر تلغرام، مثل التذكير بالحلقات والدرجات.",
            },
          ],
        },
      ],
      faq: [
        {
          q: "كيف أسجل في أكاديمية ورتل؟",
          a: "اقرأ شروط القبول ووافق عليها، ثم املأ نموذج التسجيل (الاسم، والعمر، ورقم الواتساب، وكلمة المرور، والمسار) وأرسل تلاوة صوتية قصيرة، وبعد المراجعة يُتواصل معك بالنتيجة.",
        },
        {
          q: "ما الرابط المباشر للتسجيل؟",
          a: "رابط تسجيل الطالبات: [/ar/register](/register?type=student)، ورابط تسجيل ولي الأمر: [/ar/register/parent](/register/parent).",
        },
        {
          q: "هل التسجيل مجاني؟",
          a: "نعم، التسجيل مجاني بالكامل ولا توجد رسوم تسجيل أو اشتراك.",
        },
        {
          q: "ما أسعار أكاديمية ورتل؟",
          a: "لا توجد أسعار؛ جميع الأنشطة مجانية بما فيها الشهادات والإجازات، لأن الأكاديمية خيرية غير ربحية.",
        },
        {
          q: "كم حصة في الأسبوع؟",
          a: "في قسم النساء: حلقة حفظ أسبوعية مع المعلمة، ودرسا تجويد يومي الأحد والأربعاء الساعة الثامنة مساءً بتوقيت مصر، وتسميع يومي مع الرفيقة القرآنية.",
        },
        {
          q: "ليس لدي حساب، كيف أدخل؟",
          a: "يجب التسجيل أولاً من رابط التسجيل المباشر، وبعد قبول الطلب تدخل برقم الهاتف وكلمة المرور اللذين سجّلت بهما.",
        },
        {
          q: "كيف يسجّل ولي الأمر أبناءه؟",
          a: "ينشئ [حساب ولي الأمر](/register/parent)، ثم يسجّل الدخول ويضيف أبناءه من البوابة، أو يربط حساباتهم الحالية بكود الربط.",
        },
        {
          q: "هل يوجد تلغرام أو واتساب؟",
          a: `نعم: واتساب [wa.me/201229449474](${WHATSAPP})، وتلغرام [قناة أكاديمية ورتل](${TELEGRAM}).`,
        },
      ],
      cta: {
        title: "جاهز للتسجيل؟",
        text: "التسجيل مجاني ويستغرق دقائق. اختر نوع الحساب المناسب وابدأ الآن.",
        label: "سجّل الآن",
        href: "/instructions?type=student",
        secondary: { label: "تسجيل ولي الأمر", href: "/instructions?type=parent" },
      },
      schema: {
        type: "howto",
        name: "خطوات التسجيل في أكاديمية ورتل",
        steps: [
          { name: "اقرأ شروط القبول", text: "افتح صفحة شروط القبول واقرأ تعليمات القسم المناسب ثم اضغط «أوافق».", path: "/instructions" },
          { name: "افتح نموذج التسجيل", text: "انتقل إلى نموذج التسجيل للطالبات، أو نموذج ولي الأمر لتسجيل الأطفال.", path: "/register" },
          { name: "أدخل بياناتك", text: "اكتب الاسم الكامل والعمر ورقم الواتساب وكلمة المرور، واختر المسار المناسب." },
          { name: "أرسل تلاوة صوتية", text: "سجّل تلاوة قصيرة من المتصفح أو ارفع ملفاً صوتياً لتحديد مستواك." },
          { name: "انتظر المراجعة", text: "تُراجَع التلاوة ويُتواصل معك بالنتيجة وتفاصيل الحلقة." },
          { name: "التحق بالحلقة", text: "تُسكَّن في حلقة تناسب مسارك ووقتك، وتدخل إليها من لوحة التحكم بضغطة زر." },
        ],
      },
    },
    en: {
      keyword: "How to register",
      title: "How to Register at Wartel Academy | Step-by-Step Guide",
      description:
        "How to register at Wartel Academy step by step: direct links, parent sign-up, weekly classes and WhatsApp/Telegram contacts. It's free – register now.",
      h1: "How to Register at Wartel Academy",
      linkLabel: "How to register",
      lead:
        "To register at Wartel Academy, read and accept the admission criteria, fill in the registration form and upload a short recitation; after review you are contacted and placed in a suitable circle. Registration is completely free. Children are registered by a parent through a parent account.",
      sections: [
        {
          h2: "How do I register?",
          blocks: [
            {
              type: "ol",
              items: [
                "Open the [admission criteria](/instructions?type=student), read the women's section rules carefully and click \"I agree\".",
                "In the registration form enter your full name, age, WhatsApp number and password, and choose a track.",
                "Record a short recitation in your browser or upload an audio file – this is how your level is assessed.",
                "Submit. Your application shows as under review, and you are contacted with the result and circle details.",
              ],
            },
            {
              type: "p",
              text: "Use a WhatsApp number you can reply on – it is how the academy contacts you, and the same number must be used for all tests and forms.",
            },
          ],
        },
        {
          h2: "Direct registration links",
          blocks: [
            {
              type: "ul",
              items: [
                "Student registration (women): [direct registration link](/register?type=student)",
                "Parent registration (children): [parent registration link](/register/parent)",
                "Admission criteria: [admission criteria page](/instructions)",
              ],
            },
          ],
        },
        {
          h2: "Is registration free? What are the prices?",
          blocks: [
            {
              type: "p",
              text: "Registration is completely free, and there are no prices or plans. Wartel is a non-profit academy funded by donations: circles, Tajweed lessons, tests, certificates and Ijazahs are all free. See [free online Quran classes](/free-quran-memorization). If anyone asks you for money in the academy's name, contact support through the official channels below.",
            },
          ],
        },
        {
          h2: "How many classes per week?",
          blocks: [
            {
              type: "p",
              text: "Women's section: one weekly memorization circle with your teacher, two Tajweed lessons (Sunday and Wednesday at 8 pm Egypt time) on Tuhfat Al-Atfal and Al-Jazariyyah, plus a short daily recitation with your Quran partner. Children's section: a fixed weekly circle attended with the mother, daily Tamam under her supervision, and simplified Tajweed lessons. More on [online Quran classes for women](/quran-for-women) and [online Quran memorization for kids](/quran-for-kids).",
            },
            { type: "todo", text: "Confirm the number and length of weekly sessions for the children's section." },
          ],
        },
        {
          h2: "I don't have an account",
          blocks: [
            {
              type: "p",
              text: "If you reached the login page without an account, you need to register first – choose \"Register as Student (Women)\" or \"Register as Parent (Children)\" on the login page, or use the direct links above. Once your application is accepted, log in with the phone number and password you registered with. If you already have an account but forgot your password, use password recovery instead of creating a new account.",
            },
          ],
        },
        {
          h2: "Registering as a parent",
          blocks: [
            {
              type: "ol",
              items: [
                "Read and accept the [children's section instructions](/instructions?type=parent).",
                "Create a [parent account](/register/parent) with your name, WhatsApp number and password.",
                "Log in, choose \"Add New Child\" and enter your child's details; the request is reviewed before placement.",
                "If your child already has a student account, choose \"Link New Child\" and enter the PIN from their profile.",
              ],
            },
          ],
        },
        {
          h2: "Is there a Telegram or WhatsApp?",
          blocks: [
            {
              type: "ul",
              items: [
                `WhatsApp: [message us on WhatsApp](${WHATSAPP})`,
                `Telegram: [Wartel Academy on Telegram](${TELEGRAM})`,
                "The [contact us](/contact-us) page on this website.",
              ],
            },
          ],
        },
      ],
      faq: [
        {
          q: "How do I register at Wartel Academy?",
          a: "Accept the admission criteria, fill in the form (name, age, WhatsApp, password, track) and upload a short recitation. After review you are contacted with the result.",
        },
        {
          q: "What is the direct registration link?",
          a: "Students: [/en/register](/register?type=student). Parents: [/en/register/parent](/register/parent).",
        },
        {
          q: "Is registration free?",
          a: "Yes. There are no registration fees, subscriptions or prices.",
        },
        {
          q: "How many classes are there per week?",
          a: "Women: one weekly memorization circle, two Tajweed lessons (Sunday and Wednesday, 8 pm Egypt time) and a daily partner recitation.",
        },
        {
          q: "I don't have an account. How do I log in?",
          a: "Register first using the direct link; once accepted, log in with the phone number and password you registered with.",
        },
        {
          q: "How do parents register their children?",
          a: "Create a [parent account](/register/parent), log in and add your children, or link their existing accounts with a PIN.",
        },
        {
          q: "Is there a Telegram or WhatsApp?",
          a: `Yes: WhatsApp [wa.me/201229449474](${WHATSAPP}) and [Telegram](${TELEGRAM}).`,
        },
      ],
      cta: {
        title: "Ready to register?",
        text: "Registration is free and takes a few minutes.",
        label: "Register now",
        href: "/instructions?type=student",
        secondary: { label: "Parent registration", href: "/instructions?type=parent" },
      },
      schema: {
        type: "howto",
        name: "Steps to register at Wartel Academy",
        steps: [
          { name: "Read the admission criteria", text: "Open the admission criteria, read your section's rules and click \"I agree\".", path: "/instructions" },
          { name: "Open the registration form", text: "Go to the student form, or the parent form to register children.", path: "/register" },
          { name: "Enter your details", text: "Enter your full name, age, WhatsApp number and password, and choose a track." },
          { name: "Send a recitation", text: "Record a short recitation in your browser or upload an audio file for placement." },
          { name: "Wait for review", text: "Your recitation is reviewed and you are contacted with the result and circle details." },
          { name: "Join your circle", text: "You are placed in a circle that fits your track and time, and join it from your dashboard with one click." },
        ],
      },
    },
  },
};
