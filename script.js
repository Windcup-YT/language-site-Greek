let vocab = [];
let questionPool = [];
let currentIndex = 0;
let currentQuestion = null;

fetch("data/vocab.json")
  .then(res => {
    if (!res.ok) throw new Error("Failed to load.");
    return res.json();
  })
  .then(data => {
    vocab = data;
    resetQuestionPool(); // 初始洗牌
    nextQuestion();
  })
  .catch(err => {
    document.getElementById("question").textContent = "Failed to load 🥲";
    console.error("Error:", err);
  });

function resetQuestionPool() {
  questionPool = [...vocab];
  shuffle(questionPool);
  currentIndex = 0;
}

function nextQuestion() {
  document.getElementById("feedback").textContent = "";

  // 題目出完就重新洗一輪
  if (currentIndex >= questionPool.length) {
    alert("You've finished all the questions! Starting again.");
    resetQuestionPool();
  }

  currentQuestion = questionPool[currentIndex];
  currentIndex++;

  // 建立選項
  const options = [currentQuestion.translation];
  while (options.length < 4) {
    const random = vocab[Math.floor(Math.random() * vocab.length)].translation;
    if (!options.includes(random)) options.push(random);
  }

  shuffle(options);

  document.getElementById("question").textContent = `What does “${currentQuestion.word}” mean?`;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  speak(currentQuestion.word); // 點選就唸出希臘文單字

  const feedback = document.getElementById("feedback");
  if (selected === currentQuestion.translation) {
    feedback.textContent = "Correct! 🎉";
    feedback.style.color = "lightgreen";
  } else {
    feedback.textContent = `Oops! The correct answer is: ${currentQuestion.translation}`;
    feedback.style.color = "red";
  }
}


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "el-GR";     // 希臘語（Greek - Greece）
  utterance.rate = 0.9;         // 語速稍微慢一點
  speechSynthesis.speak(utterance);
}
