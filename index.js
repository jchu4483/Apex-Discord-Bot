const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Discord.Client();

function showMostRecentStats(res, msg, playerName) {
  const {
    legends,
  } = res.data;
  const embed = new Discord.RichEmbed();

  legends.forEach((legend, i) => {
    legend.stats.forEach((legendStat) => {
      for (const stat in legendStat) {
        if (legendStat.hasOwnProperty(stat)) {
          embed.addField(`${legend.name} - ${stat}`, `${legendStat[stat]}`, true);
          embed.setColor('#f50057');
          embed.setDescription(`Here are the stats for ${playerName}`);
        }
      }
    });
  });
  msg.channel.send(embed);
}

async function makeAPICall(playerName, msg) {
  try {
    await axios.get(`https://www.apexlegendsapi.com/api/v2/player?platform=pc&name=${playerName}`, {
      headers: {
        Authorization: process.env.APEX_API_TOKEN,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          showMostRecentStats(res, msg, playerName);
        }
      });
  } catch (error) {
    console.log(error);
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  if (msg.content.includes('!apexbot')) {
    const playerName = msg.content.split(' ')[1] || null;
    if (playerName) {
      makeAPICall(playerName, msg);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
