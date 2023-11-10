const express = require('express');
const app = express();
const multer = require('multer')
const upload = multer({ dest: './server/uploads' })
const path = require('path');
const fs = require('fs');
const PORT = 3000;
const db = require('./model.js');
const controller = require('./controller.js');

// parse JSON from incoming requests
app.use(express.json());

// handle requests from static files
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// handle API calls
app.post('/api/newProject', controller.newProject, (req, res) => {
    return res.status(200).send(res.locals.project)
})

app.get('/api/getProjectArr', controller.getProjectArr, (req, res) => {
    return res.status(200).send(res.locals.projectArr)
})

app.post('/api/getData', controller.getData, (req, res) => {
    return res.status(200).send(res.locals.data)
})

app.post('/api/processFile', upload.single('file'), controller.processFile, (req, res) => {
    console.log(res.locals.data)
    return res.status(200).send('success');
});

// route handler to respond with main app
app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/project', (req, res) => {

});

// catch-all route handler for any requests to an unknown route
app.get('*', (req, res) => {
    return res.sendStatus(404);
});

// global error handling middleware
app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});

// initialize port listening
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
});
