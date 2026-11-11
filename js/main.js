// Giriş noktası: önce dil yüklenir, sonra modüller birbirine bağlanır.
import { TESTS, DEFAULT_TEST } from "./config.js";
import { initI18n, t, onLangChange } from "./i18n.js";
import { initLangSwitch } from "./langswitch.js";
import { initSite } from "./site.js";
import { initShare } from "./share.js";
import { createQuiz } from "./quiz.js";
import { createResult } from "./result.js";
import { initTestSwitch } from "./testswitch.js";
import { initStats, trackTestCompleted } from "./stats.js";
import { initRichText } from "./richtext.js";

const $ = (sel) => document.querySelector(sel);

await initI18n();

initLangSwitch();
initSite();
initShare();
initRichText();
initStats(); // beklenmez: sayılar gelince kutu kendi kendine açılır

const quizPanel = $("#quiz-panel");
const subtitle = $("#test-subtitle");
const intro = $("#test-intro");         // tests.<id>.intro[]: sorulardan önce gösterilen yönerge (isteğe bağlı)
const copyright = $("#test-copyright"); // tests.<id>.copyright: telif/lisans satırı (isteğe bağlı)

// Bitirilmiş testlerin cevapları (sadece bellekte). Test değiştirince sonuç ekranı geri gelir.
const finished = new Map();

const result = createResult({
  panel: $("#result-panel"),
  content: $("#result-content"),
  canvas: $("#scratch"),
  hint: $("#scratch-hint"),
  skipBtn: $("#skip-scratch"),
  actions: $("#result-actions"),
  summary: $("#print-summary"),
  editBtn: $("#edit-btn"),
  restartBtn: $("#restart-btn"),
  printBtn: $("#print-btn"),
  onEdit: () => {
    finished.delete(quiz.testId);
    result.hide();
    quizPanel.hidden = false;
    quiz.goTo(quiz.lastIndex);
    scrollToTest();
  },
  onRestart: () => {
    finished.delete(quiz.testId);
    result.hide();
    quizPanel.hidden = false;
    quiz.reset();
    scrollToTest();
  },
});

const quiz = createQuiz({
  root: quizPanel,
  track: $("#quiz-track"),
  viewport: $("#quiz-viewport"),
  prevBtn: $("#prev-btn"),
  nextBtn: $("#next-btn"),
  progressText: $("#progress-text"),
  progressFill: $("#progress-fill"),
  progressBar: $("#progress-bar"),
  tipEl: $("#quiz-tip"),
  tests: TESTS,
  initialTest: DEFAULT_TEST,
  onFinish: (answers, id) => {
    finished.set(id, answers);
    trackTestCompleted(id); // sadece sayı gider, cevaplar değil
    quizPanel.hidden = true;
    result.show(answers, id);
    scrollToTest();
  },
});

// İsteğe bağlı metin: dil dosyasında yoksa t() anahtarın kendisini döndürür
function optional(key) {
  const v = t(key);
  return v === key ? null : v;
}

// Seçili testin alt başlığı, yönergesi ve telif satırı
function renderTestMeta() {
  const id = quiz.testId;
  subtitle.textContent = t(`tests.${id}.subtitle`);

  const paragraphs = [];
  for (let i = 0; i < 20; i++) {
    const text = optional(`tests.${id}.intro.${i}`);
    if (text === null) break;
    const p = document.createElement("p");
    p.textContent = text;
    paragraphs.push(p);
  }
  intro.replaceChildren(...paragraphs);
  intro.hidden = paragraphs.length === 0;

  const c = optional(`tests.${id}.copyright`);
  copyright.textContent = c ?? "";
  copyright.hidden = c === null;
}

// Seçili testi gösterir: bitirilmişse sonucu, değilse soruları
function selectTest(id) {
  quiz.setTest(id);
  renderTestMeta();
  if (finished.has(id)) {
    quizPanel.hidden = true;
    result.show(finished.get(id), id, { revealed: true });
  } else {
    result.hide();
    quizPanel.hidden = false;
  }
}

initTestSwitch({
  container: $("#test-switch"),
  ids: Object.keys(TESTS),
  current: quiz.testId,
  onSelect: selectTest,
});

renderTestMeta();
onLangChange(renderTestMeta);

function scrollToTest() {
  $("#test-title").scrollIntoView({ block: "start" });
}
