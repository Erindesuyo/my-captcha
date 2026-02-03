// script.js 맨 위에 추가
console.log("스크립트가 정상적으로 연결되었습니다! 🔥");

const captchaData = [
    { img: 'captcha1.png', answer: 'perspective' },
    { img: 'captcha2.png', answer: '325' },
    { img: 'captcha3.png', answer: 'recognition' },
    { img: 'captcha4.png', answer: 'TTC' },
    { img: 'captcha5.png', answer: 'weather' },
    { img: 'captcha6.png', answer: 'subversive' },
    { img: 'captcha7.png', answer: 'flow' },
    { img: 'captcha8.png', answer: 'believe' },
    { img: 'captcha9.png', answer: 'typography' },
    { img: 'captcha11.png', answer: '85w6s>' },
    { img: 'captcha12.png', answer: 'popcorn' },
    { img: 'captcha13.png', answer: 'oec0qp' }
];

// --- 배열을 랜덤하게 섞는 함수 ---
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 1. 전체 데이터를 섞고 5개 선택
shuffle(captchaData);
const selectedQuestions = captchaData.slice(0, 5);
const totalSteps = selectedQuestions.length;

let currentIndex = 0;

const captchaBox = document.querySelector('.captcha-box');
const stepCounter = document.getElementById('step-counter');
const captchaImg = document.getElementById('captcha-image');
const userInput = document.getElementById('user-input');
const goBtn = document.getElementById('go-btn');

// 초기 설정
captchaImg.src = selectedQuestions[currentIndex].img;
stepCounter.innerText = `1/${totalSteps}`;

const resultArea = document.createElement('div');
resultArea.id = 'result-message';
resultArea.style.marginTop = '15px';
resultArea.style.fontWeight = 'bold';
captchaBox.appendChild(resultArea);

// 다음 문제로 넘어가는 함수
function nextQuestion() {
    currentIndex++;
    resultArea.innerHTML = ""; 

    if (currentIndex < totalSteps) {
        stepCounter.innerText = `${currentIndex + 1}/${totalSteps}`;
        captchaImg.src = selectedQuestions[currentIndex].img;
        userInput.value = "";
        userInput.style.display = "inline-block"; 
        goBtn.style.display = "inline-block";    
        userInput.focus();
    } else {
        showFinalScreen();
    }
}

function showFinalScreen() {
    captchaBox.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h2 style="color: white; margin-bottom: 10px;">Verification Complete!</h2>
            <p style="color: #eee;">You are not robot 🤖</p>
            <button onclick="location.reload()" style="margin-top: 15px; padding: 8px 20px; cursor: pointer;">Restart</button>
        </div>
    `;
}

// [추가] 아까 복사한 구글 웹 앱 URL을 여기에 넣으세요!
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzDzHuOaTDzKf180wwPVIvaLkKxlH3zFjfhY6cj2hgEq_8v6OGbyJbo3SekWop6X6F-/exec";

goBtn.addEventListener('click', () => {
    const userAnswer = userInput.value.trim(); // 비교는 대문자로 하지만 저장은 원본으로!
    const correctAnswer = selectedQuestions[currentIndex].answer;
    const isCorrect = userAnswer.toUpperCase() === correctAnswer.toUpperCase();

    // 1. 구글 시트로 데이터 전송 (비동기)
    sendDataToSheet(currentIndex + 1, userAnswer, correctAnswer, isCorrect);

    // 2. 화면 UI 처리
    userInput.style.display = "none";
    goBtn.style.display = "none";

    if (isCorrect) {
        nextQuestion(); 
    } else {
        resultArea.innerHTML = `
            <div style="color: #c63636; margin-bottom: 10px;">Wrong! The answer is [ ${correctAnswer} ]</div>
        `;
        setTimeout(nextQuestion, 2000);
    }
});

function sendDataToSheet(qNum, uAns, cAns, isCorr) {
    const payload = {
        question: qNum,
        userAnswer: uAns,
        correctAnswer: cAns,
        isCorrect: isCorr
    };

    console.log("보내는 데이터:", payload); // 콘솔에서 확인용

    fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors", // 로컬 환경에서 필수
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => console.log("전송 신호 보냄!"))
    .catch(err => console.error("전송 에러:", err));
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') goBtn.click();
});