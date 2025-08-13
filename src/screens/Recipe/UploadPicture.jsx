//* UploadPicture.jsx

import React, {useEffect, useMemo, useState} from 'react';
import {Button, Text, View} from '../../KQ-UI';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native';
import {setHapticFeedback} from '../../hooks/setHapticFeedback';
import {useDeviceInfo, useProfile} from '../../hooks/useHooks';
import {useColors, useFontSizes} from '../../KQ-UI/KQUtilities';
import {Icons} from '../../components/IconListRouter';
import {capFirst} from '../../utilities/helpers';
import Toast from 'react-native-toast-message';
import {useCoreInfo} from '../../utilities/coreInfo';
import {useTakePhoto} from './ImageFunctions/takePhoto';
import {useCropPhoto} from './ImageFunctions/cropPhoto';
import {UploadPictureStyles} from '../../styles/Styles';

const UploadPicture = props => {
  const coreInfo = useCoreInfo();
  const profile = useProfile();
  const useHaptics = setHapticFeedback();
  const deviceInfo = useDeviceInfo();
  const buttonWidth = deviceInfo?.dimensions?.width / 6;

  const {
    handleCloseUploadPicture,
    cameraStyles,
    recipeName,
    finalImage,
    setFinalImage,
  } = props;

  const {
    cameraRef,
    takePhoto,
    photoData,
    photoError,
    flashOption,
    setFlashOption,
  } = useTakePhoto();

  const {croppedData, cropError, cropPhoto, cropView} = useCropPhoto();

  const toastProps = {
    fontSize1: useFontSizes('small')?.fontSize,
    fontSize2: useFontSizes('xSmall')?.fontSize,
  };

  const [cameraActive, setCameraActive] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const [screenView, setScreenView] = useState('action');
  const [isCropping, setIsCropping] = useState(false);

  const pictureName = useMemo(() => {
    const slug = String(recipeName || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) return null;

    const prefix = coreInfo?.lastName?.trim()
      ? coreInfo.lastName.trim().toLowerCase()
      : coreInfo?.onlineName?.trim();
    coreInfo?.profileID;

    return `${prefix}-${slug}`;
  }, [
    recipeName,
    coreInfo?.lastName,
    coreInfo?.onlineName,
    coreInfo?.profileID,
  ]);

  useEffect(() => {
    return () => {
      setCameraActive(false);
    };
  }, []);

  // useEffect(() => {
  //   if (screenView === 'final') {
  //     setTempImage(null);
  //     setFinalImage(null); // optional
  //     // 💡 Clear crop state to prevent stale reuse
  //     cropError && setCropError(null);
  //     croppedData && setCroppedData(null);
  //   }
  // }, [screenView]);

  useMemo(() => {
    if (screenView === 'crop' && tempImage?.uri && !isCropping && !cropView) {
      setIsCropping(true);
      cropPhoto(tempImage, pictureName);
    }
    if (croppedData) {
      setFinalImage(croppedData);
      setScreenView('final');
      setIsCropping(false);
    }
    if (cropError) {
      console.log('Crop Error:', cropError);
      setScreenView('action');
      setIsCropping(false);
      handleCloseUploadPicture();
      Toast.show({
        type: cropError?.type || 'error',
        text1: cropError?.text1 || 'Crop Error',
        text2:
          cropError?.text2 || 'An error occurred while cropping the image.',
        props: toastProps,
      });
    }
  }, [
    screenView,
    tempImage?.uri,
    isCropping,
    cropView,
    croppedData,
    cropError,
  ]);

  const flashColor = useMemo(() => {
    if (flashOption === 'on') return 'success';
    if (flashOption === 'off') return 'danger';
    return 'info';
  }, [flashOption]);

  const device = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });

  if (!device) return <View style={{flex: 1, backgroundColor: 'white'}} />; // do we even need this?

  useMemo(() => {
    if (photoData) {
      setTempImage(photoData);
      setScreenView('crop');
    }
    if (photoError) {
      Toast.show({
        type: 'error',
        text1: 'Photo Error',
        text2: photoError,
        props: toastProps,
      });
      setScreenView('action');
      setTempImage(null);
      setFinalImage(null);
      handleCloseUploadPicture();
    }
  }, [photoData, photoError]);

  const toggleFlash = () => {
    useHaptics(profile?.userSettings?.hapticStrength || 'light');
    setFlashOption(prev => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });
  };

  const handleActionPress = action => {
    useHaptics(profile?.userSettings?.hapticStrength || 'light');
    if (action === 'photo') {
      setCameraActive(true);
      setScreenView('camera');
    }
  };

  const handleTakePhoto = () => {
    useHaptics(profile?.userSettings?.hapticStrength || 'light');
    takePhoto(flashOption);
  };

  const handleCancelCamera = () => {
    useHaptics(profile?.userSettings?.hapticStrength || 'light');
    setCameraActive(false);
    setScreenView('action');
    setTempImage(null);
  };

  const handleFinalizeImage = () => {
    if (!pictureName) {
      Toast.show({
        type: 'error',
        text1: 'Missing name',
        text2: 'Add a recipe name first.',
        props: toastProps,
      });
      return;
    }
    handleCloseUploadPicture();
  };

  const UploadActionButton = ({action, icon, label}) => (
    <TouchableOpacity
      style={UploadPictureStyles.button}
      onPress={() => handleActionPress(action)}>
      <View column flex>
        <View flex={1.25} pb={2.5} centerH bottomAlign>
          {icon}
        </View>
        <View flex pt={2.5} centerH>
          <Text centered size="small">
            {label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (screenView === 'action') {
    return (
      <View ph5 flex>
        <View mt5 mb15>
          <Text centered>Choose an Action</Text>
        </View>
        <View row>
          <View flex>
            <UploadActionButton
              action="upload"
              icon={<Icons.Upload size={30} color={useColors('dark70')} />}
              label="Upload Image"
            />
          </View>
          <View flex>
            <UploadActionButton
              action="photo"
              icon={<Icons.Camera size={30} color={useColors('dark70')} />}
              label="Take Photo"
            />
          </View>
        </View>
        {finalImage && (
          <View flex mt25>
            <Text centered size="small" italic>
              Image Found: Preview
            </Text>
            <View style={UploadPictureStyles.finalizedWrapper} mt10>
              <FastImage
                style={{width: '100%', height: '100%', index: 2000}}
                source={{
                  uri: finalImage?.uri.startsWith('file://')
                    ? finalImage?.uri
                    : `file://${finalImage?.uri}`,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  if (screenView === 'camera') {
    return (
      <View style={UploadPictureStyles.cameraWrapper}>
        <View flex>
          <Camera
            ref={cameraRef}
            style={[{flex: 1, zIndex: 1}, cameraStyles]}
            device={device}
            isActive={cameraActive}
            photo={true}
            autoFocus="on"
            frameColor="white"
            zoom={1.5}
            enableZoomGesture={false}
            enableShutterSound
          />
        </View>
        <View row style={UploadPictureStyles.btWrapper}>
          <View flex mh20 row>
            <View mh5>
              <Text kqColor="white" size="small" font="open-7">
                Flash:
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={toggleFlash}>
                <Text kqColor={flashColor} size="small" font="open-7">
                  {capFirst(flashOption)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View flex rightAlign mh15>
            <TouchableOpacity onPress={handleCancelCamera}>
              <Icons.XCircleOutline size={25} color={useColors('white')} />
            </TouchableOpacity>
          </View>
        </View>
        <View row style={UploadPictureStyles.bbWrapper}>
          <View flex />
          <View centerVH>
            <TouchableOpacity
              onPress={handleTakePhoto}
              style={UploadPictureStyles.cameraButton(buttonWidth)}>
              <View flex style={UploadPictureStyles.redDot} />
            </TouchableOpacity>
          </View>
          <View flex />
        </View>
      </View>
    );
  }

  if (screenView === 'crop' && tempImage) {
    return (
      <View flex centerVH>
        <Text centered italic size="xSmall">
          Loading Crop Screen, Please Wait
        </Text>
      </View>
    );
  }

  if (screenView === 'final' && finalImage) {
    return (
      <View flex>
        <View style={UploadPictureStyles.previewWrapper}>
          <FastImage
            style={{width: '100%', height: '100%', index: 2000}}
            source={{
              uri: finalImage?.uri.startsWith('file://')
                ? finalImage?.uri
                : `file://${finalImage?.uri}`,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View mt15>
          <Button
            type="outline"
            onPress={() => {
              setScreenView('crop');
            }}>
            Reset
          </Button>
        </View>
        <View mt5>
          <Button onPress={handleFinalizeImage}>Done</Button>
        </View>
      </View>
    );
  }
};

export default UploadPicture;
