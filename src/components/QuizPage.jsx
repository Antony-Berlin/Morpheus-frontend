import  { useState } from "react";
import quizData from "./data.json"; 

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleOptionChange = (selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedOption,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    quizData.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctAnswers += 1;
      }
    });
    return correctAnswers;
  };

  if (quizCompleted) {
    const totalCorrect = calculateResults();
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Quiz Completed</h1>
        <p>
          You answered {totalCorrect} out of {quizData.length} questions
          correctly.
        </p>
        <button onClick={() => window.location.reload()}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Quiz Application</h1>
      <div style={{ marginBottom: "20px" }}>
        <h3>{currentQuestion.question}</h3>
        {currentQuestion.options.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={userAnswers[currentQuestionIndex] === option}
                onChange={() => handleOptionChange(option)}
              />
              {option}
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleNext}
        style={{ marginTop: "20px" }}
        disabled={!userAnswers[currentQuestionIndex]} // Disable until an option is selected
      >
        {currentQuestionIndex === quizData.length - 1 ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default QuizPage;
