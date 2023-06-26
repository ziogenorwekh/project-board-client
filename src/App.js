/* eslint-disable */

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {logout, setUserId, setUsername} from './store';
import {useEffect} from 'react';
import axios from 'axios';

import BoardList from './page/board/BoardList';
import Login from './page/Login';
import Join from './page/Join';
import User from './page/user/User';
import UserEdit from "./page/user/UserEdit";
import BoardView from "./page/board/BoardView";
import BoardWrite from "./page/board/BoardWrite";
import Home from "./page/Home";
import BoardEdit from "./page/board/BoardEdit";
import NotFound from "./page/NotFound";
import AdminPage from "./page/user/AdminPage";


function App() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);


    useEffect(() => {
        let timeoutId = null;
        const checkToken = () => {
            if (localStorage.getItem('token') == null) {
                dispatch(logout());
                localStorage.removeItem('token');
            } else {
                let token = localStorage.getItem('token');
                axios.get(`/api/users/currents`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(resp => {
                        dispatch(setUsername(resp.data.username))
                        dispatch(setUserId(resp.data.userId));
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }).catch(() => {
                    localStorage.removeItem('token')
                });
                timeoutId = setTimeout(checkToken, 15 * 60 * 1000); // 15 minute
            }
        };
        checkToken();
        return () => clearTimeout(timeoutId);
    }, [dispatch, navigate]);


    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="App">
            <Navbar bg="dark" variant="dark" sticky={'top'}>
                <Container fluid>
                    <Navbar.Brand onClick={() => navigate('/')}>
                        Board Project
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
                            <Nav.Link onClick={() => navigate('/board')}>Board</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    {user.username ? (
                        <Nav>
                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title="Menu"
                                align={"end"}
                                menuVariant="dark"
                            >
                                <NavDropdown.Item onClick={() => navigate('/board/write')}>
                                    Write
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate(`/user/${user.userId}`)}>
                                    {user.username}
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    onClick={() => {
                                        handleLogout()
                                    }}
                                >
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav.Link
                            style={{color: '#afafaf', padding: '0.5em'}}
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Nav.Link>
                    )}
                </Container>
            </Navbar>

            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/join'} element={<Join/>}/>
                <Route path={'/admin/page'} element={<AdminPage/>}/>

                <Route path={'/user/:id'} element={<User/>}/>
                <Route path={'/user/edit/:id'} element={<UserEdit/>}/>

                <Route path={'/board'} element={<BoardList/>}/>
                <Route path={'/board/:id'} element={<BoardView/>}/>
                <Route path={'/board/write'} element={<BoardWrite/>}/>
                <Route path={'/board/edit/:id'} element={<BoardEdit/>}/>
                <Route path='/*' element={<NotFound></NotFound>}></Route>
            </Routes>
        </div>
    );
}

export default App;
