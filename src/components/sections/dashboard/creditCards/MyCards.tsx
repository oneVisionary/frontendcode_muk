import { Link, Stack, Typography } from '@mui/material';
import CreditCard, { CreditCardData } from 'components/sections/dashboard/creditCards/CreditCard';
import { Fragment, useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';

/* ---------------------------- Credit Card Data----------------------------- */
interface CardData {
  theme: 'blue' | 'white';
  data: CreditCardData;
  id: number;
}

const MyCards = () => {
  const [cardData, setCardData] = useState<CardData[]>([]);

  useEffect(() => {
    // Retrieve user info from localStorage
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo);

      // Create a card for the user account
      const userCard: CardData = {
        id: 0, // Assign an ID, ensure it doesn't conflict with existing IDs
        theme: 'blue', // or 'white', based on your preference
        data: {
          balance: user.balance, // You can set a default balance or fetch from the user data
          cardHolder: user.username, // Display the username as cardholder name
          validThru: '12/28', // Example expiration date, can be modified
          cardNumber: '**** **** **** ' + user.account_no, // Masking account number
        },
      };

      // Set the card data including user card and predefined cards
      setCardData([
        userCard,
        {
          id: 1,
          theme: 'white',
          data: {
            balance: user.balance,
            cardHolder: user.username, // Display the username as cardholder name
            validThru: '01/28',
            cardNumber: '**** **** **** ' + user.account_no,
          },
        },
      ]);
    }
  }, []);

  return (
    <Fragment>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: 3, pb: 2.5 }}
      >
        <Typography
          sx={{
            fontSize: { xs: 'body2.fontSize', md: 'h6.fontSize', xl: 'h3.fontSize' },
            fontWeight: 600,
          }}
        >
          My Cards
        </Typography>
        <Link
          variant="h5"
          href="#!"
          sx={{
            fontSize: { xs: 'caption.fontSize', md: 'body1.fontSize', xl: 'h5.fontSize' },
            fontWeight: 600,
            pr: 1,
          }}
        >
          See All
        </Link>
      </Stack>
      <SimpleBar style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" gap={4} sx={{ minWidth: 800 }}>
          {cardData.map((card) => (
            <CreditCard key={card.id} theme={card.theme} cardData={card.data} />
          ))}
        </Stack>
      </SimpleBar>
    </Fragment>
  );
};

export default MyCards;
