import { db } from '#src/utils';

export const serviceGuestsSlotted = async (req) => {
    try {
        await db.connect();

        // Ensure request body exists
        const { service_id = null, guest_id = null } = req.body || {};

        // Debugging: Log request body to confirm the API is receiving it
        const debugLog = {
            receivedParams: { service_id, guest_id },
            requestBody: req.body // Check if the request body is null or undefined
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
            const parsedServiceId = parseInt(service_id, 10);
            if (isNaN(parsedServiceId)) throw new Error(`Invalid service_id: ${service_id}`);
            values.push(parsedServiceId);
            queryText += ` AND guest_services.service_id = $${values.length}`;
        }

        if (guest_id) {
            const parsedGuestId = parseInt(guest_id, 10);
            if (isNaN(parsedGuestId)) throw new Error(`Invalid guest_id: ${guest_id}`);
            values.push(parsedGuestId);
            queryText += ` AND guests.guest_id = $${values.length}`;
        }

        // Execute query
        const rows = (await db.query({ text: queryText, values })).rows;
        await db.clean();

        // Return API response with debug info
        return {
            rows,
            debug: {
                ...debugLog,
                generatedQuery: queryText,
                queryValues: values
            }
        };
    } catch (error) {
        console.error("Error in serviceGuestsSlotted:", error);

        return {
            error: "Internal Server Error",
            message: error.message,
            debug: {
                receivedParams: req.body || null
            }
        };
    }
};
