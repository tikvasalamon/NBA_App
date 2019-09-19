import React from 'react';
import FontAwesome from "react-fontawesome";

import style from "./cardInfo.module.css";

const CardInfo = (props) => {

    const teamName = (teams, team) => {
        let data = teams.find((item) => {
            return item.id === team
        });

        if (data) {
            return data.name
        }
    }

    return (
        <div className={style.cardInfo}>
            <span className={style.teamName}>
                {teamName(props.teams, props.team)}
            </span>
            <span className={style.date}>
                <FontAwesome name="clock" />
                {props.date}
            </span>
        </div>
    );
};

export default CardInfo;