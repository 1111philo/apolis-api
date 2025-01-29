import { db } from '#src/utils';

export const serviceGuestsSlotted = async (req) => {
    await db.connect();

    const { service_id = null, guest_id = null } = req.body || {}; // <-- Ensure request body is used correctly

    // Debugging: Log incoming data
    const debugLog = {
        receivedParams: { service_id, guest_id },
        requestBody: req.body // <-- Log full request body
    };

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

    if (service_id) {
        values.push(parseInt(service_id, 10)); // Ensure it's an integer
        queryText += ` AND guest_services.service_id = $${values.length}`;
    }

    if (guest_id) {
        values.push(parseInt(guest_id, 10));
        queryText += ` AND guests.guest_id = $${values.length}`;
    }

    const rows = (await db.query({ text: queryText, values })).rows;
    await db.clean();

    // Return API response with debug info
    return {
        rows,
        debug: {
            ...debugLog, // Include request body and received parameters
            generatedQuery: queryText,
            queryValues: values
        }
    };
};
