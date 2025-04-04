import React from "react";

const ContentDetailPopup = ({ content, onClose }) => {
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] relative">
        <h2 className="text-2xl font-semibold mb-4">Content Details</h2>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          onClick={onClose}
        >
          X
        </button>

        {/* Content Details */}
        <div className="space-y-2">
          <p>
            <strong>Title:</strong> {content.title}
          </p>
          <p>
            <strong>Description:</strong> {content.description}
          </p>

          {/* Show Image if Exists */}
          {content.image && (
            <div className="flex flex-col items-center">
              <strong className="mb-2">Image:</strong>
              <img
                src={`http://localhost:3001${content.image}`}
                alt="Content Image"
                className="w-full max-w-sm rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPopup;