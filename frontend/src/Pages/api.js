const BASE_URL = "http://localhost:3001/api/content"; // Adjust according to your server

// Add new content
export const addContent = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/add`, {
            method: "POST",
            body: formData, // Must be FormData for image uploads
        });

        return await response.json();
    } catch (error) {
        console.error("Error adding content:", error);
        return { error: "Failed to add content" };
    }
};

// Get all content
export const getAllContent = async () => {
    try {
        const response = await fetch(`${BASE_URL}/all`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching content:", error);
        return [];
    }
};

// Delete content
export const deleteContent = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/delete/${id}`, {
            method: "DELETE",
        });

        return await response.json();
    } catch (error) {
        console.error("Error deleting content:", error);
        return { error: "Failed to delete content" };
    }
};
