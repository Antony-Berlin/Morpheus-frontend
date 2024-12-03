import  { useState, useEffect } from 'react';
import axios from 'axios';



const Profiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newProfile, setNewProfile] = useState({ prof_name: '', about_prof: '', prof_sample_question: '' });
    const [file, setFile] = useState(null);

    useEffect(() => {
        axios.get("/api/get_all_proff_profile")
            .then((res) => {
                if (res.data && Array.isArray(res.data.professors)) {
                    setProfiles(res.data.professors);
                } else {
                    console.error("Expected an array but got:", res.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching profiles:", error);
            });
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        
    };

      const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
      };

    const addProfile = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            axios
              .post("/api/upload_file", formData)
              .then((res) => {
                console.log("File uploaded:", res.data.file_name);
                axios
                  .post("/api/extract_text", { file_name: res.data.file_name })
                  .then((ext_res) => {
                    console.log("Text extracted:", ext_res.data.text);
                     setNewProfile({
                       ...newProfile,
                       prof_sample_question: ext_res.data.text,
                     });
                      const profileData = { ...newProfile , prof_sample_question: ext_res.data.text };
                      console.log("Profile Data:", profileData);
                      axios
                        .post("/api/add_proff_profile", profileData)
                        .then((prof_res) => {
                          console.log("Profile added:", prof_res.data);
                          setProfiles([...profiles, prof_res.data.proff_name]);
                          setShowAddDialog(false);
                          setNewProfile({
                            prof_name: "",
                            about_prof: "",
                            prof_sample_question: "",
                          });
                          setFile(null);
                          axios.post("api/delete_file", { file_name: res.data.file_name })
                          .catch((error) => {
                            console.error("Error deleting file:", error);
                          });
                        })
                        .catch((error) => {
                          console.error("Error adding profile:", error);
                        });
                  });
              })
              .catch((error) => {
                console.error("Error extracting text from sample doc:", error);
              });
        }else{
             const profileData = {
               ...newProfile
             };
             console.log("Profile Data:", profileData);
             axios
               .post("/api/add_proff_profile", profileData)
               .then((prof_res) => {
                 console.log("Profile added:", prof_res.data);
                 setProfiles([...profiles, prof_res.data.proff_name]);
                 setShowAddDialog(false);
                 setNewProfile({
                   prof_name: "",
                   about_prof: "",
                   prof_sample_question: "",
                 });
    
               })
               .catch((error) => {
                 console.error("Error adding profile:", error);
               });
        }
       
    };

    const deleteProfile = () => {
        selectedProfiles.forEach((profile) => {
            axios
              .post("/api/delete_proff_profile", { proff_name: profile })
              .then(() => {
                setProfiles((prevProfiles) =>
                  prevProfiles.filter((prof) => prof !== profile)
                );
              })
              .catch((error) => {
                console.error("Error deleting profile:", error);
              });
        });
        setSelectedProfiles([]);
    };

    const handleSelect = (profile) => {
        setSelectedProfiles((prevSelected) =>
            prevSelected.includes(profile)
                ? prevSelected.filter((prof) => prof !== profile)
                : [...prevSelected, profile]
        );
    };

    return (
      <div
        className={`p-12 text-white h-full ${
          showAddDialog ? "bg-opacity-50" : ""
        }`}
      >
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold text-green-500">
            {"Proffessor's Profile"}
          </h1>
          <div className="w-1/5 flex justify-between">
            <button
              onClick={() => setShowAddDialog(true)}
              className="bg-blue-700 p-2 cursor-pointer rounded px-4"
            >
              add profile
            </button>
            <button
              onClick={deleteProfile}
              className="bg-red-700 p-2 cursor-pointer rounded px-4"
            >
              Delete
            </button>
          </div>
        </div>
        <ul>
          {profiles.map((profile, index) => (
            <li
              key={index}
              className="p-2 my-4 flex items-center bg-transparent border-b border-green-300 border-opacity-20"
            >
              <input
                type="checkbox"
                checked={selectedProfiles.includes(profile)}
                onChange={() => handleSelect(profile)}
                className="mr-4 w-4 h-4 accent-green-500 "
              />
              {profile}
            </li>
          ))}
        </ul>
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
            <div className="bg-green-700 bg-opacity-20 border border-green-500 p-8 rounded-xl backdrop-filter backdrop-blur-lg h-2/3 w-1/2 flex flex-col justify-between">
              <h2 className="text-xl mb-4 text-green-400 font-bold">
                Add profile
              </h2>
              <input
                type="text"
                placeholder="Professor Name"
                value={newProfile.prof_name}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, prof_name: e.target.value })
                }
                className="bg-black bg-opacity-50 text-white p-2 my-2 rounded"
              />
              <input
                type="text"
                placeholder="About Professor"
                value={newProfile.about_prof}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, about_prof: e.target.value })
                }
                className="bg-black bg-opacity-50 text-white p-2 my-2 mb-4 rounded"
              />
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-400 p-4 mb-4 text-center h-2/3 justify-center flex items-center rounded-xl"
              >
                {file
                  ? file.name
                  : "Drag and drop a file here or click to select a file"}
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                className="bg-black bg-opacity-50 text-white p-2 mb-4 rounded"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowAddDialog(false),
                      setNewProfile({
                        prof_name: "",
                        about_prof: "",
                        prof_sample_question: "",
                      }),
                      setFile(null);
                  }}
                  className="bg-gray-500 p-2 px-4 cursor-pointer rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={addProfile}
                  className="bg-green-700 p-2 px-4 cursor-pointer rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default Profiles;
