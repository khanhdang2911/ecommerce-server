import { connectToRabbitMQ, consumerExchange, consumerQueue } from "~/dbs/init.rabbit";

const consumerQueueService = async (queue: string) => {
  try {
    const result = await connectToRabbitMQ();
    if (!result) {
      throw new Error("Failed to connect to RabbitMQ");
    }
    const { channel } = result;
    await consumerQueue(channel, queue);
  } catch (error) {
    console.error(error);
  }
};
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
}
export { consumerQueueService, consumerExchangeService };
