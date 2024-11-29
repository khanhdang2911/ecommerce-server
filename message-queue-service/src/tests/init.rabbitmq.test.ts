import { connectToRabbitMQToTest } from "../dbs/init.rabbit";

describe("Test RabbitMQ", () => {
  it("Should connect to RabbitMQ", async () => {
    const result = await connectToRabbitMQToTest();
    expect(result).toBeUndefined();
  });
});
