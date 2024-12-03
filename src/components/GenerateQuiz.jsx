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
        setQuiz({...Quiz, num_of_questions : numQuestions, file_name: selectedFile, prof_name: selectedProfile});
        axios
          .post("/api/extract_text", { file_name: selectedFile})
          .then((response) => {
            console.log("extracted text");
            setQuiz({...Quiz, text: response.data.text});
            axios.post("/api/get_topics",   { text: response.data.text })
            .then((response) => { 
                console.log("Topics extracted");
                setQuiz({...Quiz, topics: response.data.topics});
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
            <option value="">Select an Document</option>
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
            <option value="">Select an Proffessor profile</option>
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
            <input
                type="number"
                id="numQuestions"
                name="numQuestions"
                className="p-2 rounded w-1/3"
                placeholder="Enter number of questions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
            />
        </div>
            
        <div className="flex justify-center">
        <button onClick={handleGenerateQuiz} className="bg-green-700 p-2 mt-4 rounded w-1/4">Generate Quiz</button>
        </div>
      </div>
    );
};

export default GenerateQuiz;
