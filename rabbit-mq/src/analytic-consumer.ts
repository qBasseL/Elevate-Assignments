// analytics-consumer.ts
import amqp from "amqplib";

const processedEvents = new Set<string>();

async function main() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(
        "user-signup-exchange",
        "fanout",
        { durable: true }
    );

    await channel.assertQueue("analytics-service", {
        durable: true,
    });

    await channel.bindQueue(
        "analytics-service",
        "user-signup-exchange",
        ""
    );

    channel.consume("analytics-service", (msg) => {
        if (!msg) return;

        const event = JSON.parse(msg.content.toString());

        // Check if this event was already processed
        if (processedEvents.has(event.eventId)) {
            console.log(
                "Duplicate event, ignoring:",
                event.eventId
            );

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