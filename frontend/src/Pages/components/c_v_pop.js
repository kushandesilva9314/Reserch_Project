import React from "react";

const OrgDetailsPopup = ({ organization, onClose }) => {
  if (!organization) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] relative">
        <h2 className="text-2xl font-semibold mb-4">Organization Details</h2>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          onClick={onClose}
        >
          X
        </button>

        {/* Organization Details */}
        <div className="space-y-2">
          <p>
            <strong>Company Name:</strong> {organization.companyName}
          </p>
          <p>
            <strong>Email:</strong> {organization.companyEmail}
          </p>
          <p>
            <strong>Phone:</strong> {organization.companyPhone}
          </p>
          <p>
            <strong>Owner:</strong> {organization.ownerName}
          </p>
          <p>
            <strong>Business Type:</strong> {organization.businessType}
          </p>
          <p>
            <strong>Description:</strong> {organization.companyDescription}
          </p>

          {/* Show Image if Registration Copy Exists */}
          {organization.registrationCopy && (
            <div className="flex flex-col items-center">
              <strong className="mb-2">Registration Copy:</strong>
              <a
                href={`http://localhost:3001${organization.registrationCopy}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Full Image
              </a>
              <img
                src={`http://localhost:3001${organization.registrationCopy}`}
                alt="Registration Copy"
                className="w-full max-w-sm rounded-lg shadow-md mt-2"
                onError={(e) => {
                  console.error("Image failed to load:", e.target.src);
                  e.target.style.display = "none"; // Hide broken image
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgDetailsPopup;
