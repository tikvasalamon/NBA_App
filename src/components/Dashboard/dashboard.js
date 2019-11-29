import React, { Component } from 'react';
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import { firebaseTeams, firebaseArticles, firebase } from "../../firebase";
import style from "./dashboard.module.css";
import FormField from "../Widgets/FormField/formField";
import Uploader from "../Widgets/FileUploader/fileUploader";

class Dashboard extends Component {

    state = {
        editorState: EditorState.createEmpty(),
        postError: '',
        loading: false,
        formData: {
            author: {
                element: 'input',
                value: '',
                config: {
                    name: 'author_input',
                    type: 'text',
                    placeholder: 'Enter your name'
                },
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            title: {
                element: 'input',
                value: '',
                config: {
                    name: 'title_input',
                    type: 'text',
                    placeholder: 'Enter title'
                },
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            body: {
                element: 'texteditor',
                value: '',
                valid: true
            },
            image: {
                element: 'image',
                value: '',
                valid: true
            },
            team: {
                element: 'select',
                value: '',
                config: {
                    name: 'team_input',
                    options: []
                },
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage: ''
            }
        }
    }

    componentDidMount() {
        this.loadTeams();
    }

    loadTeams = () => {
        firebaseTeams.once('value')
            .then((snapshot) => {
                let teams = [];

                snapshot.forEach((childSnapshot) => {
                    teams.push({
                        id: childSnapshot.val().teamId,
                        name: childSnapshot.val().city
                    })
                })

                const newFormdata = { ...this.state.formData };
                const newElement = newFormdata['team'];

                newElement.config.options = teams;
                newFormdata['team'] = newElement;

                this.setState({
                    formData: newFormdata
                })
            })
    }

    updateForm = (element, content = '') => {
        const newFormdata = {
            ...this.state.formData
        }
        const newElement = {
            ...newFormdata[element.id]
        }

        if (content === '') {
            newElement.value = element.event.target.value;
        } else {
            newElement.value = content;
        }

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

    submitForm = (event) => {
        event.preventDefault()

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
                postError: ''
            })

            firebaseArticles.orderByChild('id').limitToLast(1).once('value')
                .then( snapshot => {
                    let articleId = null;

                    snapshot.forEach( childSnapshot => {
                        articleId = childSnapshot.val().id
                    })

                    dataToSubmit['date'] = firebase.database.ServerValue.TIMESTAMP;
                    dataToSubmit['id'] = articleId + 1;
                    dataToSubmit['team'] = parseInt(dataToSubmit['team']);

                    firebaseArticles.push(dataToSubmit)
                        .then( article => {
                            this.props.history.push(`/articles/${article.key}`)
                        }).catch( e => {
                            this.setState({postError: e.message})
                        })
                })
        } else {
            this.setState({
                postError: 'something went wrong'
            })
        }
    }

    submitButton = () => {
        return this.state.loading ?
            'loading...'
            :
            <div>
                <button type='submit'> Add Post </button>
            </div>
    }

    showError = () => (
        this.state.postError !== '' ?
            <div className={style.error}>{this.state.postError}</div>
            : ''
    )

    onEditorStateChange = (editorState) => {

        let contentState = editorState.getCurrentContent()
        let html = stateToHTML(contentState);

        this.updateForm({ id: 'body' }, html)

        this.setState({
            editorState
        })
    }

    storeFilename = (filename) => {
        this.updateForm({ id: 'image' }, filename)
    }

    render() {
        return (
            <div className={style.postContainer}>
                <form onSubmit={this.submitForm}>
                    <h2>Add Post</h2>

                    <Uploader
                        onFilenameCreated={(filename) => this.storeFilename(filename)}
                    />

                    <FormField
                        id={'author'}
                        formdata={this.state.formData.author}
                        change={(element) => this.updateForm(element)}
                    />

                    <FormField
                        id={'title'}
                        formdata={this.state.formData.title}
                        change={(element) => this.updateForm(element)}
                    />

                    <Editor
                        EditorState={this.state.editorState}
                        wrapperClassName="myEditor-wrapper"
                        editorClassName="myEditor-editor"
                        onEditorStateChange={this.onEditorStateChange}
                    />

                    <FormField
                        id={'team'}
                        formdata={this.state.formData.team}
                        change={(element) => this.updateForm(element)}
                    />

                    {this.submitButton()}
                    {this.showError()}
                </form>
            </div>
        );
    }
}

export default Dashboard;