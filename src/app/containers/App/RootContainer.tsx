import * as React from 'react';
import Container from 'semantic-ui-react/dist/commonjs/elements/Container/Container';
// @ts-ignore

import ThreeContainer from 'app/components/ThreeContainer';

export class RootContainer extends React.Component {

  render() {
    return (
      <Container textAlign="justified" fluid={true}>
        <ThreeContainer />
      </Container>
    );
  }
}
