import type { SeoPageDefinition } from "./types";

// Facts from the live site: children's section "براعم ورتل", circle attended with the mother,
// fixed circle time, daily tamam under the mother's supervision, parent portal
// (attendance + grades, add a child / link an existing child account by PIN).

export const kidsPage: SeoPageDefinition = {
  key: "kids",
  path: "/quran-for-kids",
  kind: "landing",
  related: ["register", "free", "women", "memorize", "tajweed"],
  content: {
    ar: {
      keyword: "تحفيظ القرآن أونلاين للأطفال",
      title: "تحفيظ القرآن أونلاين للأطفال مجاناً | أكاديمية ورتل",
      description:
        "تحفيظ القرآن أونلاين للأطفال في حلقات مجانية مع متابعة يومية وتقارير لولي الأمر. سجّل الآن حساب ولي الأمر وأضف أبناءك إلى براعم ورتل.",
      h1: "تحفيظ القرآن أونلاين للأطفال – براعم ورتل",
      linkLabel: "تحفيظ القرآن للأطفال",
      lead:
        "تحفيظ القرآن أونلاين للأطفال في أكاديمية ورتل يتم عبر قسم «براعم ورتل»: حلقات افتراضية مجانية بالكامل يحضرها الطفل برفقة أمه في موعد ثابت، مع تسميع يومي ومتابعة مستمرة. يسجّل ولي الأمر حساباً خاصاً به، ثم يضيف أبناءه ويتابع حضورهم ودرجاتهم من بوابة أولياء الأمور.",
      sections: [
        {
          h2: "حلقات تحفيظ قرآن للأطفال أونلاين بأسلوب تربوي",
          blocks: [
            {
              type: "p",
              text: "تعليم القرآن للأطفال يحتاج إلى صبر وتدرّج وبيئة محفّزة، ولذلك خصّصت الأكاديمية قسماً مستقلاً للأطفال باسم «براعم ورتل». في هذا القسم يتعلّم الطفل التلاوة الصحيحة ويحفظ ما يناسب قدرته، في مجموعة صغيرة من أقرانه، مع معلمة تتابعه وتشجّعه.",
            },
            {
              type: "p",
              text: "ميزة الحلقات أونلاين أنها تختصر مشوار الذهاب والعودة، وتسمح للأسرة باختيار موعد يتناسب مع مواعيد المدرسة والدروس، كما تتيح للأم أن تكون حاضرة مع طفلها فترى بنفسها ما يتعلّمه وكيف يتقدّم.",
            },
          ],
        },
        {
          h2: "دور ولي الأمر: شراكة بين الأم والطفل والمعلمة",
          blocks: [
            {
              type: "p",
              text: "نجاح البرنامج القرآني للطفل يعتمد – بعد توفيق الله – على تكامل ثلاثة أطراف: الأم، والطالب، والمعلمة. لذلك نطلب من ولي الأمر ما يلي:",
            },
            {
              type: "ul",
              items: [
                "اختيار مسار يناسب قدرة الطفل على الحفظ، دون تحميله فوق طاقته.",
                "اختيار موعد الحلقة بعناية بما يتماشى مع مواعيد دراسته، لأن موعد الحلقة ثابت لا يتغيّر.",
                "حضور الحلقة برفقة الأم من بدايتها حتى نهايتها.",
                "متابعة إرسال «التمام» اليومي تحت إشراف الأم، ومراجعة حفظ الطفل قبل موعد الحلقة.",
                "تشغيل المصحف المعلّم للطفل يومياً أثناء المذاكرة واللعب لتثبيت الحفظ وتحسين التلاوة.",
              ],
            },
            {
              type: "p",
              text: "للبدء، أنشئ [حساب ولي الأمر](/register/parent) أولاً، ثم سجّل الدخول وأضف أبناءك من البوابة. وإن كان لابنك حساب طالب مسبقاً فيمكنك ربطه بحسابك بكود الربط الذي يظهر في ملفه الشخصي.",
            },
          ],
        },
        {
          h2: "الأعمار المناسبة",
          blocks: [
            {
              type: "p",
              text: "يستقبل قسم البراعم الأطفال الذين يستطيعون الجلوس في الحلقة والتركيز مع المعلمة لمدتها كاملة. ويُحدَّد المسار المناسب لكل طفل بحسب مستواه في القراءة ومقدار حفظه وقدرته على الحفظ، لا بحسب العمر وحده؛ فقد يبدأ طفل بالقاعدة النورانية لتعلّم الحروف، بينما ينتقل آخر مباشرة إلى الحفظ.",
            },
            { type: "todo", text: "حدّدوا الفئة العمرية المقبولة في قسم البراعم (أصغر وأكبر سن)، ومتى ينتقل الطفل/الطفلة إلى قسم الكبار." },
          ],
        },
        {
          h2: "ماذا يتعلّم الطفل؟",
          blocks: [
            {
              type: "ul",
              items: [
                "القاعدة النورانية: تعلّم الحروف ومخارجها والقراءة الصحيحة، مع إجازة في نهاية الدورة لمن يُتقنها.",
                "حفظ القرآن الكريم بالتدرّج وفق خطة تناسب سنّ الطفل وقدرته.",
                "المراجعة اليومية، وهي لا تقل أهمية عن الحفظ الجديد بل هي أساس تثبيته.",
                "حلقات التجويد المبسّطة للارتقاء بمستوى التلاوة، ومنها متن تحفة الأطفال.",
              ],
            },
            {
              type: "p",
              text: "إن كنت تبحث عن نصائح عملية لمساعدة طفلك في البيت فاقرأ مقال [كيف أحفظ القرآن](/blog/how-to-memorize-quran)، ففيه جدول حفظ وطرق لتثبيت المحفوظ تصلح للصغار والكبار.",
            },
          ],
        },
        {
          h2: "كيف نتابع تقدّم الطفل؟",
          blocks: [
            {
              type: "p",
              text: "صُمّمت منصة ورتل لتجعل المتابعة واضحة لولي الأمر في أي وقت:",
            },
            {
              type: "ul",
              items: [
                "بوابة أولياء الأمور: تعرض حضور الطفل وغيابه ودرجاته فور تسجيلها.",
                "اختبارات القرآن الدورية: تمثّل درجاتها جزءاً من التقييم النهائي للطفل.",
                "التمام اليومي: يرسل الطفل ورده يومياً، وعدم إرساله يومين متتاليين يستوجب إنذاراً، وتكرار الإنذار يؤدي إلى الاستبعاد.",
                "تقارير وإشعارات: تصل لولي الأمر لتنبيهه إلى ما يحتاج متابعة.",
              ],
            },
            {
              type: "p",
              text: "هذه الضوابط ليست للتشديد، بل لأن الانتظام هو سرّ الحفظ عند الأطفال. وتجد الضوابط كاملة في [تعليمات قسم الأطفال](/instructions?type=parent).",
            },
          ],
        },
        {
          h2: "نصائح لولي الأمر لتحبيب الطفل في الحفظ",
          blocks: [
            {
              type: "p",
              text: "الطفل يحفظ أسرع حين يحبّ ما يحفظه، ودور الأسرة في ذلك أكبر من دور الحلقة نفسها. ومن الوسائل المجرّبة:",
            },
            {
              type: "ul",
              items: [
                "اجعل وقت المراجعة اليومي قصيراً وثابتاً، كعشر دقائق بعد صلاة معيّنة، بدلاً من جلسة طويلة متقطعة.",
                "امدح الجهد والمواظبة لا مقدار الحفظ وحده، وكافئ الطفل عند ختم كل سورة.",
                "اقرأ ما حفظه الطفل معه في الصلاة أو قبل النوم، فيرى أن القرآن جزء من حياة الأسرة.",
                "اشرح له معاني الآيات القصيرة بقصص بسيطة، فالفهم يثبّت الحفظ.",
                "لا تقارنه بإخوته أو زملائه، فلكل طفل قدرته ووتيرته.",
              ],
            },
          ],
        },
        {
          h2: "أكاديمية تحفيظ قرآن للأطفال مجانية",
          blocks: [
            {
              type: "p",
              text: "أكاديمية ورتل خيرية غير ربحية، فحلقات الأطفال ودروس التجويد والشهادات والإجازات كلها مجانية بالكامل. المطلوب فقط هو الالتزام بالحضور والتمام والاختبارات. اقرأ المزيد في [تحفيظ القرآن أونلاين مجاناً](/free-quran-memorization)، وإن كانت الأم ترغب في الحفظ أيضاً فلدينا [حلقات تحفيظ القرآن للنساء](/quran-for-women).",
            },
          ],
        },
      ],
      faq: [
        {
          q: "كيف أسجّل طفلي في حلقات تحفيظ القرآن؟",
          a: "أنشئ [حساب ولي الأمر](/register/parent)، ثم سجّل الدخول واختر «إضافة ابن جديد»، وسيُراجَع الطلب ويُسكَّن الطفل في الحلقة المناسبة.",
        },
        {
          q: "هل يجب أن تحضر الأم مع الطفل؟",
          a: "نعم، حضور الحلقة برفقة الأم من بدايتها حتى نهايتها من ضوابط قسم البراعم، لأن متابعة الأم أساس نجاح الطفل.",
        },
        {
          q: "هل يمكنني متابعة درجات طفلي وحضوره؟",
          a: "نعم، بوابة أولياء الأمور تعرض الحضور والغياب والدرجات فور تسجيلها.",
        },
        {
          q: "هل حلقات الأطفال مجانية؟",
          a: "نعم، جميع أنشطة الأكاديمية مجانية بالكامل بما في ذلك الشهادات والإجازات.",
        },
        {
          q: "هل يمكن تغيير موعد حلقة الطفل لاحقاً؟",
          a: "موعد الحلقة ثابت، لذلك يُرجى اختياره بعناية عند التسجيل بما يتناسب مع مواعيد دراسة الطفل.",
        },
        {
          q: "لدى ابني حساب طالب بالفعل، كيف أربطه بحسابي؟",
          a: "من بوابة أولياء الأمور اختر «ربط حساب ابن جديد» وأدخل كود الربط (PIN) الظاهر في ملف الطفل الشخصي مع رقم جواله.",
        },
      ],
      cta: {
        title: "سجّل أبناءك في براعم ورتل",
        text: "أنشئ حساب ولي الأمر مجاناً وأضف أبناءك إلى حلقات تحفيظ القرآن أونلاين للأطفال.",
        label: "سجّل الآن",
        href: "/instructions?type=parent",
        secondary: { label: "طريقة التسجيل", href: "/how-to-register" },
      },
      schema: {
        type: "course",
        name: "تحفيظ القرآن أونلاين للأطفال – براعم ورتل",
        description:
          "حلقات مجانية لتحفيظ القرآن الكريم للأطفال أونلاين بحضور الأم، تشمل القاعدة النورانية والحفظ والمراجعة والتجويد، مع بوابة لأولياء الأمور لمتابعة الحضور والدرجات.",
        audience: "الأطفال وأولياء الأمور",
      },
    },
    en: {
      keyword: "Online Quran memorization for kids",
      title: "Online Quran Memorization for Kids – Free | Wartel",
      description:
        "Free online Quran memorization for kids with daily follow-up and a parent portal for attendance and grades. Register now as a parent at Wartel Academy.",
      h1: "Online Quran Memorization for Kids – Baraem Wartel",
      linkLabel: "Quran for kids",
      lead:
        "Wartel Academy teaches online Quran memorization for kids through its children's section, \"Baraem Wartel\": free virtual circles that children attend with their mother at a fixed time, with daily recitation and continuous follow-up. Parents create their own account, add their children, and track attendance and grades from the parent portal.",
      sections: [
        {
          h2: "Online Quran circles for children",
          blocks: [
            {
              type: "p",
              text: "Teaching children the Quran takes patience, gradual steps and an encouraging environment, which is why the academy runs a separate children's section. Children learn correct recitation and memorize at a pace that suits them, in a small group of peers with a teacher who follows and encourages them.",
            },
            {
              type: "p",
              text: "Online circles save the commute, let the family pick a time that fits around school, and allow the mother to sit with her child and see exactly what they are learning and how they are progressing. Lessons are taught in Arabic; the website and registration are available in English.",
            },
          ],
        },
        {
          h2: "For parents: a partnership between mother, child and teacher",
          blocks: [
            {
              type: "p",
              text: "A child's progress depends, after Allah's help, on three parties working together: the mother, the child and the teacher. Parents are asked to:",
            },
            {
              type: "ul",
              items: [
                "Choose a track that matches the child's memorization ability.",
                "Choose the circle time carefully around school commitments – circle times are fixed.",
                "Attend the circle with the child from start to finish.",
                "Supervise the daily \"Tamam\" recitation and review the child's portion before each circle.",
                "Play a teaching Mushaf recording daily during study and play to reinforce memorization.",
              ],
            },
            {
              type: "p",
              text: "To start, create a [parent account](/register/parent), log in, and add your children from the portal. If your child already has a student account, you can link it with the PIN shown on their profile.",
            },
          ],
        },
        {
          h2: "Ages",
          blocks: [
            {
              type: "p",
              text: "The children's section welcomes children who can sit through a circle and focus with the teacher for its full length. Each child's track is set by their reading level, current memorization and ability – not by age alone. One child may start with Al-Qaida Al-Noorania to learn the letters, while another moves straight to memorization.",
            },
            { type: "todo", text: "State the accepted age range for the children's section and when children move to the adult section." },
          ],
        },
        {
          h2: "What your child learns",
          blocks: [
            {
              type: "ul",
              items: [
                "Al-Qaida Al-Noorania: letters, articulation and correct reading, with an Ijazah at the end of the course for those who master it.",
                "Gradual Quran memorization following a plan suited to the child.",
                "Daily revision – just as important as new memorization.",
                "Simplified Tajweed lessons, including Tuhfat Al-Atfal.",
              ],
            },
          ],
        },
        {
          h2: "How progress is tracked",
          blocks: [
            {
              type: "ul",
              items: [
                "Parent portal: attendance, absences and grades as soon as they are recorded.",
                "Regular Quran tests that count toward the child's final assessment.",
                "Daily Tamam: missing it two days in a row triggers a warning; repeated warnings lead to removal.",
                "Notifications to parents about anything that needs attention.",
              ],
            },
            {
              type: "p",
              text: "These rules exist because consistency is the secret of memorization for children. Full rules are on the [children's section instructions](/instructions?type=parent).",
            },
          ],
        },
        {
          h2: "Tips for parents: helping your child love memorizing",
          blocks: [
            {
              type: "p",
              text: "Children memorize faster when they love what they memorize, and the family's role in this is even bigger than the circle's. Approaches that work well:",
            },
            {
              type: "ul",
              items: [
                "Keep daily revision short and regular – ten minutes after a particular prayer beats one long, irregular session.",
                "Praise effort and consistency, not only the amount memorized, and celebrate each completed surah.",
                "Recite what your child has memorized together in prayer or at bedtime, so the Quran feels part of family life.",
                "Explain the meaning of short verses through simple stories – understanding strengthens memory.",
                "Avoid comparing your child with siblings or classmates; every child has their own pace.",
              ],
            },
          ],
        },
        {
          h2: "Completely free",
          blocks: [
            {
              type: "p",
              text: "Wartel is a non-profit academy, so children's circles, Tajweed lessons, certificates and Ijazahs are all free. See [free online Quran classes](/free-quran-memorization), and if the mother would like to memorize too, see our [online Quran classes for women](/quran-for-women).",
            },
          ],
        },
      ],
      faq: [
        {
          q: "How do I enrol my child?",
          a: "Create a [parent account](/register/parent), log in, choose \"Add New Child\", and the request is reviewed before your child is placed in a suitable circle.",
        },
        {
          q: "Does the mother need to attend?",
          a: "Yes. Attending the circle with the child from start to finish is one of the children's section rules.",
        },
        {
          q: "Can I follow my child's grades and attendance?",
          a: "Yes. The parent portal shows attendance, absences and grades as soon as they are recorded.",
        },
        {
          q: "Is it free?",
          a: "Yes. All academy activities are free of charge, including certificates and Ijazahs.",
        },
        {
          q: "Are lessons in English?",
          a: "Lessons are taught in Arabic. The website, registration and parent portal are available in English.",
        },
        {
          q: "My child already has a student account. How do I link it?",
          a: "In the parent portal choose \"Link New Child\" and enter the PIN from your child's profile together with their phone number.",
        },
      ],
      cta: {
        title: "Enrol your children today",
        text: "Create a free parent account and add your children to online Quran memorization circles.",
        label: "Register now",
        href: "/instructions?type=parent",
        secondary: { label: "How to register", href: "/how-to-register" },
      },
      schema: {
        type: "course",
        name: "Online Quran Memorization for Kids – Baraem Wartel",
        description:
          "Free online Quran memorization circles for children attended with their mother: Noorani Qaida, memorization, revision and Tajweed, with a parent portal for attendance and grades.",
        audience: "Children and parents",
      },
    },
  },
};
