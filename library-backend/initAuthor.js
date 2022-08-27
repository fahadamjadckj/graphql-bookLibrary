const { mongo, default: mongoose } = require("mongoose");
const Author = require("./models/Author");

require("dotenv").config();

try {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(console.log("connected to database"));
} catch (err) {
  console.error(err);
}

const author = new Author({
  name: "Fahad Amjad",
  born: "2000",
});

try {
  author.save().then(() => {
    console.log("user saved");
    mongoose.connection.close();
  });
} catch (err) {
  console.log(err);
}
