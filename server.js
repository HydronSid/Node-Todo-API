const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const app = require("./app");

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

try {
  mongoose
    .connect(DB)
    .then(() => {
      console.log(`CONNECTED TO MONGODB`);
    })
    .catch((error) => {
      console.log(error);
      console.log(`ERROR While Connecting to MongoDB`);
    });
} catch (error) {
  console.log(`SERVER SIDE ISSUE While Connecting to MongoDB`);
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on post ${port}`);
});
