import React from 'react';
import FontAwesome from "react-fontawesome";
import moment from "moment";

import style from "./cardInfo.module.css";

const CardInfo = (props) => {

    const teamName = (teams, team) => {
        let data = teams.find((item) => {
            return item.teamId === team
        });

        if (data) {
            return data.name
        }
    }

    const formatDate = (date) => {
        return moment(date).format(' DD-MM-YYYY')
    }

    return (
        <div className={style.cardInfo}>
            <span className={style.teamName}>
                {teamName(props.teams, props.team)}
            </span>
            <span className={style.date}>
                <FontAwesome name="clock" />
                {formatDate(props.date)}
            </span>
        </div>
    );
};

export default CardInfo;