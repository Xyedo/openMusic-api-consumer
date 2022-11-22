require("dotenv").config();
const amqp = require("amqplib");
const PlaylistsService = require("./playlistService");
const MailSender = require("./mailSender");
const Listener = require("./listener");

const playlistQueue = "export:playlist";

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(playlistQueue, {
    durable: true,
  });
  
  channel.consume(playlistQueue, listener.listen, { noAck: true });
};

init();
