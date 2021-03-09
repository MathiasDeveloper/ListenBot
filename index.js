const fs = require('fs');
const discord = require('discord.js');
const ApiHelper = require('./helper/apiHelper');
const dotenv = require('dotenv');

const { parse } = require('path');


const client = new discord.Client();
client.commands = new discord.Collection();
const api = new ApiHelper();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const instance = api.create(process.env.access_token);



for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

let id;
instance.get('/services').then(response => {
    return id = response.data.data.services[0]['id'];
});


client.once('ready', () => {
	console.log(`Ready for use!`);
    instance.get('/services/' + id + '/gameservers/games/players').then(response => {
        console.log(response.data);
    });
});

client.on('message', function(message){
	if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;
	const args = message.content.slice(process.env.prefix).trim().split(/ +/);
	const command = args.shift().toLowerCase();
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('This command is not avalaible');
    }
});

client.login(process.env.token);



