import React, { Component } from 'react';

import { firebase } from "../../firebase";
import style from "./sign-in.module.css";
import FormField from "../Widgets/FormField/formField";

class SignIn extends Component {

    state = {
        registerError: '',
        loading: false,
        formData: {
            email: {
                element: 'input',
                value: '',
                config: {
                    name: 'email_input',
                    type: 'email',
                    placeholder: 'Enter your email'
                },
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            password: {
                element: 'input',
                value: '',
                config: {
                    name: 'password_input',
                    type: 'password',
                    placeholder: 'Enter your password'
                },
                validation: {
                    required: true,
                    password: true
                },
                valid: false,
                touched: false,
                validationMessage: ''
            }
        }
    }

    updateForm = (element) => {
        const newFormdata = {
            ...this.state.formData
        }
        const newElement = {
            ...newFormdata[element.id]
        }
        newElement.value = element.event.target.value;

        if (element.blur) {
            let validData = this.validate(newElement);
            newElement.valid = validData[0];
            newElement.validationMessage = validData[1];
        }

        newElement.touched = element.blur;
        newFormdata[element.id] = newElement;

        this.setState({
            formData: newFormdata
        })
    }

    validate = (element) => {
        let error = [true, ''];

        if (element.validation.email) {
            const valid = /\S+@\S+\.\S+/.test(element.value);
            const message = !valid ? 'Must be a valid email' : '';
            error = !valid ? [valid, message] : error;
        }

        if (element.validation.password) {
            const valid = element.value.length >= 5;
            const message = !valid ? 'Must be greater then 5' : '';
            error = !valid ? [valid, message] : error;
        }

        if (element.validation.required) {
            const valid = element.value.trim() !== '';
            const message = !valid ? 'This field is required' : '';
            error = !valid ? [valid, message] : error;
        }

        return error;
    }

    submitForm = (event, type) => {
        event.preventDefault()
        if (type !== null) {
            let dataToSubmit = {};
            let formIsValid = true;

            for (let key in this.state.formData) {
                dataToSubmit[key] = this.state.formData[key].value;
            }
            for (let key in this.state.formData) {
                formIsValid = this.state.formData[key].valid && formIsValid;
            }

            if (formIsValid) {
                this.setState({
                    loading: true,
                    registerError: ''
                })

                if (type) {
                    firebase.auth().signInWithEmailAndPassword(
                        dataToSubmit.email,
                        dataToSubmit.password
                    ).then(() => {
                        this.props.history.push('/')
                    }).catch(error => {
                        this.setState({
                            loading: false,
                            registerError: error.message
                        })
                    })
                } else {
                    firebase.auth().createUserWithEmailAndPassword(
                        dataToSubmit.email,
                        dataToSubmit.password
                    ).then(() => {
                        this.props.history.push('/')
                    }).catch(error => {
                        this.setState({
                            loading: false,
                            registerError: error.message
                        })
                    })
                }
            }
        }
    }

    submitButton = () => {
        return this.state.loading ?
            'loading...'
            :
            <div>
                <button onClick={(event) => this.submitForm(event, false)}> Register now </button>
                <button onClick={(event) => this.submitForm(event, true)}> Log in </button>
            </div>
    }

    showError = () => (
        this.state.registerError !== '' ?
            <div className={style.error}>{this.state.registerError}</div>
            : ''
    )

    render() {
        return (
            <div className={style.logContainer}>
                <form onSubmit={(event) => this.submitForm(event, null)}>
                    <h2>Register / Log in</h2>
                    <FormField
                        id={'email'}
                        formdata={this.state.formData.email}
                        change={(element) => this.updateForm(element)}
                    />
                    <FormField
                        id={'password'}
                        formdata={this.state.formData.password}
                        change={(element) => this.updateForm(element)}
                    />
                    {this.submitButton()}
                    {this.showError()}
                </form>
            </div>
        );
    }
}

export default SignIn;