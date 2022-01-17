import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';

import {UserReducer} from './reducer';
import {getUser} from './actions'

export default function User() {
    const [state, dispatch] = useReducer(UserReducer);
    const {username} =useParams();
    const [user,setUser] = useState();

    useEffect(()=>{
        (async()=>{
            const payload={
                'username':username
            }
            const response = await getUser(dispatch, payload)
            if (response?.result) {
                setUser(response.result)
            }
        })()
    })
    
    return(
        <div>
            {user}
        </div>
    )
}