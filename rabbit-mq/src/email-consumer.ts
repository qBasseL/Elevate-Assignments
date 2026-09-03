import amqp from "amqplib";

const processedEvents = new Set<string>();

async function main() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(
        "user-signup-exchange",
        "fanout",
        {durable: true}
    );

    await channel.assertQueue("email-service", {durable: true});

    await channel.bindQueue(
        "email-service",
        "user-signup-exchange",
        ""
    );

    channel.consume("email-service", (msg) => {
        if (!msg) return;

        const event = JSON.parse(msg.content.toString());

        // Check if we've already processed this event
        if (processedEvents.has(event.eventId)) {
            console.log("Duplicate event, ignoring:", event.eventId);

            channel.ack(msg);
            return;
        }

        // Business logic
        console.log("EMAIL:", event);

        // Mark as processed
        processedEvents.add(event.eventId);

        // Tell RabbitMQ we're done
        channel.ack(msg);
    });

    console.log("Email consumer started");
}

main();