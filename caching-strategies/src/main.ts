import {createClient} from "redis";

const bootstrap = async () => {
    const client = createClient({
        url: "rediss://default:gQAAAAAAAWYHAAIgcDE4ZmNmOWVhNmUwNjA0YTdkODUwMGQ1YTE1ZGU1NzYxMA@direct-wasp-91655.upstash.io:6379"
    });

    client.on("ready", () => {
        console.log("Ready");
    });

    client.on("error", (err) => {
        console.error(err.message);
    });

    client.on("connect", () => {
        console.log("Client connected");
    });

    await client.connect();

    //strings

    const cacheProduct = async (productId: string, product: any) => {
        const key = `product_${productId}`;
        const value = JSON.stringify(product);

        await client.set(key, value);
    };

    await cacheProduct("123", {
        name: "iPhone",
        price: 1000
    });

    const getProduct = async (productId: string) => {
        const key = `product_${productId}`;
        const value = await client.get(key);
        if (!value) return null;
        return JSON.parse(value);
    }

    console.log(await getProduct("123"));

    //hash type


    const createSession = async (sessionId: string, fields: any) => {
        const key = `session_${sessionId}`;
        return await client.hSet(key, fields);
    }

    const getSessionField = async (sessionId: string, field: any) => {
        const key = `session_${sessionId}`;
        const value = await client.hGet(key, field);
        if (!value) return null;
        return value
    }

    const getSession = async (sessionId: string) => {
        const key = `session_${sessionId}`;
        const value = await client.hGetAll(key);
        if (!value) return null;
        return value
    }

    await createSession("123", {name: "bassel", age: 21, salary: 75000})
    await createSession("124", {name: "ِAlaa", age: 56, salary: 175000})

    console.log(await getSessionField('123', "name"))
    console.log(await getSession('123'))
    console.log(await getSession('124'))

};

bootstrap();