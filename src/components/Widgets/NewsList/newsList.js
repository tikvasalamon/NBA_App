import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Link } from "react-router-dom";

import { firebase, firebaseArticles, firebaseTeams, firebaseLooper } from "../../../firebase";
import style from "./newsList.module.css";
import Button from "../Buttons/buttons";
import CardInfo from "../CardInfo/cardInfo";

class NewsList extends Component {
    state = {
        teams: [],
        items: [],
        start: this.props.start,
        end: this.props.start + this.props.amount,
        amount: this.props.amount
    }

    componentWillMount() {
        this.request(this.state.start, this.state.end);
    }

    request = (start, end) => {
        if (this.state.teams.length < 1) {
            firebaseTeams.once('value')
                .then((snapshot) => {
                    const teams = firebaseLooper(snapshot);
                    this.setState({
                        teams
                    })
                })
        }

        firebaseArticles.orderByChild('id').startAt(start).endAt(end).once('value')
            .then((snapshot) => {
                const articles = firebaseLooper(snapshot);

                const asyncFunction = (item, i, cb) => {
                    firebase.storage().ref('images').child(item.image).getDownloadURL()
                        .then( url => {
                            articles[i].image = url;
                            cb();
                        })
                }
        
                let requests = articles.map((item, i) => {
                    return new Promise((resolve) => {
                        asyncFunction(item, i, resolve);
                    })
                })

                Promise.all(requests).then(() => {
                    this.setState({
                        items: [...this.state.items, ...articles],
                        start,
                        end
                    })
                })
            })
            .catch(e => {
                console.log(e);
            })
    }

    loadMore = () => {
        let end = this.state.end + this.state.amount;
        this.request(this.state.end + 1, end)
    }

    renderNews = (type) => {
        let template = null;

        switch (type) {
            case "card":
                template = this.state.items.map((item, i) => (
                    <CSSTransition
                        classNames={{
                            enter: style.newsList_wrapper,
                            enterActive: style.newsList_wrapper_enter
                        }}
                        timeout={500}
                        key={i}
                    >
                        <div>
                            <div className={style.newslist_item}>
                                <Link to={`/articles/${item.id}`}>
                                    <CardInfo teams={this.state.teams} team={item.team} date={item.date} />
                                    <h2>{item.title}</h2>
                                </Link>
                            </div>
                        </div>
                    </CSSTransition>
                ))
                break;
            case "cardMain":
                template = this.state.items.map((item, i) => (
                    <CSSTransition
                        classNames={{
                            enter: style.newsList_wrapper,
                            enterActive: style.newsList_wrapper_enter
                        }}
                        timeout={500}
                        key={i}
                    >
                        <div>
                            <Link to={`/articles/${item.id}`}>
                                <div className={style.flex_wrapper}>
                                    <div className={style.left}
                                        style={{
                                            background: `url(${item.image})`
                                        }}
                                    >
                                        <div></div>
                                    </div>
                                    < div className={style.right} >
                                        <CardInfo teams={this.state.teams} team={item.team} date={item.date} />
                                        <h2>{item.title}</h2>
                                    </div >
                                </div>
                            </Link>
                        </div>
                    </CSSTransition>
                ))
                break;
            default:
                template = null;
        }

        return template;
    }

    render() {
        return (
            <div>
                <TransitionGroup
                    component="div"
                    className="list"
                >
                    {this.renderNews(this.props.type)}
                </TransitionGroup>
                <Button
                    type="loadmore"
                    loadMore={() => this.loadMore()}
                    cta="Load More News"
                />
            </div>
        );
    }
}

export default NewsList;