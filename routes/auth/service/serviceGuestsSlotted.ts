import { db } from '#src/utils';

export const serviceGuestsSlotted = async (req) => {
    try {
        await db.connect();

        // Extract parameters safely
        const { service_id = null, guest_id = null } = req.body || {}; 

        // Debugging: Log received parameters
        const debugLog = {
            receivedParams: { service_id, guest_id },
            requestBody: req.body || null
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

        // Validate and append `service_id`
        if (service_id !== null) {
            const parsedServiceId = parseInt(service_id, 10);
            if (isNaN(parsedServiceId)) throw new Error(`Invalid service_id: ${service_id}`);
            values.push(parsedServiceId);
            queryText += ` AND guest_services.service_id = $${values.length}`;
        }

        // Validate and append `guest_id`
        if (guest_id !== null) {
            const parsedGuestId = parseInt(guest_id, 10);
            if (isNaN(parsedGuestId)) throw new Error(`Invalid guest_id: ${guest_id}`);
            values.push(parsedGuestId);
            queryText += ` AND guests.guest_id = $${values.length}`;
        }

        // Execute query
        const result = await db.query({ text: queryText, values });
        const rows = result.rows;

        await db.clean();

        // Return response with debug info
        return {
            rows,
            debug: {
                ...debugLog,
                generatedQuery: queryText,
                queryValues: values
            }
        };

    } catch (error) {
        console.error("❌ Internal Server Error:", error);

        return {
            error: "Internal Server Error",
            message: error.message,
            debug: {
                receivedParams: req.body || null
            }
        };
    }
};
