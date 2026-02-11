class TicketDTO {
  static fromModel(ticket) {
    return {
      id: ticket._id.toString(),
      code: ticket.code,
      purchase_datetime: ticket.purchase_datetime,
      amount: ticket.amount,
      purchaser: ticket.purchaser
    };
  }
}

export { TicketDTO };
