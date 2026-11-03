import type { SeoPageDefinition } from "./types";

// Facts used here come from the live site (landing + instructions copy):
// free incl. certificates/ijazahs, female teachers, weekly circle, Tuhfa/Jazariyya
// classes Sun & Wed 8pm Egypt time, daily "tamam" partner, 20/30/50 grading.

export const womenPage: SeoPageDefinition = {
  key: "women",
  path: "/quran-for-women",
  kind: "landing",
  related: ["free", "register", "kids", "memorize", "tajweed"],
  content: {
    ar: {
      keyword: "تحفيظ القرآن أونلاين للنساء",
      title: "تحفيظ القرآن أونلاين للنساء مجاناً | أكاديمية ورتل",
      description:
        "تحفيظ القرآن أونلاين للنساء مع معلمات مجازات في حلقات مجانية بالكامل، من التأسيس حتى الإجازة. سجّلي الآن في أكاديمية ورتل وابدئي رحلة الحفظ.",
      h1: "تحفيظ القرآن أونلاين للنساء في أكاديمية ورتل",
      linkLabel: "تحفيظ القرآن للنساء",
      lead:
        "أكاديمية ورتل تقدّم تحفيظ القرآن أونلاين للنساء في حلقات افتراضية مجانية بالكامل تُدرّسها معلمات مجازات، ضمن بيئة نسائية آمنة. تبدأ الطالبة بالتسجيل وإرسال تلاوة صوتية لتحديد المستوى، ثم تُسكَّن في حلقة تناسب مستواها ووقتها، وتتدرّج من التأسيس والتجويد حتى الختم والإجازة.",
      sections: [
        {
          h2: "لماذا حلقات تحفيظ قرآن للنساء أونلاين؟",
          blocks: [
            {
              type: "p",
              text: "كثير من النساء يرغبن في حفظ كتاب الله لكن تحول دون ذلك مسؤوليات البيت والعمل وبُعد دور التحفيظ أو عدم توفّر معلمة متقنة في المدينة. حلقات تحفيظ قرآن للنساء أونلاين تحلّ هذه المشكلة: تحضر الطالبة من بيتها، في موعد ثابت تختاره عند التسجيل، مع معلمة قرآن أونلاين متخصصة ومجموعة من الأخوات اللاتي يجمعهن الهدف نفسه.",
            },
            {
              type: "p",
              text: "وتتميّز أكاديمية ورتل للنساء بأنها أكاديمية خيرية غير ربحية، فلا تدفع الطالبة أي رسوم مقابل الدروس أو الشهادات أو الإجازات. وقد صُمّمت المنصة لتجمع بين روحانية الحلقة القرآنية وتنظيم التقنية الحديثة: لوحة تحكم لكل طالبة، ودخول إلى الحلقة بضغطة زر، وتقارير توضّح تقدّمها في الحفظ والمراجعة.",
            },
          ],
        },
        {
          h2: "كيف تعمل الحلقات في أكاديمية ورتل للنساء؟",
          blocks: [
            {
              type: "p",
              text: "تقوم الدراسة في قسم النساء على ثلاثة أركان متكاملة تضمن أن يكون الحفظ متقناً وثابتاً، لا مجرد كمٍّ من الصفحات:",
            },
            {
              type: "ul",
              items: [
                "حلقة الحفظ الأسبوعية مع المعلمة: تُسمِّع فيها الطالبة وردها الجديد وتُصحَّح تلاوتها، وحضورها إلزامي.",
                "دروس التجويد النظري: دراسة متني «تحفة الأطفال» و«المقدمة الجزرية» يومي الأحد والأربعاء الساعة الثامنة مساءً بتوقيت مصر.",
                "نظام «التمام» اليومي: تُربط كل طالبة برفيقة قرآنية تُسمِّع معها الورد يومياً لتثبيته قبل موعد الحلقة.",
              ],
            },
            {
              type: "p",
              text: "يعتمد الحفظ على منهج المتشابهات، أي ضبط المواضع المتشابهة في القرآن أثناء الحفظ لا بعده، وهو ما يقلّل التفلّت ويجعل المراجعة أيسر. وتُعرض الضوابط كاملة في [صفحة شروط القبول](/instructions?type=student) قبل التسجيل.",
            },
          ],
        },
        {
          h2: "معلمات قرآن أونلاين مجازات",
          blocks: [
            {
              type: "p",
              text: "جميع حلقات قسم النساء تُدرّسها معلمات، فتجد الطالبة راحتها في التلاوة والسؤال والمشاركة. والمعلمات في الأكاديمية مجازات في القرآن الكريم، وقد أعدّت الأكاديمية عبر سنوات كوادر قرآنية تجمع بين الإتقان العلمي والمهارة التعليمية من خلال برنامج إعداد المعلمات.",
            },
            {
              type: "p",
              text: "دور المعلمة لا يقتصر على التسميع؛ فهي تتابع مخارج الحروف وصفاتها، وتنبّه على أحكام التجويد أثناء التلاوة، وتوجّه الطالبة إلى خطة المراجعة المناسبة لها، وتتابع التزامها بالحضور والتمام.",
            },
            { type: "todo", text: "إن رغبتم، أضيفوا نبذة قصيرة عن المعلمات (عدد المعلمات المجازات، الروايات التي يُجِزن بها) دون ذكر أسماء إلا بموافقتهن." },
          ],
        },
        {
          h2: "مواعيد الحلقات وجدول الدراسة",
          blocks: [
            {
              type: "p",
              text: "تختار الطالبة موعد حلقة الحفظ عند التسجيل بحسب المواعيد المتاحة، ويبقى الموعد ثابتاً طوال الفصل حتى تستقر المجموعة ويتحقق الانتظام. أما دروس التجويد فهي مشتركة لجميع الطالبات يومي الأحد والأربعاء الساعة الثامنة مساءً بتوقيت مصر.",
            },
            {
              type: "table",
              head: ["النشاط", "التكرار", "الموعد"],
              rows: [
                ["حلقة الحفظ مع المعلمة", "أسبوعياً", "حسب الموعد الذي تختارينه عند التسجيل"],
                ["درس التجويد (التحفة والجزرية)", "مرتين أسبوعياً", "الأحد والأربعاء 8 مساءً بتوقيت مصر"],
                ["التمام مع الرفيقة القرآنية", "يومياً", "بالاتفاق مع الرفيقة"],
              ],
            },
            { type: "todo", text: "أضيفوا المواعيد المتاحة لحلقات الحفظ (الأيام والساعات) ومدة الحلقة بالدقائق، وموعد بدء الدفعة القادمة إن وُجد." },
          ],
        },
        {
          h2: "المستويات والمسارات المتاحة",
          blocks: [
            {
              type: "p",
              text: "بعد التسجيل تُراجَع التلاوة الصوتية التي ترسلها الطالبة لتحديد مستواها، ثم تُوجَّه إلى المسار الأنسب لها من أربعة مسارات:",
            },
            {
              type: "ol",
              items: [
                "مسار التأسيس والتجويد (مبتدئ – متوسط): لتصحيح النطق وتعلّم أحكام التجويد من البداية.",
                "مسار الحفظ المنهجي (متوسط – متقدم): خطة لحفظ القرآن كاملاً بمعدلات تناسب كل طالبة.",
                "مسار المراجعة والتثبيت (للخاتمات): يركّز على تكثيف المراجعة وتقليل التفلّت.",
                "مسار المقارئ والإجازات: للحصول على إجازة برواية حفص عن عاصم وما بعدها.",
              ],
            },
            {
              type: "p",
              text: "إن كنتِ في بداية الطريق فاقرئي دليلنا عن [أحكام التجويد للمبتدئين](/blog/tajweed-for-beginners)، وإن كنتِ تبحثين عن خطة عملية فاطّلعي على مقال [كيف أحفظ القرآن](/blog/how-to-memorize-quran).",
            },
          ],
        },
        {
          h2: "التقييم والشهادات والإجازة",
          blocks: [
            {
              type: "p",
              text: "تُحضر الطالبة اختبارات القرآن والتجويد الدورية، ويُحتسب تقديرها النهائي في نهاية العام الدراسي بنسبة 20% للقرآن الكريم، و30% للتجويد، و50% لاختبار نهاية العام. وتُمنح شهادة الاجتياز لمن أتمّت الدورة كاملة من بدايتها إلى نهايتها.",
            },
            {
              type: "p",
              text: "ومن تُتمّ الحفظ وتجتاز الاختبارات يمكنها الانتقال إلى مسار الإجازات للحصول على إجازة في القرآن الكريم برواية حفص عن عاصم، إضافة إلى إجازات في متون التجويد مثل تحفة الأطفال والجزرية والقاعدة النورانية. وكل ذلك مجاني بالكامل.",
            },
          ],
        },
        {
          h2: "هل تحفيظ القرآن للنساء مجاناً فعلاً؟",
          blocks: [
            {
              type: "p",
              text: "نعم. أكاديمية ورتل أكاديمية خيرية مسجّلة لا تهدف إلى الربح، وتموَّل بالكامل من الدعم الخيري والتبرعات، لذلك فإن الحلقات ودروس التجويد والشهادات والإجازات كلها بلا رسوم. المطلوب من الطالبة هو الالتزام بالحضور والتمام اليومي والاختبارات. اقرئي التفاصيل في صفحة [تحفيظ القرآن أونلاين مجاناً](/free-quran-memorization).",
            },
          ],
        },
      ],
      faq: [
        {
          q: "هل المعلمات في حلقات النساء كلهن نساء؟",
          a: "نعم، حلقات قسم النساء تُدرّسها معلمات مجازات في بيئة نسائية آمنة.",
        },
        {
          q: "هل تحفيظ القرآن للنساء في أكاديمية ورتل مجاني؟",
          a: "نعم، جميع أنشطة الأكاديمية مجانية بالكامل بما في ذلك الشهادات والإجازات، لأنها أكاديمية خيرية غير ربحية.",
        },
        {
          q: "كم مرة تُعقد حلقة الحفظ؟",
          a: "حلقة الحفظ مع المعلمة أسبوعية، إلى جانب درسَي تجويد يومي الأحد والأربعاء الساعة الثامنة مساءً بتوقيت مصر، وتسميع يومي مع الرفيقة القرآنية.",
        },
        {
          q: "أنا مبتدئة ولا أُحسن التلاوة، هل يمكنني التسجيل؟",
          a: "نعم، يوجد مسار التأسيس والتجويد لتصحيح النطق وتعلّم الأحكام من البداية، ويُحدَّد مستواكِ من التلاوة الصوتية التي ترسلينها عند التسجيل.",
        },
        {
          q: "هل أحصل على إجازة بعد الختم؟",
          a: "بعد إتمام الحفظ واجتياز الاختبارات يمكنكِ الالتحاق بمسار المقارئ والإجازات للحصول على إجازة برواية حفص عن عاصم.",
        },
        {
          q: "ما الذي يؤدي إلى الحذف من الحلقة؟",
          a: "الغياب عن حلقتين متتاليتين، أو تكرار الإنذار بسبب عدم إرسال التمام اليومي. التفاصيل كاملة في [شروط القبول](/instructions?type=student).",
        },
        {
          q: "كيف أسجّل؟",
          a: "اقرئي شروط القبول ووافقي عليها، ثم املئي نموذج التسجيل وأرسلي تلاوة صوتية. الخطوات مشروحة في [طريقة التسجيل في أكاديمية ورتل](/how-to-register).",
        },
      ],
      cta: {
        title: "ابدئي رحلة حفظ القرآن اليوم",
        text: "انضمي إلى حلقات تحفيظ القرآن أونلاين للنساء مع معلمات مجازات، مجاناً بالكامل.",
        label: "سجّل الآن",
        href: "/instructions?type=student",
        secondary: { label: "طريقة التسجيل", href: "/how-to-register" },
      },
      schema: {
        type: "course",
        name: "تحفيظ القرآن أونلاين للنساء",
        description:
          "حلقات مجانية لتحفيظ القرآن الكريم والتجويد للنساء أونلاين مع معلمات مجازات: حلقة حفظ أسبوعية، ودروس تجويد في التحفة والجزرية، وتسميع يومي مع رفيقة قرآنية، وإجازة برواية حفص عن عاصم.",
        audience: "النساء",
        level: "من المبتدئ إلى الإجازة",
      },
    },
    en: {
      keyword: "Online Quran classes for women",
      title: "Online Quran Classes for Women – Free | Wartel Academy",
      description:
        "Online Quran classes for women with Ijazah-certified female teachers, 100% free – from Tajweed basics to Ijazah. Register now at Wartel Academy.",
      h1: "Online Quran Classes for Women at Wartel Academy",
      linkLabel: "Quran classes for women",
      lead:
        "Wartel Academy offers free online Quran classes for women, taught by Ijazah-certified female teachers in a women-only virtual environment. You register, send a short recitation for placement, and join a circle that fits your level and schedule, progressing from Tajweed foundations to memorization and Ijazah.",
      sections: [
        {
          h2: "Why online Quran classes for women?",
          blocks: [
            {
              type: "p",
              text: "Many women want to memorize the Book of Allah but are held back by family and work commitments, distance from a Quran centre, or the lack of a qualified female teacher nearby. Online Quran memorization circles solve this: you attend from home, at a fixed time you choose when you register, with a dedicated female Quran teacher and a group of sisters who share the same goal.",
            },
            {
              type: "p",
              text: "Wartel is a registered non-profit academy, so there are no fees for lessons, certificates or Ijazahs. The platform combines the spirit of a traditional Quran circle with modern organisation: a personal dashboard, one-click access to your live circle, and reports that show your memorization and revision progress.",
            },
            {
              type: "p",
              text: "Classes are taught in Arabic. The website and registration are available in English, so non-Arabic speakers can sign up easily, but you should be able to follow a lesson delivered in Arabic.",
            },
          ],
        },
        {
          h2: "How the classes work",
          blocks: [
            {
              type: "p",
              text: "Study in the women's section rests on three pillars that make memorization solid rather than just a page count:",
            },
            {
              type: "ul",
              items: [
                "A weekly memorization circle with your teacher, where you recite your new portion and receive corrections. Attendance is required.",
                "Theoretical Tajweed lessons studying Tuhfat Al-Atfal and Al-Muqaddimah Al-Jazariyyah, every Sunday and Wednesday at 8 pm Egypt time.",
                "The daily \"Tamam\" system: each student is paired with a Quran partner to recite the daily portion every day before the weekly circle.",
              ],
            },
            {
              type: "p",
              text: "Memorization follows a method that handles similar verses (Mutashabihat) while memorizing, not afterwards, which reduces forgetting and makes revision easier. All rules are listed on the [admission criteria page](/instructions?type=student) before you register.",
            },
          ],
        },
        {
          h2: "Ijazah-certified female Quran teachers",
          blocks: [
            {
              type: "p",
              text: "Every circle in the women's section is taught by a female teacher, so students feel comfortable reciting, asking questions and taking part. Teachers hold Ijazahs in the Quran, and the academy has trained its own teachers over the years through a programme that combines mastery of recitation with teaching skills.",
            },
            {
              type: "p",
              text: "The teacher's role goes beyond listening: she corrects articulation points and letter characteristics, points out Tajweed rules during recitation, recommends the right revision plan and follows up on attendance and daily Tamam.",
            },
            { type: "todo", text: "Optionally add a short note about the teaching team (number of Ijazah-holding teachers, narrations they teach)." },
          ],
        },
        {
          h2: "Schedule",
          blocks: [
            {
              type: "table",
              head: ["Activity", "Frequency", "Time"],
              rows: [
                ["Memorization circle with your teacher", "Weekly", "The slot you choose at registration"],
                ["Tajweed lesson (Tuhfah & Jazariyyah)", "Twice a week", "Sunday & Wednesday, 8 pm Egypt time"],
                ["Tamam with your Quran partner", "Daily", "Arranged with your partner"],
              ],
            },
            {
              type: "p",
              text: "Your circle time stays fixed for the whole term so the group stays stable and consistent. Choose a slot you can realistically keep every week.",
            },
            { type: "todo", text: "Add the available circle times (days/hours), session length, and next cohort start date if any." },
          ],
        },
        {
          h2: "Levels and tracks",
          blocks: [
            {
              type: "p",
              text: "The recitation you send at registration is reviewed to place you in one of four tracks:",
            },
            {
              type: "ol",
              items: [
                "Foundation & Tajweed (beginner – intermediate): correct pronunciation and Tajweed rules from the start.",
                "Systematic Memorization (intermediate – advanced): a structured plan to memorize the whole Quran at a pace that suits you.",
                "Review & Consolidation (for those who have completed memorization): intensive revision to stop forgetting.",
                "Ijazah Track: earning an Ijazah in the narration of Hafs from Asim.",
              ],
            },
          ],
        },
        {
          h2: "Assessment, certificates and Ijazah",
          blocks: [
            {
              type: "p",
              text: "Students sit regular Quran and Tajweed tests. The final grade at the end of the academic year is 20% Quran, 30% Tajweed and 50% end-of-year exam. A completion certificate is awarded to those who finish the full course.",
            },
            {
              type: "p",
              text: "After completing memorization and passing the tests, you can join the Ijazah track to earn an Ijazah in Hafs from Asim, as well as Ijazahs in Tuhfat Al-Atfal, Al-Jazariyyah and Al-Qaida Al-Noorania. All of this is free – see [free online Quran classes](/free-quran-memorization) for details.",
            },
          ],
        },
      ],
      faq: [
        {
          q: "Are all teachers in the women's classes female?",
          a: "Yes. Every circle in the women's section is taught by an Ijazah-certified female teacher in a women-only environment.",
        },
        {
          q: "Are the classes really free?",
          a: "Yes. Wartel is a non-profit academy funded by charitable support; lessons, certificates and Ijazahs are all free.",
        },
        {
          q: "How many classes are there per week?",
          a: "One weekly memorization circle with your teacher, two Tajweed lessons (Sunday and Wednesday at 8 pm Egypt time), and a daily recitation with your Quran partner.",
        },
        {
          q: "Are the classes in English?",
          a: "Lessons are taught in Arabic. The website and registration are available in English.",
        },
        {
          q: "I am a complete beginner. Can I join?",
          a: "Yes. The Foundation & Tajweed track starts from correct pronunciation, and your level is set from the recitation you send when registering.",
        },
        {
          q: "How do I register?",
          a: "Read and accept the admission criteria, fill in the registration form and upload a short recitation. See [how to register](/how-to-register) for each step.",
        },
      ],
      cta: {
        title: "Start your Quran journey today",
        text: "Join free online Quran classes for women with Ijazah-certified female teachers.",
        label: "Register now",
        href: "/instructions?type=student",
        secondary: { label: "How to register", href: "/how-to-register" },
      },
      schema: {
        type: "course",
        name: "Online Quran Classes for Women",
        description:
          "Free online Quran memorization and Tajweed classes for women with Ijazah-certified female teachers: a weekly memorization circle, Tajweed lessons on Tuhfat Al-Atfal and Al-Jazariyyah, daily partner recitation and an Ijazah in Hafs from Asim.",
        audience: "Women",
        level: "Beginner to Ijazah",
      },
    },
  },
};
