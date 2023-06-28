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
    axios.get(`${process.env.REACT_APP_API}/health-check`)
        .then(resp2=>{
            let copy = resp2.data;
            response = copy;
        })
    expect(response).toEqual('connected');
})
