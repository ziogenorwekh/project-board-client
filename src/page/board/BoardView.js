import '../../css/board.css'

import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Alert, Button, Col, Form, Modal, ModalFooter, Row} from "react-bootstrap";
import HTMLReactParser from "html-react-parser";
import {useSelector} from "react-redux";

function BoardView() {

    let navigate = useNavigate();
    let params = useParams();
    let [board, setBoard] = useState({
        postedBy: undefined,
        postId: "",
        comments: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [comment, setComment] = useState("");
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const user = useSelector((state) => state.user);


    useEffect(() => {
        callPost()
    }, []);

    const callPost = () => {
        axios.get(`${process.env.REACT_APP_API}/api/posts/${params.id}`)
            .then(resp => {
                let copy = {...resp.data};
                setBoard(copy);
                setIsLoading(false);
            }).catch(() => {
            setIsLoading(false);
        })
    }

    const handlePostDelete = () => {
        axios.delete(`${process.env.REACT_APP_API}/api/posts/${board.postId}`,
            {headers: {"Content-Type": `application/json`}})
            .then(()=>{
                alert("deleted")
                navigate(`/board`)
            }).catch(()=>{
                alert("no authorized.")
        })
    }

    const handleCommentSubmit = () => {
        axios.post(`${process.env.REACT_APP_API}/api/comments/${board.postId}`, {
            'comment': comment,
        })
            .then(() => {
                setShowCommentModal(false);
                setIsLoading(true);
                callPost()
            })
            .catch((error) => {
                setError(error.response.data.message);
            });
    };

    return (
        <>
            {
                isLoading ? (
                    <p className='loading'>Loading...</p>
                ) : (
                    <div className="board text-start m-4">
                        <div className="title">{board.title}</div>
                        <div className="username"
                             onClick={() => navigate('/user/' + board.userId)}>{board.username}</div>
                        <hr/>
                        <div className="contents">{HTMLReactParser(board.content)}</div>
                        <hr/>
                        <div>
                            <Row className={"mt-2 mb-2"}>
                                <Col>
                                                <Button
                                                    variant={"secondary"}
                                                    className={"comments"}
                                                    onClick={() => setShowCommentModal(true)}
                                                >Comments</Button>
                                </Col>
                                <Col>
                                    <div className='text-end posted-by'>
                                        {board.postedBy}
                                    </div>
                                </Col>
                            </Row>
                            {
                                user.userId === board.userId ?
                                    <div>
                                        <Button style={{marginRight: '3px'}} variant={"dark"} onClick={() => {
                                            navigate(`/board/edit/${board.postId}`)
                                        }}>Edit</Button>
                                        <Button variant={"danger"} style={{marginRight: '3px'}}
                                                onClick={() => {setShowDeleteModal(true)}
                                        }>Delete</Button>
                                    </div>
                                    : null
                            }
                            <hr/>
                            <div>
                                <div><h4 className="text-dark">Comments</h4></div>
                                {board.comments.map((comment, i) => (
                                    <div key={i} className="comment">
                                        <div>{comment}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }


            <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Comment on Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="comment">
                            <Form.Label>Comment:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    {
                        error !== "" ? <Alert className="mt-2 mb-0" variant={"danger"}>{error}</Alert> : null
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="dark" onClick={() => handleCommentSubmit()}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                size="sm"
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Verify
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you wanna delete post?</Modal.Body>
                <ModalFooter>
                    <Button variant={"dark"} onClick={()=>setShowDeleteModal(false)}>No</Button>
                    <Button variant={"danger"} onClick={handlePostDelete}>Yes</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default BoardView