//* SelectedRecips.jsx

import React from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {Modal, Text, Image} from '../../KQ-UI';
import {Icons} from '../../components/IconListRouter';
import {useColors} from '../../KQ-UI/KQUtilities';
import {capFirst, capEachWord} from '../../utilities/helpers';
import {toFraction} from '../../utilities/fractionUnit';
import {formatPluralUnit} from '../../utilities/formatPluralUnit';
import {SelectedRecipeStyles} from '../../styles/Styles';

const SelectedRecipe = ({selectedRecipe, visible, useOneColumn, onClose}) => {
  if (!selectedRecipe) return null;

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
          image={selectedRecipe?.image}
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
          {selectedRecipe?.displayAuthorName
            ? `KQ Recipe provided by ${selectedRecipe?.authorName}`
            : `KQ Recipe provided by ${selectedRecipe?.source}`}
        </Text>
        <ScrollView style={{paddingHorizontal: 10}}>
          {selectedRecipe?.aboutRecipe && (
            <View style={{marginTop: 10, marginBottom: 5, marginHorizontal: 5}}>
              <Text size="xSmall" font="open-7">
                About this Recipe:
              </Text>
              <Text size="tiny" font="open-6">
                {selectedRecipe?.aboutRecipe}
              </Text>
            </View>
          )}
          <SectionHead
            title="Tools"
            value={selectedRecipe?.tools?.length > 0}
            style={{marginTop: 5}}
          />
          <View
            style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 0}}>
            {selectedRecipe?.tools?.map((tool, index) => (
              <View
                key={index}
                style={{
                  width: '50%',
                  paddingLeft: 10,
                  marginVertical: 2,
                }}>
                <Text size="xSmall" font="open-7" numberOfLines={1}>
                  {capFirst(tool)}
                </Text>
              </View>
            ))}
          </View>
          {selectedRecipe?.notes && (
            <View style={{marginTop: 10, marginHorizontal: 10}}>
              <Text size="xSmall" font="open-7">
                Note(s):
              </Text>
              <Text size="tiny" font="open-6">
                {selectedRecipe?.notes}
              </Text>
            </View>
          )}
          <SectionHead
            title="Ingredients"
            value={selectedRecipe?.ingredients?.length > 0}
          />

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {selectedRecipe?.ingredients?.map((ing, index) => (
              <View
                key={index}
                style={{
                  // borderWidth: 1,
                  width: useOneColumn ? '100%' : '50%',
                  marginVertical: useOneColumn ? 3 : 2,
                  justifyContent: 'center',
                  paddingLeft: 15,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      position: 'relative',
                      top: 8,
                      paddingHorizontal: 3,
                    }}>
                    <Icons.Dot size={4} />
                  </View>
                  <View style={{flex: 1}}>
                    <Text
                      size="xSmall"
                      font="open-7"
                      numberOfLines={useOneColumn ? 2 : 1}>
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
                    <Text size="small" font="open-7">
                      {group.name}
                    </Text>
                  ) : null}
                  {group.steps.map((ins, sIndex) => (
                    <View
                      key={`${gIndex}-${sIndex}`}
                      style={{
                        flexDirection: 'row',
                        marginLeft: 10,
                        marginVertical: 2,
                        marginTop: 5,
                      }}>
                      <View>
                        <Text size="xSmall" font="open-7">
                          Step {ins.step + 1}:
                        </Text>
                      </View>
                      <View style={{flex: 1, marginLeft: 5}}>
                        <Text size="xSmall">{ins.action}.</Text>
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
