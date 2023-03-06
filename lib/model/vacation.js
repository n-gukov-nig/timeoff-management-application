'use strict';

const moment = require('moment');

const DAYS_YEAR = 365;

class Vacation {
  constructor(args) {
    this.user = args.user;
    this.allowance = args.user.department.allowance;
    this.taken_days = args.taken_days;
  }

  get total() {
    return ((this.work_days / DAYS_YEAR) * this.allowance).toFixed(2);
  }

  get totalInt() {
    return Math.floor(this.total);
  }

  get available() {
    return (this.total - this.taken_days).toFixed(2);
  }

  get availableInt() {
    return Math.floor(this.available);
  }

  get used() {
    return this.taken_days;
  }

  get work_days() {
    return Math.ceil(
      moment.duration(moment.utc()).asDays() -
        moment.duration(moment(this.user.start_date)).asDays()
    );
  }

  static promise_vacation(args) {
    const user = args.user;
    let taken_days;

    let flow = Promise.resolve();

    if (user.my_leaves === undefined) {
      const year = moment.utc(moment(), 'YYYY');
      flow = flow.then(() => user.reload_with_leave_details());
    }

    flow = flow.then(() =>
      Promise.resolve(
        (taken_days = user.calculate_number_of_days_taken_from_allowance())
      )
    );

    flow = flow.then(() => {
      args = { ...args, taken_days };
      return new Vacation(args);
    });

    return flow;
  }
}

module.exports = Vacation;
