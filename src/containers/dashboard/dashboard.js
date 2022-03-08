import React, { Fragment, useState, useEffect } from 'react';
import AnalyticsCard from './analytics/analyticsCard';
import Grid from '@material-ui/core/Grid';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import firebase from '../../firebase/firebase';

const DashboardContainer = () => {
    const [remainingFunds, setRemainingFunds] = useState(0);
    const [remainingStocks, setRemainingStocks] = useState(0);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);

    const fetchDashboardItems =  async () => {
        let remainingFunds = 36000;
        let remainingStocks = 0;
        let debit = 0;
        let credit = 0;
        
        const expenseListRef = firebase.firestore().collection('expense_list');
        const snapshot = await expenseListRef.get();
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.entry_type === 'Debit') {
                remainingFunds = remainingFunds + parseInt(data.amount);
                debit = debit + parseInt(data.amount);
            } else {
                remainingFunds = remainingFunds - parseInt(data.amount);
                credit = credit + parseInt(data.amount);
            }
        });

        const orderListRef = firebase.firestore().collection('order_list');
        const orderSnapshot = await orderListRef.get();

        orderSnapshot.forEach(doc => {
            const data = doc.data();
            remainingFunds = remainingFunds + parseInt(data.total_amount);
            debit = debit + parseInt(data.total_amount);
        })
        
        const stockListRef = firebase.firestore().collection('stock_list');
        const stockSnapshot = await stockListRef.get();

        stockSnapshot.forEach(doc => {
            const data = doc.data();
            remainingStocks = remainingStocks + parseInt(data.remaining);
        })

        setRemainingFunds(remainingFunds);
        setTotalDebit(debit);
        setTotalCredit(credit);
        setRemainingStocks(remainingStocks);
    }

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    useEffect(() => {
        fetchDashboardItems();
    }, [])

    return(<Fragment>
        <Grid container spacing={3}>
            <Grid item lg={6}>
                <AnalyticsCard 
                    title="Remaining Funds" 
                    value={'P' + numberWithCommas(remainingFunds) }
                    icon={<AccountBalanceWalletIcon />} 
                />
            </Grid>
            <Grid item lg={6}>
                <AnalyticsCard 
                    title="Remaining Stocks" 
                    value={remainingStocks}
                    icon={<AccountBalanceWalletIcon />} 
                />
            </Grid>
        </Grid>
    </Fragment>);
}

export default DashboardContainer;