import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';
import {Svg, Rect, Text as SvgText} from 'react-native-svg';
import Tts from 'react-native-tts';

const ObstacleDetectionApp = () => {
  return <ObstacleDetection />;
};

const OBSTACLE_CLASSES = [
  'door',
  'staircase',
  'stairs',
  'step',
  'steps',
  'bed',
  'car',
  'truck',
  'chair',
  'table',
  'sofa',
  'pole',
  'fire hydrant',
  'trash can',
  'bicycle',
  'motorcycle',
  'pothole',
  'curb',
  'sidewalk',
  'pedestrian',
  'wall',
  'fence',
  'bench',
  'tree',
  'construction',
  'bus',
  'dog',
  'desk',
  'glass door',
  'puddle',
  'elevator',
];

const ObstacleDetection = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [resizedUri, setResizedUri] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectionData, setDetectionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [RealTimeDetectionActive, setRealTimeDetectionActive] = useState(false);
  const [lastDetectedObstacles, setLastDetectedObstacles] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const time_gap = 200;

  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const RealTimeDetectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const getPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    };
    getPermission();

    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);

    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      if (RealTimeDetectionTimer.current) {
        clearInterval(RealTimeDetectionTimer.current);
      }

      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  const takePhoto = async () => {
    try {
      setIsCameraActive(true);

      await new Promise(resolve => setTimeout(resolve, 300));

      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto();
        const fileUri = 'file://' + photo.path;
        setImageUri(fileUri);
        setIsCameraActive(false);
        return fileUri;
      }
    } catch (err) {
      setError(`Error taking photo: ${err}`);
      setIsCameraActive(false);
      return null;
    }
  };

  const determineQuadrant = (
    x: number,
    y: number,
    width: number,
    height: number,
    imgWidth: number,
    imgHeight: number,
  ) => {
    const centerX = x;
    const centerY = y;

    const leftBoundary = imgWidth * 0.4;
    const rightBoundary = imgWidth * 0.6;
    const topBoundary = imgHeight * 0.4;
    const bottomBoundary = imgHeight * 0.6;

    let horizontalPosition = '';
    if (centerX < leftBoundary) {
      horizontalPosition = 'left';
    } else if (centerX > rightBoundary) {
      horizontalPosition = 'right';
    } else {
      horizontalPosition = 'center';
    }

    let verticalPosition = '';
    if (centerY < topBoundary) {
      verticalPosition = 'far';
    } else if (centerY > bottomBoundary) {
      verticalPosition = 'close';
    } else {
      verticalPosition = '';
    }

    if (horizontalPosition === 'center') {
      return verticalPosition ? `${verticalPosition} ahead` : 'ahead';
    } else {
      return verticalPosition
        ? `${verticalPosition} ${horizontalPosition}`
        : horizontalPosition;
    }
  };

  const announceObstacle = (
    predictions: any[],
    imageWidth: number,
    imageHeight: number,
  ) => {
    if (predictions.length === 0 || isSpeaking) return;

    const topObstacle = predictions[0];
    const quadrant = determineQuadrant(
      topObstacle.x,
      topObstacle.y,
      topObstacle.width,
      topObstacle.height,
      imageWidth,
      imageHeight,
    );

    const announcement = `${topObstacle.class} ${quadrant}`;
    Tts.speak(announcement);
  };

  const generalDetection = async (fileUri: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const resizedImage = await ImageResizer.createResizedImage(
        fileUri,
        640,
        480,
        'JPEG',
        80,
      );
      setResizedUri(resizedImage.uri);

      const imageData = await RNFS.readFile(resizedImage.uri, 'base64');

      const response = await axios.post(
        'https://detect.roboflow.com/obstacles-for-blind/3',
        imageData,
        {
          params: {api_key: 'sJeTm3O7K8cx54VbZSPK'},
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        },
      );

      const filteredPredictions = response.data.predictions.filter(
        (pred: any) =>
          OBSTACLE_CLASSES.some(cls =>
            pred.class.toLowerCase().includes(cls.toLowerCase()),
          ),
      );

      const sortedPredictions = [...filteredPredictions].sort(
        (a, b) => b.confidence - a.confidence,
      );

      const filteredData = {
        ...response.data,
        predictions: sortedPredictions,
      };

      setDetectionData(filteredData);
      setLastDetectedObstacles(sortedPredictions);

      setFrameCount(prevCount => {
        const newCount = prevCount + 1;

        if (newCount % 2 === 0 && sortedPredictions.length > 0) {
          announceObstacle(
            sortedPredictions,
            response.data.image.width,
            response.data.image.height,
          );
        }

        return newCount;
      });

      return sortedPredictions;
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error sending image to model: ${err.message}`);
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const startRealTimeDetection = () => {
    if (RealTimeDetectionTimer.current) {
      clearInterval(RealTimeDetectionTimer.current);
    }

    setRealTimeDetectionActive(true);
    setIsCameraActive(true);
    setFrameCount(0);

    const performDetection = async () => {
      try {
        if (cameraRef.current) {
          const photo = await cameraRef.current.takePhoto();
          const photoUri = 'file://' + photo.path;

          await generalDetection(photoUri);

          await RNFS.unlink(photoUri).catch(() => {});
        }
      } catch (err) {
        setError(`Error during auto detection: ${err}`);
      }
    };

    performDetection();

    RealTimeDetectionTimer.current = setInterval(performDetection, time_gap);
  };

  const stopRealTimeDetection = () => {
    if (RealTimeDetectionTimer.current) {
      clearInterval(RealTimeDetectionTimer.current);
      RealTimeDetectionTimer.current = null;
    }
    setRealTimeDetectionActive(false);
    setIsCameraActive(false);

    Tts.stop();
  };

  const resetDetection = () => {
    setImageUri(null);
    setResizedUri(null);
    setDetectionData(null);
    setLastDetectedObstacles([]);
    setError(null);
    setFrameCount(0);
  };

  const toggleRealTimeDetection = () => {
    if (RealTimeDetectionActive) {
      stopRealTimeDetection();
    } else {
      startRealTimeDetection();
    }
  };

  const manualDetection = async () => {
    const photoUri = await takePhoto();
    if (photoUri) {
      await generalDetection(photoUri);
    }
  };

  const deleteImage = async () => {
    if (imageUri) {
      await RNFS.unlink(imageUri).catch(() => {});
      resetDetection();
    }
  };

  const renderSvgOverlays = () => {
    if (!detectionData?.predictions || detectionData.predictions.length === 0) {
      return null;
    }

    return (
      <Svg style={styles.svg}>
        {detectionData.predictions.map((obj: any, index: number) => {
          const scaleX = 640 / detectionData.image.width;
          const scaleY = 480 / detectionData.image.height;

          return (
            <React.Fragment key={`${obj.class}-${index}`}>
              <Rect
                x={obj.x * scaleX - (obj.width * scaleX) / 2}
                y={obj.y * scaleY - (obj.height * scaleY) / 2}
                width={obj.width * scaleX}
                height={obj.height * scaleY}
                stroke="red"
                strokeWidth={2}
                fill="transparent"
              />
              <SvgText
                x={Math.max(obj.x * scaleX, 5)}
                y={Math.max(obj.y * scaleY, 10)}
                fontSize="16"
                fill="red"
                fontWeight="bold">
                {`${obj.class} (${(obj.confidence * 100).toFixed(1)}%)`}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  if (!device) return <Text>Loading camera...</Text>;
  if (!hasPermission) return <Text>Camera permission not granted</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          {isCameraActive ? (
            <View style={styles.cameraContainer}>
              <Camera
                ref={cameraRef}
                device={device}
                isActive={isCameraActive}
                photo={true}
                style={styles.camera}
              />
              {RealTimeDetectionActive && (
                <View style={styles.RealTimeDetectionOverlay}>
                  <Text style={styles.RealTimeDetectionText}>
                    Real Time Detection Active
                  </Text>
                  <ActivityIndicator size="large" color="#ffffff" />
                  {renderSvgOverlays()}
                  {isSpeaking && (
                    <View style={styles.speakingIndicator}>
                      <Text style={styles.speakingText}>Speaking</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ) : resizedUri ? (
            <View style={styles.resultContainer}>
              <Image source={{uri: resizedUri}} style={styles.image} />
              {renderSvgOverlays()}
            </View>
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>No image captured</Text>
              <Text style={styles.noImageSubtext}>
                Tap "Take Single Photo" or "Start Real Time Detection"
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.controlsContainer}>
            <Button
              title={
                RealTimeDetectionActive
                  ? 'Stop Real Time Detection'
                  : 'Start Real Time Detection'
              }
              onPress={toggleRealTimeDetection}
              color={RealTimeDetectionActive ? '#ff0000' : '#00aa00'}
            />

            {!RealTimeDetectionActive && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Take Single Photo"
                  onPress={manualDetection}
                  disabled={isLoading}
                />
                {imageUri && (
                  <Button title="Delete & Reset" onPress={deleteImage} />
                )}
                {!imageUri && detectionData && (
                  <Button title="Reset Detection" onPress={resetDetection} />
                )}
              </View>
            )}
          </View>

          <View style={styles.obstacleListContainer}>
            <View style={styles.listHeaderContainer}>
              <Text style={styles.listTitle}>Detected Obstacles:</Text>
              {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
            </View>

            <ScrollView
              style={styles.obstacleScroll}
              contentContainerStyle={styles.obstacleScrollContent}>
              {detectionData?.predictions &&
              detectionData.predictions.length > 0 ? (
                detectionData.predictions.map((obj: any, index: number) => (
                  <Text key={`${obj.class}-${index}`} style={styles.listItem}>
                    {`${obj.class} (${(obj.confidence * 100).toFixed(1)}%)`}
                  </Text>
                ))
              ) : (
                <Text style={styles.noObstaclesText}>
                  No relevant obstacles detected
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 0.75,
  },
  bottomSection: {
    flex: 0.25,
    display: 'flex',
    flexDirection: 'column',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  RealTimeDetectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  RealTimeDetectionText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  speakingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 200, 0, 0.7)',
    padding: 8,
    borderRadius: 5,
  },
  speakingText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  controlsContainer: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 4,
  },
  resultContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  svg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
  },
  noImageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
  },
  noImageSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  statusContainer: {
    backgroundColor: '#eaeaea',
    padding: 4,
    alignItems: 'center',
    marginTop: 4,
    borderRadius: 4,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  obstacleListContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  obstacleScroll: {
    flex: 1,
  },
  obstacleScrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  listItem: {
    fontSize: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    color: '#34495e',
  },
  noObstaclesText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#7f8c8d',
    textAlign: 'center',
    paddingVertical: 10,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 8,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ObstacleDetectionApp;

