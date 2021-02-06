import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Button from '../UI/Button/Button';

class OrderSummary extends Component{
    // This could be a functional component
    componentDidUpdate(){
        console.log('[OrderSummary] DidUpdate');
    }

    render(){
        const ingredientsSummary = Object.keys(this.props.ingredients)
        .map(igkey => {
        return <li key={igkey}>
            <span style={{textTransform: 'capitalize'}}>{igkey}</span>: {this.props.ingredients[igkey]}
            </li>
        })
    return(
        <Aux>
            <h3>Your Order</h3>

            <p>A delicious burger with the following ingredients:</p>
            <ul>
            {ingredientsSummary}
            </ul>
            <p>Total price: <strong>{this.props.price.toFixed(2)}</strong></p>
            <p>Continue to Checkout?</p>
            <Button clicked={this.props.cancelled} btnType='Danger'>CANCEL</Button>
            <Button clicked={this.props.continued} btnType='Success'>CONTINUE</Button>
        </Aux>
    );
    }
    //convert object to an array
    
};

export default OrderSummary;