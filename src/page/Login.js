/* eslint-disable */

import React, {useState} from "react";
import "../css/form.css";
import {Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setAdmin, setUserId, setUsername} from "../store";

function Login() {

    let navigate = useNavigate();
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let dispatch = useDispatch();
    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const [modal, setModal] = useState(false);

    function deleteToken() {
        localStorage.removeItem('token');
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            loginAxios()
        }
    }

    const loginAxios = () => {
        let login = {'email': email, 'password': password}
        axios.post(`${process.env.REACT_APP_API}/api/login`, JSON.stringify(login), {
            headers: {
                "Content-Type": `application/json`,
            }
        }).then(resp => {
            dispatch(setUsername(resp.data.username))
            dispatch(setUserId(resp.data.userId));
            localStorage.removeItem('token')
            axios.defaults.headers.common['Authorization'] = `Bearer ${resp.data.access}`;
            localStorage.setItem('token', resp.data.access);
            setTimeout(deleteToken, 15 * 60 * 1000);
            console.log(resp.data)
            if (resp.data.admin != null) {
                dispatch(setAdmin(resp.data.admin))
            }
            navigate('/');
        }).catch(() => {
            setModal(true)
        })
    }

    return (
        <>
            <div className="login-container">
                <form className="login-form" onClick={handleSubmit}>
                    <h3>Login</h3>

                    <div className="form-group">
                        <label>Email address</label>
                        <input type="text" autoComplete={"on"} onChange={e => {
                            setEmail(e.target.value)
                        }} className="form-control" placeholder="Enter email"/>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" autoComplete="current-password" onChange={e => {
                            setPassword(e.target.value)
                        }} className="form-control" onKeyDown={handleKeyDown} placeholder="Enter password"/>
                    </div>
                    <button type="button" onClick={() => {
                        loginAxios()
                    }} className="btn btn-primary login-button">Login
                    </button>
                    <div className="join-container">
                        <p className="join-text">Don't have an account?</p>
                        <button type="button" className="join-button w-25" onClick={() => {
                            navigate('/join')
                        }}>Join
                        </button>
                    </div>

                </form>
            </div>

            <Modal
                size="sm"
                show={modal}
                onHide={() => setModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Login Error
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>Invalidate</Modal.Body>
            </Modal>
        </>
    );
}

export default Login;
