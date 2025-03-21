//* DevModals.jsx
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {View} from 'react-native';
import {Button, Layout, Modal, Text} from '../../KQ-UI';

const DevModals = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;

  const [showModal, setShowModal] = useState(false);

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
      <Modal
        visible={showModal}
        header="Modal Title"
        headerFont="open-6"
        headerSize="small"
        headerColor="white"
        height="95%"
        width="95%"
        // fullScreen
        hideHeader
        // hideTitle
        // hideClose
        onClose={() => setShowModal(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Show me the money!</Text>
          <Button onPress={() => setShowModal(false)}>Close Modal</Button>
        </View>
      </Modal>
      <Button onPress={() => setShowModal(true)}>Show Modal</Button>
    </Layout>
  );
};

export default React.memo(DevModals);
