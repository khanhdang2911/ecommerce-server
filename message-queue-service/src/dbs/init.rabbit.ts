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

const consumerQueue = async (channel: amqp.Channel, queue: string) => {
  try {
    await channel.assertQueue(queue, {
      durable: true,
    });
    await channel.consume(
      queue,
      (message) => {
        console.log("Received message::", message?.content.toString());
        //1. find user following the shop
        //2. send notification to user
        //3. yes ==> success
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

//Send message to exchange, use fanout exchange
// const consumerExchange = async (
//   channel: amqp.Channel,
//   exchangeName: string
// ) => {
//   try {
//     await channel.assertExchange(exchangeName, "fanout", {
//       durable: true,
//     });
//     //binding queue to exchange
//     const { queue } = await channel.assertQueue("", {
//       exclusive: true,
//     });
//     console.log("Queue name::", queue);
//     await channel.bindQueue(queue, exchangeName, "");
//     await channel.consume(
//       queue,
//       (message) => {
//         console.log("Received message::", message?.content.toString());
//       },
//       {
//         noAck: true,
//       }
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };

//send message to exchange, use topic exchange
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
  connectToRabbitMQToTest,
  consumerQueue,
  consumerExchange,
};
