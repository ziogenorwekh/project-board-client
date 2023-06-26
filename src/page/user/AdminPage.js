import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import '../../css/admin.css'
import {Button, Col, Modal, Row} from "react-bootstrap";


function AdminPage() {

    let navigate = useNavigate();
    const currentUser = useSelector((state) => state.user);
    const [allUser, setAllUser] = useState([]);
    const [allPost, setAllPost] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [deleteType, setDeleteType] = useState('');

    useEffect(() => {
        if (currentUser.admin !== 'ADMIN') {
            navigate('/forbidden')
        }
        getAllData()
    }, [])

    const getAllData = () => {
        axios.get(`${process.env.REACT_APP_API}/api/posts`).then(resp => {
            let copy = [...resp.data];
            setAllPost(copy);
            setIsLoading(false);
        })
        axios.get(`${process.env.REACT_APP_API}/api/users`).then(resp => {
            let copy = [...resp.data];
            setAllUser(copy);
            setIsLoading(false);
        })
    }

    const handleDelete = (type) => {
        axios.delete(`${process.env.REACT_APP_API}/api/${type}/${deleteId}`,
            {headers: {"Content-Type": `application/json`}})
            .then(() => {
                setDeleteType('');
                setDeleteId('');
                setDeleteModal(false);
                setIsLoading(true);
                getAllData()
            })
            .catch(error => {
                alert(error.response.data.message)
            })
    };


    return (
        <>
            {
                isLoading ? (
                    <p className='loading'>Loading...</p>
                ) : (
                    <div className={"data"}>
                        <div className={"data-title"}>
                            Post List
                        </div>
                        {allPost.map((item, index) => (
                            <div key={index} className="data-list">
                                <Row>
                                    <Col>
                                        <div className="data-post-title"
                                             onClick={() => navigate(`${process.env.REACT_APP_API}/board/${item.postId}`)}>
                                            {item.title}
                                        </div>
                                    </Col>
                                    <Col xs="auto" className="text-right">
                                        <Button variant={"danger"} onClick={() => {
                                            setDeleteType('posts')
                                            setDeleteId(item.postId)
                                            setDeleteModal(true)
                                        }}>Delete</Button>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <hr className={"hr"}/>
                        <div className={"data-title"}>
                            User List
                        </div>
                        {allUser.map((item, index) => (
                            <div key={index} className="data-list">
                                <Row>
                                    <Col>
                                        <div className="data-user-username"
                                             onClick={() => navigate(`/user/${item.userId}`)}>{item.username}</div>
                                    </Col>
                                    <Col xs="auto" className="text-right">
                                        <Button variant={"danger"} onClick={() => {
                                            setDeleteType('users')
                                            setDeleteId(item.userId)
                                            setDeleteModal(true)
                                        }}>Delete</Button>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>
                )
            }

            <Modal
                size="sm"
                show={deleteModal}
                onHide={() => setDeleteModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Verify
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body><h4 className="fw-bold">Delete this Data?</h4></Modal.Body>
                <Modal.Footer>
                    <Button variant={"dark"} onClick={() => setDeleteModal(false)}>No</Button>
                    <Button variant={"danger"} onClick={() => {
                        handleDelete(deleteType)
                    }}>Yes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AdminPage;