// Giriş noktası: önce dil yüklenir, sonra modüller birbirine bağlanır.
import { QUIZ } from "./config.js";
import { initI18n } from "./i18n.js";
import { initLangSwitch } from "./langswitch.js";
import { initSite } from "./site.js";
import { initNav } from "./nav.js";
import { initShare } from "./share.js";
import { createQuiz } from "./quiz.js";
import { createResult } from "./result.js";
import { initStats, trackTestCompleted } from "./stats.js";
import { initRichText } from "./richtext.js";

const $ = (sel) => document.querySelector(sel);

await initI18n();

initLangSwitch();
initSite();
initNav();
initShare();
initRichText();
initStats(); // beklenmez: sayılar gelince kutu kendi kendine açılır

const quizPanel = $("#quiz-panel");

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
    result.hide();
    quizPanel.hidden = false;
    quiz.goTo(quiz.lastIndex);
    scrollToTest();
  },
  onRestart: () => {
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
  count: QUIZ.questionCount,
  scaleSize: QUIZ.scaleSize,
  onFinish: (answers) => {
    trackTestCompleted(); // sadece sayı gider, cevaplar değil
    quizPanel.hidden = true;
    result.show(answers);
    scrollToTest();
  },
});

function scrollToTest() {
  $("#test-title").scrollIntoView({ block: "start" });
}
