/*********************************************/
/* https://m.wikihow.com/Calculate-Mortgage-Payments*/
/*********************************************/
class MortgageCalculator {
    constructor(
        initial_principal,
        nominal_interest_rate,  // in percentage, annually
        nominal_amortization_period_years,
        down_payment = 0
    ) {
        this.initial_principal = (down_payment) ? initial_principal - down_payment : initial_principal;
        this.nominal_interest_rate = nominal_interest_rate;  // in percentage
        this.nominal_amortization_period_years = nominal_amortization_period_years;
        this.monthly_interest_rate = nominal_interest_rate / 12 / 100;
        this.number_of_payments = nominal_amortization_period_years * 12;
    }

    get monthly_periodic_payment() {
        const rate_plus_1 = this.monthly_interest_rate + 1;
        const rate_plus_1_power_of = Math.pow(rate_plus_1, this.number_of_payments);
        const numerators = this.monthly_interest_rate * rate_plus_1_power_of;
        const denominators = rate_plus_1_power_of - 1;
        const fraction = numerators / denominators;
        return this.initial_principal * fraction;
    }

    periodic_payment(period){
        switch (period) {
            case 'monthly':
                return this.monthly_periodic_payment;
            case 'semi-monthly':  // basically the same as accelerated_bi-weekly (cannot find the exact calculation online)
                return this.monthly_periodic_payment * 12 / 24;
            case 'accelerated_weekly':
                return this.monthly_periodic_payment / 4;
            case 'accelerated_bi-weekly':
                return this.monthly_periodic_payment / 2;
            case 'weekly':  // 12 months => 52 weeks in a year
                return this.monthly_periodic_payment * 12 / 52;
            case 'bi-weekly':  // 12 months => 26 payments if doing bi weekly since there are 52 weeks in a year
                return this.monthly_periodic_payment * 12 / 26;
        }
    }

    get show_all_periodic_payment(){
        return {
            monthly: this.periodic_payment('monthly'),
            semiMonthly: this.periodic_payment('semi-monthly'),
            acceleratedWeekly: this.periodic_payment('accelerated_weekly'),
            acceleratedBiWeekly: this.periodic_payment('accelerated_bi-weekly'),
            weekly: this.periodic_payment('weekly'),
            biWeekly: this.periodic_payment('bi-weekly'),
        }
    }
}

module.exports = MortgageCalculator;

// console.log('-------------class below-----------------');
// const mc = new MortgageCalculator(100000, 2.97, 25);
// console.log(mc.periodic_payment('monthly'), 'periodic_payment  month');
// console.log(mc.periodic_payment('semi-monthly'), 'periodic_payment semi-month');
// console.log(mc.periodic_payment('accelerated_weekly'), 'periodic_payment accelerated_weekly');
// console.log(mc.periodic_payment('accelerated_bi-weekly'), 'periodic_payment accelerated_bi-weekly');
// console.log(mc.periodic_payment('weekly'), 'periodic_payment weekly');
// console.log(mc.periodic_payment('bi-weekly'), 'periodic_payment bi-weekly');

// console.log(mc.show_all_periodic_payment);
