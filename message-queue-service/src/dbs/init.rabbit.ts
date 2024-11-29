import amqp from "amqplib";

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    if (!connection) throw new Error("Failed to connect to RabbitMQ");
    const channel = await connection.createChannel();
    return { channel, connection };
  } catch (error) {
    console.error(error);
  }
};

const connectToRabbitMQToTest = async () => {
  try {
    const result = await connectToRabbitMQ();
    if (result) {
      const { channel, connection } = result;
      const queue = "test-queue";
      const message = "Hello World From File Test Init";
      await channel.assertQueue(queue);
      await channel.sendToQueue(queue, Buffer.from(message));

      //close connection
      await connection.close();
    }
  } catch (error) {
    console.error(error);
  }
};

export { connectToRabbitMQ, connectToRabbitMQToTest };
