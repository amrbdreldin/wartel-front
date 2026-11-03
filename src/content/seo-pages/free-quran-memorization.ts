import type { SeoPageDefinition } from "./types";

// "Free" facts come from the live site: non-profit charity funded by donations;
// all activities free incl. certificates and ijazahs. Conditions = the instructions page rules.

export const freePage: SeoPageDefinition = {
  key: "free",
  path: "/free-quran-memorization",
  kind: "landing",
  related: ["register", "women", "kids", "memorize"],
  content: {
    ar: {
      keyword: "تحفيظ القرآن أونلاين مجانا",
      title: "تحفيظ القرآن أونلاين مجانا للنساء والأطفال | ورتل",
      description:
        "تحفيظ القرآن أونلاين مجانا في أكاديمية ورتل الخيرية: حلقات وتجويد وشهادات وإجازات بلا رسوم للنساء والأطفال. اعرف الشروط وسجّل الآن.",
      h1: "تحفيظ القرآن أونلاين مجانا في أكاديمية ورتل",
      linkLabel: "تحفيظ القرآن مجاناً",
      lead:
        "نعم، يمكنك الحصول على تحفيظ القرآن أونلاين مجانا بالكامل في أكاديمية ورتل، لأنها أكاديمية خيرية غير ربحية ممولة من التبرعات. الحلقات ودروس التجويد والاختبارات والشهادات والإجازات كلها بلا رسوم، والشرط الوحيد هو الالتزام بالحضور والتسميع اليومي وفق ضوابط الأكاديمية.",
      sections: [
        {
          h2: "ما الذي تقدّمه أكاديمية ورتل لتحفيظ القرآن أونلاين مجانا؟",
          blocks: [
            {
              type: "p",
              text: "عندما يسمع الناس عبارة «أكاديمية تحفيظ قرآن مجانية» يتساءلون أحياناً: هل المجاني هو الحصة الأولى فقط؟ أم أن هناك رسوماً مخفية للشهادة؟ في أكاديمية ورتل الإجابة واضحة: كل ما تقدّمه الأكاديمية مجاني، وليس هناك باقات مدفوعة أو اشتراك شهري.",
            },
            {
              type: "ul",
              items: [
                "حلقات الحفظ الأسبوعية مع معلمات مجازات.",
                "دروس التجويد النظري في متني «تحفة الأطفال» و«المقدمة الجزرية».",
                "دورة القاعدة النورانية لتعلّم القراءة الصحيحة من البداية.",
                "نظام التمام اليومي مع رفيقة قرآنية لتثبيت الحفظ.",
                "المقرأة لتطبيق التلاوة الصحيحة عملياً.",
                "الاختبارات الدورية والشهادات.",
                "الإجازات القرآنية برواية حفص عن عاصم، وإجازات المتون العلمية.",
                "المنصة الإلكترونية نفسها: لوحة التحكم، والحلقات الافتراضية، والمكتبة، والتقارير، وبوابة أولياء الأمور.",
              ],
            },
          ],
        },
        {
          h2: "لماذا الحلقات مجانية؟",
          blocks: [
            {
              type: "p",
              text: "أكاديمية ورتل أكاديمية خيرية مسجّلة لا تهدف إلى الربح، تسعى إلى تيسير حفظ القرآن الكريم وفهمه وعلومه للنساء والأطفال، وتموَّل بالكامل من الدعم الخيري والتبرعات. ولأن رسالتها نشر كتاب الله لا تحصيل الرسوم، فإنها لا تشترط على الطالبة أو ولي الأمر أي مقابل مادي في أي مرحلة.",
            },
            {
              type: "p",
              text: "هذا النموذج يجعل حلقات التحفيظ المجانية متاحة لمن لا تسمح ظروفه بالاشتراك في الأكاديميات المدفوعة، ويضمن ألا يكون المال سبباً في انقطاع أحد عن القرآن.",
            },
            { type: "todo", text: "إن رغبتم في قبول التبرعات من الزوار، أضيفوا هنا رابط صفحة التبرع أو وسيلة التبرع الرسمية." },
          ],
        },
        {
          h2: "شروط الالتحاق بحلقات التحفيظ المجانية",
          blocks: [
            {
              type: "p",
              text: "المجانية لا تعني غياب الضوابط؛ فالمقاعد محدودة، والأكاديمية تحرص على أن تذهب لمن يلتزم. أهم الشروط للطالبات:",
            },
            {
              type: "ul",
              items: [
                "حضور حلقة الحفظ الأسبوعية، والغياب عن حلقتين متتاليتين يؤدي إلى الحذف من الحلقة.",
                "حضور دروس التجويد يومي الأحد والأربعاء الساعة الثامنة مساءً بتوقيت مصر.",
                "إرسال التمام اليومي مع الرفيقة، وعدم إرساله ثلاثة أيام متتالية يستوجب إنذاراً.",
                "حضور جميع اختبارات القرآن والتجويد.",
                "استخدام رقم الهاتف نفسه في جميع الاختبارات والاستمارات.",
                "عدم الالتحاق بمجموعات حفظ أخرى طوال مدة الدراسة.",
              ],
            },
            {
              type: "p",
              text: "وللأطفال ضوابط خاصة أهمها حضور الأم مع الطفل ومتابعة تمامه اليومي، وتجدها في صفحة [تحفيظ القرآن أونلاين للأطفال](/quran-for-kids). أما الضوابط الكاملة فهي في [صفحة شروط القبول](/instructions).",
            },
          ],
        },
        {
          h2: "كيف تنضم إلى حلقات التحفيظ المجانية؟",
          blocks: [
            {
              type: "ol",
              items: [
                "اقرأ شروط القبول ووافق عليها.",
                "املأ نموذج التسجيل (الاسم، والعمر، ورقم الواتساب، وكلمة المرور) وأرسل تلاوة صوتية قصيرة.",
                "تُراجَع التلاوة لتحديد مستواك، ويُتواصل معك بالنتيجة وتفاصيل المجموعة.",
                "تُسكَّن في حلقة تناسب مسارك ووقتك، وتبدأ الدراسة.",
              ],
            },
            {
              type: "p",
              text: "شرحنا كل خطوة بالتفصيل، مع الرابط المباشر للتسجيل وتسجيل أولياء الأمور، في صفحة [طريقة التسجيل في أكاديمية ورتل](/how-to-register).",
            },
          ],
        },
        {
          h2: "لمن هذه الحلقات المجانية؟",
          blocks: [
            {
              type: "p",
              text: "الأكاديمية مخصّصة للنساء والأطفال. فالنساء يلتحقن بـ[حلقات تحفيظ القرآن أونلاين للنساء](/quran-for-women) مع معلمات مجازات في بيئة نسائية آمنة، والأطفال يلتحقون بقسم «براعم ورتل» عن طريق حساب ولي الأمر. ويُدرَّس المحتوى باللغة العربية، وتستقبل الأكاديمية طالبات من مختلف البلدان ما دامت المواعيد مناسبة لهن.",
            },
          ],
        },
        {
          h2: "هل الجودة أقل لأن الحلقات مجانية؟",
          blocks: [
            {
              type: "p",
              text: "سؤال مشروع، والجواب أن المجانية في ورتل لا تأتي على حساب الإتقان. فالمعلمات مجازات في القرآن الكريم، والحفظ يسير جنباً إلى جنب مع دراسة متون التجويد، والتلاوة تُصحَّح حرفاً حرفاً في الحلقة، والتمام اليومي يضمن أن الورد يُراجَع قبل تسميعه. ثم إن التقدّم يُقاس باختبارات دورية، ويُحتسب التقدير النهائي بنسبة 20% للقرآن و30% للتجويد و50% لاختبار نهاية العام، فلا تُمنح الشهادة إلا لمن أتمّت المنهج كاملاً.",
            },
            {
              type: "p",
              text: "بل إن الضوابط الصارمة في الحضور والتمام هي ما يحفظ قيمة المقعد المجاني؛ فكل مقعد يشغله من لا يلتزم هو مقعد حُرم منه غيره ممن ينتظر.",
            },
          ],
        },
        {
          h2: "ما الذي تحتاجه للبدء؟",
          blocks: [
            {
              type: "ul",
              items: [
                "هاتف أو حاسوب متصل بالإنترنت، مع ميكروفون للتلاوة في الحلقة وتسجيل التلاوة عند التسجيل.",
                "رقم واتساب ثابت تستخدمه في التسجيل وجميع الاختبارات.",
                "وقت ثابت أسبوعياً لحلقة الحفظ، ووقت يومي قصير للتمام والمراجعة.",
                "مصحف بطبعة واحدة تلتزم بها طوال رحلة الحفظ.",
              ],
            },
          ],
        },
        {
          h2: "نصيحة قبل التسجيل",
          blocks: [
            {
              type: "p",
              text: "لأن المقاعد محدودة، اختر موعداً تستطيع الالتزام به أسبوعياً، وابدأ بخطة حفظ واقعية. إن أردت أن تعرف كيف تنظّم وقتك قبل الالتحاق فاقرأ مقال [كيف أحفظ القرآن](/blog/how-to-memorize-quran).",
            },
          ],
        },
      ],
      faq: [
        {
          q: "هل أكاديمية ورتل لتحفيظ القرآن أونلاين مجانا فعلاً؟",
          a: "نعم، جميع أنشطة الأكاديمية مجانية بالكامل بما في ذلك الحلقات والتجويد والشهادات والإجازات، وهي ممولة من الدعم الخيري والتبرعات.",
        },
        {
          q: "هل هناك رسوم للشهادة أو الإجازة؟",
          a: "لا، الشهادات والإجازات مجانية أيضاً، وتُمنح لمن تُتمّ المنهج وتجتاز الاختبارات.",
        },
        {
          q: "هل هناك رسوم تسجيل أو اشتراك شهري؟",
          a: "لا، التسجيل مجاني ولا توجد أي اشتراكات أو باقات مدفوعة.",
        },
        {
          q: "ما شروط الاستمرار في الحلقات المجانية؟",
          a: "الالتزام بحضور الحلقة الأسبوعية ودروس التجويد، وإرسال التمام اليومي، وحضور الاختبارات. التفاصيل في [شروط القبول](/instructions).",
        },
        {
          q: "هل يوجد حلقات تحفيظ مجانية للأطفال؟",
          a: "نعم، قسم «براعم ورتل» للأطفال مجاني أيضاً، ويسجّل الطفل عن طريق [حساب ولي الأمر](/register/parent).",
        },
        {
          q: "هل الحلقات المجانية للرجال أيضاً؟",
          a: "الأكاديمية مخصّصة للنساء والأطفال.",
        },
      ],
      cta: {
        title: "احجز مقعدك في حلقات التحفيظ المجانية",
        text: "المقاعد محدودة، والتسجيل مجاني ويستغرق دقائق.",
        label: "سجّل الآن",
        href: "/instructions?type=student",
        secondary: { label: "تسجيل ولي الأمر", href: "/instructions?type=parent" },
      },
      schema: {
        type: "course",
        name: "تحفيظ القرآن أونلاين مجانا",
        description:
          "حلقات مجانية بالكامل لتحفيظ القرآن الكريم والتجويد أونلاين للنساء والأطفال، تشمل الاختبارات والشهادات والإجازات برواية حفص عن عاصم.",
        audience: "النساء والأطفال",
      },
    },
    en: {
      keyword: "Free online Quran classes",
      title: "Free Online Quran Classes for Women & Kids | Wartel",
      description:
        "Free online Quran classes at Wartel, a non-profit academy: memorization, Tajweed, certificates and Ijazah, no fees. See the conditions and register now.",
      h1: "Free Online Quran Classes at Wartel Academy",
      linkLabel: "Free Quran classes",
      lead:
        "Yes – Wartel Academy offers completely free online Quran classes because it is a registered non-profit funded by donations. Memorization circles, Tajweed lessons, tests, certificates and Ijazahs all cost nothing; the only requirement is commitment to attendance and daily recitation under the academy's rules.",
      sections: [
        {
          h2: "What is free?",
          blocks: [
            {
              type: "p",
              text: "When people hear \"free Quran academy\" they often wonder whether only the first lesson is free, or whether there is a hidden fee for the certificate. At Wartel the answer is simple: everything the academy offers is free. There are no paid plans and no monthly subscription.",
            },
            {
              type: "ul",
              items: [
                "Weekly memorization circles with Ijazah-certified female teachers.",
                "Tajweed lessons on Tuhfat Al-Atfal and Al-Muqaddimah Al-Jazariyyah.",
                "Al-Qaida Al-Noorania for learning to read correctly from the start.",
                "The daily Tamam system with a Quran partner.",
                "A recitation circle (Maqra'ah) to practise Tajweed.",
                "Regular tests and certificates.",
                "Quran Ijazah in Hafs from Asim and Ijazahs in classical Tajweed texts.",
                "The platform itself: dashboard, virtual circles, library, reports and parent portal.",
              ],
            },
          ],
        },
        {
          h2: "Why are the classes free?",
          blocks: [
            {
              type: "p",
              text: "Wartel is a registered non-profit academy that aims to make Quran memorization and understanding accessible to women and children. It is funded entirely by charitable support and donations, so it never charges students or parents at any stage. This keeps quality Quran teaching open to people who could not afford a paid academy.",
            },
            { type: "todo", text: "If you accept donations from visitors, add the official donation link here." },
          ],
        },
        {
          h2: "Conditions",
          blocks: [
            {
              type: "p",
              text: "Free does not mean without rules. Seats are limited, so the academy keeps them for committed students:",
            },
            {
              type: "ul",
              items: [
                "Attend the weekly memorization circle – missing two in a row means removal from the circle.",
                "Attend Tajweed lessons on Sunday and Wednesday at 8 pm Egypt time.",
                "Send your daily Tamam – three missed days in a row triggers a warning.",
                "Attend all Quran and Tajweed tests.",
                "Use the same phone number for all tests and forms.",
                "Do not join other memorization groups while studying with the academy.",
              ],
            },
            {
              type: "p",
              text: "Children have their own rules, mainly that the mother attends with the child – see [online Quran memorization for kids](/quran-for-kids). The complete rules are on the [admission criteria page](/instructions).",
            },
          ],
        },
        {
          h2: "How to join",
          blocks: [
            {
              type: "ol",
              items: [
                "Read and accept the admission criteria.",
                "Fill in the registration form (name, age, WhatsApp number, password) and upload a short recitation.",
                "Your recitation is reviewed to set your level, and you are contacted with the result and group details.",
                "You are placed in a circle that fits your track and schedule.",
              ],
            },
            {
              type: "p",
              text: "Each step is explained, with direct links, on [how to register](/how-to-register). Classes are for women ([online Quran classes for women](/quran-for-women)) and children, and are taught in Arabic.",
            },
          ],
        },
        {
          h2: "Is quality lower because it's free?",
          blocks: [
            {
              type: "p",
              text: "A fair question. At Wartel, free does not mean lower standards. Teachers hold Ijazahs in the Quran, memorization runs alongside the study of classical Tajweed texts, recitation is corrected letter by letter in the circle, and the daily Tamam makes sure each portion is revised before it is recited to the teacher. Progress is measured with regular tests, and the final grade is 20% Quran, 30% Tajweed and 50% end-of-year exam – certificates go only to those who complete the full curriculum.",
            },
            {
              type: "p",
              text: "The strict attendance and Tamam rules are what protect the value of a free seat: every seat taken by someone who does not commit is a seat another student on the waiting list could have used.",
            },
          ],
        },
        {
          h2: "What you need to start",
          blocks: [
            {
              type: "ul",
              items: [
                "A phone or computer with an internet connection and a microphone, for the live circle and the recitation you record at registration.",
                "A WhatsApp number you will use for registration and all tests.",
                "A fixed weekly slot for your memorization circle, plus a short daily slot for Tamam and revision.",
                "One printed edition of the Mushaf that you stick with throughout your memorization.",
              ],
            },
            {
              type: "p",
              text: "New to memorizing? Our Arabic guide [how to memorize the Quran](/ar/blog/how-to-memorize-quran) and the [Tajweed basics for beginners](/ar/blog/tajweed-for-beginners) are good places to start.",
            },
          ],
        },
      ],
      faq: [
        {
          q: "Are Wartel's online Quran classes really free?",
          a: "Yes. All activities – circles, Tajweed, certificates and Ijazahs – are free, funded by charitable support and donations.",
        },
        {
          q: "Is there a fee for the certificate or Ijazah?",
          a: "No. Certificates and Ijazahs are free too, awarded to those who complete the curriculum and pass the tests.",
        },
        {
          q: "Is there a registration fee or subscription?",
          a: "No. Registration is free and there are no paid plans.",
        },
        {
          q: "Are there free classes for children?",
          a: "Yes. The children's section is free; children enrol through a [parent account](/register/parent).",
        },
        {
          q: "Are the classes for men?",
          a: "The academy serves women and children.",
        },
        {
          q: "What language are the classes in?",
          a: "Classes are taught in Arabic; the website and registration are available in English.",
        },
      ],
      cta: {
        title: "Reserve your free seat",
        text: "Seats are limited. Registration is free and takes a few minutes.",
        label: "Register now",
        href: "/instructions?type=student",
        secondary: { label: "Parent registration", href: "/instructions?type=parent" },
      },
      schema: {
        type: "course",
        name: "Free Online Quran Classes",
        description:
          "Completely free online Quran memorization and Tajweed classes for women and children, including tests, certificates and an Ijazah in Hafs from Asim.",
        audience: "Women and children",
      },
    },
  },
};
