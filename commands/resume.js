const { SlashCommandBuilder } = require('discord.js');
const { hasQueue, getQueue } = require('../musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Retoma a música pausada'),

  async execute(interaction) {
    if (!hasQueue(interaction.guildId)) {
      return interaction.reply({ content: '❌ Não há nada tocando agora.', ephemeral: true });
    }
    const queue = getQueue(interaction.guildId, interaction.channel);
    queue.resume();
    await interaction.reply('▶️ Música retomada.');
  },
};
