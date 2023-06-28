import { render, screen } from '@testing-library/react';
import App from './App';
import axios from "axios";

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('test api',()=>{
    let response = '';
    const resp = axios.get(`${process.env.REACT_APP_API}/health-check`)
        .then(resp2=>{
            response = resp2.data;
        })
    expect(response).toEqual('connected');
})
