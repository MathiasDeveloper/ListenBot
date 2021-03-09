const fs = require('fs');
const discord = require('discord.js');
const ApiHelper = require('./helper/apiHelper');
const dotenv = require('dotenv');
dotenv.config();
const { parse } = require('path');
const https = require('https');
// const request = require('request');


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
    id = response.data.data.services[0]['id'];
});



client.once('ready', () => {
    const channelForLog = client.channels.cache.find(channels => channels.name === 'test');
	console.log(`Ready for use!`);

    setInterval(loop, 1800000);
    function loop() {
        let absolutePath = instance.get('/services/' + id + '/gameservers').then(response => {
            return response.data.data.gameserver.game_specific.path;
        });
    
        let logFile = instance.get('/services/' + id + '/gameservers').then(response => {
            return response.data.data.gameserver.game_specific.log_files[0];
        })
    
        logFile.then(function(pathLog) {
            let remove = 'dayzxb';
            absolutePath.then(function(path){
                let endpoint = '/services/' + id  + '/gameservers/file_server/download?file=' + path + pathLog.slice(remove.length);
                console.log(endpoint);
                let url = instance.get(endpoint).then(response => {
                    console.log(response.data.data.token.url);
                    const file = fs.createWriteStream('logDayz.log');
                    https.get(response.data.data.token.url, function(response) {
                        response.pipe(file);
                    })
                });
             });
        });
    
        fs.readFile('logDayz.log', 'utf-8', function(err, data) {
            var feedConnected = data.match(/((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9]))\s\|\sPlayer\s(".*?")\sis\sconnected.\(id=(.*?)\)/gm);
            var regex = /((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9]))\s\|\sPlayer\s(".*?")\sis\sconnected.\(id=(.*?)\)/gm;
            var match = regex.exec(feedConnected);
            var logged = "";
            while (match != null) {
                logged += match[1] + " | Player : " + match[2] + ' ID : ' + match[3] + ' is connected on server\n';
                match = regex.exec(feedConnected);
              }
              channelForLog.send(logged);
        });
    }
    
    
    // setInterval(loop, 5000);
    // function loop() {
    //     absolutePath.then(function(path){
    //        let endpoint = '/services/' + id  + '/gameservers/file_server/download?file=' + path;
    //        console.log(endpoint);
    //        let url = instance.get(endpoint).then(response => {
    //            console.log(response);
    //        });
    //     });
    // }
});


client.on('message', function(message){
	if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;
	const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('This command is not avalaible');
    }
});

client.login(process.env.token);



