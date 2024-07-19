require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError.js');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user.js');

const listingsRouter = require('./routes/listings.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const DatabaseUrl = process.env.DATABASE_URL;

main()
	.then(() => {
		console.log('connected to database');
	})
	.catch((err) => {
		console.log(err);
	});

async function main() {
	await mongoose.connect(DatabaseUrl);
}

app.get('/', (req, res) => {
	res.redirect("/listings");
});

const store = MongoStore.create({
	mongoUrl: DatabaseUrl,
	crypto: {
		secret: process.env.SECRET,
	},
	touchAfter: 24 * 3600,
});

const sessionOptions = {
	store: store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	},
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.currUser = req.user;
	next();
});

app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);

app.all('*', (req, res, next) => {
	next(
		new ExpressError(404, "We can't seem to find the page you're looking for.")
	);
});

//middleware
app.use((err, req, res, next) => {
	let { statusCode = 500, message = 'Somethong went wrong!' } = err;
	res.status(statusCode).render('./listings/error.ejs', { message });
});

app.listen(8080, () => {
	console.log('app is listenenig');
});
