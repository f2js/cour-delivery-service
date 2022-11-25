require("dotenv").config({ path: "./.env" });
const dbConnection = require("./Services/DBConnection");

const app = require("./app");
const https = require("https");

const port = process.env.API_PORT || 3000;

const config = {
  port: port,
  host: "0.0.0.0",
};

dbConnection.connect();

if (process.env.NODE_ENV == "development") {
  app.listen(config.port, config.host, (e) => {
    if (e) {
      throw new Error("Error starting server");
    }
    console.log(
      `App running locally without sslOptions on host: ${config.host} : port ${config.port}`
    );
  });
} else {
  https.createServer(app).listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}
