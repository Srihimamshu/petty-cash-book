const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactions');
const Meta = require('../models/metadata');
const { parse } = require('dotenv');


router.get('/', (req,res) => 
{
    res.render('index');
});

router.get('/my-ledger', (req,res) => 
{
    res.render('ledger');
});

router.get('/analytics', async (req,res) => 
{
    //return balance
    const balance = await Meta.findOne({identity: 'test'});
    const date = new Date();
    const dateStringToday = date.toLocaleDateString();
    
    const last30Transactions = await Transaction.find().sort({ _id: -1 }).limit(30)
    // console.log('trans',last30Transactions);

    var daily = [];

    console.log(dateStringToday)

    await Transaction.find({timestamp: dateStringToday})
    .then((dailyRet) => 
    {
        dailyRet.forEach((doc) => {
            console.log(doc);
            daily.push(doc);
        }
    )})
    console.log(daily);

    var weekArray = [];
    var monthArray = [];
    var yearArray = [];
    var allDataArray = [];
    
    await Transaction.find({})
    .then((documents) => 
    {
        console.log('fetched');
        documents.forEach((doc) => {
            allDataArray.push(doc);
            const dateParts = doc.timestamp.split('/');
            const day =  parseInt(dateParts[0])
            const month = parseInt(dateParts[1])
            const year = parseInt(dateParts[2])

            const currentDate = new Date();

        // Check if the document falls within the week
        const oneWeekAgo = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
        if (new Date(year, month - 1, day) >= oneWeekAgo && new Date(year, month - 1, day) <= currentDate) {
          weekArray.push(doc);
        }

        // Check if the document falls within the month
        const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
        if (new Date(year, month - 1, day) >= oneMonthAgo && new Date(year, month - 1, day) <= currentDate) {
          monthArray.push(doc);
        }

        // Check if the document falls within the year
        const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
        if (new Date(year, month - 1, day) >= oneYearAgo && new Date(year, month - 1, day) <= currentDate) {
          yearArray.push(doc);
        }
    })

    var openingDay = 0;
    daily.forEach((doc) => {
        if (doc.transact_type === 'income') {
            openingDay = openingDay + doc.transact_amt;
        }

        else {
            openingDay = openingDay - doc.transact_amt;
        }
    });

    var openingWeek = 0;

    weekArray.forEach((doc) => {
        if (doc.transact_type === 'income') {
            openingWeek = openingWeek + doc.transact_amt;
        }

        else {
            openingWeek = openingWeek - doc.transact_amt;
        }
    });

    var openingMonth = 0;
    var monthIncome = 0;
    var monthExpense = 0;

    monthArray.forEach((doc) => {
        if (doc.transact_type === 'income') {
            openingMonth = openingMonth + doc.transact_amt;
            monthIncome = monthIncome + doc.transact_amt
        }

        else {
            openingMonth = openingMonth - doc.transact_amt;
            monthExpense = monthExpense + doc.transact_amt
        }
    });

    var openingYear = 0;

    yearArray.forEach((doc) => {
        if (doc.transact_type === 'income') {
            openingYear = openingYear + doc.transact_amt;
        }

        else {
            openingYear = openingYear - doc.transact_amt;
        }



   
    
    const docy = {
        openingBalDay: balance.balance + openingDay,
        openingBalWeek: balance.balance + openingWeek,
        openingBalMonth: balance.balance + openingMonth,
        incomeThisMonth: monthIncome,
        expenseThisMonth: monthExpense,
        savingsThisMonth: monthIncome - monthExpense,
        openingBalYear: balance.balance + openingYear,
        balance: balance.balance,
        trans_hist: last30Transactions,
        dailySend: daily, 
        weeklySend: weekArray,
        monthlySend: monthArray,
        yearlySend: yearArray,
    }
    res.render('analytics', { docy });

    })
})
});

router.post('/my-ledger', (req,res) => 
{
    const date = new Date();
    const dateStringToday = date.toLocaleDateString();
    console.log(req.body.entryType);
    console.log(req.body.amount)
    const doc = {
        timestamp: dateStringToday,
        transact_head: req.body.expenseHead,
        transact_amt: req.body.amount,
        transact_type: req.body.entryType,
        transact_desc: req.body.description,
    }
    Transaction.create(doc)
    .then(user => res.render('ledger'))
    .catch(err => res.status(400).json({error:'cant add note'}));
    
    if (req.body.entryType === 'income') {
        Meta.findOneAndUpdate(
            {identity: 'test'},
            { $inc: { balance: req.body.amount } },
        ) 
        .then(a => console.log('balance updated'))
        .catch(error => res.status(400).json({error:'cant add note'}));
    }

    else {
        Meta.findOneAndUpdate(
            {identity: 'test'},
            { $inc: { balance: -req.body.amount } },
        ) 
        .then(a => console.log('balance updated'))
        .catch(error => res.status(400).json({error:'cant add note'}));
    }
})

module.exports = router;