// İngilizce (varsayılan dil). Başka dillerde eksik kalan anahtarlar buradan gelir.
export default {
  meta: {
    title: "Narcolepsy",
    description: "A 2-minute narcolepsy screening (Swiss Narcolepsy Scale).",
    dateLocale: "en-GB",
  },

  site: { name: "Narcolepsy" },

  nav: {
    aria: "Main menu",
    home: "Home",
    about: "About me",
    narcolepsy: "Narcolepsy",
    test: "Test",
  },

  lang: { label: "Language" },

  about: {
    lead: "For 15 years I walked around like a zombie and blamed it on \"engineering stress\". When my battery died out of nowhere in the middle of the day, or my knees buckled when I laughed, I called it \"just being busy\".",
    big: "Turns out it has a name: Narcolepsy Type 1.",
    p1: "Everyone around us says \"we're all tired, don't make a fuss\", and doctors just say \"you're not sleeping enough\", so it never occurs to you. Noticing a fault in your own body can take years. In Turkey, thousands of people are still groping around in the dark and running into walls.",
    p2: "If you have ever had those moments where you quietly think \"something is off with me, nobody can be this exhausted\", you don't need to read long articles. There is a practical 5-question screening test used in clinics, the Swiss Narcolepsy Scale (SNS). It took me 15 years to learn this. I put it here so you can check in 2 minutes.",
  },

  home: {
    tagline: "Swiss Narcolepsy Scale (SNS) · about 2 minutes",
    start: "Take the test",
    views: "page views",
    tests: "tests completed",
  },

  narcolepsy: {
    title: "Narcolepsy",
    soon: "Coming soon.",
  },

  test: {
    title: "Test yourself",
    subtitle: "Swiss Narcolepsy Scale (SNS) · about 2 minutes",
    progress: "Question {n} / {total}",
    prev: "← Back",
    next: "Next →",
    finish: "See result",
    tip: "Answer with keys 1–5, move with the arrow keys, or swipe left and right.",
  },

  questions: [
    "Do you find yourself suddenly falling asleep during the day?",
    "When you get excited, laugh, or get angry, do you feel a sudden loss of muscle strength (knees buckling, jaw dropping, etc.)?",
    "Is your sleep at night often interrupted? Do you have trouble sleeping through the night?",
    "Do you have episodes where you can't move your body while falling asleep or waking up (sleep paralysis)?",
    "Do you experience very vivid, dream-like, frightening images or sounds (hallucinations) while falling asleep or waking up?",
  ],

  scale: ["Never", "Rarely", "Sometimes", "Often", "Always"],

  result: {
    cover: "Scratch to reveal",
    hint: "Scratch with your finger or mouse to see the result.",
    skip: "Show without scratching",
    pdf: "Save as PDF",
    pdfTip: "In the window that opens, choose \"Save as PDF\" as the destination. You get a summary of your answers you can take to a doctor.",
    edit: "Edit answers",
    restart: "Start over",
  },

  share: {
    button: "Share on WhatsApp",
    text: "A 2-minute narcolepsy screening. It took me 15 years to notice it in myself, maybe it will help you:",
  },

  messages: {
    suspect: {
      title: "Your score points to a possible concern",
      body: "Don't ignore it. Don't put off booking an appointment with a neurologist or sleep specialist. You're not alone.",
    },
    unlikely: {
      title: "Your score is below the threshold",
      body: "That doesn't mean nothing is going on. If your symptoms continue, talk to a specialist.",
    },
    neutral: {
      title: "Your answers are in",
      body: "The threshold that interprets your score hasn't been added yet. If your symptoms bother you, talk to a neurologist or sleep specialist. You're not alone.",
    },
  },

  print: {
    title: "Narcolepsy screening answers",
    note: "This summary is not a diagnosis. It is prepared to share with a neurologist or sleep specialist.",
  },

  footer: {
    role: "A short description",
    note: "This page is not a diagnostic tool. It only gives an idea of whether you should see a neurologist or sleep specialist. Your answers never leave this device and are not stored anywhere.",
    statsNote: "This site only counts visits and completed tests, anonymously. Your answers and results are never sent.",
  },
};
