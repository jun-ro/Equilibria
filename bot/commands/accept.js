const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const { response } = require("express");
const fetch = require("node-fetch-commonjs");
const randomCat = require("random-cat-img");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("accept")
    .setDescription("Accepts any forum at your mercy.")
    .addStringOption((option) =>
      option.setName("id").setDescription("Forum ID").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("token")
        .setDescription("hush hush baby w rizz")
        .setRequired(true)
    ),
  async execute(interaction) {
    const id = interaction.options.getString("id");
	const Goodrgb = [0, 255, 0];
	const Goodcolor = (Goodrgb[0] << 16) + (Goodrgb[1] << 8) + Goodrgb[2];
	const Badrgb = [255,0, 0];
	const Badcolor = (Badrgb[0] << 16) + (Badrgb[1] << 8) + Badrgb[2];
    const token = interaction.options.getString("token");
    const cat = await randomCat();
    const catPfp = cat.data.message;
    try {
      await fetch(`http://localhost:3000/acceptForum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          id: id,
          token: token,
        },
      })
	  .then (async response =>{
		if(response.status === 200){
			const okEmbed = new EmbedBuilder()
			.setColor(Goodcolor)
			.setTitle(`Congrats! Successfully accepted the Forum of ${id}`)
			.setImage(catPfp)
			await interaction.reply({embeds: [okEmbed]})
		}
		else if(response.status === 500){
			const badEmbed = new EmbedBuilder()
			.setColor(Badcolor)
			.setTitle(`Forum no longer exist 😢`)
			.setImage("https://media.tenor.com/sVPaeSrkl6oAAAAM/cat-sad.gif")
			await interaction.reply({embeds: [badEmbed]})
		}
	  })
    } catch (error) {
      await interaction.reply(
        `There's been an error ${error} -I'm going fucking insane.`
      );
    }
  },
};
