const questionOptionsContainer = document.querySelector('.quizz');
const questionTitle = document.querySelector('.text-quizz');
const circleContainer = document.querySelector('.circle');
const loadingContainer = document.querySelector('.loading-cotainer');

let levelIndex = 0;
const userAnswers = [];
const questions = [];
const questionOptions = [];
let activeQuestion = null;
let correctAnswers = 0;


window.addEventListener('load', init);

async function getQuestionsFromAPI(questionCount) {
    const data = await fetch(`https://opentdb.com/api.php?amount=${questionCount}`);
    const { results } = await data.json();

    results.forEach((res) => {
        questions.push(res)
    });
}

const timelineOptions = gsap.timeline({
    duration: .3,
    paused: true,
    defaults: {
        ease: "power4.Out",
    }
});



function animeOptoions() {
    
    timelineOptions.fromTo('.text-quizz',{"clip-path": "polygon(0 0, 0 0, 0 100%, 0 100%)"} ,{ 'clip-path': 'polygon(100% 0, 0 0, 0 100%, 100% 100%)'})
        .from('.quizz-item', { opacity: 0, y: -100, stagger: .2 });

    timelineOptions.play();
}

function selectActiveQuestion(number) {
    activeQuestion = questions[number];
}

async function init() {
    await getQuestionsFromAPI(5);
    activeQuestion = questions[levelIndex];
    renderQuestion(activeQuestion.question, [activeQuestion.correct_answer, ...activeQuestion.incorrect_answers]);
    showResults(questions);
    loadingContainer.style.display = "none"
}

function renderQuestion(questionTitle, questionOptions) {
    clearPage();
    renderQuestionTitle(questionTitle);
    renderQuestionOptions(questionOptions);
    animeOptoions()
}

function renderQuestionTitle(textContent) {
    questionTitle.textContent = textContent;
}

function renderQuestionOptions(array) {
    array.sort();

    const divOptions = array.map((option) => {
        return createQuestionOption(option)
    });

    divOptions.forEach((item) => {
        questionOptionsContainer.appendChild(item);
    })
}

function createQuestionOption(textContent) {
    const div = document.createElement('div');
    div.className = "quizz-item";
    div.textContent = textContent;
    div.addEventListener('click', clickOptionHandler)
    return div;
}

function clickOptionHandler(event) {

    const answer = event.currentTarget.textContent;
    userAnswers.push(answer);

    const currentCircle = document.querySelector(`.circle-item:nth-child(${levelIndex + 1})`);

    if (answer == activeQuestion.correct_answer) {
        currentCircle.style.backgroundColor = "green";
        correctAnswers++;
    }
    else {
        currentCircle.style.backgroundColor = "red";
    }

    if (levelIndex == questions.length - 1) {
        clearPage();
        questionTitle.textContent = `Your Score Is : ${correctAnswers} of ${questions.length}`;
        return;
    }

    levelIndex++;
    clearPage();
    selectActiveQuestion(levelIndex);
    renderQuestion(activeQuestion.question, [activeQuestion.correct_answer, ...activeQuestion.incorrect_answers])
}

function clearPage() {
    questionOptionsContainer.textContent = "";
    questionTitle.textContent = "";
}

function showResults(array) {
    const circleDivs = array.map(() => {
        return createResultItem();
    });

    circleDivs.forEach((item) => {
        circleContainer.append(item);
    });
}

function createResultItem() {
    const div = document.createElement('div');
    div.className = 'circle-item';
    return div;
}