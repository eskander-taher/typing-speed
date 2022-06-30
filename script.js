const RANDOM_WORDS_API_URL = 'http://api.quotable.io/random'
const MINUTE = 59

const container = document.getElementById('container')
const words = document.getElementById('words')
const input = document.getElementById('inputField')
const wpm = document.getElementById('wpm')
const wrong = document.getElementById('wrong')
const timer = document.getElementById('timer')
const bestSchore = document.getElementById('best-score')
const wrongWordReslut = document.getElementById('wrong-words')
const scoreTitle = document.getElementById('score-title')
const wrongTitle = document.getElementById('wrong-title')
const restart = document.getElementById('restart')
const bestScore = document.getElementById('bestScore')
const bestScoreTitle = document.getElementById('bestScore-title')

let wpmCounter = 0
let wrongWords = 0
let countDown = MINUTE
let start = false

renderNewWords()

restart.addEventListener('click', () => {
    window.location.reload();
})

input.addEventListener('input', () => {
    let currentWordElement = document.querySelector(".next-word")
    currentWordElement.classList.add("current-word")
    let currentWord = currentWordElement.innerText

    if (start == false) {
        start = true
        CountDownTimer()
    }

    if (input.value[input.value.length - 1] === " ") {
        if (input.value.trim() == currentWord) {
            wpmCounter += currentWord.length + 1
            wpm.innerText = Math.round(wpmCounter / 5)
            currentWordElement.classList.add("correct")
            currentWordElement.classList.remove("next-word", "current-word")
        } else {
            wrongWords++
            wrong.innerText = wrongWords
            currentWordElement.classList.add("incorrect")
            currentWordElement.classList.remove("next-word", "current-word")
        }

        input.value = ''

        if (document.querySelector(".next-word") == null) {
            renderNewWords()
        }

        currentWordElement = document.querySelector(".next-word")
        currentWordElement.classList.add("current-word")
        currentWord = currentWordElement.innerText
    }
})

function getRandomWords() {
    return fetch(RANDOM_WORDS_API_URL)
        .then(response => response.json())
        .then(data => data.content)
}

async function renderNewWords() {
    const randomWords = await getRandomWords()
    words.innerHTML = textToWordSpans(randomWords).reduce((acc, item) => {
        return acc + item
    })
}

function textToWordSpans(text) {
    return text.split(" ").map(word => {
        return `<span class="next-word">${word}</span>`
    })
}

function CountDownTimer() {
    countDownFunction = setInterval(() => {
        timer.innerHTML = countDown;
        countDown--;
        if (countDown <= -1) {
            clearInterval(countDownFunction);
            start = false
            countDown = MINUTE
            renderNewWords()

            bestSchore.innerText = wpm.innerText
            wrongWordReslut.innerText = wrong.innerText
            container.style.display = "none"
            scoreTitle.style.display = "block"
            wrongTitle.style.display = "block"
            bestScoreTitle.style.display = "block"

            if (parseInt(localStorage.getItem("bestScore")) < parseInt(wpm.innerText)) {
                localStorage.setItem("bestScore", JSON.parse(JSON.stringify(wpm.innerText)))
            }

            bestScore.innerText = localStorage.getItem("bestScore")
            wpm.innerText = 0
        }
    }, 1000)
}