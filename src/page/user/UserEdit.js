import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Col, Row} from "react-bootstrap";

function UserEdit() {

    let params = useParams();
    let navigate = useNavigate();
    let [user, setUser] = useState({});
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/api/users/${params.id}`).then(resp => {
            let copy = {...resp.data};
            setUser(copy);
            setUsername(user.username)
            setBio(user.introduce);
        }).catch(() => {
        })
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            <div className="login-container">
                <form className="login-form" onClick={handleSubmit}>
                    <h3>Edit Profile</h3>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" defaultValue={user.username} onChange={e => {
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
                        <textarea placeholder="Enter bio" defaultValue={user.introduce} onChange={e => {
                            setBio(e.target.value);
                        }}></textarea>
                    </div>
                    {
                        error === '' ? null : <Alert variant={"danger"}>{error}</Alert>
                    }
                    <Row>
                        <Col>
                            <button type="button" onClick={() => navigate('/user/'+params.id)}
                                    className="btn btn-primary login-button">Back
                            </button>
                        </Col>
                        <Col>
                            <button type="button" onClick={() => {
                                let join = {
                                    'username': username,
                                    'password': password,
                                    'introduce': bio
                                }
                                axios.put(`${process.env.REACT_APP_API}/api/users/${params.id}`,
                                    JSON.stringify(join), {
                                    headers: {"Content-Type": `application/json`}
                                }).then(resp => {
                                    if (resp.status === 202) {
                                        alert("수정 되었습니다.")
                                        navigate(`/user/${params.id}`);
                                    }
                                }).catch(error => {
                                    setError(error.response.data.message)
                                })
                            }} className="btn btn-primary login-button">Edit
                            </button>
                        </Col>
                    </Row>
                </form>
            </div>
        </div>
    )
}

export default UserEdit