export default class Expense {
  constructor(id, description, amount, paidBy, participants) {
    this.id = id;
    this.description = description;
    this.amount = amount;
    this.paidBy = paidBy;
    this.participants = participants;
    this.splitAmount = amount / participants.length;
  }
}
