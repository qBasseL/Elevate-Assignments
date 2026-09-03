// producer.ts
import amqp from "amqplib";

async function main() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(
        "user-signup-exchange",
        "fanout",
        {durable: true}
    );

    const event = {
        eventId: "123",
        email: "bassel@example.com",
    };

    channel.publish(
        "user-signup-exchange",
        "",
        Buffer.from(JSON.stringify(event))
    );

    console.log("Published", event);

    setTimeout(() => connection.close(), 500);
}

main();