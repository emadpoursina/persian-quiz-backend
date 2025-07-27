// Script to seed example quizzes for demonstration
const exampleQuizzes = [
  {
    id: "quiz-1",
    title: "آزمون دانش عمومی ایران",
    description:
      "آزمونی جامع درباره تاریخ، جغرافیا و فرهنگ ایران. این آزمون شامل سوالاتی در زمینه‌های مختلف دانش عمومی کشورمان است.",
    slug: "general-knowledge-iran",
    isActive: true,
    requirePermission: false,
    allowedNumbers: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    questions: [
      {
        id: "q1-1",
        question: "<p><strong>پایتخت ایران</strong> کدام شهر است؟</p>",
        options: ["تهران", "اصفهان", "شیراز", "مشهد"],
        correct: 0,
      },
      {
        id: "q1-2",
        question: "<p>کدام یک از این <em>کشورها</em> همسایه ایران <u>نیست</u>؟</p>",
        options: ["عراق", "افغانستان", "سوریه", "ترکیه"],
        correct: 2,
      },
      {
        id: "q1-3",
        question: "<p>بزرگترین دریاچه ایران کدام است؟</p><ul><li>در شمال غرب کشور</li><li>در معرض خشک شدن</li></ul>",
        options: ["دریاچه ارومیه", "دریاچه نمک", "دریاچه پریشان", "دریاچه زریوار"],
        correct: 0,
      },
      {
        id: "q1-4",
        question: "<h3>ادبیات فارسی</h3><p>کدام شاعر، مؤلف <strong>شاهنامه</strong> است؟</p>",
        options: ["حافظ", "سعدی", "فردوسی", "مولوی"],
        correct: 2,
      },
      {
        id: "q1-5",
        question: "<p>واحد پول رسمی ایران چیست؟</p>",
        options: ["دینار", "درهم", "ریال", "تومان"],
        correct: 2,
      },
      {
        id: "q1-6",
        question: '<p>کدام شهر به عنوان <em>"نصف جهان"</em> شناخته می‌شود؟</p>',
        options: ["تهران", "اصفهان", "شیراز", "یزد"],
        correct: 1,
      },
    ],
  },
  {
    id: "quiz-2",
    title: "آزمون ریاضی پایه",
    description:
      "آزمون ریاضیات برای سطح مقدماتی شامل اعمال اصلی، کسرها و هندسه ابتدایی. مناسب برای دانش‌آموزان و علاقه‌مندان به ریاضی.",
    slug: "basic-math-quiz",
    isActive: true,
    requirePermission: false,
    allowedNumbers: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    questions: [
      {
        id: "q2-1",
        question: "<h3>محاسبه ساده</h3><p><strong>25 + 17</strong> چقدر است؟</p>",
        options: ["42", "41", "43", "40"],
        correct: 0,
      },
      {
        id: "q2-2",
        question: "<p>حاصل <strong>8 × 7</strong> کدام است؟</p>",
        options: ["54", "56", "58", "52"],
        correct: 1,
      },
      {
        id: "q2-3",
        question: "<p>کدام عدد <u>اول</u> است؟</p><p><em>عدد اول: عددی که فقط بر 1 و خودش بخش‌پذیر است</em></p>",
        options: ["15", "21", "17", "25"],
        correct: 2,
      },
      {
        id: "q2-4",
        question: "<p>مساحت مربعی با ضلع <strong>5 سانتی‌متر</strong> چقدر است؟</p>",
        options: ["20 سانتی‌متر مربع", "25 سانتی‌متر مربع", "30 سانتی‌متر مربع", "15 سانتی‌متر مربع"],
        correct: 1,
      },
      {
        id: "q2-5",
        question: "<p>کسر <strong>3/4</strong> معادل چند درصد است؟</p>",
        options: ["70%", "75%", "80%", "65%"],
        correct: 1,
      },
    ],
  },
  {
    id: "quiz-3",
    title: "آزمون زبان انگلیسی مبتدی",
    description:
      "آزمون زبان انگلیسی برای سطح مبتدی شامل واژگان پایه، گرامر ساده و عبارات روزمره. مناسب برای شروع یادگیری زبان انگلیسی.",
    slug: "beginner-english-quiz",
    isActive: false,
    requirePermission: true,
    allowedNumbers: ["09123456789", "09987654321"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    questions: [
      {
        id: "q3-1",
        question: '<p><strong>"Hello"</strong> به فارسی یعنی:</p>',
        options: ["خداحافظ", "سلام", "ممنون", "ببخشید"],
        correct: 1,
      },
      {
        id: "q3-2",
        question: "<p>کدام گزینه <em>صحیح</em> است؟</p>",
        options: ["I am student", "I is student", "I are student", "I am a student"],
        correct: 3,
      },
      {
        id: "q3-3",
        question: '<h3>رنگ‌ها</h3><p><strong>"Red"</strong> به فارسی چه معنی دارد؟</p>',
        options: ["آبی", "سبز", "قرمز", "زرد"],
        correct: 2,
      },
      {
        id: "q3-4",
        question: '<p>جمع <strong>"Book"</strong> چیست؟</p>',
        options: ["Books", "Bookes", "Book", "Bookies"],
        correct: 0,
      },
    ],
  },
  {
    id: "quiz-4",
    title: "آزمون علوم طبیعی",
    description:
      "آزمون جامع علوم طبیعی شامل فیزیک، شیمی و زیست‌شناسی. این آزمون برای دانش‌آموزان و علاقه‌مندان به علوم طراحی شده است.",
    slug: "natural-sciences-quiz",
    isActive: true,
    requirePermission: false,
    allowedNumbers: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    questions: [
      {
        id: "q4-1",
        question: "<h3>فیزیک</h3><p>واحد اندازه‌گیری <strong>نیرو</strong> چیست؟</p>",
        options: ["ژول", "نیوتن", "وات", "پاسکال"],
        correct: 1,
      },
      {
        id: "q4-2",
        question: '<p>کدام عنصر نماد <strong>"O"</strong> دارد؟</p>',
        options: ["طلا", "اکسیژن", "نقره", "آهن"],
        correct: 1,
      },
      {
        id: "q4-3",
        question:
          "<h3>زیست‌شناسی</h3><p>کوچکترین واحد زندگی چیست؟</p><ul><li>قابل مشاهده با میکروسکوپ</li><li>دارای غشای سلولی</li></ul>",
        options: ["بافت", "سلول", "اندام", "دستگاه"],
        correct: 1,
      },
      {
        id: "q4-4",
        question: "<p>سرعت نور در خلأ تقریباً چقدر است؟</p>",
        options: [
          "300,000 کیلومتر بر ثانیه",
          "150,000 کیلومتر بر ثانیه",
          "450,000 کیلومتر بر ثانیه",
          "200,000 کیلومتر بر ثانیه",
        ],
        correct: 0,
      },
      {
        id: "q4-5",
        question: "<p>فرمول شیمیایی <strong>آب</strong> چیست؟</p>",
        options: ["CO2", "H2O", "NaCl", "CH4"],
        correct: 1,
      },
    ],
  },
  {
    id: "quiz-5",
    title: "آزمون تاریخ ایران",
    description:
      "آزمون تخصصی تاریخ ایران از دوران باستان تا معاصر. شامل سلسله‌های مختلف، رویدادهای مهم و شخصیت‌های تاریخی.",
    slug: "iran-history-quiz",
    isActive: true,
    requirePermission: false,
    allowedNumbers: [],
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    questions: [
      {
        id: "q5-1",
        question: "<h3>دوران باستان</h3><p>بنیانگذار <strong>امپراتوری هخامنشی</strong> کیست؟</p>",
        options: ["داریوش", "کوروش", "خشایارشا", "اردشیر"],
        correct: 1,
      },
      {
        id: "q5-2",
        question: "<p>کدام شهر پایتخت <em>امپراتوری ساسانی</em> بود؟</p>",
        options: ["پرسپولیس", "تیسفون", "اصطخر", "ری"],
        correct: 1,
      },
      {
        id: "q5-3",
        question: "<p>فتح ایران توسط اعراب در کدام قرن رخ داد؟</p>",
        options: ["قرن ششم", "قرن هفتم", "قرن هشتم", "قرن نهم"],
        correct: 1,
      },
      {
        id: "q5-4",
        question: "<h3>دوران اسلامی</h3><p>کدام خاندان اولین حکومت <u>مستقل</u> ایرانی پس از اسلام را تشکیل داد؟</p>",
        options: ["آل بویه", "طاهریان", "صفاریان", "سامانیان"],
        correct: 1,
      },
    ],
  },
]

// Generate some example results
const exampleResults = [
  {
    id: "result-1",
    quizId: "quiz-1",
    userName: "علی احمدی",
    userMobile: "09123456789",
    answers: [0, 2, 0, 2, 2, 1], // 5/6 correct
    score: 5,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "result-2",
    quizId: "quiz-1",
    userName: "فاطمه رضایی",
    userMobile: "09987654321",
    answers: [0, 2, 0, 2, 2, 0], // 4/6 correct
    score: 4,
    completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: "result-3",
    quizId: "quiz-2",
    userName: "محمد کریمی",
    userMobile: "09111111111",
    answers: [0, 1, 2, 1, 1], // 5/5 correct
    score: 5,
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: "result-4",
    quizId: "quiz-2",
    userName: "زهرا موسوی",
    userMobile: "09222222222",
    answers: [0, 1, 1, 1, 0], // 3/5 correct
    score: 3,
    completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: "result-5",
    quizId: "quiz-4",
    userName: "حسن نوری",
    userMobile: "09333333333",
    answers: [1, 1, 1, 0, 1], // 5/5 correct
    score: 5,
    completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: "result-6",
    quizId: "quiz-4",
    userName: "مریم صادقی",
    userMobile: "09444444444",
    answers: [1, 1, 0, 0, 1], // 3/5 correct
    score: 3,
    completedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
  },
  {
    id: "result-7",
    quizId: "quiz-1",
    userName: "رضا محمدی",
    userMobile: "09555555555",
    answers: [0, 1, 0, 2, 2, 1], // 4/6 correct
    score: 4,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "result-8",
    quizId: "quiz-2",
    userName: "سارا حسینی",
    userMobile: "09666666666",
    answers: [0, 1, 2, 0, 1], // 4/5 correct
    score: 4,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
]

// Function to seed the data
function seedExampleData() {
  try {
    // Save example quizzes
    localStorage.setItem("adminQuizzes", JSON.stringify(exampleQuizzes))

    // Save example results
    localStorage.setItem("adminResults", JSON.stringify(exampleResults))

    console.log("✅ Example quizzes and results have been successfully added!")
    console.log(`📊 Added ${exampleQuizzes.length} quizzes and ${exampleResults.length} results`)

    // Log quiz details
    console.log("\n📝 Added Quizzes:")
    exampleQuizzes.forEach((quiz, index) => {
      console.log(
        `${index + 1}. ${quiz.title} (${quiz.questions.length} questions) - ${quiz.isActive ? "Active" : "Inactive"}`,
      )
    })

    return true
  } catch (error) {
    console.error("❌ Error seeding example data:", error)
    return false
  }
}

// Run the seeding function
seedExampleData()
