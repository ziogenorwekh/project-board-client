/* eslint-disable */
import {useEffect, useState} from "react";
import '../../css/board.css'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import {useSelector} from "react-redux";

function BoardList() {

    let navigate = useNavigate();
    let [board, setBoard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/api/posts`).then(resp => {
            let copy = [...resp.data];
            setBoard(copy);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        })
    }, [])

    return (
        <div>
            {
                isLoading ? (
                    <p className='loading'>Loading...</p>
                ) : (
                    <div>
                        {
                            user.username === "" ? null : <div className={"post-top"}>
                                <Button variant={"dark"} className="button" onClick={() => {
                                    navigate('/board/write')
                                }}>Write</Button>
                                <hr/>
                            </div>
                        }
                        {
                            board.map((item, index) => (
                                <div key={index} className="post-list"
                                     onClick={() => navigate('/board/' + item.postId)}>
                                    <div className="title">{item.title}</div>
                                    <div className={"username"}>{item.username}</div>
                                    <div className="posted-by">{item.postedBy}</div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}

export default BoardList;