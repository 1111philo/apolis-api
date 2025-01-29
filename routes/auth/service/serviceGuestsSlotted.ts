import { db, event } from '#src/utils';

export const serviceGuestsSlotted = async ({ service_id = null, guest_id = null } = {}) => {
    await db.connect();
    
    const query = {
        text: `
            SELECT 
                guests.guest_id,
                guests.first_name,
                guests.last_name,
                guests.dob,
                guests.case_manager,
                guest_services.service_id,
                guest_services.slot_id AS slot_number, -- Include slot ID
                guest_services.status,
                guest_services.queued_at
            FROM guests
            INNER JOIN guest_services ON guests.guest_id = guest_services.guest_id
            WHERE guest_services.status = $1
            ${service_id ? "AND guest_services.service_id = $2" : ""}
            ${guest_id ? "AND guests.guest_id = $3" : ""}
        `,
        values: ['Slotted', ...(service_id ? [service_id] : []), ...(guest_id ? [guest_id] : [])]
    };

    const rows = (await db.query(query)).rows;
    await db.clean();
    return rows;
};
