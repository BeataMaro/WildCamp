if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { urlencoded } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const helmet = require("helmet");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");

const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

//ROUTERS
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const ExpressError = require("./utils/ExpressError");

// const dbUrl = process.env.DB_URL ?? "mongodb://localhost:27017/yelp-camp";
const dbUrl = "mongodb://localhost:27017/yelp-camp-paginated";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

//https://mongoosejs.com/docs/index.html

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected!");
});

const app = express();

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Middlewares
//Body parser (danych z formularzy) express.urlencoded
app.use(urlencoded({ extended: true }));
// //Nadpisywanie zmian w formularzu i usuwanie
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const secret = process.env.SECRET ?? "itshouldbebettersecret";

//MongoStore
const store = new MongoStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60, // 86 400 sekund - uaktualnienie co 24h
});

store.on("error", (e) => {
  console.log("SESSION STORE ERROR", e);
});

//SESSION
const sessionConfig = {
  store,
  name: "ajyses",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https: //cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/becka/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Morgan
app.use(morgan("tiny"));

app.use((req, res, next) => {
  //to przenosi błędnie do originalUrl: /javascripts/validateForms.js jesli ta linijka app.use(express.static(path.join(__dirname, "public"))); jest ponizej
  if (!["/login", "/", "/register"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  // console.log(req.session);
  console.log(req.query);
  res.locals.currentUser = req.user; // logout widac tylko po zalogowaniu - warunek if w nabvar.ejs
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

//Middleware functions
const verifyPassword = (req, res, next) => {
  const { password } = req.query;
  password === "kicior" ? next() : res.send("Sorry, password is required!");
};

//Routes

app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "bec@gmx.com", username: "Bec" });
  const newUser = await User.register(user, "gruszka");
  res.send(newUser);
});

app.get("/", (req, res) => {
  res.render("campgrounds/home");
});

//password protected: http://localhost:3000/secret?password=gruszka
app.get("/secret", verifyPassword, (req, res) => {
  res.send("This is the Secret Page!");
});

//np localhost:3000/cats:
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
  // res.render("error");
});

app.use((err, req, res, next) => {
  const { message = "Something went wrong!!!", statusCode = 500 } = err;
  if (!err.message) err.massage = "Error message";
  res.status(statusCode).render("error", { err });
});

// const port = process.env.PORT ?? 5000;
const port = 3000;

app.listen(port, () => console.log(`Listening on port ${port}!`));
