//* DevModals.jsx
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {View} from 'react-native';
import {Button, Layout, Modal, Text} from '../../KQ-UI';

const DevModals = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);

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
        header="Full Screen"
        headerFont="open-6"
        headerSize="small"
        headerColor="white"
        height="95%"
        width="95%"
        fullScreen
        // hideHeader
        // hideTitle
        // hideClose
        onClose={() => setShowModal(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Full Screen w/ Header</Text>
          <Button onPress={() => setShowModal(false)}>Close Modal</Button>
        </View>
      </Modal>
      <Modal
        visible={showModal2}
        header="Full Screen"
        headerFont="open-6"
        headerSize="small"
        headerColor="white"
        height="95%"
        width="95%"
        fullScreen
        hideHeader
        // hideTitle
        // hideClose
        onClose={() => setShowModal2(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Full Screen w/o Header</Text>
          <Button onPress={() => setShowModal2(false)}>Close Modal</Button>
        </View>
      </Modal>
      <Modal
        visible={showModal3}
        header="Modal Title"
        headerFont="open-6"
        headerSize="small"
        headerColor="white"
        height="95%"
        width="95%"
        // fullScreen
        // hideHeader
        hideTitle
        // hideClose
        onClose={() => setShowModal3(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>95% Screen w/o Title</Text>
          <Button onPress={() => setShowModal3(false)}>Close Modal</Button>
        </View>
      </Modal>
      <Modal
        visible={showModal4}
        header="Modal Title"
        headerFont="open-6"
        headerSize="small"
        headerColor="white"
        height="85%"
        width="85%"
        // fullScreen
        // hideHeader
        // hideTitle
        hideClose
        onClose={() => setShowModal4(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>85% Screen w/o Close Button</Text>
          <Button onPress={() => setShowModal4(false)}>Close Modal</Button>
        </View>
      </Modal>
      <Button onPress={() => setShowModal(true)}>Show F/S w/ Header</Button>
      <Button onPress={() => setShowModal2(true)}>Show F/S w/o Header</Button>
      <Button onPress={() => setShowModal3(true)}>
        Show 95% Modal w/o Title
      </Button>
      <Button onPress={() => setShowModal4(true)}>
        Show 85% Modal w/o Close
      </Button>
    </Layout>
  );
};

export default React.memo(DevModals);
