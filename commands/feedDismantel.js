'use-strict';
const ApiHelper = require('./../helper/apiHelper');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');
dotenv.config();

const api = new ApiHelper();
const instance = api.create(process.env.access_token);

let id;
instance.get('/services').then(response => {
    id = response.data.data.services[0]['id'];
});

module.exports = {
	name: 'feeddismantel',
	description: 'This command can list all user dismantel',
	execute(message, args) {  
        fs.readFile('logDayz.log', 'utf-8', function(err, data) {
            var feedConnected = data.match(/((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9]))\s\|\sPlayer\s(".*?")\s\(id=(.*?)\)\ dismantled\s(.*?)\swith\s(.*?)\s/gm);
            var regex = /((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9]))\s\|\sPlayer\s(".*?")\s\(id=(.*?)\)\ dismantled\s(.*?)\swith\s(.*?)\s/gm;
            var match = regex.exec(feedConnected);
            var logged = "", logged1 = "";
            while (match != null) {
                message.channel.send(match[1] + " | Player : " + match[2] + ' ID/pos : ' + match[3] + 'dismantel ' + match[4] + ' with ' + match[5]);
                match = regex.exec(feedConnected);
              }
        });
	},
};