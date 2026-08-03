export class DevpostAdapter {
  constructor() {
    this.name = 'Devpost';
  }

  async fetchOpportunities(options = {}) {
    // TODO: Implement Devpost integration
    console.log(`Fetching opportunities from ${this.name}...`);
    return [];
  }
}
