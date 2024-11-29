import amqp from "amqplib";

const sendMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "test-queue";
    await channel.assertQueue(queue, { durable: true });
    const message = "Hello World From RabbitMQ";
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Message: ${message} sent to queue: ${queue}`);
  } catch (error) {
    console.error(error);
  }
};

sendMessage().catch(console.error);
