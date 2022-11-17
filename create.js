import { Parser } from "json2csv";
import * as fs from "fs";
import fetch from "node-fetch";

//columns in exported CSV file
const fields = [
  { label: "Item Group Id", value: "groupId" },
  { label: "Name", value: "name" },
  { label: "Price", value: "price" },
  { label: "GTIN", value: "gtin" }
];

//get group ids from CSV file
function arrayGroupIds() {
  var data = fs.readFileSync("groupids.csv", "utf8");
  data = data.split("\r\n"); // SPLIT ROWS
  data.shift();
  data.pop();
  return data;
}

async function totalIndividualItems() {
  const groupIds = arrayGroupIds();
  let arr = [];
  for (let i = 0; i < groupIds.length; i++) {
    let indiv = await getIndividualItems(groupIds[i]);
    arr.push(indiv);
  }
  return arr;
}

async function concatArrays() {
  const arr = await totalIndividualItems();
  let allItems = [];
  for (let i = 0; i < arr.length; i++) {
    allItems = allItems.concat(arr[i]);
  }
  console.log(allItems);
  return allItems;
}

//call ebay API to get data of a group id
async function getIndividualItems(groupId) {
  const url = `https://api.ebay.com/buy/browse/v1/item/get_items_by_item_group?item_group_id=${groupId}`;
  const token =
    "v^1.1#i^1#p^1#r^0#f^0#I^3#t^H4sIAAAAAAAAAOVYW2wUVRjuttvKxdIQERBE1kHCdWbntpcZ2cVtt5QF2m3ZUm2VkLmcWYadnZnOzNJWBUsTUKKSANYQxYrBBw0gIIISDCq3BLQJkIhENL6I6ZugD6hB8Mx0KdtKuHUTm7gvm/Of//zn+77z/+ecOXh7yfCZ6+avu1LqeqBwWzveXuhyESPx4SXFs0YVFU4oLsBzHFzb2p9od3cU9cwxubSis4uBqWuqCTytaUU1WccYQjKGymqcKZusyqWByVoCm4hUL2JJDGd1Q7M0QVMQTywaQoI8H6Rxyhfw+3hGFDloVW/ErNdCiBDAGd4PJAnnJDxIULDfNDMgppoWp1ohhMRJEiUIlAjU4yRLUayPxpgg3YR4GoBhypoKXTAcCTtwWWeskYP19lA50wSGBYMg4VhkXiIeiUUra+rneHNihbM6JCzOypj9WxWaCDwNnJIBt5/GdLzZREYQgGki3nDvDP2DspEbYO4DviM1DySaFhkK+PwMRTPBvEg5TzPSnHV7HLZFFlHJcWWBaslW250UhWrwK4BgZVs1MEQs6rH/6jKcIksyMEJIZXmkMVJbi4QXyLzBqVGAJg0to6O1i6OoSPh5XqCCFOTDB2ie8WVn6Q2V1XjANBWaKsq2YqanRrPKAYQMBgpD5ggDneJq3IhIlg0n14++IWCAabJXtHcJM9Zy1V5UkIYqeJzmneXvG21ZhsxnLNAXYWCHo08I4XRdFpGBnU4iZnOn1Qwhyy1LZ73elpYWrIXCNCPpJXGc8D5TvSghLAdpWImOr13r0F++8wBUdqgIAI40ZdZq0yGWVpioEICaRMK030/56azu/WGFB1r/Zcjh7O1fDvkqD9rnY0S4w9AciQclhs9HeYSzGeq1cQCea0PTnJEClq5wAkAFmGeZNDBkkaV8EkkFJYCKfkZCaUaSUN4n+lFCAgAHAGYyE/zfVMnd5nkCCAaw8pXo+UnyaFXjwpSvsSopEkky2hBf0LzQqHv6+UiiqqoybhCVeGBWM0jpddWZVOhuS+GW5CsUGSpTD+fPnwB2redDhPmaaQFxUPQSgqaDWk2RhbahtcCUIdZyhtWWAIoCDYMiGdH1WN426vzQu5c94v5I5/V0+i9OpluyMu18HVqs7PEmDMDpMmafPZigpb0aBy8dtsmu9WUO6kHxluGFdUixhiR72cpi700Tcyhj5koBM4CpZQx4ycbi9t2rXksBFR5mlqEpCjAaiEEXczqdsTheAUOtqvOQ4DI3xE5awu8P+n0kTQ2Ol+Cco8uG2paU133Y/eQ93Ka9/T/swwXOj+hw7cc7XHsLXS7ci08lpuCPlxQtcRc9OMGULYDJnISZclKF36sGwFKgTedko7DEtbqarfs25ylh21J8fN9jwvAiYmTOywL+6M2eYqJsXClJEgQRwEmK8tFN+JSbvW5irHvMmbJhrxx7fd+hnunM4p2vLW3u+vS3JF7a5+RyFRe4O1wFc2cSZGdkxBGue+zhyPG/urnZ9IV44oftL5wtLRc2vrjZPePVzz6Ze6Ky9K3TS1d0TX4jiI2aeWnLh9fPjd668OojgfNVs3um7dg6/dl9endP07sbkFNjR6y/nJ78Qen6nVsuf1321Mg9v5zt3HwQ++ax9x7eey02rgc9ce3vVaHOQ1817lmSnHgufvTST7syc97c8P2k8DzEe7SksLOLmTTsyg7spROpI2P2H/d9t2nNj5dbd5PjS04fi79z5vDEc6u+WP3xhS8/f7uOXTu16cDEi13lf7y8cfyZh6at/f1UU2j/qI6y0Scvvr/7oHkw8vMm35rtM1Z2T9l1ddZHNcW/Xo9pzQp6/rkDJ/+MdKn6Jb53+f4B93wRQeQRAAA=";

  const authString = "Bearer " + token;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": authString,
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  const items = data.items;
  const onlyItemsInStock = items.filter(
    (item) =>
      item.estimatedAvailabilities[0].estimatedAvailabilityStatus == "IN_STOCK"
  );
  const newArray = onlyItemsInStock.map((item) => newItem(item));
  return newArray;
}

function newItem(item) {
  const itemData = {
    groupId: item.legacyItemId,
    name: item.localizedAspects[0].value,
    price: item.price.value,
    gtin: item.gtin
  };
  return itemData;
}

const allItems = await concatArrays();

const json2csvParser = new Parser({ fields });
const csv = json2csvParser.parse(allItems);
fs.writeFileSync("products.csv", csv);
