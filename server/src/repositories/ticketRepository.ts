import { db } from "../config/db";

export const ticketRepository = {
    async findByRaffleId(raffleId: number) {
        const [rows]: any = await db.query(`SELECT * FROM tickets WHERE raffleId = ?`, [raffleId]);
        return rows;
    },
    async findByIds(ids: number[]) {
        if (!ids || ids.length === 0) return [];
        const placeholders = ids.map(() => '?').join(',');
        const [rows]: any = await db.query(
            `SELECT * FROM tickets WHERE id_ticket IN (${placeholders})`,
            ids
        );
        return rows;
    }
    ,

    async find(filter: any) {
        const [rows]: any = await db.query(`SELECT * FROM tickets WHERE ${filter.where}`, [filter.where]);
        return rows;
    },

    async findById(filter: any) {
        const [rows]: any = await db.query(`SELECT * FROM tickets WHERE ${filter.where}`, [filter.where]);
        return rows;
    },

    async create(ticket: any) {
        const { raffleId, userId, price, status } = ticket;
        return {
            id: null,
            raffleId,
            userId,
            price,
            status,
        } as any;
    }
    ,
    async save(ticket: any) {
        const { id_ticket, raffleId, userId, status } = ticket;

        if (!id_ticket) {
            throw new Error("Falta id_ticket para actualizar el ticket");
        }

        const dataToUpdate = {
            raffleId,
            userId,
            status
        };

        return db.query('UPDATE tickets SET ? WHERE id_ticket = ?', [dataToUpdate, id_ticket]);
    }



}