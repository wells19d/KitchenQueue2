//* DevInputs.jsx
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {Layout, Input} from '../../KQ-UI';
import {TouchableWithoutFeedback} from 'react-native';
import {Icons} from '../../components/IconListRouter';

const DevInputs = ({}) => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;

  const [value, setValue] = useState('');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = () => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      {secureTextEntry ? <Icons.EyeOff /> : <Icons.EyeOn />}
    </TouchableWithoutFeedback>
  );

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
      sheetOpen={false}>
      <Input
        label="Email"
        placeholder="Email"
        value={value}
        onChangeText={setValue}
        capitalize={true}
        capitalMode="words"
      />
      <Input
        label="Password"
        placeholder="Password"
        value={value1}
        onChangeText={setValue1}
        capitalize={false}
        accessoryRight={renderIcon}
        secureTextEntry={secureTextEntry}
        required
        caption="Password must be at least 8 characters long"
        counter
        maxCount={500}
      />
      <Input
        label="Multiple Lines"
        placeholder="Enter text here"
        value={value2}
        onChangeText={setValue2}
        multiline
        multiHeight="medium"
        required
        caption="Enter a message"
        counter
        maxCount={50}
      />
      <Input
        label="Notes"
        placeholder="Type multiple lines..."
        value={value3}
        onChangeText={setValue3}
        multiline
        multiHeight="large"
        caption="Enter notes"
        counter
        maxCount={150}
      />
    </Layout>
  );
};

export default DevInputs;
