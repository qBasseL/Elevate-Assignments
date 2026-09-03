"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// analytics-consumer.ts
const amqplib_1 = __importDefault(require("amqplib"));
const processedEvents = new Set();
async function main() {
    const connection = await amqplib_1.default.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange("user-signup-exchange", "fanout", { durable: true });
    await channel.assertQueue("analytics-service", {
        durable: true,
    });
    await channel.bindQueue("analytics-service", "user-signup-exchange", "");
    channel.consume("analytics-service", (msg) => {
        if (!msg)
            return;
        const event = JSON.parse(msg.content.toString());
        // Check if this event was already processed
        if (processedEvents.has(event.eventId)) {
            console.log("Duplicate event, ignoring:", event.eventId);
            channel.ack(msg);
            return;
        }
        // Business logic
        console.log("ANALYTICS:", event);
        // Mark event as processed
        processedEvents.add(event.eventId);
        // Tell RabbitMQ we successfully processed it
        channel.ack(msg);
    });
    console.log("Analytics consumer started");
}
main();
//# sourceMappingURL=analytic-consumer.js.map