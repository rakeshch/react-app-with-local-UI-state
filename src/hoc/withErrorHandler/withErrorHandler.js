import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';
//can be wrapped around multiple components to handle errors
const withErrorHandler =( WrappedComponent, axios )=>{
    return class extends Component{
        state={
            error: null
        }

        //use a constructor nce this is deprecated
       componentWillMount(){
            //clear any previois errors
            this.reqInterceptor = axios.interceptors.request.use(req=>{
                this.setState({ error: null });
                return req;
            });

            //capture any errors in the response
            this.resInterceptor = axios.interceptors.response.use(resp=>resp, error=>{
                this.setState({ error: error });
            });
        }

        componentWillUnmount(){
            //console.log('Unmount', this.reqInterceptor, this.resInterceptor);
            //cleanup the interceptors created earlier in the mount - to prevent memory leaks when wrapping this error handler on multiple components
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        clickedErrorHandler=()=>{
            this.setState({ error: null });
        }

        render(){
            return (
                <Aux>
                    <Modal 
                        modalClosed={this.clickedErrorHandler}
                        show={this.state.error}>
                        {this.state.error ? this.state.error.message: null}
                    </Modal>
                    <WrappedComponent {...this.props}/>
                </Aux>
                
            );
        }
    } 
};


export default withErrorHandler;