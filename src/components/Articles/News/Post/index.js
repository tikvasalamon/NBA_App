import React, { Component } from 'react';

import { firebase, firebaseDB, firebaseLooper, firebaseTeams } from "../../../../firebase";
import style from "../../articles.module.css";
import Header from "./header";

class NewsArticle extends Component {

    state = {
        article: [],
        team: [],
        imageURL: ''
    }

    componentWillMount() {
        firebaseDB.ref(`articles/${this.props.match.params.id}`).once('value')
            .then((snapshot) => {
                let article = snapshot.val();

                firebaseTeams.orderByChild('teamId').equalTo(article.team).once('value')
                    .then((snapshot) => {
                        const team = firebaseLooper(snapshot);

                        firebase.storage().ref('images').child(article.image).getDownloadURL()
                            .then(url => {
                                this.setState({
                                    imageURL: url,
                                    article,
                                    team
                                })
                            })
                    })
            })
    }

    render() {

        const article = this.state.article;
        const team = this.state.team;

        return (
            <div className={style.articleWrapper}>
                <Header
                    teamData={team[0]}
                    date={article.date}
                    author={article.author}
                />
                <div className={style.articleBody}>
                    <h1>{article.title}</h1>
                    <div className={style.articleImage}
                        style={{
                            background: `url(${this.state.imageURL})`
                        }}
                    ></div>
                    <div className={style.articleText}
                        dangerouslySetInnerHTML={{
                            __html: article.body
                        }}
                    >
                    </div>
                </div>
            </div>
        );
    }
}

export default NewsArticle;