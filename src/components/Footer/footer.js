import React from 'react';
import style from "./footer.module.css";
import { Link } from "react-router-dom";

import { CURRENT_YEAR } from "../../config";

const Footer = () => (
    <div className={style.footer}>
        <Link to="/" className={style.logo}>
            <img alt="NBA logo" src="/images/nba_logo.png" />
        </Link>
        <div className={style.rigth}>
            @NBA {CURRENT_YEAR} All rigths reserved.
        </div>
    </div>
);

export default Footer;