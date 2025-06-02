import React from "react";
import { X } from "lucide-react";

const ContentDetailPopup = ({ content, onClose }) => {
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh] relative border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Content Details</h2>
          
          {/* Close Button - More subtle and accessible */}
          <button
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Details with improved spacing and styling */}
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-1 gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded">
              <span className="text-sm text-slate-500 dark:text-slate-400">Title</span>
              <p className="font-medium">{content.title}</p>
            </div>
            
            <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded">
              <span className="text-sm text-slate-500 dark:text-slate-400">Description</span>
              <p className="font-medium">{content.description}</p>
            </div>
          </div>

          {/* Content Image with improved layout */}
          {content.image && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-medium mb-3 text-slate-800 dark:text-slate-200">Content Image</h3>
              <div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                <img
                  src={`http://localhost:3001${content.image}`}
                  alt="Content Image"
                  className="w-full max-w-lg mx-auto rounded shadow-sm hover:shadow-md transition-shadow"
                  onError={(e) => {
                    console.error("Image failed to load:", e.target.src);
                    e.target.style.display = "none"; // Hide broken image
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Action button */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPopup;