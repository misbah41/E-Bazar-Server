const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const fileUpload = require("express-fileupload");

const cors = require("cors");
const fs = require("fs-extra");
require("dotenv").config();
const app = express();
const port = 3500;

app.use(fileUpload());
app.use(bodyParser.json());
app.use(cors());

//root api
app.get("/", (req, res) => {
  res.send("Wonderful Misbah Hasan Error not solved solved");
});

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.DB_PASS}@cluster0.qwvsk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("erroe here", err);

  const productsCollection = client
    .db("bazarbdDatabase")
    .collection("cardProducts");

  //add addProducts by post method start
  app.post("/addProducts", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const categories = req.body.categories;
    const productPrice = req.body.productPrice;
    const discount = req.body.discount;
    const tags = req.body.tags;
    const productsOff = req.body.productsOff;
    const description = req.body.description;
    const subdescription = req.body.subdescription;

    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    productsCollection
      .insertOne({
        name,
        categories,
        subdescription,
        description,
        productsOff,
        tags,
        productPrice,
        file,
        discount,
        image,
      })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });
  //add addProducts by post method end

  app.get("/fruitProducts", (req, res) => {
    productsCollection
      .find({ categories: "fruit" })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/drinkProducts", (req, res) => {
    productsCollection
      .find({ categories: "drink" })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/drinkWater", (req, res) => {
    productsCollection
      .find({ categories: "water" })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });


   // //get sngle product by get method
   app.get("/productById/:id", (req, res) => {
    productsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, service) => {
        res.send(service[0]);
      });
  });







  console.log("database connected successfully");
});

app.listen(process.env.PORT || port);
