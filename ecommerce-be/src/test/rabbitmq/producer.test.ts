import amqp from "amqplib";

// const sendMessage = async () => {
//   try {
//     const connection = await amqp.connect("amqp://localhost");
//     const channel = await connection.createChannel();
//     const queue = "test-queue";
//     await channel.assertQueue(queue, { durable: true });
//     const message = "Product name: iphone 12, price: 1000, quantity: 10";
//     channel.sendToQueue(queue, Buffer.from(message), {
//       expiration: 10000,
//     });
//     console.log(`Message: ${message} sent to queue: ${queue}`);
//   } catch (error) {
//     console.error(error);
//   }
// };

//send message with fanout exchange
// const sendMessage = async () => {
//   try {
//     const connection = await amqp.connect("amqp://localhost");
//     const channel = await connection.createChannel();
//     const exchangeName = "test-exchange";
//     await channel.assertExchange(exchangeName, "fanout", {
//       durable: true,
//     });
//     const message = process.argv[2].toString() || "Hello World";
//     //bind exchange to queue
//     await channel.publish(exchangeName, "", Buffer.from(message));
//     console.log(`Message: ${message} sent by exchange name: ${exchangeName}`);
//   } catch (error) {
//     console.error(error);
//   }
// };

//send message with topic exchange
const sendMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchangeName = "test-exchange-topic";
    await channel.assertExchange(exchangeName, "topic", {
      durable: true,
    });
    const message = process.argv[2].toString() || "Hello World";
    const topic = process.argv[3].toString() || "test";
    //bind exchange to queue
    await channel.publish(exchangeName, topic, Buffer.from(message), {
      persistent: true,
    });
    console.log(
      `Message: ${message} sent by exchange name: ${exchangeName} and topic: ${topic}`
    );
  } catch (error) {
    console.error(error);
  }
};

sendMessage().catch(console.error);
