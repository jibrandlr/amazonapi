const products = require("./results.json");
const { Parser } = require("json2csv");

const fields = [
  { label: "ASIN", value: "result.request_parameters.asin" },
  { label: "Title", value: "result.product.title" },
  { label: "Format", value: "result.product.format" },
  { label: "Price", value: "result.product.buybox_winner.price.value" },
  { label: "Price after fees", value: "priceAfterFees" }
  //{ label: "FBA offers", value: "amountFBA" },
  //{ label: "FBM offers", value: "amountFBM" },
  //{ label: "Monthly estimate", value: "monthlyEstimate" },
  //{ label: "Bestseller rank", value: "bestseller_rank" }
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
  const dataOffer = getOfferData(asin);
  const dataSales = getSales(asin);
  const productWithFees = {
    ...product,
    priceAfterFees: priceAfterFees,
    amountFBA: dataOffer.fba,
    amountFBM: dataOffer.fbm,
    monthlyEstimate: dataSales.monthly_sales_estimate,
    bestseller_rank: dataSales.bestseller_rank
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

function getSalesType() {
  const onlySales = products.filter(
    (product) => product.result.request_parameters.type == "sales_estimation"
  );
  return onlySales;
}

//get sales estimation
function getSales(asin) {
  const product = getSalesType().filter(
    (product) => product.result.request_parameters.asin == asin
  );

  const hasSalesEstimation =
    product[0].result.sales_estimation.has_sales_estimation;
  if (hasSalesEstimation) {
    const estimation = {
      monthly_sales_estimate:
        product[0].result.sales_estimation.monthly_sales_estimate,
      bestseller_rank: product[0].result.sales_estimation.bestseller_rank
    };
    return estimation;
  } else {
    const estimation = {
      monthly_sales_estimate: "Not available",
      bestseller_rank: product[0].result.sales_estimation.bestseller_rank
    };
    return estimation;
  }
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
