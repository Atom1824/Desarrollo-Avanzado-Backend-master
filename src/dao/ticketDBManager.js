import { ticketModel } from "./models/ticketModel.js";

class ticketDBManager {
  async createTicket(ticketData) {
    return ticketModel.create(ticketData);
  }

  async getTicketByCode(code) {
    const ticket = await ticketModel.findOne({ code });
    if (!ticket) throw new Error(`El ticket ${code} no existe!`);
    return ticket;
  }
}

export { ticketDBManager };
