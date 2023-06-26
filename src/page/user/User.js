import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import "../../css/user.css"
import {Button, Container, Modal, Row} from "react-bootstrap";
import {useSelector} from "react-redux";
import API_BASE_URL from "../../config";

function User() {

    let params = useParams();
    let [user, setUser] = useState({});
    let navigate = useNavigate();
    const currentUser = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteUserModal, setDeleteUserModal] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/api/users/${params.id}`).then(resp => {
            let copy = {...resp.data};
            setUser(copy);
            setIsLoading(false);
        }).catch(() => {
            navigate('/not-found')
            setIsLoading(false);
        })
    }, [])

    const handleUserDelete = () => {
        axios.delete(`${process.env.REACT_APP_API}/api/users/${currentUser.userId}`,
            {headers: {"Content-Type": `application/json`}})
            .then(() => {
                navigate('/login')
            })
            .catch(() => {
            })
    };

    return (
        <>
            {isLoading ? (
                <p className='loading'>Loading...</p>
            ) : (
                <div className="user-container">
                    <div className="user-header">
                        <Container>
                            <Row>
                                <div className="user-info">
                                    <h3>Username</h3>
                                    <h4>{user.username}</h4>
                                    <h3>Email</h3>
                                    <p>{user.email}</p>
                                </div>
                            </Row>
                            <Row>
                                <div className={"user-info"}>
                                    <h3>Introduce</h3>
                                    <div className="user-bio">
                                        <div>{user.introduce ? (
                                            <div>{user.introduce}</div>
                                        ) : (<div>No Content</div>)}</div>
                                    </div>
                                </div>
                            </Row>
                            <div className="user-buttons text-start">
                                {
                                    currentUser.userId === user.userId ?
                                        <>
                                            <button className="user-button" type="button"
                                                    onClick={() => {
                                                        navigate('/user/edit/' + params.id)
                                                    }}>
                                                Edit Profile
                                            </button>
                                            <button className={"user-button"} type={"button"}
                                                    onClick={() => {
                                                        setDeleteUserModal(true)
                                                    }}>
                                                Delete Account
                                            </button>
                                        </>
                                        : null
                                }
                                {
                                    currentUser.admin === 'ADMIN' ? <>
                                      <button className={"user-button"} onClick={()=>{
                                            navigate('/admin/page')
                                      }
                                      }>Edit Server</button>
                                    </> : null
                                }
                            </div>
                        </Container>
                    </div>
                </div>
            )
            }

            <Modal
                size="sm"
                show={deleteUserModal}
                onHide={() => setDeleteUserModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Verify
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you wanna delete account?</Modal.Body>
                <Modal.Footer>
                    <Button variant={"dark"} onClick={() => setDeleteUserModal(false)}>No</Button>
                    <Button variant={"danger"} onClick={() => {
                        handleUserDelete()
                    }}>Yes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default User