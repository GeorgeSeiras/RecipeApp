import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';

export default function EmailVerification() {
    const [searchParams] = useSearchParams();
    const [email] = useState(searchParams.get('email'))
  
    return (
        <>
            {email &&
                <h1 style={{ textAlign:'center',paddingTop:'5em'}}>
                    A verification email has been sent to {email}
                </h1>
            }
        </>
    )
}