const products = require("./both.json");
const { Parser } = require("json2csv");

const fields = [
  { label: "ASIN", value: "result.request_parameters.asin" },
  { label: "Title", value: "result.product.title" },
  { label: "Format", value: "result.product.format" },
  { label: "Price", value: "result.product.buybox_winner.price.value" },
  { label: "Price after fees", value: "priceAfterFees" },
  { label: "FBA offers", value: "amountFBA" },
  { label: "FBM offers", value: "amountFBM" }
];

//get requests product type only
function getProductType() {
  const onlyProducts = products.filter(
    (product) => product.result.request_parameters.type == "product"
  );
  return onlyProducts;
}

const productsWithNewValue = getProductType().map((product) =>
  addPriceAfterFeesAndFbData(product)
);

function addPriceAfterFeesAndFbData(product) {
  const priceAfterFees = (
    product.result.product.buybox_winner.price.value * 0.85 -
    4.87
  ).toFixed(2);

  const asin = product.result.request_parameters.asin;
  const data = getOfferData(asin);
  const productWithFees = {
    ...product,
    priceAfterFees: priceAfterFees,
    amountFBA: data.fba,
    amountFBM: data.fbm
  };
  return productWithFees;
}

//

function getOffersType() {
  const onlyOffers = products.filter(
    (product) => product.result.request_parameters.type == "offers"
  );
  return onlyOffers;
}

//get offers number
function getOfferData(asin) {
  const product = getOffersType().filter(
    (product) => product.result.request_parameters.asin == asin
  );

  const offersArray = product[0].result.offers;

  const fbaOffers = offersArray.filter(
    (offer) => offer.delivery.fulfilled_by_amazon == true
  );

  const fbmOffers = offersArray.filter(
    (offer) => offer.delivery.fulfilled_by_amazon == false
  );

  const totalOffers = {
    fba: fbaOffers.length,
    fbm: fbmOffers.length
  };

  return totalOffers;
}

const json2csvParser = new Parser({ fields });
const csv = json2csvParser.parse(productsWithNewValue);

const fs = require("fs");
fs.writeFileSync("products.csv", csv);

console.log(productsWithNewValue);
