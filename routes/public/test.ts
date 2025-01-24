import { db, event } from '#src/utils'

export const test = async () => {
    // Always connect to the db first, then clean when you're done.
    await db.connect();
    const response = (await db.query({
        text: `SELECT * FROM "users"`,
        values: [],
    })).rows;
    await db.clean();

    // You can access anything like "?id=1&name=user" through the queryStringParameters object like so:
    const id = event.queryStringParameters?.id;
    const name = event.queryStringParameters?.name;

    // You can access anything sent through the body of the request like so:
    const action = event.body?.action;

    console.log(JSON.stringify({ id, name, action }));

    return {
        message: 'Test received!!',
        users: response,
        id,
        name,
        action,
    }
}