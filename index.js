/*======*/
const discordToken = "Token"
/*======*/
const Discord = require('discord.js');
const client = new Discord.Client();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const adapterUser = new FileSync('dbUser.json')
const dbUser = low(adapterUser)

function emoreg(msg) {
  return msg.match(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*|\:(.*?)\:/g)
}

function register(msg) {
  let currentEmoji = emoreg(msg.content)
  if (currentEmoji) {
    currentEmoji.forEach((emo) => {
      if (client.emojis.find(emoji => emoji.name === emo.slice(1, -1)) || emo[0] != ":") {
        dbUser.defaults({
          [msg.author.id]: []
        }).write()
        if (emo == "❤" || emo == "♥") {
          emo = "❤️"
        }
        let currentUser = dbUser.get(msg.author.id).find({
          type: emo
        }).value()
        if (currentUser) {
          dbUser.get(msg.author.id)
            .find({
              type: emo
            })
            .assign({
              amount: currentUser.amount + 1
            })
            .write()
        } else {
          dbUser.get(msg.author.id)
            .push({
              amount: 1,
              type: emo
            })
            .write()
        }
        let current = db.get(msg.guild.id).find({
          type: emo
        }).value()
        if (current) {
          db.get(msg.guild.id)
            .find({
              type: emo
            })
            .assign({
              amount: current.amount + 1
            })
            .write()
        } else {
          db.get(msg.guild.id)
            .push({
              amount: 1,
              type: emo
            })
            .write()
        }
      }
    })
  }
}

