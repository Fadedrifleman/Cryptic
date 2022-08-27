const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cryptoData = require('./models/crypto-data');
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));
// const ejs = require('ejs');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const app = express();
// app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

mongoose.connect("mongodb://localhost:27017/DataBase", {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.log(err);
    });

const CryptoData = cryptoData;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const url = "https://api.wazirx.com/api/v2/tickers";

const deleteData = () => {
    CryptoData.deleteMany()
        .then(() =>{
            console.log("Data deleted"); // Success
        }).catch((error) => {
            console.log(error); // Failure
        });
};

const getData = async url => {
    try {
        deleteData();
        const response = await fetch(url);
        const data = await response.json();
        const arr = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var val = data[key];
                const record = new CryptoData({
                    name: val.name,
                    last: val.last,
                    buy: val.buy,
                    sell: val.sell,
                    volume: val.volume,
                    base_unit: val.base_unit
                });
                arr.push(record);
            }
        }
        arr.sort((a, b) => b.last - a.last);

        for(let i=0; i<10; i++){
            record = arr[i];
            record.save();
        }

    } catch (error) {
        console.log(error, "Error");
    }
};
getData(url);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/',  (req, res) => {
    CryptoData.find()
    .select('-_id -__v')
    .then(records => {
        res.send(records);
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let port = process.env.PORT;
if (port == null || port == '') {
    port = 3000;
}

app.listen(port, function () {
    console.log(`Server started at port ${port}`);
});