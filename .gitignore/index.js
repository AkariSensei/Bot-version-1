const Discord = require("discord.js");
const token = require("./token.json");
const bdd = require("./bdd.json");
const fs = require("fs");
const { totalmem } = require("os");
const { brotliCompressSync } = require("zlib");

const bot = new Discord.Client();

//Allumage du bot ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
bot.on("ready", async () => {
    console.log("le bot est allumé")
    bot.user.setStatus("dnd");
    setTimeout(() => {
        bot.user.setActivity("Développement JavaScript");
    }, 100)
});
// fin allumage --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// Message MP et sur le salon bienvenue à chaque nouveaux membres ------------------------------------------------------------------------------------------------------------------------------------------------------------
bot.on("guildMemberAdd", member => {
    if (bdd["message-bienvenue"]) {
        bot.channels.cache.get('772826574617182230').send(bdd["message-bienvenue"]); // mettre member.user.username si l'on veut avoir le pseudo mais sans la mention dans le message
    }
    else {
        bot.channels.cache.get('772826574617182230').send("Bienvenue sur le serveur");
    }
    member.send(`Bienvenue sur le serveur de la meilleure classe de BTS de 2020 héhé ${member.user.username}!`);
    member.roles.add('772828378880540703');
})
// Fin message ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// Commande clear ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
bot.on("message", async message => {

    if(message.author.bot) return;

    if (message.content.startsWith("/clear")) {
        message.delete();
        if (message.member.hasPermission('MANAGE_MESSAGES')) {

            let args = message.content.trim().split(/ +/g);

            if (args[1]) {
                if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99) {

                    message.channel.bulkDelete(args[1])
                    message.channel.send(`Vous avez supprimé ${args[1]} message(s)`)

                }
                else {
                    message.channel.send(`Vous devez indiquer une valeur entre 1 et 99 !`)
                }
            }
            else {
                message.channel.send(`Vous devez rentrer un nombre entre 1 et 99 !`)
            }
        }
        else {
            message.channel.send(`Vous devez avoir un rôle spécial pour effacer ces messages !`)
        }
    }
    // Fin commande clear --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    // Définition du message de bienvenue ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    if (message.content.startsWith("/mb")) {
        message.delete();
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            // /mb <le message>
            if (message.content.length > 5) {
                message_bienvenue = message.content.slice(4)
                bdd["message-bienvenue"] = message_bienvenue
                Savebdd()
            }
        }
    }
    // Fin définition message ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    // Commande de warn ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    if (message.content.startsWith("/warn")) {
        if (message.member.hasPermission('BAN_MEMBERS')) {

            if (!message.mentions.users.first()) return;
            utilisateur = message.mentions.users.first().id

            if (bdd["warn"][utilisateur] == 2) {
                delete bdd["warn"][utilisateur]
                message.guild.members.ban(utilisateur)
            }
            else {
                if (!bdd["warn"][utilisateur]) {
                    bdd["warn"][utilisateur] = 1
                    Savebdd();
                    message.channel.send("Vous êtes à présent à " + bdd["warn"][utilisateur] + " warn ");
                }
                else {
                    bdd["warn"][utilisateur]++
                    Savebdd();
                    message.channel.send("Vous êtes à présent à " + bdd["warn"][utilisateur] + " warn ");
                }
            }
        }
    }
    // Fin commande de warn ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    //Statistiques ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    if (message.content.startsWith("/stats")) {
        message.delete();
        let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
        let totalmembers = message.guild.members.cache.size;
        let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
        let totalroleir = message.guild.roles.cache.get('772824665549963304').members.map(member => member.user.tag).length; //ir
        let totalroleec = message.guild.roles.cache.get('772824804746592287').members.map(member => member.user.tag).length; //ec
        let totalmemberswithoutbot = totalmembers - totalbots;
        let totalmembersconnectedwithoutbots = onlines - totalbots;

        message.channel.send("Il y a " + onlines + " membres en ligne sur le serveur");
        message.channel.send("Le nombre de membres sur le serveur est de " + totalmemberswithoutbot);
        message.channel.send("Le nombre d'IR est de " + totalroleir);
        message.channel.send("Le nombre d'EC est de " + totalroleec);


        console.log("onlines : " + onlines + "\nTotal onlines sans bots : " + totalmemberswithoutbot + "\nTotal membres : " + totalmembers + "\nTotal bots : " + totalbots + "\nTotal IR : " + totalroleir + "\nTotal EC : " + totalroleec);

        /*const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Statistiques')
            .setURL('https://discord.js.png')
            .setAuthor('Akari_Sensei', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription('Voici les statistiques du serveur')
            .setThumbnail('')
            .addFields(
                { name : 'Nombre total de membres', value: totalmemberswithoutbot, inline: true},
                { name : 'Nombre de membres connectés', value: totalmembersconnectedwithoutbots, inline: true},
                { name : '\u2008', value: '\u2008' },
                { name : 'Nombre de membres en EC', value: totalroleec, inline: true},
                { name : 'Nombre de membres en IR', value: totalroleir, inline: true},
            )
            .setTimestamp()
            .setFooter('some footer text here', 'https://i.imgur.com/wSTFkRM.png');
        
        message.channel.send(exampleEmbed); */
    }
    // Fin Statistiques ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    // Level ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //Fin Level ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
})



function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
}


Savebdd();

bot.login(token.token);
