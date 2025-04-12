//* AccountSetup.jsx

import React from 'react';
import {ScrollView, Text} from '../../KQ-UI';

const AccountSetup = props => {
  const {isSplashVisible, logoSet, logoHeight, setWizardStep} = props;

  if (!isSplashVisible && logoSet) {
    return (
      <ScrollView
        noBar
        style={{
          flex: 1,
          marginTop: logoHeight * 1.25,
          paddingTop: 50,
          marginHorizontal: -5,
        }}>
        <Text>Account</Text>
      </ScrollView>
    );
  }
};

export default React.memo(AccountSetup);
