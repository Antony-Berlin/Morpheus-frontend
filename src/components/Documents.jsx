import { useState, useEffect } from "react";
import axios from "axios";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get("/api/get_files")
      .then((res) => {
        if (Array.isArray(res.data.files)) {
          setDocuments(res.data.files);
        } else {
          console.error("Expected an array but got:", res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }, []);

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      axios.post("/api/upload_file", formData)
        .then((res) => {
          setDocuments([...documents, res.data.file_name]);
          setShowUploadDialog(false);
          setFile(null);
        })
        .catch((error) => {
          console.error("Error uploading document:", error);
        });
    }
  };

  const handleDelete = () => {
    selectedDocuments.forEach((document) => {
      axios.post("/api/delete_file", { file_name: document })
        .then(() => {
          setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc !== document));
        })
        .catch((error) => {
          console.error("Error deleting document:", error);
        });
    });
    setSelectedDocuments([]);
  };

  const handleSelect = (document) => {
    setSelectedDocuments((prevSelected) =>
      prevSelected.includes(document)
        ? prevSelected.filter((doc) => doc !== document)
        : [...prevSelected, document]
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  return (
    <>
      <div className={`p-12 text-white h-full ${showUploadDialog ? 'bg-opacity-50' : ''}`}>
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold text-green-500">Documents</h1>
          <div className="w-1/6 flex justify-between">
            <button
              onClick={() => setShowUploadDialog(true)}
              className="bg-blue-700 p-2 cursor-pointer rounded px-4"
            >
              Upload
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-700 p-2 cursor-pointer rounded px-4"
            >
              Delete
            </button>
          </div>
        </div>
        <ul>
          {documents.map((document, index) => (
            <li key={index} className="p-2 my-4 flex items-center bg-transparent border-b border-green-300 border-opacity-20">
              <input
                type="checkbox"
                checked={selectedDocuments.includes(document)}
                onChange={() => handleSelect(document)}
                className="mr-4 w-4 h-4 accent-green-500 "
              />
              {document}
            </li>
          ))}
        </ul>
        {showUploadDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
            <div className="bg-green-700 bg-opacity-20 border border-green-500 p-8 rounded-xl backdrop-filter backdrop-blur-lg h-1/2 flex flex-col justify-between">
              <h2 className="text-xl mb-4 text-green-400 font-bold">Upload Document</h2>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-400 p-4 mb-4 text-center h-2/3 justify-center flex items-center rounded-xl"
              >
                {file ? file.name : "Drag and drop a file here or click to select a file"}
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
              </div>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-4"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {setShowUploadDialog(false), setFile(null)}}
                  className="bg-gray-500 p-2 px-4 cursor-pointer rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="bg-green-700 p-2 px-4 cursor-pointer rounded"
                >
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Documents;
