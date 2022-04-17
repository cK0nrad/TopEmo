/*======*/
const discordToken = "token"
/*======*/
const Discord = require('discord.js');
const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"]
})

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapterUserTotal = new FileSync('dbUserTotal.json')
const adapterUser = new FileSync('dbUser.json')
const adapter = new FileSync('db.json')

const db = low(adapter)
const dbUser = low(adapterUser)
const dbUserTotal = low(adapterUserTotal)

const emoreg = (msg) => msg.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|<(.*?)>/gi)


const writeDB = (database, id, emo) => {

  let curretnServer = database.get(id)

  //Fetch the current emoji
  isEmoji = curretnServer.find({
    type: emo
  }).value()

  //If the emoji is already registered, increment the counter
  if (isEmoji) {
    curretnServer
      .find({
        type: emo
      })
      .assign({
        amount: isEmoji.amount + 1
      })
      .write()
  } else {
    curretnServer
      .push({
        amount: 1,
        type: emo
      })
      .write()
  }

}


const register = (msg) => {
  let currentEmoji = emoreg(msg.content)
  
  if (!currentEmoji)
    return false

  currentEmoji.forEach((emo) => {
    emo = emo[0] == "<" ? emo.slice(1, -1).split(':') : emo

    if (Array.isArray(emo) && !client.emojis.cache.find(emoji => emoji.id === emo[2]))
      return;
    else
    emo = (emo[0] == "") ? "<:" + emo[1] + ":" + emo[2] + ">" : emo

    //Define default value for the current user
    dbUser.defaults({
      [msg.author.id]: []
    }).write()

    dbUserTotal.defaults({
      [msg.guild.id]: []
    }).write()
    
    //Check for different hearts emoji 
    if (emo == "❤" || emo == "♥") {
      emo = "❤️"
    }

    writeDB(db, msg.guild.id, emo)
    writeDB(dbUser, msg.author.id, emo)
    writeDB(dbUserTotal, msg.guild.id, msg.author.id)

  })

}

function readMessageChannel(channel, lastMess) {

  channel.messages.fetch({
    limit: 100,
    before: lastMess
  }).then((msg) => {
    if (msg.size > 0) {

      let final = msg.last().id
      msg.forEach((el, ida, ind) => {
        if (!el.author.bot) {
          register(el)
        }
        if (ida == final) {
          readMessageChannel(channel, final)
        }
      })

    } else {
      console.log("Fin:" + channel.name)
      return true;
    }
  }).catch(err => {
    console.log(err)
  })
}

client.on("guildCreate", (server) => {
  db.defaults({
    [servers.id]: []
  }).write()

  if (db.get(servers.id).size().value() == 0) {
    servers.channels.fetch()
      .then(channels => {
        if (channels.type == 'GUILD_TEXT') {
          console.log("Channel:" + channels.name)
          readMessageChannel(channels, channels.lastMessageID)
        }
      })
      .catch(console.error);
  }
})


client.on('ready', () => {
  client.user.setActivity("?topemo | ?myemo")
  console.log(`Logged in as ${client.user.tag}!`);

  client.guilds.cache.forEach((servers) => {
    db.defaults({
      [servers.id]: []
    }).write()

    if (db.get(servers.id).size().value() == 0) {
      servers.channels.fetch()
        .then(channels => {
          if (channels.type == 'GUILD_TEXT') {
            console.log("Channel:" + channels.name)
            readMessageChannel(channels, channels.lastMessageID)
          }
        })
        .catch(console.error);
    }
  })

});


client.on('messageCreate', msg => {
  if (!msg.author.bot) {
    register(msg)
  }

  if (msg.content == "?resync" && (msg.member.permissions.has("ADMINISTRATOR"))) {
    msg.delete()
    
    db.get(msg.guild.id)
      .remove()
      .write()

    db.defaults({
      [msg.guild.id]: []
    }).write()

    msg.guild.channels.cache.forEach((el, id) => {
      if (el.type == 'GUILD_TEXT') {
        readMessageChannel(el, el.lastMessageID)
      }
    })
  }

  if (msg.content == "?topemo" || msg.content == "?myemo" || msg.content == "?topuser") {
    msg.delete()
    let database, title;

    switch (msg.content){
      case "?topemo":
        database = db.get(msg.guild.id)
        title = "Emote total sur le serveur"
        break;
      case "?myemo":
        database = dbUser.get(msg.author.id)
        title = "Votre total d'emote"
        break;
      case "?topuser":
        database = dbUserTotal.get(msg.guild.id)
        title = "Utilisateur utilisant le plus d'emote"
        break;
    }

    let topito = database.orderBy('amount').reverse().take(10).value()

    let message = new Discord.MessageEmbed()
      .setColor('#3498DB')
      .setTitle('Top emoji du serveur')
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.defaultAvatarURL
      })
      .setTimestamp()
      .setFooter({
        text: "© someone who did it ",
        iconURL: client.user.defaultAvatarURL
      });

    topito.forEach((el, id) => {
      if(msg.content == "?topuser"){
        let user = msg.guild.members.cache.get(el.type)
        el.type=user.displayName + "#" + user.user.discriminator
      }
      message.addFields({
        name: "#" + (id + 1) + ": " + el.type,
        value: el.amount + ' fois'
      })
    })


    msg.channel.send({
      embeds: [message]
    })

  }
});

client.login(discordToken);