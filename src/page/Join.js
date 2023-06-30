import "../css/form.css"
import React, {useState} from "react";
import {Alert, Col, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function Join() {
    let navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            <div className="login-container">
                <form className="login-form" onClick={handleSubmit}>
                    <h3>Join</h3>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" autoComplete={"on"} onChange={e => {
                            setEmail(e.target.value)
                        }} className="form-control" placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" autoComplete={"on"} onChange={e => {
                            setUsername(e.target.value);
                        }} className="form-control" placeholder="Enter username"/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" autoComplete="current-password" onChange={e => {
                            setPassword(e.target.value)
                        }} className="form-control" placeholder="Enter password"/>
                    </div>
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea placeholder="Enter bio" autoComplete={"off"} onChange={e => {
                            setBio(e.target.value);
                        }}></textarea>
                    </div>
                    {
                        error === '' ? null : <Alert variant={"danger"}>{error}</Alert>
                    }
                    <Row>
                        <Col>
                            <button type="button" onClick={() => navigate('/login')}
                                    className="btn btn-primary login-button">Back
                            </button>
                        </Col>
                        <Col>
                            <button type="button" onClick={() => {
                                let join = {
                                    'username': username,
                                    'email': email,
                                    'password': password,
                                    'introduce': bio
                                }
                                axios.post(`${process.env.REACT_APP_API}/api/users`, JSON.stringify(join), {
                                    headers: {
                                        "Content-Type": `application/json`,
                                        "Access-Control-Allow-Origin": `${process.env.REACT_APP_API}`,
                                        "Access-Control-Allow-Headers": "*"
                                    }
                                }).then(resp => {
                                    if (resp.status === 201) {
                                        alert("가입 되었습니다.")
                                        navigate('/login');
                                    }
                                }).catch(error => {
                                    setError(error.response.data.message)
                                })
                            }} className="btn btn-primary login-button">Join
                            </button>
                        </Col>
                    </Row>
                </form>
            </div>
        </div>
    );
}

export default Join