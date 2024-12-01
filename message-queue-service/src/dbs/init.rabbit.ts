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

const consumerExchange = async (
  channel: amqp.Channel,
  exchangeName: string
) => {
  try {
    await channel.assertExchange(exchangeName, "topic", {
      durable: true,
    });
    //binding queue to exchange
    const { queue } = await channel.assertQueue("", {
      exclusive: true,
    });
    console.log("Queue name::", queue);
    const topic = process.argv[2].toString() || "#test";
    console.log("Topic::", topic);
    await channel.bindQueue(queue, exchangeName, topic);
    await channel.consume(
      queue,
      (message) => {
        console.log("Received message::", message?.content.toString());
        console.log("Routing key::", message?.fields.routingKey);
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
};



export {
  connectToRabbitMQ,
  consumerExchange,
};
