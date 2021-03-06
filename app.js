const express =  require('express');
const morgan =  require('morgan');
const dotenv =  require('dotenv');
const path =  require('path');
const cors =  require('cors');
const helmet = require("helmet");
var cookieParser = require('cookie-parser')

dotenv.config();
const router = require('./routes');
const { sequelize } = require('./models');
const schedule = require('./utils/schedule');
const app = express();

app.set('port', process.env.PORT || 3001);

sequelize.sync({ force: false, alter: false })
  .then(() => {
    console.log('Database connected!');
  })
  .catch((err) => {
    console.error(err);
  });
schedule.setSchedule();
app.use(morgan('dev'));
app.use('/api/img', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser())
app.use(cors());
app.use(helmet());

app.get('/', function (req, res, next) {
  res.status(200).send('OK');
});
app.use('/api',router.indexRouter);
app.use('/api/auth',router.authRouter);
app.use('/api/users',router.usersRouter);
app.use('/api/accounts',router.accountsRouter);
app.use('/api/transactions',router.transactionsRouter);


app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} not found`);
    error.status = 404;
    next(error);
  });

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.send(`${err.message} ${process.env.NODE_ENV !== 'production' ? err : {}}`);
});
  
app.listen(app.get('port'), () => {
    console.log(app.get('port'), ' running');
});

/***************************************************/
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error
});