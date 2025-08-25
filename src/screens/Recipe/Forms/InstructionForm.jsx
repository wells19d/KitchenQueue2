//* InstructionForm.jsx

import React, {useEffect, useMemo, useState} from 'react';
import {setHapticFeedback} from '../../../hooks/setHapticFeedback';
import {useCoreInfo} from '../../../utilities/coreInfo';
import {Button, Input, Text, View} from '../../../KQ-UI';
import {Icons} from '../../../components/IconListRouter';
import {ScrollView} from 'react-native-gesture-handler';
import {TouchableOpacity} from 'react-native';
import {useColors} from '../../../KQ-UI/KQUtilities';
import {capEachWord, capFirst} from '../../../utilities/helpers';

const InstructionForm = props => {
  const {
    instructions,
    setInstructions,
    handleCloseInstructions,
    tempName,
    setTempName,
    tempSteps,
    setTempSteps,
    tempAction,
    setTempAction,
  } = props;
  const useHaptics = setHapticFeedback();
  const core = useCoreInfo();
  const [canAdd, setCanAdd] = useState(false);

  useEffect(() => {
    if (tempName) {
      setCanAdd(true);
    } else {
      setCanAdd(false);
    }
  }, [tempName]);

  const allowReset = useMemo(() => {
    if (
      (typeof tempName === 'string' && tempName.trim().length > 0) ||
      (typeof tempAction === 'string' && tempAction.trim().length > 0)
    ) {
      return false;
    }
    return true;
  }, [tempName, tempAction]);

  const allowAdd = useMemo(() => {
    if (
      typeof tempName === 'string' &&
      tempName.trim().length > 0 &&
      typeof tempAction === 'string' &&
      tempAction.trim().length > 0
    ) {
      return false;
    }
    return true;
  }, [tempName, tempAction]);

  const handleAddInstruction = () => {
    if (canAdd) {
      let newObject = {
        index: instructions?.length,
        name: tempName?.toLowerCase().trim() ?? null,
        steps: tempSteps,
      };
      setInstructions(prev => [...prev, newObject]);
      setTempName(null);
      setTempSteps([]);
    }
  };

  const handleAddStep = () => {
    if (canAdd) {
      let newStep = {
        step: tempSteps?.length,
        action: tempAction?.toLowerCase().trim() ?? null,
      };
      setTempSteps(prev => [...prev, newStep]);
      setTempAction(null);
    }
  };

  const moveInstruction = (fromIndex, toIndex) => {
    setInstructions(prev => {
      const updated = [...prev];
      const item = updated.splice(fromIndex, 1)[0];
      updated.splice(toIndex, 0, item);
      return updated;
    });
  };

  const handleMove = (index, direction) => {
    useHaptics(core?.userSettings?.hapticStrength || 'light');
    moveInstruction(index, direction);
  };

  const handleReset = () => {
    setTempName(null);
    setTempSteps([]);
    setTempAction(null);
  };

  return (
    <>
      <View row>
        <View flex>
          <Input
            required
            labelStyles={{fontSize: 13}}
            label="Instruction Group"
            value={tempName}
            onChangeText={setTempName}
            size="tiny"
            capitalize
            capitalMode="sentences"
          />
        </View>
      </View>

      <View row>
        <View flex>
          <Input
            labelStyles={{fontSize: 13}}
            label={`Step ${tempSteps.length + 1}`}
            value={tempAction}
            onChangeText={setTempAction}
            size="tiny"
            capitalize
            capitalMode="sentences"
          />
        </View>
        <View style={{justifyContent: 'flex-end', paddingBottom: 3}}>
          <Button
            textSize="xSmall"
            size="tiny"
            disabled={allowAdd}
            onPress={handleAddStep}>
            <Icons.Plus size={18} color="white" />
          </Button>
        </View>
      </View>
      <View mh5 mv={2}>
        {tempSteps?.map((i, index) => (
          <View key={index}>
            <Text
              key={index}
              size="tiny"
              font="open-5"
              italic
              kqColor="black"
              numberOfLines={1}>
              Step {i.step + 1}: {capFirst(i.action)}
            </Text>
          </View>
        ))}
      </View>
      <View row>
        <View>
          <Button
            textSize="xSmall"
            size="tiny"
            type="outline"
            color="danger"
            disabled={allowReset}
            onPress={handleReset}>
            Reset
          </Button>
        </View>
        <View flex />
        <View>
          <Button
            textSize="xSmall"
            size="tiny"
            disabled={tempSteps?.length <= 0}
            onPress={handleAddInstruction}>
            Add Instructions
          </Button>
        </View>
      </View>
      <ScrollView style={styles.scrollStyles} hideBar>
        {instructions?.length > 0 ? (
          instructions?.map((instruction, index) => (
            <View
              key={index}
              row
              centerH
              pt={5}
              pb={5}
              pl={5}
              pr={0}
              mh={5}
              mv={3}
              style={{
                borderWidth: 1,
                alignItems: 'flex-start',
                borderRadius: 8,
              }}>
              <View flex ml5>
                <Text size="xSmall" font="open-6">
                  {capEachWord(instruction.name)}
                </Text>
                {instruction.steps?.length > 0 &&
                  instruction.steps.map((step, stepIndex) => (
                    <Text key={stepIndex} size="tiny" font="open-5" italic>
                      Step {step.step + 1}: {capFirst(step.action)}
                    </Text>
                  ))}
              </View>
              <View row centerV>
                {index > 0 && (
                  <TouchableOpacity
                    style={styles.indexButtons}
                    onPress={() => handleMove(index, index - 1)}>
                    <Icons.ChevronUp size={15} color={useColors('dark')} />
                  </TouchableOpacity>
                )}
                {index < instructions.length - 1 && (
                  <TouchableOpacity
                    style={styles.indexButtons}
                    onPress={() => handleMove(index, index + 1)}>
                    <Icons.ChevronDown size={15} color={useColors('dark')} />
                  </TouchableOpacity>
                )}
                <View centerVH>
                  <TouchableOpacity
                    style={{marginRight: 10}}
                    onPress={() => {
                      useHaptics(core?.userSettings?.hapticStrength || 'light');
                      setInstructions(prev =>
                        prev.filter((_, i) => i !== index),
                      );
                    }}>
                    <Icons.XCircleOutline
                      size={18}
                      color={useColors('danger')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View centerH mt20>
            <Text size="xSmall" font="open-6" centered>
              No Instructions added yet.
            </Text>
          </View>
        )}
        <View row>
          <View flex />
          <View>
            <Button
              textSize="xSmall"
              size="tiny"
              onPress={handleCloseInstructions}>
              Finished
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = {
  scrollStyles: {
    // borderWidth: 1,
    flex: 1,
    marginTop: 0,
    backgroundColor: '#fff',
    // paddingHorizontal: 5,
  },
  indexButtons: {
    marginRight: 5,
    width: 25,
    height: 20,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: useColors('dark70'),
  },
};

export default InstructionForm;
