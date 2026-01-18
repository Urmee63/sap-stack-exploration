import React from 'react';
import { Container } from '@material-ui/core';
import Welcome from './components/Welcome';

function Home(): React.ReactElement<{}> {
  return (
    <Container maxWidth='lg' style={{ marginTop: '30px' }}>
      <Welcome />
    </Container>
  );
}

export default Home;