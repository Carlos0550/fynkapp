import { faker } from "@faker-js/faker"
import { useAppContext } from "../Context/AppContext"
import { logic_apis } from "../apis";

const generateDNI = () => faker.number.int({ min: 10000000, max: 49999999 }).toString();

const generateFakeClient = () => ({
    client_fullname: faker.person.fullName(),  
    client_email: faker.internet.email(),  
    client_phone: faker.phone.number('+54 9 ##########'),  
    client_dni: generateDNI(),  
    client_address: faker.location.streetAddress(),  
    client_city: faker.location.city(),  
});

const createClients = async (count = 100) => {
    const clients = Array.from({ length: count }, generateFakeClient);

    for (const client of clients) {
        try {
            const url = new URL(logic_apis.clients + "/create-client");
            const response = await fetch(url,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(client)
            })
            const responseData = await response.json()
            console.log(`✅ Cliente creado: ${responseData}`);
        } catch (error) {
            console.error(`❌ Error creando cliente ${client.fullname}:`, error.response?.data || error.message);
        }
    }
};

export { createClients };