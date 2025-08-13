//* SelectedRecips.jsx

import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {Modal, Text, Image} from '../../KQ-UI';
import {Icons} from '../../components/IconListRouter';
import {useColors} from '../../KQ-UI/KQUtilities';
import {capFirst, capEachWord, endWithPeriod} from '../../utilities/helpers';
import {toFraction} from '../../utilities/fractionUnit';
import {formatPluralUnit} from '../../utilities/formatPluralUnit';
import {SelectedRecipeStyles} from '../../styles/Styles';

const SelectedRecipe = ({selectedRecipe, visible, useOneColumn, onClose}) => {
  if (!selectedRecipe) return null;

  const [showAboutRecipe, setShowAboutRecipe] = useState(false);

  console.log('SelectedRecipe', selectedRecipe);

  const SectionHead = ({title, value, style}) => {
    if (value) {
      return (
        <View style={[SelectedRecipeStyles.sectionWrapper, {...style}]}>
          <View style={SelectedRecipeStyles.sectionEnd} />
          <View style={SelectedRecipeStyles.sectionTitle}>
            <Text size="xSmall" numberOfLines={1} font="open-7">
              {title}:
            </Text>
          </View>
          <View style={SelectedRecipeStyles.sectionEnd} />
        </View>
      );
    }
    return null;
  };

  return (
    <Modal
      visible={visible}
      title={selectedRecipe?.title}
      headerFont="open-6"
      headerSize="small"
      height="99.5%"
      width="96%"
      hideClose
      headerColor="orange"
      onClose={onClose}>
      <View style={{borderBottomWidth: 1, borderColor: useColors('dark10')}}>
        <Image
          image={selectedRecipe?.imageUri}
          style={SelectedRecipeStyles.imageSelectedStyles}
        />
      </View>
      <TouchableOpacity
        style={SelectedRecipeStyles.selectedCloseButton}
        onPress={onClose}>
        <Icons.Close size={25} color={useColors('white')} />
      </TouchableOpacity>

      <View style={SelectedRecipeStyles.selectedViewWrapper}>
        <Text size="tiny" centered font="open-7" kqColor="dark90">
          KQ Recipe provided by{' '}
          {selectedRecipe?.displayAuthorName
            ? `${selectedRecipe?.authorFirstName} ${selectedRecipe?.authorLastName}`
            : selectedRecipe?.source
            ? `${selectedRecipe?.source}`
            : `${selectedRecipe?.credit}`}
        </Text>
        <ScrollView>
          {selectedRecipe?.aboutRecipe && (
            <>
              <View style={SelectedRecipeStyles.aboutRecipe}>
                <Text size="xSmall" font="open-7">
                  About this Recipe:
                </Text>
                <Text
                  size="tiny"
                  font="open-6"
                  numberOfLines={showAboutRecipe ? 10 : 1}>
                  {endWithPeriod(selectedRecipe?.aboutRecipe)}
                </Text>
              </View>
              <TouchableOpacity
                style={SelectedRecipeStyles.aboutRecipeButton}
                onPress={() => setShowAboutRecipe(!showAboutRecipe)}>
                <Text size="tiny" font="open-5" kqColor="rgb(56, 71, 234)">
                  {showAboutRecipe ? 'Show Less' : 'Show More'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <SectionHead
            title="Ingredients"
            value={selectedRecipe?.ingredients?.length > 0}
            style={{marginTop: 5}}
          />
          <View style={SelectedRecipeStyles.ingWrapper}>
            {selectedRecipe?.ingredients?.map((ing, index) => (
              <View
                key={index}
                style={
                  useOneColumn
                    ? SelectedRecipeStyles.ingColOne
                    : index % 2 === 0
                    ? SelectedRecipeStyles.ingColTwo
                    : SelectedRecipeStyles.ingColTwoAlt
                }>
                <View style={{flexDirection: 'row'}}>
                  <View style={SelectedRecipeStyles.ingDot}>
                    <Icons.Dot size={4} />
                  </View>
                  <View style={{flex: 1}}>
                    <Text
                      size="xSmall"
                      font="open-7"
                      numberOfLines={useOneColumn ? 3 : 1}>
                      {(() => {
                        if (ing.amount != null) {
                          const pluralUnit = formatPluralUnit(
                            ing.amount,
                            ing.unit,
                          );
                          return `${toFraction(ing.amount)}${
                            pluralUnit ? ` ${pluralUnit}` : ''
                          } `;
                        }
                        return '';
                      })()}
                      {capEachWord(ing.name)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <SectionHead
            title="Instructions"
            value={selectedRecipe?.instructions?.length > 0}
          />
          <View style={{margin: 5, marginBottom: 10}}>
            {Array.isArray(selectedRecipe?.instructions) &&
              selectedRecipe.instructions.length > 0 &&
              selectedRecipe.instructions.map((group, gIndex) => (
                <View key={`group-${gIndex}`} style={{marginBottom: 25}}>
                  {group.name ? (
                    <View style={{paddingLeft: 10, paddingBottom: 2}}>
                      <Text size="small" font="open-7">
                        {group.name}
                      </Text>
                    </View>
                  ) : null}
                  {group.steps.map((ins, sIndex) => (
                    <View
                      key={`${gIndex}-${sIndex}`}
                      style={SelectedRecipeStyles.stepWrapper}>
                      <View style={SelectedRecipeStyles.stepNumber}>
                        <Text size="xSmall" font="open-7">
                          Step {ins.step + 1}:
                        </Text>
                      </View>
                      <View style={SelectedRecipeStyles.stepText}>
                        <Text size="xSmall">{endWithPeriod(ins.action)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default __DEV__ ? SelectedRecipe : React.memo(SelectedRecipe);
