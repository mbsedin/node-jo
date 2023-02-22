const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./config.env" });

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

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!");
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// console.log(process.argv);
/* 
In the terminal run this file by adding --import or --delete options.
node .\dev-data\data\import-dev-data.js --import
node .\dev-data\data\import-dev-data.js --delete
}
We catch these arguments by exploring process.argv[2]
*/
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
