import Airtable from 'airtable'
import Moment from 'moment'

const apiKey = 'keyyKoLrS4fQAkhML'
const baseID = 'appaXW95iIHcAeyWW'

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: apiKey
})

const base = Airtable.base(baseID);


// DOWNLOAD DATA
let getInventoryList = function () {
  console.log("Fetching Supermarket")
  let itemList = []
  base('Supermarket').select({view: "scanner"}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
    itemList.push ({
        recordId:record.id,
        productId:record.fields['Product ID'],
        description:record.fields['Description'],
        image: record.fields.Images !== undefined ? record.fields.Images[0].thumbnails.large.url : undefined
      })
    })
      fetchNextPage();
  }, function done(err) {
    alert(err)
  });

}


//--- CONSUMING PARTS -----
let consumePart = (scan) => {
  const market = require("../data/supermarket.json")
  const currentPart = {}
  market.forEach((part) => {
    if (part.partID == scan) {
      currentPart.image = part.image
      currentPart.description = part.description
      currentPart.airtableID = part.airtableID
    }
  })
  if (Object.entries(currentPart).length === 0) {
    alert('The part was not found')
  } else {

    // //Update View
    // updateCheckoutView(currentPart.description, currentPart.image)

    //Push to Airtable
    base('Consuming').create([
      {
        "fields": {
          "Description": currentPart.description,
          "Quantity": 1,
          "Supermarket": [
            currentPart.airtableID
          ]
        }
      }
    ], function (err, records) {
      if (err) {
        console.error(err);
        alert('Scan not logged - could not update database')
        return;
      }
      records.forEach(function (record) {
        LAST_PART_ID = record.getId()

      });
    })
  }
}

let updateQuantity = (quant) => {
  base('Consuming').update([
    {
      "id": LAST_PART_ID,
      "fields": {
        "Quantity": parseInt(quant)
      }
    }
  ], function (err, records) {
    if (err) {
      alert('failed to update quantity')
      console.error(err);
      return;
    }
    // records.forEach(function (record) {
    //   let cell = document.getElementById('log-table').rows[1].cells[2]
    //   cell.textContent = quant
    //   console.log("Quantity updated")
    // })
  })
}

module.exports = { updateQuantity, consumePart, getInventoryList}