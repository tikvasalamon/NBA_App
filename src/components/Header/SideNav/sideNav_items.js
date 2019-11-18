import React from 'react';
import style from "./sideNav.module.css";
import { Link, withRouter } from "react-router-dom";
import FontAwesome from "react-fontawesome";

import { firebase } from "../../../firebase";

const SideNavItems = (props) => {
    console.log(props)
    const items = [
        {
            type: style.option,
            icon: "home",
            text: "Home",
            link: "/",
            login: ''
        },
        {
            type: style.option,
            icon: 'file-alt',
            text: "News",
            link: "/news",
            login: ''
        },
        {
            type: style.option,
            icon: 'play',
            text: "Videos",
            link: "/videos",
            login: ''
        },
        {
            type: style.option,
            icon: 'sign-in-alt',
            text: "Dashboard",
            link: "/dashboard",
            login: true
        },
        {
            type: style.option,
            icon: 'sign-in-alt',
            text: "Sign in",
            link: "/sign-in",
            login: false
        },
        {
            type: style.option,
            icon: 'sign-out-alt',
            text: "Sign out",
            link: "/sign-out",
            login: true
        }
    ]

    const element = (item, i) => (
        <div key={i} className={item.type}>
            <Link to={item.link}>
                <FontAwesome name={item.icon} />
                {item.text}
            </Link>
        </div>
    )

    const restricted = (item, i) => {
        let template = null;

        if (props.user === null && !item.login) {
            template = element(item, i);
        }
        if (props.user !== null && item.login) {
            if (item.link === '/sign-out') {
                template = (
                    <div key={i}
                        className={item.type}
                        onClick={() => {
                            firebase.auth().signOut()
                                .then(() => {
                                    props.history.push('/')
                                })
                        }}
                    >
                        <FontAwesome name={item.icon} />
                        {item.text}
                    </div>
                )
            } else {
                template = element(item, i);
            }
        }

        return template;
    }

    const showItem = () => {
        return items.map((item, i) => {
            return item.login !== '' ?
                restricted(item, i)
                :
                element(item, i)
        })
    }

    return (
        <div>
            {showItem()}
        </div>
    );
};

export default withRouter(SideNavItems);