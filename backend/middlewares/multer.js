// Multer is used for profile pictures,files,documents. Simplifies the process of handling file uploads
import multer from "multer";

const upload = multer({
    storage:multer.memoryStorage()
})

export default upload;