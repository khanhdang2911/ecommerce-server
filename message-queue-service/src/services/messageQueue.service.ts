import {
  connectToRabbitMQ,
  consumerExchange,
} from "~/dbs/init.rabbit";

const consumerExchangeService = async (exchangeName: string) => {
  try {
    const result = await connectToRabbitMQ();
    if (!result) {
      throw new Error("Failed to connect to RabbitMQ");
    }
    const { channel } = result;
    await consumerExchange(channel, exchangeName);
  } catch (error) {
    console.error(error);
  }
};

const receiveNotificationNormal = async () => {
  try {
    const result = await connectToRabbitMQ();
    if (!result) {
      throw new Error("Failed to connect to RabbitMQ");
    }
    const { channel } = result;
    const queue = "notification-queue";
    channel.consume(queue, (message) => {
      try {
        const randomNumber = Math.random();
        console.log("Random number::", randomNumber);
        if (randomNumber < 0.8) {
          throw new Error("Failed to process message");
        }
        console.log("Received message::", message?.content.toString());
        channel.ack(message!);
      } catch (error: any) {
        console.log("Error::", error.message);
        if (message) {
          channel.nack(message, false, true);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const receiveNotificationFailed = async () => {
  try {
    const result = await connectToRabbitMQ();
    if (!result) {
      throw new Error("Failed to connect to RabbitMQ");
    }
    const { channel } = result;
    const exchangeDLXName = "notificationDLX-exchange";
    const routingDLXKey = "notificationDLX-routingKey";
    const notiQueueDLX = "notificationDLX-queue";
    await channel.assertExchange(exchangeDLXName, "direct", {
      durable: true,
    });
    await channel.assertQueue(notiQueueDLX, {
      exclusive: false,
    });
    await channel.bindQueue(notiQueueDLX, exchangeDLXName, routingDLXKey);
    await channel.consume(
      notiQueueDLX,
      (message) => {
        console.log("Received message failed::", message?.content.toString());
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
  consumerExchangeService,
  receiveNotificationNormal,
  receiveNotificationFailed,
};
