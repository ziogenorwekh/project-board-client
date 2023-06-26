/* eslint-disable */

import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React, {useEffect, useState} from "react";
import '../../css/board.css'
import {Button} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useSelector} from "react-redux";

function BoardEdit() {

    let navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [writer, setWriter] = useState('');
    const user = useSelector((state) => state.user);
    let params = useParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/api/posts/${params.id}`).then(resp => {
            setTitle(resp.data.title)
            setContent(resp.data.content)
            setWriter(resp.data.userId)
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        })

        if (localStorage.getItem('token') == null) {
            alert("login first")
            navigate('/');
        } else if (user.userId !== writer) {
            alert("it is not your post.");
        }
    }, []);

    return (
        <div>
            {
                isLoading ? (
                    <p className='loading'>Loading...</p>
                ) : (

                    <div className="create">
                        <h1>Update Posts</h1>
                        <div>
                            <label>title</label>
                            <input type={"text"} defaultValue={title} onChange={event => setTitle(event.target.value)}/>
                        </div>
                        <div>
                            <label>contents</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={content}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setContent(data)
                                }}
                            />
                        </div>
                        <div className={"modal-footer mb-4"}>
                            <Button variant={"secondary"} className="m-2"
                                    onClick={() => navigate(`/board/${params.id}`)}>Back</Button>
                            <Button variant={"dark"} onClick={() => {
                                let object = {'title': title, 'content': content}
                                axios.put(`${process.env.REACT_APP_API}/api/posts/${params.id}`, object, {
                                    headers: {"Content-Type": `application/json`}
                                }).then(() => {
                                    alert("Edit.");
                                }).catch(error => {
                                    console.log(error.response)
                                    alert("No Authorization.")
                                }).finally(() => {
                                    navigate(`/board/${params.id}`)
                                })
                            }}>Edit</Button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default BoardEdit