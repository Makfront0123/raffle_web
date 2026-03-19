import axios from "axios";

const URL = "http://localhost:4000/api/payment/wompi/test";

async function simulateUser(i: number) {
    try {
        const base = i * 3;
        const res = await axios.post(URL, {
            userId: 105,
            raffle_id: 1, ticket_ids: [base + 1, base + 2, base + 3],
            reference: `TEST_${i}_${Date.now()}`,
            method: "CARD"
        });


        console.log(`Usuario ${i} OK`, res.data);
    } catch (err: any) {


        if (err.response) {
            console.log("STATUS:", err.response.status);
            console.log("DATA:", err.response.data);
        } else {
            console.log("MESSAGE:", err.message);
        }
    }
}

async function run() {
    const USERS = 50;

    await Promise.all(
        Array.from({ length: USERS }, (_, i) => simulateUser(i + 1))
    );

    console.log("Test terminado");
}

run();