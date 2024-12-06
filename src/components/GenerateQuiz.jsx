import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { QuizState } from "../App";

const GenerateQuiz = () => {
    const { Quiz, setQuiz} = useContext(QuizState);
    const [options, setOptions] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");
    const [selectedProfile, setSelectedProfile] = useState("");
    const [numQuestions, setNumQuestions] = useState(0);

    useEffect(() => {
      axios
        .get("api/get_files")
        .then((response) => {
            console.log("Files fetched:", response.data.files);
          setOptions(response.data.files);
        })
        .catch((error) => {
          console.error("There was an error fetching the files!", error);
        });
    }, []);

    useEffect(() => {
      axios
        .get("api/get_all_proff_profile")
        .then((response) => {
          console.log("Files fetched:", response.data.files);
          setProfiles(response.data.professors);
        })
        .catch((error) => {
          console.error("There was an error fetching the files!", error);
        });
    }, []);
    
    const handleGenerateQuiz = () => {
        if (!selectedFile || !selectedProfile || !numQuestions) {
            console.error("Please select a file, profile, and enter the number of questions.");
            return;
        }
        setQuiz({...Quiz, num_of_questions : numQuestions, file_name: selectedFile, prof_name: selectedProfile, Questions: []});
        axios
          .post("/api/extract_text", { file_name: selectedFile})
          .then((response) => {
            console.log("extracted text");
            setQuiz({...Quiz, text: response.data.text});
            axios.post("/api/get_topics",   { text: response.data.text, no_of_questions: numQuestions})
            .then((topic_response) => { 
                console.log("Topics extracted");
                setQuiz({
                    num_of_questions: numQuestions,
                    file_name: selectedFile,
                    prof_name: selectedProfile,
                    text: response.data.text,
                    topics: topic_response.data.topics,
                });

                var questionswithans =[];
                var questions = []
                console.log("Topics extracted: ", topic_response.data.topics);
                console.log("Topics length: ", topic_response.data.topics.length);

                axios.post("/api/get_proff_profile", {
                  proff_name: selectedProfile,
                }).then((prof_response) => {
                  console.log("Proff profile extracted");
                  var about_prof = prof_response.data.about_prof;
                  var proff_sample_question =
                    prof_response.data.prof_sample_question;

                  for (let i = 0; i < topic_response.data.topics.length; i++) {
                    // for (let i = 0; i < 2; i++) {
                    var topic = topic_response.data.topics[i];

                    axios
                      .post("/api/get_questions", {
                        topic: topic,
                        about_prof: about_prof,
                        prof_sample_question: proff_sample_question,
                        no_of_questions:
                          numQuestions / topic_response.data.topics.length,
                        file_text: response.data.text,
                        questions: questions,
                      })
                      .then((question_response) => {
                        questionswithans = questionswithans.concat(
                          question_response.data
                        );
                        questions = questions.concat(
                          question_response.data.map((q) => q.question)
                        );
                        console.log("Questions extracted: ", questionswithans);
                        setQuiz({
                          num_of_questions: numQuestions,
                          file_name: selectedFile,
                          prof_name: selectedProfile,
                          text: response.data.text,
                          topics: topic_response.data.topics,
                          QuizQuestion: questionswithans,
                          Questions: questions,
                        });
                      })
                      .catch((error) => {
                        console.error(
                          "There was an error fetching the questions!",
                          error
                        );
                      });
                  }


                }).catch((error) => {
                  console.error("There was an error fetching the proff profile!", error);
                });
                
                
             });
          }
          ).catch((error) => {
            console.error("There was an error extracting the text!", error);
          });

        console.log("Quiz generation started");
    };

    return (
      <div className="p-12 flex flex-col">
        <h1 className="text-2xl font-bold text-white">Generate Quiz</h1>

        <div className=" flex justify-around">
          <select
            className="mt-4 p-2 rounded w-1/2 mr-4"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
        <option value="">Select a Document</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            className="mt-4 p-2 rounded w-1/2 mr-4"
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
          >
        <option value="">Select a Professor profile</option>
            {profiles.map((profile, index) => (
              <option key={index} value={profile}>
                {profile}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="numQuestions">
                Number of Questions
            </label>
        <select
                id="numQuestions"
                name="numQuestions"
                className="p-2 rounded w-1/3"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
        >
          <option value="">Select number of questions</option>
          {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        </div>
            
        <div className="flex justify-center">
        <button onClick={handleGenerateQuiz} className="bg-green-700 p-2 mt-4 rounded w-1/4">Generate Quiz</button>
        </div>
      </div>
    );
};

export default GenerateQuiz;
