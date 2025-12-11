// Ekspert tizimi qoidalari bazasi
const rules = [
  {
    id: 1,
    condition: (symptoms) => symptoms.power && symptoms.fan,
    conclusion: "Quvvat bloki nosoz bo'lishi mumkin.",
    recommendations: [
      "Quvvat kabelini tekshiring",
      "Elekt rozetkasini tekshiring",
      "Quvvat blokini almashtiring",
    ],
    confidence: 85,
  },
  {
    id: 2,
    condition: (symptoms) => symptoms.noDisplay && symptoms.noSignal,
    conclusion:
      "Videokarta signal bermayapti yoki monitor bilan ulanish muammosi.",
    recommendations: [
      "Videokarta kabelini tekshiring",
      "Videokartani boshqa slotga o'tkazing",
      "Videokartani almashtiring",
    ],
    confidence: 80,
  },
  {
    id: 3,
    condition: (symptoms) => symptoms.noSignal && !symptoms.noDisplay,
    conclusion: "Monitor kabeli yoki ulanish muammosi.",
    recommendations: [
      "Monitor kabelini tekshiring",
      "Kabelni qayta ulang",
      "Boshqa monitor sinab ko'ring",
    ],
    confidence: 70,
  },
  {
    id: 4,
    condition: (symptoms) => symptoms.noDisplay && !symptoms.noSignal,
    conclusion: "Monitor sozlamalari noto'g'ri yoki ekran muammosi.",
    recommendations: [
      "Monitor quvvat manbasini tekshiring",
      "Monitor sozlamalarini qayta o'rnating",
      "Monitorni boshqa kompyuterga ulab ko'ring",
    ],
    confidence: 65,
  },
  {
    id: 5,
    condition: (symptoms) => symptoms.beep,
    conclusion: "Xotira yoki protsessor muammosi (POST xatolari).",
    recommendations: [
      "Xotira modullarini qayta o'rnating",
      "Xotira slotlarini tekshiring",
      "Protsessor sovutish tizimini tekshiring",
    ],
    confidence: 75,
  },
  {
    id: 6,
    condition: (symptoms) => symptoms.overheat,
    conclusion: "Sovutish tizimi ishlamayapti yoki chang bosgan.",
    recommendations: [
      "Ventilyatorlarni tozalang",
      "Termal pastani almashtiring",
      "Qo'shimcha sovutish o'rnating",
    ],
    confidence: 90,
  },
];

// DOM elementlari
const diagnoseBtn = document.getElementById("diagnoseBtn");
const resetBtn = document.getElementById("resetBtn");
const diagnosisTitle = document.getElementById("diagnosisTitle");
const diagnosisText = document.getElementById("diagnosisText");
const recommendationsDiv = document.getElementById("recommendations");
const recommendationsList = document.getElementById("recommendationsList");
const confidenceLevel = document.getElementById("confidenceLevel");
const confidencePercent = document.getElementById("confidencePercent");
const symptomCards = document.querySelectorAll(".symptom-card");

// Belgilarni olish funksiyasi
function getSymptoms() {
  return {
    power: document.getElementById("power").checked,
    fan: document.getElementById("fan").checked,
    noDisplay: document.getElementById("noDisplay").checked,
    noSignal: document.getElementById("noSignal").checked,
    beep: document.getElementById("beep").checked,
    overheat: document.getElementById("overheat").checked,
  };
}

// Diagnostika funksiyasi
function diagnose() {
  const symptoms = getSymptoms();

  // Tanlangan belgilarni tekshirish
  const selectedSymptoms = Object.values(symptoms).filter(Boolean).length;

  if (selectedSymptoms === 0) {
    showResult(
      "Hech qanday belgi tanlanmadi",
      "Iltimos, kamida bitta belgi tanlang.",
      "normal",
      0,
      []
    );
    return;
  }

  // Qoidalarni baholash
  let matchedRules = [];

  for (const rule of rules) {
    if (rule.condition(symptoms)) {
      matchedRules.push(rule);
    }
  }

  // Natijalarni ko'rsatish
  if (matchedRules.length > 0) {
    // Birinchi mos kelgan qoidani asosiy natija sifatida ko'rsatish
    const primaryRule = matchedRules[0];
    const allRecommendations = [];

    // Barcha mos kelgan qoidalardan tavsiyalarni yig'ish
    matchedRules.forEach((rule) => {
      allRecommendations.push(...rule.recommendations);
    });

    // Takrorlangan tavsiyalarni olib tashlash
    const uniqueRecommendations = [...new Set(allRecommendations)];

    showResult(
      "Nosozlik aniqlandi",
      primaryRule.conclusion,
      "danger",
      primaryRule.confidence,
      uniqueRecommendations
    );

    // Qoidalarni vizual jihatdan ajratib ko'rsatish
    highlightMatchedRules(matchedRules);
  } else {
    // Hech qaysi qoidaga mos kelmasa
    const confidence = Math.min(50, selectedSymptoms * 10);
    showResult(
      "Aniq nosozlik topilmadi",
      "Tanlangan belgilar mavjud qoidalarga mos kelmadi. Qo'shimcha tekshiruv talab qilinadi.",
      "warning",
      confidence,
      [
        "Qo'shimcha diagnostika dasturlaridan foydalaning",
        "Mutaxassis bilan bog'laning",
      ]
    );
  }

  // Belgilarni hisoblash va ko'rsatish
  updateSymptomsCount(selectedSymptoms);
}

