/* 
    Useful links

    Repo where I finally understood a bit on what was going on
    * https://github.com/google/generative-ai-js/blob/main/samples/node/simple-text-and-images.js
    https://github.com/google/generative-ai-js

    Vlad and Chelsea Mission 2 Repo
    https://github.com/ntLeo/Mission-2/blob/main/src/components/ai-with-image.tsx

*/

// ---------------------------------------------------------------- //
// ---------------------- IMPORTS AND SETUP ----------------------- //
// ---------------------------------------------------------------- //

// .ENV SETUP
require('dotenv').config();

// IMPORTS
const fs = require('fs');
const path = require('path');
const {GoogleGenerativeAI} = require('@google/generative-ai');

// AI CLIENT
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// --------------------------- SETTINGS --------------------------- //

/* 
    The images are briefly saved on the server side then are analysed and finally deleted.
    That's the IMAGES_PATH location 
    The prompt is how the AI will handler the images, what is being asked for it to do.

    Here I am handling images that are not a car on the prompt itself. And also limiting the 
    format i want my response so I can conscistently work with it on the frontend.
*/

const IMAGES_PATH = './tempImages/';
const prompt =
    'What is this car brand and model? What are similar cars? Give me as a json file with that exact keys: model, brand, similar_cars. If the image is not a car return {error: "The image is not of a car. Please pick a different image."}';

// ---------------------------------------------------------------- //
// --------------------- SAVE IMAGE TO SERVER --------------------- //
// ---------------------------------------------------------------- //

function saveImageToServer(file) {
    /* 
        Because fs is Async this function had to be Promisified So I could 
        retrieve the fileName value.

        fileName is how the AI Client will pick the image to analyse on the server 
    */
    return new Promise((resolve, reject) => {
        fs.readFile(file.path, (err, data) => {
            if (err) {
                console.error('Error reading uploaded file:', err);
                reject('Error reading uploaded file.');
                return;
            }

            // Save the file with a unique name
            const fileName = `image_${Date.now()}.jpeg`;
            try {
                fs.writeFileSync('tempImages/' + fileName, data);
                console.log('Image saved as:', fileName);
                resolve(fileName);
            } catch (writeErr) {
                console.error('Error while saving image file on server.\n', writeErr);
                reject('Error saving file');
            }
        });
    });
}

// ---------------------------------------------------------------- //
// ----------------------- SERVER CLEAN UP ------------------------ //
// ---------------------------------------------------------------- //

const cleanUpTempFiles = () => {
    // DELETE MULTER IMAGES FILES
    fs.readdir(IMAGES_PATH, (err, files) => {
        if (err) return console.error('Error reading folder:', err);

        // DELETE MULTER DOWNLOADED IMAGES
        files.forEach(file => {
            // Construct the full path of the file
            const filePath = path.join(IMAGES_PATH, file);
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
    const model = genAI.getGenerativeModel({model: 'gemini-pro-vision'});
    // prompt was initialized on line 37 - SETTINGS but I left it here for reference.
    // const prompt = 'What is this car brand and model? What are similar cars? Give me as a json file.';
    const image = fileToGenerativePart(IMAGES_PATH + imageName, 'image/jpeg');

    const result = await model.generateContent([prompt, image]);

    // Clear string response and convert to JSON
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

    cleanUpTempFiles();

    res.status(200).send(await analysisResult);
}

module.exports = analyseCarImage;
