"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// producer.ts
const amqplib_1 = __importDefault(require("amqplib"));
async function main() {
    const connection = await amqplib_1.default.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange("user-signup-exchange", "fanout", { durable: true });
    const event = {
        eventId: "123",
        email: "bassel@example.com",
    };
    channel.publish("user-signup-exchange", "", Buffer.from(JSON.stringify(event)));
    console.log("Published", event);
    setTimeout(() => connection.close(), 500);
}
main();
//# sourceMappingURL=main.js.map