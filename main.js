/* pages element */
const welcomPage = document.getElementById("welcomePage");
const questionPage = document.getElementById("questionPage");
const resultPage = document.getElementById("resultPage");
const answerDetailsPage = document.getElementById("answerDetailsPage");
const waitingPage = document.getElementById("waiting")

/* html elements */
// home page elements
const quizeType = document.getElementById("quizzes")
const quizeDifficulty = document.getElementById("quizeDifficulty")
const quizeNum = document.getElementById("quizeNum")
const quizeTags = document.getElementById("tags")
const beginChallenge = document.getElementById("beginBtn");
const timeLimit = document.getElementById("timeLimit")

// question page elements
const questionIndex = document.getElementById("questionIndex")
const questionTitle = document.getElementById("questionTitle")
const correctAnswerNum = document.getElementById("correctAnswerNum")
const questionChoices = document.getElementById("questionChoices")
const nextBtn = document.getElementById("nextBtn");
const previousBtn = document.getElementById("previousBtn");
const timmer = document.getElementById("timmer")

// result page elements
const score = document.getElementById("score")
const totalQuestions = document.getElementById("totalQuestions")
const correctAnswersNum = document.getElementById("correctAnswersNum")
const grade = document.getElementById("grade")
const answerDetailsBtn = document.getElementById("answerDetailBtn");
const resultNewChallengeBtn = document.getElementById("resultNewChallengeBtn");
const resultHomePageBtn = document.getElementById("resultHomePageBtn");

// answer detail page elements
const quizeExplaination = document.getElementById("quizeExplaination")
const newChallengeBtn = document.getElementById("newChallengeBtn");
const homePageBtn = document.getElementById("homePageBtn");

// waiting page elements
// const waitingPageHomeBtn = document.getElementById("waitingPageHomeBtn")

// footer
const footer = document.querySelector("footer")

// other variabels
const url = `https://quizapi.io/api/v1/questions?apiKey=qWI1Pi7r4fFgKYRqFlg8mIpcNknMfog1esTwvjB6`
let urlQuize = ''
let urlDifficulty = ''
let urlQuizeNum = '&limit=5'
let urlTags = ''
let quizzesData = []
let currentQuestionIndex = 0; // represents current question index
let totalTime = 299 // set the default time (300 seconds, which means 5 minutes)
let timePassedBy = 0
let countDown = null //declare the coundDown function to be a gloable variable

/* Check if there is any local data saved, update the url and the selection boxes */
if (localStorage.getItem('quizeType')) {
    quizeType.value = localStorage.getItem('quizeType')
    urlQuize = `&category=${localStorage.getItem('quizeType')}`
}

if (localStorage.getItem('quizeDifficulty')) {
    quizeDifficulty.value = localStorage.getItem('quizeDifficulty')
    urlDifficulty = `&difficulty=${localStorage.getItem('quizeDifficulty')}`
}

if (localStorage.getItem('quizeNum')) {
    quizeNum.value = localStorage.getItem('quizeNum')
    urlQuizeNum = `&limit=${quizeNum.value}`
    timeLimit.textContent = `${quizeNum.value} mins`
    totalTime = quizeNum.value * 60 - 1 //initialize timmer
}

if (localStorage.getItem('quizeTags')) {
    quizeTags.value = localStorage.getItem('quizeTags')
    urlTags = `&tags=${quizeTags.value}`
}

/* get data from selection boxes when the value changes */
quizeType.addEventListener('change', () => {
    urlQuize = `&category=${quizeType.value}`
    localStorage.setItem('quizeType', quizeType.value) //updates local data
})

quizeDifficulty.addEventListener('change', () => {
    urlDifficulty = `&difficulty=${quizeDifficulty.value}`
    localStorage.setItem('quizeDifficulty', quizeDifficulty.value) //updates local data
})

quizeNum.addEventListener('change', () => {
    urlQuizeNum = `&limit=${quizeNum.value}`
    timeLimit.textContent = `${quizeNum.value} mins`
    localStorage.setItem('quizeNum', quizeNum.value) //updates local data
    totalTime = quizeNum.value * 60 - 1 //updates timmer
})

quizeTags.addEventListener('change', () => {
    urlTags = `&tags=${quizeTags.value}`
    localStorage.setItem('quizeTags', quizeTags.value) //updates local data
})