function readMessageChannel(channel, lastMess) {
  channel.fetchMessages({
    limit: 100,
    before: lastMess
  }).then((msg) => {
    let leng = msg.array().length
    if (leng > 0) {
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

client.on("guildCreate", (guild) => {
  db.defaults({
      [guild.id]: []
    })
    .write()
  if (db.get(guild.id).size().value() == 0) {
    guild.channels.forEach((el, id) => {
      if (el.type == 'text') {
        readMessageChannel(el, el.lastMessageID)
      }
    })

  }
})


client.on('ready', () => {
  client.user.setActivity("?topemo | ?myemo")
  console.log(`Logged in as ${client.user.tag}!`);
  db.defaults({
    "347299107573858306": []
  }).write()
  client.guilds.forEach((el) => {
    db.defaults({
      [el.id]: []
    }).write()

    if (db.get(el.id).size().value() == 0) {
      el.channels.forEach((el, id) => {
        if (el.type == 'text') {
          console.log("Channel:" + el.name)
          readMessageChannel(el, el.lastMessageID)
        }
      })

    }
  })
});


client.on('message', msg => {
  if (!msg.author.bot) {
    register(msg)
  }
  if (msg.content == "?resync" && (msg.member.hasPermission("ADMINISTRATOR"))) {
    msg.delete()
    db.get(msg.guild.id)
      .remove()
      .write()

    db.defaults({
      [msg.guild.id]: []
    }).write()

    msg.guild.channels.forEach((el, id) => {
      if (el.type == 'text') {
        readMessageChannel(el, el.lastMessageID)
      }
    })
  }
  if (msg.content == "?myemo") {
    msg.delete()
    let topito = dbUser.get(msg.author.id).orderBy('amount').reverse().take(10).value()
    let one, two, three, four, five, six, seven, heigh, nine, ten
    let oneA, twoA, threeA, fourA, fiveA, sixA, sevenA, heighA, nineA, tenA
    topito[0] ? (one = msg.guild.emojis.find(emoji => emoji.name == topito[0].type.slice(1, -1)) || topito[0].type, oneA = topito[0].amount) : (one = "Rien", oneA = "0");
    topito[1] ? (two = msg.guild.emojis.find(emoji => emoji.name == topito[1].type.slice(1, -1)) || topito[1].type, twoA = topito[1].amount) : (two = "Rien", twoA = "0");
    topito[2] ? (three = msg.guild.emojis.find(emoji => emoji.name == topito[2].type.slice(1, -1)) || topito[2].type, threeA = topito[2].amount) : (three = "Rien", threeA = "0");
    topito[3] ? (four = msg.guild.emojis.find(emoji => emoji.name == topito[3].type.slice(1, -1)) || topito[3].type, fourA = topito[3].amount) : (four = "Rien", fourA = "0");
    topito[4] ? (five = msg.guild.emojis.find(emoji => emoji.name == topito[4].type.slice(1, -1)) || topito[4].type, fiveA = topito[4].amount) : (five = "Rien", fiveA = "0");
    topito[5] ? (six = msg.guild.emojis.find(emoji => emoji.name == topito[5].type.slice(1, -1)) || topito[5].type, sixA = topito[5].amount) : (six = "Rien", sixA = "0");
    topito[6] ? (seven = msg.guild.emojis.find(emoji => emoji.name == topito[6].type.slice(1, -1)) || topito[6].type, sevenA = topito[6].amount) : (seven = "Rien", sevenA = "0");
    topito[7] ? (heigh = msg.guild.emojis.find(emoji => emoji.name == topito[7].type.slice(1, -1)) || topito[7].type, heighA = topito[7].amount) : (heigh = "Rien", heighA = "0");
    topito[8] ? (nine = msg.guild.emojis.find(emoji => emoji.name == topito[8].type.slice(1, -1)) || topito[8].type, nineA = topito[8].amount) : (nine = "Rien", nineA = "0");
    topito[9] ? (ten = msg.guild.emojis.find(emoji => emoji.name == topito[9].type.slice(1, -1)) || topito[9].type, tenA = topito[9].amount) : (ten = "Rien", tenA = "0");

    msg.channel.send({
      embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "Top emoji de " + msg.author.username,
        fields: [{
            name: "#1: " + one,
            value: oneA + ' fois'
          },
          {
            name: "#2: " + two,
            value: twoA + ' fois'
          },
          {
            name: "#3: " + three,
            value: threeA + ' fois'
          },
          {
            name: "#4: " + four,
            value: fourA + ' fois'
          },
          {
            name: "#5: " + five,
            value: fiveA + ' fois'
          },
          {
            name: "#6: " + six,
            value: sixA + ' fois'
          },
          {
            name: "#7: " + seven,
            value: sevenA + ' fois'
          },
          {
            name: "#8: " + heigh,
            value: heighA + ' fois'
          },
          {
            name: "#9: " + nine,
            value: nineA + ' fois'
          },
          {
            name: "#10: " + ten,
            value: tenA + ' fois'
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© someone who did it "
        }
      }

    })
  }

  if (msg.content == "?topemo") {
    msg.delete()
    let topito = db.get(msg.guild.id).orderBy('amount').reverse().take(10).value()
    let one, two, three, four, five, six, seven, heigh, nine, ten
    let oneA, twoA, threeA, fourA, fiveA, sixA, sevenA, heighA, nineA, tenA
    topito[0] ? (one = msg.guild.emojis.find(emoji => emoji.name == topito[0].type.slice(1, -1)) || topito[0].type, oneA = topito[0].amount) : (one = "Rien", oneA = "0");
    topito[1] ? (two = msg.guild.emojis.find(emoji => emoji.name == topito[1].type.slice(1, -1)) || topito[1].type, twoA = topito[1].amount) : (two = "Rien", twoA = "0");
    topito[2] ? (three = msg.guild.emojis.find(emoji => emoji.name == topito[2].type.slice(1, -1)) || topito[2].type, threeA = topito[2].amount) : (three = "Rien", threeA = "0");
    topito[3] ? (four = msg.guild.emojis.find(emoji => emoji.name == topito[3].type.slice(1, -1)) || topito[3].type, fourA = topito[3].amount) : (four = "Rien", fourA = "0");
    topito[4] ? (five = msg.guild.emojis.find(emoji => emoji.name == topito[4].type.slice(1, -1)) || topito[4].type, fiveA = topito[4].amount) : (five = "Rien", fiveA = "0");
    topito[5] ? (six = msg.guild.emojis.find(emoji => emoji.name == topito[5].type.slice(1, -1)) || topito[5].type, sixA = topito[5].amount) : (six = "Rien", sixA = "0");
    topito[6] ? (seven = msg.guild.emojis.find(emoji => emoji.name == topito[6].type.slice(1, -1)) || topito[6].type, sevenA = topito[6].amount) : (seven = "Rien", sevenA = "0");
    topito[7] ? (heigh = msg.guild.emojis.find(emoji => emoji.name == topito[7].type.slice(1, -1)) || topito[7].type, heighA = topito[7].amount) : (heigh = "Rien", heighA = "0");
    topito[8] ? (nine = msg.guild.emojis.find(emoji => emoji.name == topito[8].type.slice(1, -1)) || topito[8].type, nineA = topito[8].amount) : (nine = "Rien", nineA = "0");
    topito[9] ? (ten = msg.guild.emojis.find(emoji => emoji.name == topito[9].type.slice(1, -1)) || topito[9].type, tenA = topito[9].amount) : (ten = "Rien", tenA = "0");

    msg.channel.send({
      embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "Top emoji du serveur",
        fields: [{
            name: "#1: " + one,
            value: oneA + ' fois'
          },
          {
            name: "#2: " + two,
            value: twoA + ' fois'
          },
          {
            name: "#3: " + three,
            value: threeA + ' fois'
          },
          {
            name: "#4: " + four,
            value: fourA + ' fois'
          },
          {
            name: "#5: " + five,
            value: fiveA + ' fois'
          },
          {
            name: "#6: " + six,
            value: sixA + ' fois'
          },
          {
            name: "#7: " + seven,
            value: sevenA + ' fois'
          },
          {
            name: "#8: " + heigh,
            value: heighA + ' fois'
          },
          {
            name: "#9: " + nine,
            value: nineA + ' fois'
          },
          {
            name: "#10: " + ten,
            value: tenA + ' fois'
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© someone who did it "
        }
      }

    })
  }
});

client.login(discordToken);