const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  NoSubscriberBehavior,
} = require('@discordjs/voice');
const play = require('play-dl');

// Armazena um "servidor de música" (queue) por guild
const queues = new Map();

class GuildQueue {
  constructor(guildId, textChannel) {
    this.guildId = guildId;
    this.textChannel = textChannel;
    this.connection = null;
    this.player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });
    this.songs = []; // { title, url, requestedBy }
    this.playing = false;

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.songs.shift();
      this.playNext();
    });

    this.player.on('error', (error) => {
      console.error(`Erro no player (guild ${guildId}):`, error);
      this.songs.shift();
      this.playNext();
    });
  }

  async connect(voiceChannel) {
    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: true,
    });

    await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
    this.connection.subscribe(this.player);

    this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
      } catch {
        this.destroy();
      }
    });
  }

  enqueue(song) {
    this.songs.push(song);
    if (!this.playing) this.playNext();
  }

  async playNext() {
    if (this.songs.length === 0) {
      this.playing = false;
      // Sai do canal de voz depois de 60s sem música
      this.idleTimeout = setTimeout(() => {
        if (!this.playing) this.destroy();
      }, 60_000);
      return;
    }

    clearTimeout(this.idleTimeout);
    this.playing = true;
    const song = this.songs[0];

    try {
      const stream = await play.stream(song.url);
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
        inlineVolume: true,
      });
      resource.volume.setVolume(0.5);
      this.player.play(resource);
      this.textChannel.send(`🎶 Tocando agora: **${song.title}** (pedido por ${song.requestedBy})`);
    } catch (err) {
      console.error('Erro ao criar stream:', err);
      this.textChannel.send(`⚠️ Não consegui tocar **${song.title}**, pulando...`);
      this.songs.shift();
      this.playNext();
    }
  }

  skip() {
    this.player.stop(); // dispara o evento Idle -> toca a próxima
  }

  pause() {
    this.player.pause();
  }

  resume() {
    this.player.unpause();
  }

  destroy() {
    this.songs = [];
    this.playing = false;
    if (this.connection) this.connection.destroy();
    queues.delete(this.guildId);
  }
}

function getQueue(guildId, textChannel) {
  if (!queues.has(guildId)) {
    queues.set(guildId, new GuildQueue(guildId, textChannel));
  }
  return queues.get(guildId);
}

function hasQueue(guildId) {
  return queues.has(guildId);
}

module.exports = { getQueue, hasQueue, queues };
