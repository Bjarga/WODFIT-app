import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/gallery.css";
import "../styles/modal.css";

// GalleryPage component definition
function GalleryPage({ token, isAdmin }) {
  // State to store the list of photos
  const [photos, setPhotos] = useState([]);

  // State to store the caption for a new photo
  const [caption, setCaption] = useState("");

  // State to store the file for a new photo
  const [file, setFile] = useState(null);

  // State to manage the modal visibility
  const [showModal, setShowModal] = useState(false);

  // useEffect to fetch photos from the API when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/photos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPhotos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
      });
  }, [token]);

  // Handler for file input changes
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handler for uploading a new photo
  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("caption", caption);

    axios
      .post("http://localhost:5000/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Update the photos state with the new photo
        setPhotos([...photos, response.data]);
        // Reset the form fields and hide the modal
        setCaption("");
        setFile(null);
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error uploading photo:", error);
      });
  };

  // Handler for deleting a photo
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Update the photos state to remove the deleted photo
        setPhotos(photos.filter((photo) => photo._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting photo:", error);
      });
  };

  // Render the GalleryPage component
  return (
    <div className="gallery-container">
      {/* Button to show the add photo modal */}
      <button className="add-photo-button" onClick={() => setShowModal(true)}>
        Add Photo
      </button>

      {/* Modal for adding a new photo */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <form onSubmit={handleUpload} className="upload-form">
              <input type="file" onChange={handleFileChange} required />
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter caption"
                required
              />
              <button type="submit">Upload</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grid display of photos */}
      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo._id} className="photo-item">
            <img src={photo.url} alt={photo.caption} />
            <p>{photo.caption}</p>
            {isAdmin && (
              <button onClick={() => handleDelete(photo._id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryPage;
