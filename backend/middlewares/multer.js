import multer from 'multer';
import path from 'path'; // Node.js built-in module
import fs from 'fs';     // Node.js built-in module

// Define the destination folder
const uploadDir = 'uploads/';

// --- Create the 'uploads/' directory if it doesn't exist ---
// This prevents an error if the folder is missing
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// --- Configure DiskStorage ---
const storage = multer.diskStorage({
  /**
   * destination: REQUIRED
   * This function tells multer WHERE to save the files.
   */
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save to the 'uploads/' folder
  },

  /**
   * filename: RECOMMENDED
   * This function tells multer WHAT to name the file.
   * Using a unique name prevents overwrites.
   */
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    
    // Example: "image-1678886400000-123456789.png"
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Initialize Multer with the correct storage
const upload = multer({ 
  storage: storage 
});

// Export the Multer configuration
export default upload;

