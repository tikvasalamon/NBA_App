import React from 'react';
import style from "./sideNav.module.css";
import { Link } from "react-router-dom";
import FontAwesome from "react-fontawesome";

const SideNavItems = () => {

    const items = [
        {
            type: style.option,
            icon: "home",
            text: "Home",
            link: "/"
        },
        {
            type: style.option,
            icon: 'file-alt',
            text: "News",
            link: "/news"
        },
        {
            type: style.option,
            icon: 'play',
            text: "Videos",
            link: "/videos"
        },
        {
            type: style.option,
            icon: 'sign-in-alt',
            text: "Sign in",
            link: "/sign-in"
        },
        {
            type: style.option,
            icon: 'sign-out-alt',
            text: "Sign out",
            link: "/sign-out"
        }
    ]

    const showItem = () => {
        return items.map((item, i) => {
            return (
                <div key={i} className={item.type}>
                    <Link to={item.link}>
                        <FontAwesome name={item.icon} />
                        {item.text}
                    </Link>
                </div>
            )
        })
    }
    
    return (
        <div>
            {showItem()}
        </div>
    );
};

export default SideNavItems;