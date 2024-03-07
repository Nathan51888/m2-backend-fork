const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const corsOrigin = 'http://localhost:3000';
app.use(
    cors({
        origin: [corsOrigin],
        methods: ['GET', 'POST'],
        credentials: true,
    })
);
const imageUploadPath = 'C:/Users/User-Name/Documents/Coding/image-uploads-tutorial-blog-walkthrough/uploaded_files';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageUploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`);
    },
});

const imageUpload = multer({storage: storage});

app.post('/image-upload', imageUpload.array('my-image-file'), (req, res) => {
    console.log('POST request received to /image-upload.');
    console.log('Axios POST body: ', req.body);
    res.send('POST request recieved on server to /image-upload.');
});
const port = 4000;
app.listen(port, process.env.IP, function () {
    console.log(`Server is running on port ${port}`);
});
