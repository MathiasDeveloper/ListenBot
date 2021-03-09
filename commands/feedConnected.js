'use-strict';
const ApiHelper = require('./../helper/apiHelper');
const dotenv = require('dotenv');
const fs = require('fs');
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
              message.channel.send(logged);
        });
	},
};