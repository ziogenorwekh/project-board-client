/* eslint-disable */

import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React, {useEffect, useState} from "react";
import '../../css/board.css'
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function BoardWrite() {

    let navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            alert("you must login first")
            navigate('/');
        }
    }, [])

    return (
        <div>
            <div className="create">
                <h1>Create Posts</h1>
                <div>
                    <label>title</label>
                    <input type={"text"} placeholder={"enter title"} onChange={event => setTitle(event.target.value)}/>
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
                    <Button variant={"secondary"} className="m-2" onClick={() => navigate('/board')}>Back</Button>
                    <Button variant={"dark"} onClick={() => {
                        let object = {'title':title, 'content': content}
                        axios.post(`${process.env.REACT_APP_API}/api/posts`,object,{
                            headers: {"Content-Type": `application/json`}
                        }).then(()=>{
                            alert("작성되었습니다.");
                            navigate('/board')
                        }).catch(()=>{
                            alert("작성 권한이 없습니다.")
                            navigate('/board')
                        })
                    }}>Create</Button>
                </div>
            </div>
        </div>
    );
}

export default BoardWrite