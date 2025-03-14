//* DevModals.jsx
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {Button, View} from 'react-native';
import {Layout, Modal, Text, useModal} from '../../KQ-UI';

const DevModals = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const {showModal} = useModal();

  const [showModal2, setShowModal2] = useState(false);

  return (
    <Layout
      bgColor={bgColor}
      headerTitle={title}
      headerColor={headerColor}
      textColor={textColor}
      LeftButton=""
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      innerViewStyles={{justifyContent: 'center', alignItems: 'center'}}>
      <>
        <Button
          title="Open Global Modal"
          onPress={() =>
            showModal({
              size: 'full',
              title: 'Welcome to the App!',
              // font: 'noto-9',
              fontSize: 'large',
              centered: false,
              globalView: true,
              // noTitle: true,
              // noCloseButton: true,
              // noHeader: true,
              children: (
                <View style={{flex: 1, borderWidth: 0.2}}>
                  <Text>Test Test Test</Text>
                </View>
              ),
            })
          }
        />
        <Button
          title="Open Component Modal"
          onPress={() => setShowModal2(true)}
        />
      </>
      <Modal
        size="custom"
        title="Welcome to the App, it's got the looks that kill!"
        // font="Noto-9"
        fontSize="medium"
        visible={showModal2}
        height="95%"
        width="92%"
        centered
        onClose={() => setShowModal2(false)}
        // noTitle
        // noHeader
        // noCloseButton
      >
        <View style={{flex: 1, borderWidth: 0.2}}>
          <Text>Test Test Test</Text>
        </View>
      </Modal>
    </Layout>
  );
};

export default DevModals;
