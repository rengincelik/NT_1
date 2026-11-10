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

  refs: {
    title: "Sources",
    cite: "Source {n}",
  },

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

  // body: paragraf dizisi. "## " ile başlayan satır başlık olur. [@anahtar] kaynak numarası ekler (js/references.js).
  narcolepsy: {
    title: "Narcolepsy",
    body: [
      "Narcolepsy is a chronic neurological disorder of hypersomnolence in which the brain cannot properly regulate the sleep-wake cycle.[@scammell2015][@bassetti2021] It usually begins in the teenage years or young adulthood and stays for life.[@dauvilliers2007]",
      "Narcolepsy with cataplexy affects roughly 0.02% of adults worldwide, about 1 in 2,000.[@dauvilliers2007] Symptoms are often not recognized as narcolepsy, and studies report an average delay of up to 15 years before the diagnosis is made.[@thorpy2014]",

      "## Cause",
      "The hallmark of Type 1 narcolepsy is the loss of orexin (hypocretin) neurons in the lateral hypothalamus.[@nishino2000][@thannickal2000] The most likely explanation is an autoimmune process.[@dauvilliers2007][@bassetti2021]",
      "Genetic susceptibility: almost all people with narcolepsy with cataplexy carry the HLA-DQB1*06:02 allele.[@mignot2001]",
      "Environmental triggers: the strongest environmental risk identified so far is influenza A (H1N1), through both infection and vaccination.[@bonvalet2017]",

      "## The five symptoms",
      "Narcolepsy is described by a symptom pentad, which includes fragmented night sleep.[@dauvilliers2007]",
      "1. Excessive daytime sleepiness. Present in every patient: constant sleepiness and irresistible sleep attacks during the day.[@scammell2015]",
      "2. Cataplexy. A sudden, brief loss of muscle tone triggered by strong emotions such as laughter, excitement or anger, while you stay conscious.[@sturzenegger2004]",
      "3. Sleep paralysis. Being temporarily unable to move or speak while falling asleep or waking up.[@dauvilliers2007]",
      "4. Hypnagogic / hypnopompic hallucinations. Vivid, often frightening experiences at sleep onset or on waking.[@dauvilliers2007]",
      "5. Disrupted night sleep. Frequent movement and awakenings during the night, even though you are sleepy during the day.[@dauvilliers2007]",

      "## Types",
      "The International Classification of Sleep Disorders (3rd edition) separates two types.[@aasm2014][@sateia2014]",
      "Type 1 (NT1): cataplexy is present, or the hypocretin-1 level in cerebrospinal fluid (CSF) is low (110 pg/mL or less).",
      "Type 2 (NT2): no cataplexy, and CSF hypocretin-1 is normal or has not been measured.",

      "## How it is diagnosed",
      "A formal diagnosis needs a full clinical and laboratory work-up.[@aasm2014]",
      "Overnight polysomnography (PSG) looks at the structure of night sleep and rules out other causes, such as obstructive sleep apnea.",
      "The Multiple Sleep Latency Test (MSLT) measures how quickly you fall asleep (an average of 8 minutes or less) and whether REM sleep starts within minutes of sleep onset (two or more sleep-onset REM periods).[@aasm2014][@littner2005]",
      "The Swiss Narcolepsy Scale (SNS), the test on this site, is a short five-question screening tool for Type 1 narcolepsy, and its questions cover the five symptoms above. Several studies in different populations found that it separates Type 1 narcolepsy from other causes of sleepiness with high sensitivity and specificity.[@sturzenegger2004][@sturzenegger2018][@bargiotas2019] A Turkish version has been validated.[@demir2023] It does not detect Type 2, and a screening tool does not replace a diagnosis.[@bargiotas2019]",
      "CSF hypocretin-1 measurement is the gold-standard biomarker for Type 1 narcolepsy.[@nishino2000]",

      "## Treatment",
      "Treatment combines medication with behavioral measures and usually has to continue for life.[@bassetti2021]",
      "Scheduled daytime naps and several medicines reduce sleepiness, and other medicines reduce cataplexy. The choice depends on your symptoms and is made by a specialist.[@bassetti2021]",
      "Orexin receptor agonists are a newer approach aimed directly at the hypocretin deficiency. In August 2026 the FDA approved oveporexton (Orzeyful), an oral orexin receptor-2 (OX2R) agonist, for adults with Type 1 narcolepsy. It is the first medicine designed to target the loss of orexin signaling itself.[@fda2026]",

      "## What to do next",
      "If these symptoms sound familiar, see a neurologist or a sleep medicine specialist. Write down when your sleepiness, muscle weakness and sleep problems happen and which medicines you take, and bring the note with you.",
      "Do not start, stop or change any medicine on your own. A screening test is only a first step.",
		"This test only looks for Type 1 narcolepsy. Sleepiness has many other causes, such as sleep apnea or not getting enough sleep, and a sleep clinic can look at all of them.",
    ],
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