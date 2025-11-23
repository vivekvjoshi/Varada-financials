const handler = require('./netlify/functions/sheet-worker').handler;
(async () => {
    const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '123456',
            advisorName: 'Alice',
            sheetId: '1Qj8bhNSE59Y3cDGww5r1okZ3gt1sXKhxzia4eyD0Mn8'
        })
    };
    const result = await handler(event, {});
    console.log('Result:', result);
})();
