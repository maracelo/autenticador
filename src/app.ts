import makeApp from './server';
import dotenv from 'dotenv';
import dbConnection from './database/connection';

dotenv.config();

const app = makeApp(dbConnection);

app.listen(process.env.PORT || 4000, () => console.log('Running on ' + process.env.SITE_URL));