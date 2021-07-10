require('dotenv').config();
const Express = require('express');
const app = Express();
const db = require('./db');
const cors = require('cors');

app.use(cors());

app.use(require('./middleware/headers'));

const controllers = require('./controllers');

app.use(Express.json());

app.use('/user', controllers.userController);
app.use('/log', controllers.logController);

db.authenticate()
    .then(() => db.sync()) //{force: true} (clear table to reset)
    .then(() => {
        app.listen(3000, () => {
            console.log(`[Server]: App is listening on 3000.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });