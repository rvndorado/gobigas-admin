import { combineReducers } from 'redux';
import adminList from './manageUsers/adminList';
import expenseList from './manageExpense/expenseList';
import productList from './manageProducts/productList';
import stockList from './manageStocks/stockList';
import orderList from './manageOrders/orderList';

const allReducers = combineReducers({
    adminList: adminList,
    expenseList: expenseList,
    productList: productList,
    stockList: stockList,
    orderList: orderList
});

export default allReducers;