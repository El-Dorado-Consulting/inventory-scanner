const moment = require('moment')
const Airtable = require('airtable');
const fs = require('fs')
const path = require('path')

//BASE SETUP

let CONFIG = require("../config.json")
const {onLoad} = require('./helpers/onLoad.js');


const apiKey = 'keyyKoLrS4fQAkhML'
const baseID = CONFIG.base

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: apiKey
});
const base = Airtable.base(baseID);

onLoad.test()
onLoad.updateCityList()

const LOOKUP = {}
const CHECKIN = {}
const CHECKOUT = {}
const CYCLECOUNT = {}
let LAST_PART_ID = ''

//cycle count
let cycleCountArray = []
let completedCycleCount = []
let timeToCount = true
let cyclePart = {}

// fields 
let quantityField
let manualField
let clearButton



let Onload = window.addEventListener('load', () => {
    console.log('App loaded')
    clock.innerHTML = moment().format('H:mm:ss')
    START_SCANNER()
    START_CLOCK()
    CHECKOUT.loadTemplate()


    let configFile = require("../config.json")
    console.log('Current city: ' + configFile.city)
    document.getElementById('city').textContent = configFile.city
})


function START_CLOCK() {
    setInterval(() => {
        clock.innerHTML = moment().format('H:mm:ss')
    }, 1000)
}

// SCANNER SCRIPT
function START_SCANNER() {
    console.log('Scanner started')

    let now = '', then = ''
    let barcodeArray = []
    let buffer = []

    function filterChar(char) {
        if (char != "Shift" && char != "Backspace")
            return char
    }

    document.addEventListener("keydown", function (e) {
        let thisChar = filterChar(e.key)
        buffer.push(thisChar)
        //Characters entered within 25ms are from barcode scanner
        now = new Date().getTime()
        if (now - then <= 25) {
            if (barcodeArray.length < 1) {
                barcodeArray.push(buffer[buffer.length - 2])
            }
            barcodeArray.push(thisChar)
            if (thisChar == "Enter") {
                barcodeArray.pop()//get rid of "enter"
                let finalString = barcodeArray.join('')
                scannerInput(finalString)
                barcodeArray = []
                buffer = []
            }
        }
        then = now

    })

}
/////////////////   LOOKUP  ////////////////
LOOKUP.loadTemplate = () => {
    // First run
    let content = document.getElementById('main-content')
    content.innerHTML = (
        '<section class="scan-section">' +
        '<h4 id="title">Supermarket</h4>' +
        '<table>' +
        '<tr>' +
        '<td class="col-short">Description:</td>' +
        '<td id="scan-description"></td>' +
        '</tr>' +
        '</td>' +
        '</table>' +
        '<br>' +
        '<div id="part-image">' +
        '<img id="scan-image" src="assets/placeholder.png" alt="">' +
        '</div>' +
        '</section>' +
        '<section class="scan-section">' +
        // '<h4 id="title">Service BOM</h4>' +
        // '<table>' +
        // '<tr>' +
        // '<td class="col-short">Description:</td>' +
        // '<td id="scan-description"></td>' +
        // '</tr>' +
        // '</table>' +
        '</section>'
    )

    // stopListeners()
    styleNav('but-lookup')
}


///////////////// CHECK OUT //////////////////////


CHECKOUT.loadTemplate = () => {
    // First run
    if (document.getElementById('title')) {
        stopListeners()
    }

    let content = document.getElementById('main-content')
    content.innerHTML = (
        '<section class="scan-section">' +
        '<h4 id="title">Scan Out</h4>' +
        '<table>' +
        '<tr>' +
        '<td class="col-short">Description:</td>' +
        '<td id="scan-description"></td>' +
        '</tr>' +
        '<td class="col-short">Quantity:</td>' +
        '<td>' +
        '<form id="scan-quantity">' +
        '<input id="scan-quantity-field" type="text" value="">' +
        '</form>' +
        '</td>' +
        '</table>' +
        '<br>' +
        '<div id="part-image">' +
        '<img id="scan-image" src="assets/placeholder.png" alt="">' +
        '</div>' +
        '</section>' +
        '<section id="log-section">' +
        '<div class="log-header">' +
        '<h4>Log</h4>' +
        '<button id="clear-log">Clear Log</button>' +
        '</div>' +
        '<table id ="log-table">' +
        '<tr>' +
        '<th class="col-short">Time</th>' +
        '<th class="col-long">Description</th>' +
        '<th>Quantity</th>' +
        '</tr>' +
        '</table>' +
        '</section>'
    )

    // stopListeners()
    styleNav('but-checkout')
    startListeners()

}

