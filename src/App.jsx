import './App.css';
import { useState, createContext } from 'react';

import { MutatingDots } from "react-loader-spinner";
import Documents from './components/Documents';
import Profiles from './components/Profiles';
import GenerateQuiz from './components/GenerateQuiz';
import QuizPage from './components/QuizPage';

export const QuizState = createContext();

function App() {
  const [activeTab, setActiveTab] = useState("GenerateQuiz");
  const [Quiz, setQuiz] = useState({});
  

  const renderContent = () => {
    switch (activeTab) {
      case 'Documents':
        return <Documents />;
      case 'Profiles':
        return <Profiles />;
      case 'GenerateQuiz':
        return <GenerateQuiz />;
      default:
        return <Documents />;
    }
  };

  return (
    <QuizState.Provider value={{ Quiz, setQuiz }}>
      <div className="bg-img">
        {Object.keys(Quiz).length === 0 && (
          <div>
            <div className="flex h-screen relative overflow-hidden">
              <div className="relative z-10 w-1/4 bg-green-800 bg-opacity-20 p-4 backdrop-filter backdrop-blur-sm text-white border-r-2 border-green-500 flex flex-col ">
                <h1 className="text-2xl font-bold my-8 p-4 text-green-500">
                  Morhpeus
                </h1>
                <ul>
                  <li
                    className={`p-2 cursor-pointer ${
                      activeTab === "Documents" ? "bg-green-700 rounded-lg" : ""
                    } mb-4`}
                    onClick={() => setActiveTab("Documents")}
                  >
                    Documents
                  </li>
                  <li
                    className={`p-2 cursor-pointer ${
                      activeTab === "Profiles" ? "bg-green-700 rounded-lg" : ""
                    } mb-4`}
                    onClick={() => setActiveTab("Profiles")}
                  >
                    Profiles
                  </li>
                  <li
                    className={`p-2 cursor-pointer ${
                      activeTab === "GenerateQuiz"
                        ? "bg-green-700 rounded-lg"
                        : ""
                    } mb-4`}
                    onClick={() => setActiveTab("GenerateQuiz")}
                  >
                    Generate Quiz
                  </li>
                </ul>
              </div>

              <div className="relative z-10 w-3/4 bg-black bg-opacity-60 backdrop-blur-md ">
                {renderContent()}
              </div>
            </div>
          </div>
        )}
        {Object.keys(Quiz).length > 0 &&
          !Quiz.hasOwnProperty("QuizQuestion") && (
            <div>
              <div className="flex items-center justify-center h-screen backdrop-blur-sm">
                <div className="text-white text-2xl flex flex-col items-center">
                  <MutatingDots
                    visible={true}
                    height="100"
                    width="100"
                    color="#4fa94d"
                    secondaryColor="#4fa000"
                    radius="12.5"
                    ariaLabel="mutating-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                  <div>Generating your quiz...</div>
                </div>
              </div>
            </div>
          )}
        {Quiz.hasOwnProperty("QuizQuestion") && (
          <div>
            <QuizPage />
          </div>
        )}
      </div>
    </QuizState.Provider>
  );
}

export default App;
