import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

const Wallet = ({ userType }) => {
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await fetch(`/api/${userType}/checkWalletBalance`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.walletBalance !== undefined) {
            setWalletBalance(data.walletBalance);
          }
        } else {
          console.error('Failed to fetch wallet balance');
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    fetchWalletBalance();
  }, [userType]);

  const cardBorderStyle = userType === 'pharmacist' ? 'success' : 'success';
  const cardHeaderStyle = userType === 'pharmacist' ? { backgroundColor: '#44bab1', color: 'black',fontWeight:'bold' } : {};

  return (
    <div className="container">
      <Card border={cardBorderStyle} style={{ width: '18rem' }}>
        <Card.Header style={cardHeaderStyle}>Wallet Balance</Card.Header>
        <Card.Body>
          <Card.Title>{walletBalance} $</Card.Title>
        </Card.Body>
      </Card>
      <br />
    </div>
  );
};

export default Wallet;