CHECKOUT.consumePart = (scan) => {
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

        //Update View
        updateCheckoutView(currentPart.description, currentPart.image)

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

CHECKOUT.updateQuantity = (quant) => {

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
        records.forEach(function (record) {
            let cell = document.getElementById('log-table').rows[1].cells[2]
            cell.textContent = quant
            console.log("Quantity updated")
        })
    })
}

//Update View
function updateCheckoutView(name, img, partClass) {
    let scanDescription = document.getElementById('scan-description')
    let scanQuanity = document.getElementById('scan-quantity-field')
    let scanImage = document.getElementById('scan-image')
    // Update Scan
    scanDescription.textContent = name
    scanQuanity.value = "1"
    if (img) {
        scanImage.src = img
    } else {
        scanImage.src = "assets/no_image.png"
    }
    // Just for cycle counting
    if (partClass) {
        document.getElementById('part-class').textContent = partClass
    }

    //Update log table
    let table = document.getElementById('log-table')
    // Add Log
    let newRow = table.insertRow(1)
    let time = document.getElementById('clock').innerText
    newRow.className = "tr-sm"
    newRow.innerHTML =
        `<td class="col-short">${time}</td>` +
        `<td class="col-long">${name}</td>` +
        `<td>1</td>`
}


////////////////// CHECK IN ////////////////////


CHECKIN.loadTemplate = () => {
    stopListeners()
    let content = document.getElementById('main-content')
    content.innerHTML = (
        '<section class="scan-section">' +
        '<h4 id="title">Scan In</h4>' +
        '<table>' +
        '<tr>' +
        '<td class="col-short">SB Number:</td>' +
        '<td id="sb-number"</td>' +
        '</tr>' +
        '<tr>' +
        '<td class="col-short">Description:</td>' +
        '<td id="scan-description"></td>' +
        '</tr>' +
        '<td class="col-short">Quantity:</td>' +
        '<td>' +
        '<form id="scan-quantity">' +
        '<input id="scan-quantity-field" type="text" value="">' +
        '</form>' +
        '</td>' +
        '</table>' +
        '<br>' +
        '<h4 id="supermarket"> <br> Supermarket</h4>' +
        '<table id="supermarket-child">' +
        '</table>' +
        '</section>' +
        '<section id="log-section">' +
        '<div class="log-header">' +
        '<h4>Log</h4>' +
        '<button id="clear-log">Clear Log</button>' +
        '</div>' +
        '<table id ="log-table">' +
        '<tr>' +
        '<th class="col-short">Time</th>' +
        '<th class="col-long">SB Number</th>' +
        '<th>Quantity</th>' +
        '</tr>' +
        '</table>' +
        '</section>'
    )
    styleNav('but-checkin')
    startListeners()
}

