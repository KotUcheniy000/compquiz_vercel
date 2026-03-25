import React, { useState, useEffect } from 'react'
import './App.css'

const QUESTIONS_TIME = 40
const LOADING_TIME = 15
const LOADING_MESSAGES = [
  "Проверяем вопросы...",
  "Вспоминаем правильные ответы...",
  "Проверяем ответы на жульничество, не списали ли ответы с какого-либо сайта...",
  "Подсчёт баллов...",
  "Получение результатов..."
]

const CORRECT_ANSWERS = {
  1: 'Б',
  2: ['читы', 'кряки', 'crack', 'cheat', 'взлом', 'пират', 'торрент'],
  3: null
}

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(QUESTIONS_TIME)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => {
    if (currentQuestion <= 3 && !isLoading && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleNextQuestion()
            return QUESTIONS_TIME
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentQuestion, isLoading, showResults])

  useEffect(() => {
    if (isLoading) {
      const messageTimer = setInterval(() => {
        setLoadingMessageIndex((prev) => {
          if (prev >= LOADING_MESSAGES.length - 1) {
            clearInterval(messageTimer)
            return prev
          }
          return prev + 1
        })
      }, 3000)

      const resultsTimer = setTimeout(() => {
        calculateResults()
        setIsLoading(false)
        setShowResults(true)
      }, LOADING_TIME * 1000)

      return () => {
        clearInterval(messageTimer)
        clearTimeout(resultsTimer)
      }
    }
  }, [isLoading])

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < 3) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(QUESTIONS_TIME)
    } else {
      setIsLoading(true)
      setLoadingMessageIndex(0)
    }
  }

  const calculateResults = () => {
    let correct = 0
    
    if (answers[1] === CORRECT_ANSWERS[1]) {
      correct++
    }
    
    if (answers[2]) {
      const answerLower = answers[2].toLowerCase()
      if (CORRECT_ANSWERS[2].some(keyword => answerLower.includes(keyword))) {
        correct++
      }
    }
    
    if (answers[3]) {
      correct++
    }
    
    setCorrectCount(correct)
  }

  const restartQuiz = () => {
    setCurrentQuestion(1)
    setAnswers({})
    setTimeLeft(QUESTIONS_TIME)
    setIsLoading(false)
    setShowResults(false)
    setLoadingMessageIndex(0)
    setCorrectCount(0)
  }

  const progressPercentage = (timeLeft / QUESTIONS_TIME) * 100

  if (isLoading) {
    return (
      <div className="quiz-container">
        <div className="loading-container">
          <div className="loading-text">
            {LOADING_MESSAGES[loadingMessageIndex]}
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="quiz-container">
        <div className="results-container">
          <div className="results-title">Результаты</div>
          <div className="results-score">
            Вы решили {correctCount} из 3!
          </div>
          <div className="results-message">Так держать!</div>
          <button className="restart-button" onClick={restartQuiz}>
            Пройти ещё раз
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ 
            transform: `scaleX(${progressPercentage / 100})`,
            transition: 'transform 1s linear'
          }}
        />
      </div>
      
      <div className="question-number">
        Вопрос {currentQuestion} из 3
      </div>

      {currentQuestion === 1 && (
        <div>
          <div className="question-text">
            Для чего предназначался первый компьютер, появившийся в 1946 году?
          </div>
          <div className="options">
            <div 
              className={`option ${answers[1] === 'А' ? 'selected' : ''}`}
              onClick={() => handleAnswer('А')}
            >
              А. Для игр
            </div>
            <div 
              className={`option ${answers[1] === 'Б' ? 'selected' : ''}`}
              onClick={() => handleAnswer('Б')}
            >
              Б. Для военных целей
            </div>
            <div 
              className={`option ${answers[1] === 'В' ? 'selected' : ''}`}
              onClick={() => handleAnswer('В')}
            >
              В. Для домашней или офисной работы
            </div>
          </div>
        </div>
      )}

      {currentQuestion === 2 && (
        <div>
          <div className="question-text">
            Откуда можно получить вирусы? (самые популярные источники)
          </div>
          <div style={{ marginBottom: '20px', color: '#666' }}>
            Запишите свой ответ:
          </div>
          <textarea
            className="text-input"
            rows="4"
            placeholder="Ваш ответ..."
            value={answers[2] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
          />
        </div>
      )}

      {currentQuestion === 3 && (
        <div>
          <div className="question-text">
            Вам понравилась данная презентация, интерактив и опрос?
          </div>
          <div className="options">
            <div 
              className={`option ${answers[3] === 'А' ? 'selected' : ''}`}
              onClick={() => handleAnswer('А')}
            >
              А. Да
            </div>
            <div 
              className={`option ${answers[3] === 'Б' ? 'selected' : ''}`}
              onClick={() => handleAnswer('Б')}
            >
              Б. Нет
            </div>
          </div>
        </div>
      )}

      <button 
        className="next-button"
        onClick={handleNextQuestion}
      >
        Следующий вопрос
      </button>
    </div>
  )
}

export default App
