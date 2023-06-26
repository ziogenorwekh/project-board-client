import React, {useEffect, useState} from 'react';
import '../css/common.css';
import axios from "axios";

function Home() {

    const [data, setData] = useState('');
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API}/health-check`)
            .then(resp=>{
                setData(resp.data)
            })
    },[])

    return (
        <div className="home-container">
            <h1>Main Page</h1>
            <h4>{data}</h4>
        </div>
    )
}

export default Home;
