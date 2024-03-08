/* 
    Useful links

    Repo where I finally understood a bit on what was going on
    * https://github.com/google/generative-ai-js/blob/main/samples/node/simple-text-and-images.js
    https://github.com/google/generative-ai-js

    Vlad and Chelsea Mission 2 Repo
    https://github.com/ntLeo/Mission-2/blob/main/src/components/ai-with-image.tsx

*/
require('dotenv').config();

const fs = require('fs');
const path = require('path');
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const {GoogleGenerativeAI} = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// ---------------------------------------------------------------- //
// --------------------- SAVE IMAGE TO SERVER --------------------- //
// ---------------------------------------------------------------- //

async function saveImageToServer(file) {
    // Read the uploaded file and save it
    const name = fs.readFile(file.path, (err, data) => {
        if (err) {
            console.error('Error reading uploaded file:', err);
            return res.status(500).send('Error reading uploaded file.');
        }

        // Save the file with a unique name
        const fileName = `image_${Date.now()}.jpeg`;
        fs.writeFileSync('multerImages/' + fileName, data);

        console.log('Image saved as:', fileName);

        return fileName;
    });

    return await name;
}
// ---------------------------------------------------------------- //
// ----------------------- SERVER CLEAN UP ------------------------ //
// ---------------------------------------------------------------- //

const cleanUpTempFiles = () => {
    // DELETE MULTER IMAGES FILES
    const imagesFolderPath = '../../multerImages/'; // Replace this with the path to your folder
    fs.readdir(imagesFolderPath, (err, files) => {
        if (err) return console.error('Error reading folder:', err);

        // DELETE MULTER DOWNLOADED IMAGES
        files.forEach(file => {
            // Construct the full path of the file
            const filePath = path.join(imagesFolderPath, file);
            // Delete the file
            fs.unlink(filePath, err => {
                if (err) return console.error('Error deleting file:', err);
                console.log('File deleted:', filePath);
            });
        });
    });

    // DELETE MULT TEMP FILES
    const tempFolderPath = '../../temp/'; // Replace this with the path to your folder
    fs.readdir(tempFolderPath, (err, files) => {
        if (err) return console.error('Error reading folder:', err);

        // DELETE MULTER DOWNLOADED IMAGES
        files.forEach(file => {
            // Construct the full path of the file
            const filePath = path.join(tempFolderPath, file);
            // Delete the file
            fs.unlink(filePath, err => {
                if (err) return console.error('Error deleting file:', err);
                console.log('File deleted:', filePath);
            });
        });
    });

    console.log('Clean up successful!');
};

// ---------------------------------------------------------------- //
// ---------------------- IMAGE AI ANALYSIS ----------------------- //
// ---------------------------------------------------------------- //
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString('base64'),
            mimeType,
        },
    };
}
async function aiGenerativeAnalysis(imageName) {
    const imagesFolderPath = '../backend/multerImages/';
    console.log(imageName);
    const model = genAI.getGenerativeModel({model: 'gemini-pro-vision'});
    const prompt = 'What is this car brand and model? What are similar cars? Give me as a json file.';
    // const image = fileToGenerativePart(imagesFolderPath + imageName, 'image/jpeg');
    /* 
        The image is hardcoded here until I figure how to pass the promise of the image name, So i can:
         save it to the server, 
         analyse, 
         send the response back 
         and clean up the server 
    
    */
    /* 
        At this point past the name of the image on the multerImages folder to see your image analysed
   */
    const image = fileToGenerativePart('../backend/multerImages/image_1709809158651.jpeg', 'image/jpeg');

    const result = await model.generateContent([prompt, image]);
    const response = result.response;
    const text = response.text().replaceAll('```', '').replace('json', '');
    const jsonRes = JSON.parse(text);
    return jsonRes;
}

// ---------------------------------------------------------------- //
// ----------------------- ANALYSE CAR API ------------------------ //
// ---------------------------------------------------------------- //
async function analyseCarImage(req, res) {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded.');

    const fileName = await saveImageToServer(file);
    const analysisResult = await aiGenerativeAnalysis(fileName);
    console.log(await analysisResult);

    // cleanUpTempFiles();

    res.status(200).send(await analysisResult);
}

module.exports = analyseCarImage;