// set visibile function
const setVisible = (ele) => {
    ele.classList.remove("invisible");
}

// set invisible function
const setInVisible = (ele) => {
    ele.classList.add("invisible");
}

const fetchAndProcessData = async () => {
    waitingPage.innerHTML = "Fetching data, Hold on..."
    setVisible(waitingPage)
    setInVisible(welcomPage);
    setInVisible(resultPage);
    setInVisible(answerDetailsPage)
    quizzesData = []
    const quizzesUrl = url + urlQuize + urlDifficulty + urlQuizeNum + urlTags
    console.log(quizzesUrl)
    const res = await fetch(quizzesUrl)
    // console.log(res.ok)
    if (res.ok) {
        const data = await res.json()
        // console.log(data)
        for (let i = 0; i< data.length; i++) {
            // console.log(data[i]['correct_answers'])
            let correctAnswers = [];
            for (const correct in data[i]['correct_answers']) {       
                if (data[i]['correct_answers'][correct] === "true") {
                    correctAnswers.push(correct.slice(0, 8))
                    // console.log(correctAnswers)
                }
            }
            let answers = []
            for (const answer in data[i]['answers']) {
                if (data[i]['answers'][answer]) {
                    // console.log(answer)
                    answers.push([
                        answer, data[i]['answers'][answer]
                    ])
                }
            }
            quizzesData.push(
                {
                    questionIndex: i + 1,
                    question: data[i]['question'],
                    answers: answers,
                    correctAnswers: correctAnswers,
                    answersChosen: []
                }
            )
            correctAnswers = []
            answers = []
            timePassedBy = 0
        }
        setQuize(quizzesData, currentQuestionIndex)
        previousBtn.textContent = 'Quit'
        nextBtn.textContent = 'Next >'
        setVisible(questionPage)
        setInVisible(waitingPage);
        // console.log(quizzesData)
        /* Set up a timmer. When time runs out, jump to the result page */
        // use setInterval() function to excute the function every 1 second
        countDown = setInterval(() => {
            let distance = totalTime - timePassedBy
            let minutes = Math.floor(distance / 60) // get the minute
            let seconds = Math.floor(distance % 60) // use reminder to get the seconds
            timmer.innerHTML = seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`
            if (distance < 0) {
                clearInterval(countDown) // stop the interval function
                timmer.innerHTML = `TIME OUT`
                // jump to result page
                displayResult()
                // console.log('Jump to result page due to time out. current quize data is:', quizzesData)
            }
            timePassedBy++ //increase the value by 1 second
        }, 1000)
    } else {
        const waitingPageHomeBtn = document.createElement('button')
        waitingPageHomeBtn.className = "roundBtn primBtn waitingPageHomeBtn"
        waitingPageHomeBtn.textContent = "Ruturn Home"
        waitingPage.innerHTML = `
        Fetching data failed.<br>
        Please go back to the main page and rechoose question types
        `
        waitingPage.appendChild(waitingPageHomeBtn)
        setVisible(waitingPage)
        setInVisible(welcomPage);
        setInVisible(resultPage);
        setInVisible(answerDetailsPage)

        waitingPageHomeBtn.addEventListener('click', () => {
            setVisible(welcomPage);
            setInVisible(questionPage);
            setInVisible(resultPage);
            setInVisible(answerDetailsPage);
            setInVisible(waitingPage);
            currentQuestionIndex = 0
        })
    }

}

const displayResult = () => {
    waitingPage.innerHTML = "Result Calculating..., Hold on..."
    setInVisible(questionPage);
    setVisible(waitingPage);
    clearInterval(countDown) // stop the interval function
    totalQuestions.textContent = quizzesData.length
    let rightAnswerNum = 0
    quizzesData.map(quize => {
        if (JSON.stringify(quize.answersChosen.sort()) === JSON.stringify(quize.correctAnswers.sort())) {
            rightAnswerNum++
        }
    })
    correctAnswersNum.textContent = rightAnswerNum
    const gradeScore = Math.floor((rightAnswerNum / quizzesData.length) * 100)
    score.textContent = `${gradeScore}%`
    if (gradeScore >= 90) {
        grade.textContent = 'A+'
        grade.className = "gradeA"
        correctAnswersNum.className = "gradeA"
        score.className = "score gradeA"
    } else if (gradeScore >= 80) {
        grade.textContent = 'A'
        grade.className = "gradeA"
        correctAnswersNum.className = "gradeA"
        score.className = "score gradeA"
    } else if (gradeScore >= 70) {
        grade.textContent = 'B'
        grade.className = "gradeB"
        correctAnswersNum.className = "gradeB"
        score.className = "score gradeB"
    } else if (gradeScore >= 60) {
        grade.textContent = 'C'
        grade.className = "gradeC"
        correctAnswersNum.className = "gradeC"
        score.className = "score gradeC"
    } else {
        grade.textContent = 'D'
        grade.className = "gradeD"
        correctAnswersNum.className = "gradeD"
        score.className = "score gradeD"
    }
    setInVisible(welcomPage);
    setInVisible(questionPage);
    setVisible(resultPage);
    setInVisible(answerDetailsPage);
}

// set quize function
const setQuize = (quizeData, index) => {
    let quizeOptions = []
    questionIndex.textContent = `${quizeData[index].questionIndex} / ${quizeData.length}`
    questionTitle.textContent = `${quizeData[index].question}`
    correctAnswerNum.textContent = quizeData[index].correctAnswers.length === 1 ? `(Correct answer num: 1)` :`(Correct answers num: ${quizeData[index].correctAnswers.length})`
    for (const option in quizeData[index].answers) {
        // console.log(option)
        let optionClass = quizeData[index]['answersChosen'].includes(quizeData[index]['answers'][option][0]) ? 'selected' : ''

        // check if the answer includes "<" or ">", replace them with "&lt;" and "&gt;" respectively
        if (quizeData[index]['answers'][option][1].includes('<') || ('>')) {
            quizeData[index]['answers'][option][1] = quizeData[index]['answers'][option][1].replace(/</g, "&lt;")
            quizeData[index]['answers'][option][1] = quizeData[index]['answers'][option][1].replace(/>/g, "&gt;")
        }

        /* can't make optionsClass = 'options selected' here, only the class name before space will be accepted. */
        quizeOptions.push(`<p class="options ${optionClass}" data-option=${quizeData[index]['answers'][option][0]}>${quizeData[index]['answers'][option][1]}</p>`)
    }
    // console.log(quizeOptions)
    questionChoices.innerHTML = quizeOptions.join('')
}

// by default we will see the welcome page only
setVisible(welcomPage);
setInVisible(waitingPage);
setInVisible(questionPage);
setInVisible(resultPage);
setInVisible(answerDetailsPage)

/* when click the "begin challenge" button, switch to questions page. */
beginChallenge.addEventListener('click', () => {
    currentQuestionIndex = 0
    fetchAndProcessData()
})

/* when click the "next" button, go to the next page. If it is the last question then change the textContent to submit and jump to result page. */
nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex === 0) {
        currentQuestionIndex += 1;
        setQuize(quizzesData, currentQuestionIndex)
        nextBtn.textContent = "Next >"
        previousBtn.textContent = "< Previous"
        console.log('current Question Index:', currentQuestionIndex)
    } else if (currentQuestionIndex === quizzesData.length - 2) {
        currentQuestionIndex += 1;
        setQuize(quizzesData, currentQuestionIndex)
        nextBtn.textContent = "Submit"
        previousBtn.textContent = "< Previous"
        // console.log('current Question Index:', currentQuestionIndex)
    } else if (currentQuestionIndex === quizzesData.length - 1) {
        /* when click submit button display the result */
        if (totalTime - timePassedBy > 60) {
            // add a confirm checking if there still more than 1 minutes left.
            let confirmResult = confirm(`You still have more than 1 minutes left. If you want double check your answers, please click "Cancel", otherwise click "OK" to make your submission.`)
            if (confirmResult) {
                displayResult()
            }
        } else {
            displayResult()
        }
        
    } else {
        currentQuestionIndex += 1;
        setQuize(quizzesData, currentQuestionIndex)
        nextBtn.textContent = "Next >"
        previousBtn.textContent = "< Previous"
    }
})

/* when click the "Exit" button, end current round. If it is not the first question, then go to the previous question. */
previousBtn.addEventListener('click', () => {
    if (currentQuestionIndex === 0) {
        setInVisible(waitingPage);
        setVisible(welcomPage);
        setInVisible(questionPage);
        setInVisible(resultPage);
        setInVisible(answerDetailsPage);
        clearInterval(countDown) // stop the interval function
    } else if (currentQuestionIndex === 1) {
        currentQuestionIndex -= 1;
        setQuize(quizzesData, currentQuestionIndex)
        nextBtn.textContent = "Next >"
        previousBtn.textContent = "Quit"
    } else if (currentQuestionIndex === quizzesData.length - 1) {
        currentQuestionIndex -= 1;
        setQuize(quizzesData, currentQuestionIndex)
        nextBtn.textContent = "Next >"
        previousBtn.textContent = "< Previous"
    }  else {
        currentQuestionIndex -= 1;
        setQuize(quizzesData, currentQuestionIndex)
        nextBtn.textContent = "Next >"
        previousBtn.textContent = "< Previous"
    }
})

/* when click the choice, set the background color to green */
questionChoices.addEventListener('click', (e) => {
    console.log(e.target)
    // console.log(e.target.dataset.option)
    if (e.target.classList.contains("options")) {
        e.target.classList.toggle('selected')
    }
    if (e.target.classList.contains('selected')) {
        if (quizzesData[currentQuestionIndex].answersChosen.includes(e.target.dataset.option)) {
            console.log(quizzesData)
        } else {
            quizzesData[currentQuestionIndex].answersChosen.push(e.target.dataset.option)
        }
        console.log(quizzesData)
    } else {
        if (quizzesData[currentQuestionIndex].answersChosen.includes(e.target.dataset.option)) {
            const i = quizzesData[currentQuestionIndex].answersChosen.indexOf(e.target.dataset.option)
            quizzesData[currentQuestionIndex].answersChosen.splice(i,1)
            console.log(quizzesData)
        }
    }
})


/* when click the "answer details" button on result page, switch to asnwers detail page. */
answerDetailsBtn.addEventListener('click', () => {
    setInVisible(welcomPage);
    setInVisible(questionPage);
    setInVisible(resultPage);
    setInVisible(waitingPage);
    setVisible(answerDetailsPage);
    const answerDetailsElement = []
    quizzesData.map(quize => {
        let options = []
        quize.answers.map(answer => {
            let correctClassName = quize.correctAnswers.includes(answer[0]) ? 'correct' : 'wrong'
            let selectedClassName = quize.answersChosen.includes(answer[0]) ? 'userSelected' : ''
            options.push(`<p class="options ${correctClassName} ${selectedClassName}">${answer[1]}</p>`)
        })
        // the "\x3C" string in the question will cause a dispaly problem. Replace it with the "&lt;" string
        if (quize.question.includes('\x3C')) {
            quize.question = quize.question.replace(/(\x3C)/g, "&lt;")
        }
        answerDetailsElement.push(`
        <div class="question">
            <p class="questionTitle">Q${quize.questionIndex}: ${quize.question}</p>
            <div class="questionAnswers">
                ${options.join('')}
            </div>
        </div>
        `)
    })
    quizeExplaination.innerHTML = answerDetailsElement.join('')
});


/* when click the "new challenge" button in the result page, refetch the data and switch to questions page. */
resultNewChallengeBtn.addEventListener('click', () => {
    currentQuestionIndex = 0
    fetchAndProcessData()
})

/* when click the "Home page" button in the result page, switch to home page */
resultHomePageBtn.addEventListener('click', () => {
    setVisible(welcomPage);
    setInVisible(questionPage);
    setInVisible(resultPage);
    setInVisible(answerDetailsPage);
    setInVisible(waitingPage);
    currentQuestionIndex = 0
})

/* when click the "new challenge" button in the answer details page, refetch the data and switch to questions page. */
newChallengeBtn.addEventListener('click', () => {
    currentQuestionIndex = 0
    fetchAndProcessData()
})

// when click the "Home page" button in the answer details page, switch to home page
homePageBtn.addEventListener('click', () => {
    setVisible(welcomPage);
    setInVisible(questionPage);
    setInVisible(resultPage);
    setInVisible(answerDetailsPage);
    setInVisible(waitingPage);
    currentQuestionIndex = 0
})
