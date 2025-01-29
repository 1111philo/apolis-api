import { db } from '#src/utils';

export const serviceGuestsSlotted = async ({ service_id = null, guest_id = null } = {}) => {
    await db.connect();

    console.log("Received parameters:", { service_id, guest_id });

    // Base query
    let queryText = `
        SELECT 
            guests.guest_id,
            guests.first_name,
            guests.last_name,
            guests.dob,
            guests.case_manager,
            guest_services.service_id,
            guest_services.slot_id AS slot_number,
            guest_services.status,
            guest_services.queued_at
        FROM guests
        INNER JOIN guest_services ON guests.guest_id = guest_services.guest_id
        WHERE guest_services.status = $1
    `;

    let values = ['Slotted']; // Initial value

    // Add filtering dynamically
    if (service_id) {
        values.push(service_id);
        queryText += ` AND guest_services.service_id = $${values.length}`;
    }

    if (guest_id) {
        values.push(guest_id);
        queryText += ` AND guests.guest_id = $${values.length}`;
    }

    console.log("Executing query:", queryText);
    console.log("Query values:", values);

    const rows = (await db.query({ text: queryText, values })).rows;
    
    await db.clean();
    
    console.log("API Response:", rows);
    return rows;
};
