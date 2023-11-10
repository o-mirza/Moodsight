const db = require('./model.js');
const fs = require('fs');

const OpenAI = require('openai');
const openai = new OpenAI();

const controller = {};

controller.newProject = (req, res, next) => {
    const { projectName } = req.body;
    console.log(`\n\n\nProject Name: ${projectName}\n\n\n`)

    db.query(`INSERT INTO projects (user_id, project_name) VALUES (1, $1) RETURNING _id, project_name`, [projectName])
        .then(data => {
            res.locals.project = { _id: data.rows[0]._id, project_name: data.rows[0].project_name };
            next();
        })
        .catch(e => next({
            log: `controller.newProject: ${e}`,
            status: 500,
            message: { err: 'An error occurred. See log for details.' },
        }))
};

controller.getProjectArr = (req, res, next) => {
    db.query("SELECT _id, project_name FROM projects WHERE user_id = 1")
        .then(data => {
            res.locals.projectArr = data.rows;
            next();
        })
        .catch(e => next({
            log: `controller.newProject: ${e}`,
            status: 500,
            message: { err: 'An error occurred. See log for details.' },
        }))
};

controller.getData = (req, res, next) => {
    const { project_id } = req.body;
    db.query(`SELECT verbatim, sentiment, category FROM verbatims WHERE user_id = 1 AND project_id = ${project_id}`)
        .then(data => {
            res.locals.data = data.rows;
            next();
        })
        .catch(e => next({
            log: `controller.getData: ${e}`,
            status: 500,
            message: { err: 'An error occurred. See log for details.' },
        }))
};

controller.processFile = async (req, res, next) => {
    const project_id = req.body.project_id;
    console.log(`\n\n\nProject ID: ${project_id}\n\n\n`)

    // Read uploaded file
    const file = fs.readFileSync(req.file.path, 'utf-8');
    fs.unlinkSync(req.file.path);

    // OpenAI API call
    const prompt = `Below is a list of post-call customer verbatims. Respond with a JSON object containing the verbatim, sentiment (1-5), and category for each verbatim. Categories should be 1-2 words and there must be exactly 5 total categories (use content of verbatims to determine the category buckets). JSON object format should be { "verbatims": [{ "verbatim": "text", "sentiment": "5", "category": "Billing Issue" },…] }. IMPORTANT: INCLUDE NO OTHER WORDS IN YOUR RESPONSE EXCEPT THE JSON OBJECT. YOUR RESPONSE WILL BE DIRECTLY PARSED INTO A DATABASE.\n\n${file}`;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    // Parse OpenAI response
    const content = completion.choices[0].message.content;
    const parsedContent = JSON.parse(content).verbatims;
    const flatContent = parsedContent.map(obj => Object.values(obj)).flat();

    // Generate SQL query
    let statement = `INSERT INTO verbatims (user_id, project_id, verbatim, sentiment, category) VALUES (1, ${project_id}, $1, $2, $3)`;
    for (let i = 1; i < parsedContent.length; i++) {
        statement += `, (1, ${project_id}, $${(i * 3 + 1)}, $${(i * 3 + 2)}, $${(i * 3 + 3)})`
    };
    statement += `;`;

    // Execute SQL query
    db.query(statement, flatContent, (err, results) => {
        if (err) return next({
            log: `controller.upload: ${e}`,
            status: 500,
            message: { err: 'An error occurred. See log for details.' },
        });
        res.locals.data = parsedContent;
        next();
    });
}

// Export the controller object
module.exports = controller;