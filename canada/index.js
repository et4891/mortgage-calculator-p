/*********************************************/
/* http://www.yorku.ca/amarshal/mortgage.htm
 * found the calculation here for monthly, accelerated weekly
 * weekly and bi-weekly calculation is found some where else (https://youtu.be/auS2HWiWD9w) */
/*********************************************/
class MortgageCalculator {
    constructor(
        initial_principal,
        nominal_interest_rate,  // in percentage
        nominal_amortization_period_years,
        down_payment = 0
    ) {
        this.initial_principal = (down_payment) ? initial_principal - down_payment : initial_principal;
        this.nominal_interest_rate = nominal_interest_rate;  // in percentage
        this.nominal_amortization_period_years = nominal_amortization_period_years;
    }

    // this only happens in canada's mortgage system
    get effective_annual_rate() {
        // (1+periodic_interest_rate_monthly)^12-1)
        let result = 1 + this.periodic_interest_rate('monthly');
        result = Math.pow(result, 12);
        result = result - 1;
        result *= 100;
        // console.log(result.toFixed(2), 'effective_annual_rate');
        return result;
    }

    get monthly_periodic_payment() {
        const monthly_periodic_payment_numerators = (this.initial_principal * this.periodic_interest_rate('monthly'));
        let monthly_periodic_payment_denominators = (1 + this.periodic_interest_rate('monthly'));
        // monthly_periodic_payment_denominators = Math.pow(monthly_periodic_payment_denominators, -Math.abs(this.months_to_amortization));
        monthly_periodic_payment_denominators = Math.pow(monthly_periodic_payment_denominators, -Math.abs(this.number_of_payments('monthly')));
        monthly_periodic_payment_denominators = 1 - monthly_periodic_payment_denominators;

        const result = monthly_periodic_payment_numerators / monthly_periodic_payment_denominators;
        // console.log(result, 'monthly_periodic_payment');
        return result;
    }

    get show_periodic_interest_rate() {
        const monthly = this.periodic_interest_rate('monthly');
        const semiMonthly = this.periodic_interest_rate('semi-monthly');
        const accelerated_weekly = this.periodic_interest_rate('accelerated_weekly');
        const accelerated_biWeekly = this.periodic_interest_rate('accelerated_bi-weekly');
        const biWeekly = this.periodic_interest_rate('bi-weekly');

        const annual = monthly * 12;
        return { monthly, semiMonthly, accelerated_weekly, accelerated_biWeekly, biWeekly, annual };
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

    number_of_payments(period){
        switch (period) {
            case 'monthly':
                return this.nominal_amortization_period_years * 12;
            case 'semi-monthly':
                return this.nominal_amortization_period_years * 12 * 2;
            case 'accelerated_weekly':
                return this.nominal_amortization_period_years * 12 * 4;
            case 'accelerated_bi-weekly':
                return this.nominal_amortization_period_years * 12 * 2;
            case 'weekly':
                return this.nominal_amortization_period_years * 52;
            case 'bi-weekly':
                return this.nominal_amortization_period_years * 52 / 2;
        }
    }

    periodic_interest_rate(period) {
        let result = (1 + (this.nominal_interest_rate / 100 / 2));  // divided by another 100 because need percentage in decimal
        result = Math.pow(result, 2);

        switch(period){
            case 'monthly':
                result = Math.pow(result, (1 / 12));
                break;
            case 'semi-monthly':
                result = Math.pow(result, (1 / 26));
                break;
            case 'accelerated_weekly':
                result = Math.pow(result, (7 / 365));
                break;
            case 'accelerated_bi-weekly':
                result = Math.pow(result, (14 / 365));
                break;
            case 'weekly':
                result = Math.pow(result, (1 / 52));
                break;
            case 'bi-weekly':
                result = Math.pow(result, (1 / 26));
                break;
            default:  // default is monthly
                result = Math.pow(result, (1 / 12));
                break;

        }

        result = result - 1;
        // console.log(result, 'periodic_interest_rate ' + period);
        return result;
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

    amortization_table(period){
        const payment = this.periodic_payment(period).toFixed(2);
        const number_of_payments = this.number_of_payments(period);
        // const number_of_payments = 20; // debugging usage since number of payments might be TOO much
        let balance = this.initial_principal;
        let newBalance = balance;
        let accumulatedInterest = 0;
        let accumulatedPrincipalPaid = 0;
        const table = [];

        for(let i = 0; i <= number_of_payments; i++){
            const detail = {};

            if(i !== 0){
                balance = newBalance;
                let interest = (this.periodic_interest_rate(period) * balance).toFixed(2);
                console.log(interest, 'interestinterestinterest');
                let principal = (payment - interest).toFixed(2);
                newBalance = (balance - principal).toFixed(2);

                detail.interest = interest;
                accumulatedInterest += parseFloat(interest);
                detail.accumulatedInterest = accumulatedInterest.toFixed(2);

                detail.principal = principal;
                accumulatedPrincipalPaid += parseFloat(principal);
                detail.accumulatedPrincipalPaid = accumulatedPrincipalPaid.toFixed(2);

                detail.payment = payment;
            } else {
                detail.interest = null;
                detail.accumulatedInterest = accumulatedInterest;
                detail.accumulatedPrincipalPaid = accumulatedPrincipalPaid;
                detail.principal = null;
                detail.payment = null;
            }

            detail.payment_number = i;
            detail.balance = newBalance;

            table.push(detail);
        }
        // console.log(table, 'table');
        return table;
    }
}

module.exports = MortgageCalculator;

// console.log('-------------class below-----------------');
// const mc = new MortgageCalculator(300000, 2.88, 30);
// console.log(mc.periodic_payment('monthly'), 'periodic_payment  month');
// console.log(mc.periodic_payment('semi-monthly'), 'periodic_payment semi-month');
// console.log(mc.periodic_payment('accelerated_weekly'), 'periodic_payment accelerated_weekly');
// console.log(mc.periodic_payment('accelerated_bi-weekly'), 'periodic_payment accelerated_bi-weekly');
// console.log(mc.periodic_payment('weekly'), 'periodic_payment weekly');
// console.log(mc.periodic_payment('bi-weekly'), 'periodic_payment bi-weekly');
//
// console.log(mc.effective_annual_rate, 'effective_annual_rate');
// console.log(mc.show_all_periodic_payment);
// console.log(mc.amortization_table('weekly'));
// console.log(mc.amortization_table('accelerated_weekly'));
// console.log(mc.show_periodic_interest_rate);
