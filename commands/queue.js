const { SlashCommandBuilder } = require('discord.js');
const { hasQueue, getQueue } = require('../musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Mostra a fila de músicas'),

  async execute(interaction) {
    if (!hasQueue(interaction.guildId)) {
      return interaction.reply({ content: '❌ A fila está vazia.', ephemeral: true });
    }
    const queue = getQueue(interaction.guildId, interaction.channel);
    if (queue.songs.length === 0) {
      return interaction.reply('📭 A fila está vazia.');
    }

    const lista = queue.songs
      .map((song, i) => `${i === 0 ? '🎶 Tocando agora' : `${i}.`} **${song.title}** — pedido por ${song.requestedBy}`)
      .join('\n');

    await interaction.reply(lista);
  },
};
