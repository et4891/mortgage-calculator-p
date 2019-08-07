# NOTES
There might be some slightly off with the numbers, most of the calculation are within 1 dollar difference BUT with the `semi-monthly` I couldn't find a good calculation so the difference is a lot larger

## Install

```
$ npm i mortgage-calculator-p -S
```

## To Start
```
const MortgageCalculator = require('mortgage-calculator-p')('ca');  // ca means canada, if empty, it'll be the normal one because canada calculation is slightly different

const principal = 250000;
const annual_rate = 4.88;  // in percentage
const amortization_period = 30;  // in years
const mc = new MortgageCalculator(principal, annual_rate, amortization_period);
```

## Show periodic payment
continue with the above variable
```
// show only wanted
// options: 'monthly', 'semi-monthly', 'accelerated_weekly', 'accelerated_bi-weekly', 'weekly', 'bi-weekly'
mc.periodic_payment('monthly');
// returns
1316.3691772630164

// show all
mc.show_all_periodic_payment;
// returns
{
    monthly: 1316.3691772630164,
    semiMonthly: 658.1845886315082,
    acceleratedWeekly: 329.0922943157541,
    acceleratedBiWeekly: 658.1845886315082,
    weekly: 303.7775024453115,
    biWeekly: 607.555004890623
}
```

## Show Amortization Table
continue with the above variable
```
// show only wanted
// options: 'monthly', 'semi-monthly', 'accelerated_weekly', 'accelerated_bi-weekly', 'weekly', 'bi-weekly'
mc.amortization_table('monthly');
// returns
[
    {
        interest: null,
        accumulatedInterest: 0,
        accumulatedPrincipalPaid: 0,
        principal: null,
        payment: null,
        payment_number: 0,
        balance: 250000
        },
    {
        interest: '1006.48',
        accumulatedInterest: '1006.48',
        principal: '309.89',
        accumulatedPrincipalPaid: '309.89',
        payment: '1316.37',
        payment_number: 1,
        balance: '249690.11'
    },
.......continue
]
```
