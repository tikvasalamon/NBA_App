import React, { Component } from 'react';

import SliderTemplates from "./slider_templates";
import { firebase, firebaseArticles, firebaseLooper } from '../../../firebase';
import { resolve } from 'q';

class NewsSlider extends Component {

    state = {
        news: []
    }

    componentWillMount(){
        firebaseArticles.limitToFirst(this.props.amount).once('value')
            .then((snapshot) => {
                const news = firebaseLooper(snapshot);

                const asyncFunction = (item, i, cb) => {
                    firebase.storage().ref('images').child(item.image).getDownloadURL()
                        .then( url => {
                            console.log(url)
                            news[i].image = url;
                            cb();
                        })
                }

                let requests = news.map((item, i) => {
                    return new Promise((resolve) => {
                        asyncFunction(item, i, resolve);
                    })
                })

                Promise.all(requests).then(() => {
                    this.setState({
                        news
                    })
                })
            })
    }

    render() {
        return (
            <div>
                <SliderTemplates data={this.state.news} type={this.props.type} settings={this.props.settings} />
            </div>
        );
    }
}

export default NewsSlider;