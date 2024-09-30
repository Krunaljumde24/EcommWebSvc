const ProductRouter = require("express").Router({ strict: true });
const ProductModel = require("../model/ProductModel");

ProductRouter.get("/getAllProducts", async (req, res) => {
  try {
    let result = await ProductModel.find();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = ProductRouter;