CHECKIN.receivePart = (scan) => {
    const bom = require("../data/bomList.json")
    bom.forEach((part) => {
        if (part.sbNumber == scan) {
            console.log("part found")
            //Update View
            updateCheckinView(part.sbNumber, part.description)
            CHECKIN.findChild(part.supermarketID)
            //Push content to airtable
            base('Receiving').create([
                {
                    "fields": {
                        "Description": part.description,
                        "Quantity": 1,
                        "Service BOM": [
                            part.airtableID
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
    })

}

CHECKIN.updateQuantity = (quant) => {
    base('Receiving').update([
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
        records.forEach(function (record) {
            let cell = document.getElementById('log-table').rows[1].cells[2]
            cell.textContent = quant
            console.log("Quantity updated")
        })
    })

}

CHECKIN.findChild = (parent) => {
    let field = document.getElementById('supermarket-child')
    field.innerHTML = ''
    let market = require("../data/supermarket.json")
    market.forEach((part) => {
        if (part.airtableID == parent) {
            field.innerHTML = (
                '<tr>' +
                '<td>' +
                `${part.description}` +
                '</td>' +
                '</tr>'
            )
        }
    })
}

function updateCheckinView(name, description) {
    let sbNumber = document.getElementById('sb-number')
    let scanDescription = document.getElementById('scan-description')
    let scanQuanity = document.getElementById('scan-quantity-field')

    // Update Scan
    sbNumber.textContent = name
    scanDescription.textContent = description
    scanQuanity.value = "1"
    //Log
    let table = document.getElementById('log-table')
    // Add Log
    let newRow = table.insertRow(1)
    let time = document.getElementById('clock').innerText.slice(0, -2) //trim am/pm
    newRow.className = "tr-sm"
    newRow.innerHTML =
        `<td class="col-short">${time}</td>` +
        `<td class="col-long">${name}</td>` +
        `<td>1</td>`
}

// CYCLE COUNT
CYCLECOUNT.loadTemplate = (option) => {
    styleNav('but-cycle-count')
    stopListeners()
    let content = document.getElementById('main-content')
    if (timeToCount) {
        cycleCountArray = []
        completedCycleCount = []
        content.innerHTML = (
            '<section class="scan-section">' +
            '<div class="log-header">' +
            '<h4 id="title">Cycle Count</h4>' +
            '<h5 id="count-left">3 of 10</h5>' +
            '</div>' +
            '<table>' +
            '<tr>' +
            '<td class="col-short">Description:</td>' +
            '<td id="scan-description"></td>' +
            '</tr>' +
            '<tr>' +
            '<td class="col-short">Class:</td>' +
            '<td id="part-class"></td>' +
            '</tr>' +
            '<td class="col-short">Quantity:</td>' +
            '<td>' +
            '<form id="scan-quantity">' +
            '<input id="scan-quantity-field" type="text" value="">' +
            '</form>' +
            '</td>' +
            '</table>' +
            '<br>' +
            '<div id="part-image">' +
            '<img id="scan-image" src="assets/placeholder.png" alt="">' +
            '</div>' +
            '</section>' +
            '<section id="log-section">' +
            '<div class="log-header">' +
            '<h4>Log</h4>' +
            '<button id="clear-log">Clear Log</button>' +
            '</div>' +
            '<table id ="log-table">' +
            '<tr>' +
            '<th class="col-short">Time</th>' +
            '<th class="col-long">Description</th>' +
            '<th>Quantity</th>' +
            '</tr>' +
            '</table>' +
            '</section>'
        )
        startListeners()
        CYCLECOUNT.generateList()
    } else if (option == 'complete'){
        let nextDate = moment().startOf('isoWeek').add(1, 'week').format('MM DD YYYY')
        content.innerHTML = (
            '<section class="scan-section">' +
            '<h4 id ="title">Cycle Count</h4>' +
            '<table>' +
            '<tr>' +
            '<td>Count complete!</td>' +
            '</tr>' +
            '<tr>' +
            '<td class="col-short">Next Count</td>' +
            '<td>' +
            nextDate +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</section>' +
            '<section id="log-section">' +
            '<div class="log-header">' +
            '<h4>Log</h4>' +
            '<button id="clear-log">Clear Log</button>' +
            '</div>' +
            '<table id ="log-table">' +
            '<tr>' +
            '<th class="col-short">Time</th>' +
            '<th class="col-long">Description</th>' +
            '<th>Quantity</th>' +
            '</tr>' +
            '</table>' +
            '</section>'
        )     
        timeToCount = true
        cycleCountArray = []
        completedCycleCount = []
    }
}

CYCLECOUNT.generateList = () => {
    let market = require("../data/supermarket.json")

    let abArray = []

    market.forEach(part => {
        if (part.class == "A") {
            abArray.unshift(part.partID)
        }
        if (part.class == "B") {
            abArray.push(part.partID)
        }
    })

    // Cs
    let cArray = []

    market.forEach(part => {
        if (part.class == "C") {
            cArray.unshift(part.partID)
        }
    })
    console.log('c length ' + cArray.length)
    let chunk = cArray.length
    chunk = Math.round(chunk / 4)
    let oneOfFour  = cArray.slice(0, chunk)
    //Combine
    cycleCountArray = abArray.concat(oneOfFour)


    //Display
    CYCLECOUNT.displayItem()
}

CYCLECOUNT.displayItem = () => {
    const market = require("../data/supermarket.json")
    market.forEach((part) => {
        if (part.partID == cycleCountArray[0]) {
            cyclePart.image = part.image
            cyclePart.description = part.description
            cyclePart.airtableID = part.airtableID
            cyclePart.class = part.class[0]
        }
    })
    // Pull On hand quaniy

    reconcileQuant(cyclePart.airtableID)



    //Update View
    updateCheckoutView(cyclePart.description, cyclePart.image, cyclePart.class)
    updateCycleNumber()

}

CYCLECOUNT.submitCount = (quant) => {
    let onHand = parseInt(quant)
    let airtable = parseInt(cyclePart.qoh)
    let adjustment = onHand - airtable

    
    console.log('Submit count called')
    base('Cycle Count').create([
        {
            "fields": {
                "Description": cyclePart.description,
                "Quantity": adjustment,
                "Supermarket": [
                    cyclePart.airtableID
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
            //Change quant row
            let cell = document.getElementById('log-table').rows[1].cells[2]
            cell.textContent = quant
            //move on to next item
            shiftArray()
        });
    })


}

function reconcileQuant(currentID) {
    let market = require("../data/bomList.json")
    let bomID = ''
    market.forEach(item => {
        if (item.supermarketID == currentID) {
            bomID = item.airtableID
        }
    })
    base('Service BOM').find(bomID, function (err, record) {
        if (err) { console.error(err); return; }
        cyclePart.qoh = record.fields['Quantity on Hand']
        console.log('Quantity on hand: ' + cyclePart.qoh)
    });
}

function shiftArray() {
    completedCycleCount.push(cycleCountArray[0])
    cycleCountArray.shift()
    CYCLECOUNT.displayItem()
}

function updateCycleNumber() {
    let currentCount = completedCycleCount.length + 1
    let totalCount = currentCount + cycleCountArray.length - 1
    let countString = `${currentCount} of ${totalCount}`
    document.getElementById('count-left').textContent = countString

    if (cycleCountArray.length == 0) {
        timeToCount = false
        CYCLECOUNT.loadTemplate('complete')
    }
}

//DOM ELEMENTS

document.getElementById('but-lookup').addEventListener('click', LOOKUP.loadTemplate)
document.getElementById('but-checkin').addEventListener('click', CHECKIN.loadTemplate)
document.getElementById('but-checkout').addEventListener('click', CHECKOUT.loadTemplate)
document.getElementById('but-cycle-count').addEventListener('click', CYCLECOUNT.loadTemplate)


//HELPERS
function stopListeners() {
    //quantityField.removeEventListener('submit', manualInput)
    manualField.removeEventListener('submit', quantityInput)
    clearButton.removeEventListener('click', clearLog)
}

function startListeners() {
    //Manual Entry Field
    //quantityField = document.getElementById('manual-input')
    // quantityField.addEventListener('submit', manualInput)

    manualField = document.getElementById('scan-quantity')
    manualField.addEventListener('submit', quantityInput)
    clearButton = document.getElementById('clear-log')
    clearButton.addEventListener('click', clearLog)

}


// function manualInput(event) {
//     event.preventDefault()
//     let string = document.getElementById('manual-input-field').value
//     console.log(string)
//     let title = document.getElementById('title').textContent
//     if (title == "Scan Out") {
//         CHECKOUT.consumePart(string)
//     } else if (title == "Scan In") {
//         CHECKIN.receivePart(string)
//     } else if (title == "Cycle Count") {
//     }
// }

function scannerInput(string) {
    console.log("Scanner input: " + string)
    let title = document.getElementById('title').textContent
    if (title == "Scan Out") {
        CHECKOUT.consumePart(string)
    } else if (title == "Scan In") {
        CHECKIN.receivePart(string)
    } else if (title == "Cycle Count") {
        alert('No scanning required')
    }
}


//Update Quantity Field
function quantityInput(event) {
    event.preventDefault()
    let quant = document.getElementById('scan-quantity-field').value
    let title = document.getElementById('title').textContent
    if (title == "Scan Out") {
        CHECKOUT.updateQuantity(quant)
    } else if (title == "Scan In") {
        CHECKIN.updateQuantity(quant)
    } else if (title == "Cycle Count") {
        CYCLECOUNT.submitCount(quant)
    }
//FIND ME
    document.getElementById("scan-quantity-field").blur()
}

//Clear Log Button
function clearLog() {
    let logTable = document.getElementById('log-table')
    logTable.innerHTML = (
        '<tr>' +
        '<th class="col-short">Time</th>' +
        '<th class="col-long">Description</th>' +
        '<th>Quantity</th>' +
        '</tr>'
    )

    if (document.getElementById('title').textContent == "Scan In") {
        logTable.innerHTML = (
            '<tr>' +
            '<th class="col-short">Time</th>' +
            '<th class="col-long">SB Number</th>' +
            '<th>Quantity</th>' +
            '</tr>'
        )
    }
    document.getElementById('title').focus()
}

//Style Nav
function styleNav(buttonToStyle) {
    let navArray = ['but-lookup', 'but-checkin', 'but-checkout', 'but-cycle-count']
    navArray.forEach(button => {
        document.getElementById(button).parentElement.className = ''
    })

    document.getElementById(buttonToStyle).parentElement.className = 'selected'
}

function fsWriteHelper(location, json, message, err) {
    fs.writeFile(path.join(__dirname, location), json, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log(`Succesfully wrote ${message} file`)
        }
    })
    if (err) {
        console.error(err); return
    }
}

