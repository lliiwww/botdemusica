const { SlashCommandBuilder } = require('discord.js');
const { hasQueue, getQueue } = require('../musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Para a música e limpa a fila'),

  async execute(interaction) {
    if (!hasQueue(interaction.guildId)) {
      return interaction.reply({ content: '❌ Não há nada tocando agora.', ephemeral: true });
    }
    const queue = getQueue(interaction.guildId, interaction.channel);
    queue.destroy();
    await interaction.reply('⏹️ Reprodução interrompida e fila limpa.');
  },
};
