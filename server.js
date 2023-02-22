const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

// DATABASE CONNECTION STRINGS
// DATABASE
const DB_REMOTE = process.env.DATABASE_REMOTE.replace(
  "<PASSWORD>",
  process.env.PASSWORD_REMOTE
);
const DB_LOCAL = process.env.DATABASE_LOCAL;

// MONGOOSE
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_REMOTE)
  .then((con) => {
    console.log("DB connection successful!");
  })
  .catch((err) => console.error(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
