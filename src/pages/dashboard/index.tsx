import { Grid } from '@mui/material';
import BlockChainData from 'components/sections/dashboard/transactions/BlockchainData';
import RecentTransactions from 'components/sections/dashboard/transactions/RecentTransaction';

const Dashboard = () => {
  return (
    <Grid container direction="row" spacing={3} mb={3}>
      <Grid item xs={12}>
        <RecentTransactions />
      </Grid>
      <Grid item xs={12}>
        <BlockChainData />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
