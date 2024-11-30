import {
  consumerExchangeService,
  consumerQueueService,
} from "./services/messageQueue.service";

// const queue = "test-queue";
// consumerQueueService(queue).then(() => {
//   console.log("Consumer started...");
// });

// const exchangeName = "test-exchange";
// consumerExchangeService(exchangeName).then(() => {
//   console.log("Consumer started...");
// });


const exchangeName = "test-exchange-topic";
consumerExchangeService(exchangeName).then(() => {
  console.log("Consumer started...");
});
