import amqp from "amqplib";
const producerDLX = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "notification-queue";
    const exchangeDLXName = "notificationDLX-exchange";
    const routingDLXKey = "notificationDLX-routingKey";

    const queueResult = await channel.assertQueue(queue, {
      durable: true,
      deadLetterExchange: exchangeDLXName,
      deadLetterRoutingKey: routingDLXKey,
    });
    const message = "Product name: iphone 12, price: 1000, quantity: 10";
    channel.sendToQueue(queueResult.queue, Buffer.from(message), {
      expiration: 10000,
    });
    console.log(`Message: ${message} sent to queue: ${queue}`);
  } catch (error) {
    console.error(error);
  }
};

producerDLX();