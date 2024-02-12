const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {     
     request('https://123job.vn/tuyen-dung', (err, res, body) => {
          if (!err && res.statusCode == 200) {
               const $ = cheerio.load(body);               
               let data = [];
               $('.job__list-item').each((i, el) => {
                    const job = $(el).find('.job__list-item-title').text();
                    const company = $(el).find('.job__list-item-company').text();
                    const address = $(el).find('.job__list-item-info').find('.address').text();
                    const salary = $(el).find('.job__list-item-salary').find('.salary').text();
                    data.push({job, company, address, salary});                    
               });               
               fs.writeFile('job.json', JSON.stringify(data, null, 4), (err) => {
                    if (err) {
                         console.log(err);
                    } else {
                         console.log('File successfully written! - Check your project directory for the output.json file');
                    }
               });
          }
     })     
     res.send('Crawling..');
});

module.exports = router;