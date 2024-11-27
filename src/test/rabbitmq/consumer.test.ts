import amqp from "amqplib";

const consumeMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "test-queue";
    await channel.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in queue: ${queue}`);
    channel.consume(queue, (message) => {
      if (message) {
        console.log(`Received message ${message.content.toString()}`);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

consumeMessage().catch(console.error);
