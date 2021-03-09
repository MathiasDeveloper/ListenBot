module.exports = {
	name: 'getinfouser',
	description: 'This command can list info of user',
	execute(message, args) {
        let taggedUser =  message.mentions.users.first();
        if (!args.length || !message.mentions.users.size) {
            return message.channel.send(`You need to specify user, ${message.author}!`);
        }

        message.channel.send(`username : ${taggedUser.username} \nid : ${taggedUser.id}`)
	},
};