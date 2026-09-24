const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Credentials are read from server/.env (see server/.env.example).
// Never hard-code them here - anything committed ends up in git history.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    // Add file size limit if needed
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

async function imageUploadUtil(file) {
    
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto'  
    
    });
    

    return result;
}

module.exports = { upload, imageUploadUtil };