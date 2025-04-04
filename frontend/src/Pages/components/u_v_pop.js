import React from "react";

const UserDetailsPopup = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] relative">
        <h2 className="text-2xl font-semibold mb-4">User Details</h2>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          onClick={onClose}
        >
          X
        </button>

        {/* User Details */}
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {user._id}
          </p>
          <p>
            <strong>Full Name:</strong> {user.fullName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {user.phoneNumber}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>

          {/* Show Image if Government ID Exists */}
          {user.governmentId && (
            <div className="flex flex-col items-center">
              <strong className="mb-2">Government ID:</strong>
              <img
                src={`http://localhost:3001${user.governmentId}`}
                alt="Government ID"
                className="w-full max-w-sm rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPopup;
