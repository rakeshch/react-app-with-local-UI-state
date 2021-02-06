import React, { Component } from 'react';
import axios from '../../axios-orders';

import Order from '../../components/Order/Order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component{
    state={
        orders:[],
        loading: true
    }

    componentDidMount(){
        axios.get('/orders.json')
            .then(resp=> {
                const fetchedOrders= [];
                for(let key in resp.data){
                    fetchedOrders.push({
                        ...resp.data[key],
                        id: key
                    })
                }
                console.log(resp.data);
                this.setState({ loading: false, orders: fetchedOrders});
            })
    }

    render(){
        return (
            <div>
                {this.state.orders.map(order=>(
                    <Order 
                        key={order.id}
                        ingredients={order.ingredients}
                        price={order.price}
                        />
                ))}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios);