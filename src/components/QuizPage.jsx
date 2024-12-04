import  { useState, useContext } from "react";
// import Confetti from "react-confetti";
// import { useWindowSize } from "react-use";
import { QuizState } from "../App";

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const { Quiz, setQuiz } = useContext(QuizState);




  const totalQuestions = Quiz.num_of_questions;
  const currentQuestion = Quiz.QuizQuestion[currentQuestionIndex];

// Get window dimensions for Confetti

  const handleOptionChange = (selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedOption,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    Quiz.QuizQuestion.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctAnswers += 1;
      }
    });
    return correctAnswers;
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  if (quizCompleted) {
    const totalCorrect = calculateResults();
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-300 p-4 relative">
        {/* Confetti Effect */}
        {/* <Confetti
          width={width}
          height={height}
          numberOfPieces={500}
          recycle={false}
        /> */}

        <div className="relative w-full max-w-xl bg-black bg-opacity-30 backdrop-blur-md border border-green-300 shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-3xl font-bold mb-4 animate-pulse">
            Quiz Completed
          </h1>
          <p className="mb-6 text-lg animate-slide-in">
            You answered <span className="font-bold">{totalCorrect}</span> out
            of {totalQuestions} questions correctly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg shadow-lg animate-bounce"
          >
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm text-green-300 p-4">
      <div className="w-full max-w-2xl bg-black/40 backdrop-blur-md border border-green-500 shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-green-400 ">
          Quiz Application
        </h1>

        {/* Progress Tracker */}
        <div className="mb-6">
          <div className="relative w-full bg-black/20 rounded-full h-2.5 shadow-inner">
            <div
              className="absolute top-0 left-0 bg-green-300 h-2.5 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-green-300 mt-2 text-center">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>

        {/* Current Question */}
        <div className="bg-black/30 backdrop-blur-md border border-green-300 shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-6">
            {currentQuestion.question}
          </h3>
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionChange(option)}
              className={`mb-4 p-4 cursor-pointer rounded-lg transition-all border ${
                userAnswers[currentQuestionIndex] === option
                  ? "bg-green-500 text-black border-green-300"
                  : "bg-black/40 text-green-300 border-green-800 hover:bg-green-600 hover:text-black"
              }`}
            >
              {option}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!userAnswers[currentQuestionIndex]}
          className={`w-full px-6 py-2 font-semibold text-black rounded-lg shadow-lg transition-all ${
            userAnswers[currentQuestionIndex]
              ? "bg-green-500 hover:bg-green-600"
              : "bg-green-800 cursor-not-allowed"
          }`}
        >
          {currentQuestionIndex === totalQuestions - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
