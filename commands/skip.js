const { SlashCommandBuilder } = require('discord.js');
const { hasQueue, getQueue } = require('../musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Pula a música atual'),

  async execute(interaction) {
    if (!hasQueue(interaction.guildId)) {
      return interaction.reply({ content: '❌ Não há nada tocando agora.', ephemeral: true });
    }
    const queue = getQueue(interaction.guildId, interaction.channel);
    queue.skip();
    await interaction.reply('⏭️ Música pulada.');
  },
};
