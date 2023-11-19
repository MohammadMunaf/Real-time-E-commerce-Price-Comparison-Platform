const puppeteer = require('puppeteer');
require("dotenv").config();
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/products')
//      .then(() => {
//          console.log("connection open");
//      })
//      .catch(err => {
//          console.log("error");
//      })


const flipkartProduct = require('./schema/flipkart');
const amazonProduct = require('./schema/amazon');

exports.Amazon = async function (input) {
    //console.log(input);
    const browser = await puppeteer.launch(
        {
            headless: "new",
            executablePath: process.env.NODE_ENV === "production"
                ? '/usr/bin/google-chrome-stable'
                : puppeteer.executablePath(),
            args: [
                '--no-sandbox',
                '--disable-gpu',
            ]
        }
    );
    try {
        const page = await browser.newPage();
        await page.goto(`https://www.amazon.in/s?k=${input}`)

        const limit = 10;

        const elements = await page.$$eval('.a-section .puisg-row', (sections, limit) => {
            const extractedData = [];

            for (const section of sections.slice(0, limit)) {
                try {
                    const innerElements = section.querySelectorAll('.a-size-medium');
                    const imgs = section.querySelector('.s-image').src;
                    const prices = section.querySelector('.a-price .a-offscreen').textContent;
                    const rating = section.querySelector('.a-section.a-spacing-none.a-spacing-top-micro').textContent;
                    const link = section.querySelector('.a-link-normal').href;
                    const sectionData = [];

                    for (const innerElement of innerElements) {
                        sectionData.push(innerElement.textContent);
                    }
                    const obj = {};
                    obj.url = imgs;
                    obj.title = sectionData;
                    obj.price = prices;
                    obj.rating = rating;
                    obj.link = link
                    extractedData.push(obj);
                } catch (e) {
                    console.log("error")
                }
            }
            return extractedData;
        }, limit);
        amazonProduct.insertMany(elements);
    } catch (e) {
        console.log(e);
    }
    await browser.close();
}

exports.Flipkart = async function (input) {
    const browser = await puppeteer.launch(
        {
            // args: [
            //     "--disable-setuid-sandbox",
            //     "--no-sandbox",
            //     "--single-process",
            //     "--no-zygote",
            // ],
            // headless: true,
            // executablePath:
            //     process.env.NODE_ENV === "production"
            //         ? process.env.PUPPETEER_EXECUTABLE_PATH
            //         : puppeteer.executablePath(),
            headless: "new",
            executablePath: process.env.NODE_ENV === "production"
                ? '/usr/bin/google-chrome-stable'
                : puppeteer.executablePath(),
            args: [
                '--no-sandbox',
                '--disable-gpu',
            ]
        }
    );
    try {
        const page = await browser.newPage();
        await page.goto(`https://www.flipkart.com/search?q=${input}`);

        const limit = 5;

        const elements = await page.$$eval('._1AtVbE ._13oc-S', (sections, limit) => {
            const extractedData = [];

            for (const section of sections.slice(0, limit)) {
                try {
                    const innerElements = section.querySelector('._4rR01T').textContent;
                    const imgs = section.querySelector('._396cs4').src;
                    const prices = section.querySelector('._1_WHN1').textContent;
                    const rating = section.querySelector('._1lRcqv').textContent;
                    const link = section.querySelector('._1fQZEK').href;
                    const obj = {};
                    obj.url = imgs;
                    obj.title = innerElements;
                    obj.price = prices;
                    obj.rating = rating;
                    obj.link = link
                    extractedData.push(obj);

                } catch (e) {
                    console.log("error", (e));
                }
            }
            return extractedData;
        }, limit);
        flipkartProduct.insertMany(elements);
    } catch (e) {
        console.log(e);
    }
    await browser.close();
}