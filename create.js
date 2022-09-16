const products = require("./results.json");
const { Parser } = require("json2csv");

const productsWithNewValue = products.map((product) =>
  addPriceAfterFees(product)
);

function addPriceAfterFees(product) {
  const priceAfterFees = (
    product.result.product.buybox_winner.price.value * 0.85 -
    4.87
  ).toFixed(2);
  const productWithFees = { ...product, priceAfterFees: priceAfterFees };
  return productWithFees;
}

const fields = [
  { label: "ASIN", value: "result.request_parameters.asin" },
  { label: "Title", value: "result.product.title" },
  { label: "Price", value: "result.product.buybox_winner.price.value" },
  { label: "Price after fees", value: "priceAfterFees" }
];

const json2csvParser = new Parser({ fields });
const csv = json2csvParser.parse(productsWithNewValue);

const fs = require("fs");
fs.writeFileSync("products.csv", csv);