// Natijani ko'rsatish funksiyasi
function showResult(title, text, type, confidence, recommendations) {
  // Sarlavha va matn
  diagnosisTitle.textContent = title;
  diagnosisText.textContent = text;

  // Natija konteyneriga rang klassini qo'shish
  const resultContainer = document.querySelector(".result-container");
  resultContainer.className = "result-container";
  resultContainer.classList.add(`diagnosis-${type}`);

  // Iconni o'zgartirish
  const resultIcon = document.querySelector(".result-icon i");
  resultIcon.className = getIconForType(type);

  // Aniqlik darajasini ko'rsatish
  confidenceLevel.style.width = `${confidence}%`;
  confidencePercent.textContent = `${confidence}%`;

  // Tavsiyalarni ko'rsatish
  if (recommendations && recommendations.length > 0) {
    recommendationsDiv.classList.remove("hidden");
    recommendationsList.innerHTML = "";

    recommendations.forEach((rec) => {
      const li = document.createElement("li");
      li.textContent = rec;
      recommendationsList.appendChild(li);
    });
  } else {
    recommendationsDiv.classList.add("hidden");
  }
}

// Icon tanlash funksiyasi
function getIconForType(type) {
  switch (type) {
    case "normal":
      return "fas fa-check-circle";
    case "warning":
      return "fas fa-exclamation-triangle";
    case "danger":
      return "fas fa-exclamation-circle";
    default:
      return "fas fa-question-circle";
  }
}

// Mos kelgan qoidalarni ajratib ko'rsatish
function highlightMatchedRules(matchedRules) {
  // Barcha qoidalarni normal holatga qaytarish
  document.querySelectorAll(".rule").forEach((rule) => {
    rule.style.opacity = "0.7";
    rule.style.transform = "scale(0.98)";
  });

  // Mos kelgan qoidalarni ajratib ko'rsatish
  matchedRules.forEach((matchedRule) => {
    const ruleElement = document.querySelector(
      `.rule:nth-child(${matchedRule.id})`
    );
    if (ruleElement) {
      ruleElement.style.opacity = "1";
      ruleElement.style.transform = "scale(1.02)";
      ruleElement.style.boxShadow = "0 4px 12px rgba(67, 97, 238, 0.2)";
      ruleElement.style.borderLeftColor = "#4361ee";

      // Animatsiya
      setTimeout(() => {
        ruleElement.style.boxShadow = "0 2px 8px rgba(67, 97, 238, 0.15)";
        ruleElement.style.transform = "scale(1)";
      }, 300);
    }
  });
}

// Belgilar sonini yangilash
function updateSymptomsCount(count) {
  const symptomCountElement = document.querySelector(".symptoms-count");

  if (!symptomCountElement) {
    // Agar element mavjud bo'lmasa, yaratish
    const instructionElement = document.querySelector(".instruction");
    const countElement = document.createElement("span");
    countElement.className = "symptoms-count";
    countElement.style.fontWeight = "bold";
    countElement.style.color = "#4361ee";
    countElement.style.marginLeft = "10px";
    instructionElement.appendChild(countElement);
  }

  document.querySelector(
    ".symptoms-count"
  ).textContent = `(${count} ta tanlandi)`;
}

// Tozalash funksiyasi
function resetDiagnosis() {
  // Checkboxlarni tozalash
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Belgilar kartalarini normal holatga qaytarish
  symptomCards.forEach((card) => {
    card.style.borderColor = "#e0e0e0";
    card.style.transform = "scale(1)";
  });

  // Natijani tozalash
  showResult(
    "Tahlilni boshlang",
    'Belgilarni tanlang va "Diagnostika qilish" tugmasini bosing.',
    "normal",
    0,
    []
  );

  // Qoidalarni normal holatga qaytarish
  document.querySelectorAll(".rule").forEach((rule) => {
    rule.style.opacity = "1";
    rule.style.transform = "scale(1)";
    rule.style.boxShadow = "none";
    rule.style.borderLeftColor = "#4cc9f0";
  });

  // Belgilar sonini tozalash
  const symptomCountElement = document.querySelector(".symptoms-count");
  if (symptomCountElement) {
    symptomCountElement.textContent = "";
  }

  // Tavsiyalarni yashirish
  recommendationsDiv.classList.add("hidden");
}

// Belgilar kartalariga interaktivlik qo'shish
symptomCards.forEach((card) => {
  const checkbox = card.querySelector('input[type="checkbox"]');

  card.addEventListener("click", () => {
    // Checkbox holatini o'zgartirish
    checkbox.checked = !checkbox.checked;

    // Kartani vizual jihatdan yangilash
    if (checkbox.checked) {
      card.style.borderColor = "#2ec4b6";
      card.style.boxShadow = "0 4px 12px rgba(46, 196, 182, 0.2)";
    } else {
      card.style.borderColor = "#e0e0e0";
      card.style.boxShadow = "none";
    }
  });
});

// Tugmalarga hodisa qo'shish
diagnoseBtn.addEventListener("click", diagnose);
resetBtn.addEventListener("click", resetDiagnosis);

// Dasturni ishga tushirish
document.addEventListener("DOMContentLoaded", function () {
  // Dastlabki holatni o'rnatish
  resetDiagnosis();

  // Belgilar tanlanganda real vaqtda hisoblash
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const symptoms = getSymptoms();
      const selectedSymptoms = Object.values(symptoms).filter(Boolean).length;
      updateSymptomsCount(selectedSymptoms);
    });
  });

  // Ekspert tizimi haqida konsolga ma'lumot chiqarish
  console.log("Ekspert tizimi yuklandi:");
  console.log(`- ${rules.length} ta qoida`);
  console.log("- Faktlar bazasi: 6 ta belgi");
  console.log("- Inferensiya mexanizmi: Oldindan belgilangan qoidalar");
});
