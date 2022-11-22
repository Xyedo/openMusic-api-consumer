class Listener {
  constructor(playlistService, mailSender) {
    this.playlistService = playlistService;
    this.mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const playlist = await this.playlistService.getPlaylistById(playlistId);
      const result = await this.mailSender.sendEmail(targetEmail, {
        content: JSON.stringify(playlist),
        filename: playlistId,
      });

      // eslint-disable-next-line no-console
      console.log(result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}

module.exports = Listener;
