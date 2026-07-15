const { SlashCommandBuilder } = require('discord.js');
const play = require('play-dl');
const { getQueue } = require('../musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Toca uma música a partir de um link do YouTube ou termo de busca')
    .addStringOption((option) =>
      option
        .setName('busca')
        .setDescription('Link do YouTube ou nome da música')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('busca');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: '❌ Você precisa estar em um canal de voz para usar esse comando.',
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    try {
      let songInfo;

      if (play.yt_validate(query) === 'video') {
        const info = await play.video_info(query);
        songInfo = {
          title: info.video_details.title,
          url: info.video_details.url,
        };
      } else {
        const results = await play.search(query, { limit: 1, source: { youtube: 'video' } });
        if (!results.length) {
          return interaction.editReply('❌ Nenhum resultado encontrado para essa busca.');
        }
        songInfo = { title: results[0].title, url: results[0].url };
      }

      const queue = getQueue(interaction.guildId, interaction.channel);

      if (!queue.connection) {
        await queue.connect(voiceChannel);
      }

      queue.enqueue({
        title: songInfo.title,
        url: songInfo.url,
        requestedBy: interaction.user.username,
      });

      await interaction.editReply(`✅ Adicionado à fila: **${songInfo.title}**`);
    } catch (err) {
      console.error(err);
      await interaction.editReply('⚠️ Ocorreu um erro ao tentar tocar essa música.');
    }
  },
};
