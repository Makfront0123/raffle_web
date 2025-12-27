import { AppDataSource } from "../data-source";
import { Ticket } from "../entities/ticket.entity";
import { In } from "typeorm";

const repo = AppDataSource.getRepository(Ticket);

export const ticketRepository = {
  findByRaffleId(raffleId: number) {
    return repo.find({
      where: { raffle: { id: raffleId } },
    });
  },

  findByIds(ids: number[]) {
    if (!ids.length) return [];
    return repo.find({
      where: { id_ticket: In(ids) },
    });
  },

  findById(id: number) {
    return repo.findOne({
      where: { id_ticket: id },
    });
  },

  save(ticket: Ticket) {
    return repo.save(ticket);
  },
};
