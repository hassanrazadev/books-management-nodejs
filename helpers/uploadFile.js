const multer = require('multer');
const fs = require('fs');

/**
 * upload file
 * @param path
 * @param fileSize
 * @param mimeLimit
 * @returns {Multer}
 */
exports.uploadFile = (path = "uploads", fileSize = null, mimeLimit = null) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            cb(null, path);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    let multerConfig = {
        storage: storage
    }

    if (fileSize) {
        multerConfig.limits = {
            fileSize: fileSize
        }
    }

    return multer(multerConfig);
}

/**
 * Delete file
 * @param filePath
 * @returns {boolean}
 */
exports.deleteFile = (filePath = null) => {
    if (!filePath) return false;
    filePath = filePath.replace(process.env.APP_URL, '');
    filePath = filePath.replace(/^\/|\/$/g, '');

    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (error) => {
            return !error;
        });
    }
    return false;
}