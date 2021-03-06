import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Section = styled.section`
    width: 50%;
    font: bold;
    font-size: 2.4rem;
    position: absolute;
    left: 15%;
    text-align: left;
    padding: 1.5 rem 0 1.5rem 5rem;
    border-bottom: 1px solid black;
`;

const Button = styled.button`
    background-color: #A6FFB5;
    font-weight: bold;
    font-size: 1rem;
    position: absolute;
    margin-top: 1.5rem;
    left: 100%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    align: right;
    

`;
export default function AccountBalance(props) {
    const handleClick = (event) => {
        event.preventDefault();
        props.handleHide();     
    }

    const buttonText = props.showBalance ? 'Hide' : 'Show';
    return (
        <Section>
            {props.showBalance && (<>Balance: ${(props.amount).toFixed(2)}</>)}
            <Button onClick={handleClick}>{buttonText}</Button>
        </Section>
    );
    
}


AccountBalance.propTypes = {
    amount: PropTypes.number.isRequired
 }