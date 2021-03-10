'use-strict';
const ApiHelper = require('./../helper/apiHelper');
const dotenv = require('dotenv');
const discord = require('discord.js');
const fs = require('fs');
const https = require('https');
const { description } = require('./feedDismantel');
dotenv.config();

const api = new ApiHelper();
const instance = api.create(process.env.access_token);

let id;
instance.get('/services').then(response => {
    id = response.data.data.services[0]['id'];
});

module.exports = {
	name: 'feedconnected',
	description: 'This command can list all user connected on server',
	execute(message, args) {
        let id;
        instance.get('/services').then(response => {
            id = response.data.data.services[0]['id'];
        });
    
        fs.readFile('logDayz.log', 'utf-8', function(err, data) {
            var feedConnected = data.match(/((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9]))\s\|\sPlayer\s(".*?")\sis\sconnected.\(id=(.*?)\)/gm);
            var regex = /((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9]))\s\|\sPlayer\s(".*?")\sis\sconnected.\(id=(.*?)\)/gm;
            var match = regex.exec(feedConnected);
            while (match != null) {
                const embed = new discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Connected player')
                    .setAuthor('ListenBot')
                    .addField('Connect on server', match[1] + " | Player : " + match[2] + '\n ID : ' + match[3], true)
                    message.channel.send(embed);
                    match = regex.exec(feedConnected);
                } 
        });
	},
};