import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) =>{
    // convert an object of key value pairs to array of keys
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igkey => {
        //create an array of length of the key (for example cheese:2 will create an array of 2 elements)
            return [...Array(props.ingredients[igkey])].map((_,i) =>{
                return <BurgerIngredient key={igkey + i} type={igkey}/>
            })
         }).reduce((arr,el)=>{ //using reduce to flatten the array to pull out inner elements and check for any ingredients and add all ingredients.
            // arr will be an emty array as initilized with [] in below initiaization, add all ingredients 
            //using flatten will help to identify the array length
            return arr.concat(el);
         }, []);

         console.log(transformedIngredients);

         if(transformedIngredients.length === 0){
            transformedIngredients = 'Please start adding ingredients!';
         }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top'/>
             {transformedIngredients}
             <BurgerIngredient type='bread-bottom'/>
        </div>
    );
   
}

export default burger;