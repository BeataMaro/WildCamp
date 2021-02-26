const mongoose = require("mongoose");

const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");
const cities = require("./cities");

mongoose.connect("mongodb://localhost:27017/yelp-camp-paginated", {
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

const randomIdx = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 1; i <= 50; i++) {
    //musi byc w petli, zeby za kazdym razem losowac inny index w tablicy cities
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 50).toFixed(2);
    //50 nowych instancji modelu Campground
    const c = await new Campground({
      title: `${randomIdx(descriptors)}, ${randomIdx(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price: randomPrice,
      author: "6022d0810451d04290e5978b", // ObjectId z campgroundSchema uzytkownia (author) cat cat
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi soluta voluptates odio reprehenderit labore assumenda dolore perferendis sed ipsum esse?",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url:
            "https://res.cloudinary.com/becka/image/upload/v1613331254/YelpCamp/hteknf8ghpvn6q6moofm.jpg",
          filename: "YelpCamp/hteknf8ghpvn6q6moofm",
        },
        {
          url:
            "https://res.cloudinary.com/becka/image/upload/v1613331254/YelpCamp/orovsugvag9c2gnjmxny.jpg",
          filename: "YelpCamp/orovsugvag9c2gnjmxny",
        },
      ],
    });
    await c.save();
  }
};

seedDB().then(() => mongoose.connection.close());
