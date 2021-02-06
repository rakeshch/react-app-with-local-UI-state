import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/OrderSummary/OrderSummary';

import axios from '../../../src/axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENT_PRICES={
    salad:0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component{
    state = {
        ingredients:null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        //https://react-my-burger-f4039-default-rtdb.firebaseio.com/Ingredients
        axios.get("https://react-my-burger-f4039-default-rtdb.firebaseio.com/Ingredients.json")
                .then(response=>{
                    this.setState({ ingredients: response.data })
                })
                .catch(error=>{
                    this.setState({ error: true });
                })
    }

    updatePurchaseState(ingredients){

        //convert object to array and read the amount of ingredients added for every ingredient
        const sum = Object.keys(ingredients)
                    .map(igkey => {
                        return ingredients[igkey];
                    }).reduce((sum, el) =>{
                        return sum + el;
                    }, 0)
        this.setState({purchasable: sum>0 });
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler =()=>{
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler =()=>{
       // alert('You Continue!');
    

    //pass query parameters
        const queryparams = [];
        for(let i in this.state.ingredients)
        {
            queryparams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryparams.push('price='+ this.state.totalPrice);
        console.log(queryparams);
        const querystring = queryparams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + querystring
        })
    }

    addIngredientHandler = (type) =>{
        const oldcount = this.state.ingredients[type];
        const updatedcount = oldcount + 1;

        //update the state in immutable way, by creating a copy of the actual object
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedcount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const updatedPrice = oldPrice + priceAddition;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        });

        this.updatePurchaseState(updatedIngredients);

    };

    removeIngredientHandler = (type) =>{
        const oldcount = this.state.ingredients[type];

        if(oldcount<=0)
        return;
        const updatedcount = oldcount - 1;

        //update the state in immutable way, by creating a copy of the actual object
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedcount;
        const priceSubtraction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const updatedPrice = oldPrice - priceSubtraction;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        });
        this.updatePurchaseState(updatedIngredients);
        
    };

    render(){
        //disable button when there is no ingredient added
        const disabledInfo = {
            ...this.state.ingredients
        };

        for(let key in disabledInfo)
        {
            disabledInfo[key] = disabledInfo[key]<=0;
        }
        let orderSummary = null;

       

        let burger= this.state.error? <p>Ingredients can't be loaded</p>: <Spinner/>;

        if(this.state.ingredients)
        {
           
        burger=(
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved ={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                    />
                </Aux>
            );

            orderSummary=<OrderSummary 
            ingredients={this.state.ingredients} 
            cancelled={this.purchaseCancelHandler} 
            continued={this.purchaseContinueHandler}
            price={this.state.totalPrice}/>
        }

        if(this.state.loading)
            orderSummary= <Spinner/>

        return(
            <Aux>
                <Modal show={this.state.purchasing} clicked={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);