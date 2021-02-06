import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

import axios from '../../../axios-orders';

class ContactData extends Component{
    state={
       orderForm:{
            name: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation:{
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            phone: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Phone'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'email',
                elementConfig:{
                    type: 'email',
                    placeholder: 'Email'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig:{
                    options:[
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: '',
                validation:{},
                valid: false
            },
        },
        formIsValid: false,
        loading: false
    }

    orderHandler=(event)=>{
        // to handle default behavior of page load
        event.preventDefault();

        //access the state
        const formData={};
        for(let formElmIdentifier in this.state.orderForm){
            formData[formElmIdentifier] = this.state.orderForm[formElmIdentifier].value
        }

        this.setState({loading: true});
        const order={
           ingredients: this.props.ingredients,
           price: this.props.price, //In production app always make calculations like these in the server side to avoid any user maniulations
           orderData: formData
        }

       
       //orders will be created if do not exist. for firebase to function correctly, need to add .json
       axios.post('/orders.json', order)
                .then(response=>{
                    console.log(response);
                    this.setState({loading: false});
                    this.props.history.push('/');
                })
                .catch(error =>{
                    console.log(error);
                    this.setState({loading: false});
                })
    }

    checkValidity(value, rules){
        let isValid= false;
        //if no rules present for validation, ust return true
        if(!rules)
            return true;

        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }

        //can add any rules here
        if(rules.minLength){
            isValid = value.length >= rules.minLength;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength;
        }

        return isValid;
    }

    //perform two way binding
    inputChangedHandler = (event, inputIdentifier) =>{
        //console.log(event.target.value);
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        //above line do not performa deep clone, so do another clone to accesss value

        const updatedFromElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFromElement.value = event.target.value;
        //check for validity
        updatedFromElement.valid = this.checkValidity(updatedFromElement.value, updatedFromElement.validation);
        updatedFromElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFromElement;

        let formIsValid= true;
        for(let formIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[formIdentifier].valid && formIsValid;
        }


        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});

        //console.log(this.state.orderForm);
    }

    render(){
        const formEelementsArray=[];
        for(let key in this.state.orderForm)
        {
            formEelementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form =(
             <form onSubmit={this.orderHandler}>
                 {formEelementsArray.map(elm=>(
                     <Input 
                        key={elm.id}
                        elementType={elm.config.elementType} 
                        elementConfig={elm.config.elementConfig} 
                        value={elm.config.value} 
                        invalid={!elm.config.valid}
                        shouldValidate={elm.config.validation}
                        touched={elm.config.touched}
                        changed={(event)=>this.inputChangedHandler(event, elm.id)}/>
                 ))}
                  
                    <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
                </form>
            );

            if(this.state.loading)
            {
                form=<Spinner/>
            }
        return (
            <div className={classes.ContactData}>
                <h1>Enter your Contact data here</h1>
                {form}
            </div>
        );
    }
}

export default ContactData;