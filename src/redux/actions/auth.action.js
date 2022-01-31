/**
 * Developer                    - Aung Htet Paing
 * Start Date                   - 25 Dec 2021
 * Phone                        - 09421038123, 09758276201
 * Email                        - aunghtetpaing.info@gmail.com
**/

import axios from "axios";
import { ACCESS_TOKEN, SET_ACCEASS_TOEKN } from "../actionTypes";

export const setTokenAction = (accessToken) => async (dispatch) => {

    localStorage.setItem(ACCESS_TOKEN, accessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return dispatch({
        type: SET_ACCEASS_TOEKN,
        payload: accessToken
    });
}