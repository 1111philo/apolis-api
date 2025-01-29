import { db } from '#src/utils';

export const serviceGuestsSlotted = async ({ service_id = null, guest_id = null } = {}) => {
    await db.connect();

    let queryText = 
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
    ;

    let values = ['Slotted']; // Initial value

    // Ensure service_id is an integer
    if (service_id) {
        service_id = parseInt(service_id, 10);
        values.push(service_id);
        queryText +=  AND guest_services.service_id = $${values.length};
    }

    // Ensure guest_id is an integer
    if (guest_id) {
        guest_id = parseInt(guest_id, 10);
        values.push(guest_id);
        queryText +=  AND guests.guest_id = $${values.length};
    }

    // Execute query
    const rows = (await db.query({ text: queryText, values })).rows;
    
    await db.clean();

    // Return response with debug info
    return {
        rows,
        debug: {
            receivedParams: { service_id, guest_id },
            generatedQuery: queryText,
            queryValues: values
        }
    };
};
