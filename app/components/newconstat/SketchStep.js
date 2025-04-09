import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useConstatStore } from '../../../store/constatStore';
import { Canvas, Path, useCanvasRef, Line, Group } from '@shopify/react-native-skia';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';

export default function SketchStep() {
  const constatState = useConstatStore();
  const canvasRef = useCanvasRef();
  const viewShotRef = useRef();
  const scrollViewRef = useRef();
  
  const [paths, setPaths] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [showGrid, setShowGrid] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // Available colors for drawing
  const colors = [
    { color: '#000000', name: 'Noir' },
    { color: '#FF0000', name: 'Rouge' },
    { color: '#0000FF', name: 'Bleu' },
    { color: '#00AA00', name: 'Vert' },
  ];
  
  // Stroke width options
  const strokeWidths = [
    { width: 2, name: 'Fin' },
    { width: 4, name: 'Moyen' },
    { width: 6, name: 'Épais' },
  ];
  
  // Get screen dimensions
  const { width } = Dimensions.get('window');
  const canvasSize = width - 32; // Full width minus padding
  
  // Predefined accident scenarios
  const accidentScenarios = [
    {
      title: "VÉHICULES CIRCULANT DANS LE MÊME SENS SUR LA MÊME CHAUSSÉE",
      subtitle: "",
      cases: [
        { id: 1, description: "Collision par l'arrière", responsibility: "X: 0, Y: 1" },
        { id: 2, description: "Collision latérale lors d'un changement de file", responsibility: "X: 0, Y: 1" },
        { id: 3, description: "Collision lors d'un dépassement", responsibility: "X: 0, Y: 1" },
        { id: 4, description: "Collision lors d'un changement de direction", responsibility: "X: 0, Y: 1" },
        { id: 5, description: "Collision lors d'une marche arrière", responsibility: "X: 0, Y: 1" },
        { id: 6, description: "Collision lors d'un demi-tour ou d'un virage à gauche", responsibility: "X: 0, Y: 1" },
        { id: 7, description: "Collision en épi", responsibility: "X: 0, Y: 1" },
      ]
    },
    {
      title: "VÉHICULES PROVENANT DE DEUX CHAUSSÉES DIFFÉRENTES",
      subtitle: "Leurs directions devant se couper ou se rejoindre",
      cases: [
        { id: 8, description: "Véhicule X prioritaire empiétant ou dépassant l'axe médian. Véhicule Y circulant dans son couloir de marche, voie à double sens.", responsibility: "X: 1/4, Y: 3/4" },
        { id: 9, description: "Véhicule X prioritaire de droite circulant dans son sens de marche ou bifurquant pour emprunter une voie à droite ou à gauche.", responsibility: "X: 0, Y: 1" },
        { id: 10, description: "Véhicule X prioritaire par signalisation circulant dans son sens de marche ou bifurquant pour emprunter une voie à droite ou à gauche.", responsibility: "X: 0, Y: 1" },
        { id: 11, description: "Véhicule X prioritaire par signalisation circulant dans son sens de marche ou bifurquant pour emprunter une voie à droite ou à gauche.", responsibility: "X: 0, Y: 1" },
        { id: 12, description: "Véhicule X prioritaire par signalisation circulant dans son sens de marche ou bifurquant pour emprunter une voie à droite ou à gauche.", responsibility: "X: 0, Y: 1" },
        { id: 13, description: "Véhicule X prioritaire par signalisation circulant dans son sens de marche ou bifurquant pour emprunter une voie à droite ou à gauche.", responsibility: "X: 0, Y: 1" },
        { id: 14, description: "Véhicule X prioritaire par signalisation circulant dans son sens de marche ou bifurquant pour emprunter une voie à droite ou à gauche.", responsibility: "X: 0, Y: 1" },
        { id: 15, description: "Véhicule X prioritaire par signalisation circulant dans son sens de marche ou bifurquant pour emprunter une voie à droite ou à gauche.", responsibility: "X: 0, Y: 1" },
      ]
    },
    {
      title: "VÉHICULES EN STATIONNEMENT OU ARRÊTÉS",
      subtitle: "",
      cases: [
        { id: 16, description: "Véhicule X en stationnement régulier heurté par véhicule Y", responsibility: "X: 0, Y: 1" },
        { id: 17, description: "Véhicule X en stationnement irrégulier heurté par véhicule Y", responsibility: "X: 1/3, Y: 2/3" },
        { id: 18, description: "Véhicule X ouvrant une portière et heurté par véhicule Y", responsibility: "X: 1, Y: 0" },
        { id: 19, description: "Véhicule X quittant un stationnement et heurté par véhicule Y", responsibility: "X: 1, Y: 0" },
        { id: 20, description: "Véhicule X prenant un stationnement et heurté par véhicule Y", responsibility: "X: 1, Y: 0" },
      ]
    },
    {
      title: "PIÉTONS",
      subtitle: "",
      cases: [
        { id: 21, description: "Piéton traversant sur un passage protégé", responsibility: "X: 1, Y: 0" },
        { id: 22, description: "Piéton traversant hors passage protégé", responsibility: "X: 1/2, Y: 1/2" },
      ]
    },
    {
      title: "CAS PARTICULIERS",
      subtitle: "",
      cases: [
        { id: 23, description: "Collision en chaîne", responsibility: "Selon circonstances" },
        { id: 24, description: "Collision avec un véhicule sur rails", responsibility: "X: 1, Y: 0" },
        { id: 25, description: "Collision avec un véhicule prioritaire en intervention", responsibility: "X: 0, Y: 1" },
        { id: 26, description: "Collision avec un animal", responsibility: "Selon circonstances" },
      ]
    }
  ];
  
  // Handle touch start
  const onTouchStart = (event) => {
    setIsDrawing(true);
    const { locationX, locationY } = event.nativeEvent;
    setCurrentPoints([{ x: locationX, y: locationY }]);
    
    // Disable scroll when drawing starts
    if (scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({ scrollEnabled: false });
    }
  };
  
  // Handle touch move
  const onTouchMove = (event) => {
    if (!isDrawing) return;
    
    const { locationX, locationY } = event.nativeEvent;
    setCurrentPoints(prevPoints => [...prevPoints, { x: locationX, y: locationY }]);
  };
  
  // Handle touch end
  const onTouchEnd = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    // Re-enable scroll when drawing ends
    if (scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({ scrollEnabled: true });
    }
    
    if (currentPoints.length < 2) {
      setCurrentPoints([]);
      return;
    }
    
    // Create SVG path from points
    let pathData = '';
    currentPoints.forEach((point, index) => {
      if (index === 0) {
        pathData = `M ${point.x} ${point.y}`;
      } else {
        pathData = `${pathData} L ${point.x} ${point.y}`;
      }
    });
    
    // Add the new path to paths array
    setPaths([...paths, { 
      path: pathData,
      color: currentColor,
      strokeWidth
    }]);
    
    // Clear current points
    setCurrentPoints([]);
  };
  
  // Handle touch cancel (e.g., when a system alert appears)
  const onTouchCancel = () => {
    setIsDrawing(false);
    setCurrentPoints([]);
    
    // Re-enable scroll when touch is cancelled
    if (scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({ scrollEnabled: true });
    }
  };
  
  // Clear the canvas
  const clearCanvas = () => {
    Alert.alert(
      "Effacer le croquis",
      "Êtes-vous sûr de vouloir effacer tout le croquis ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Effacer", style: "destructive", onPress: () => setPaths([]) }
      ]
    );
  };
  
  // Save the sketch
  const saveSketch = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        
        // Convert to base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Save to store
        constatState.setSketchImage({ uri, base64 });
        
        // If a template was selected, save that information too
        if (selectedTemplate) {
          constatState.setSketchTemplate(selectedTemplate);
        }
        
        Alert.alert("Succès", "Croquis enregistré avec succès");
      }
    } catch (error) {
      console.error("Error saving sketch:", error);
      Alert.alert("Erreur", "Impossible d'enregistrer le croquis");
    }
  };

  const caseImages = {
    1: require('../../../assets/images/croquis/1.png'),
    2: require('../../../assets/images/croquis/2.png'),
    3: require('../../../assets/images/croquis/3.png'),
    4: require('../../../assets/images/croquis/4.png'),
    5: require('../../../assets/images/croquis/5.png'),
    6: require('../../../assets/images/croquis/6.png'),
    7: require('../../../assets/images/croquis/7.png'),
    8: require('../../../assets/images/croquis/8.png'),
    9: require('../../../assets/images/croquis/9.png'),
    10: require('../../../assets/images/croquis/10.png'),
    11: require('../../../assets/images/croquis/11.png'),
    12: require('../../../assets/images/croquis/12.png'),
    13: require('../../../assets/images/croquis/13.png'),
    14: require('../../../assets/images/croquis/14.png'),
    15: require('../../../assets/images/croquis/15.png'),
    16: require('../../../assets/images/croquis/16.png'),
    17: require('../../../assets/images/croquis/17.png'),
    18: require('../../../assets/images/croquis/18.png'),
    19: require('../../../assets/images/croquis/19.png'),
    20: require('../../../assets/images/croquis/20.png'),
    21: require('../../../assets/images/croquis/21.png'),
    22: require('../../../assets/images/croquis/22.png'),
    23: require('../../../assets/images/croquis/23.png'),
    24: require('../../../assets/images/croquis/24.png'),
    25: require('../../../assets/images/croquis/25.png'),
    26: require('../../../assets/images/croquis/26.png'),
  };
  
  // Select a template
  const selectTemplate = (category, caseItem) => {
    setSelectedTemplate({
      category: category.title,
      caseId: caseItem.id,
      description: caseItem.description,
      responsibility: caseItem.responsibility
    });
    setShowTemplateModal(false);
    setShowTemplates(false);
  };
  
  // Render the grid programmatically
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const gridSize = 20; // Number of cells in each direction
    const gridLines = [];
    
    // Create horizontal lines
    for (let i = 0; i <= gridSize; i++) {
      gridLines.push(
        <Line
          key={`h-${i}`}
          p1={{ x: 0, y: i * (320 / gridSize) }}
          p2={{ x: 320, y: i * (320 / gridSize) }}
          color="#CCCCCC"
          style="stroke"
          strokeWidth={i % 5 === 0 ? 1 : 0.5}
        />
      );
    }
    
    // Create vertical lines
    for (let i = 0; i <= gridSize; i++) {
      gridLines.push(
        <Line
          key={`v-${i}`}
          p1={{ x: i * (320 / gridSize), y: 0 }}
          p2={{ x: i * (320 / gridSize), y: 320 }}
          color="#CCCCCC"
          style="stroke"
          strokeWidth={i % 5 === 0 ? 1 : 0.5}
        />
      );
    }
    
    return <Group opacity={0.3}>{gridLines}</Group>;
  };

  
  
  // Create a path from current points for live drawing
  const getCurrentPath = () => {
    if (currentPoints.length < 2) return null;
    
    let pathData = '';
    currentPoints.forEach((point, index) => {
      if (index === 0) {
        pathData = `M ${point.x} ${point.y}`;
      } else {
        pathData = `${pathData} L ${point.x} ${point.y}`;
      }
    });
    
    return pathData;
  };
  
  const FieldBubble = ({ number }) => (
    <View style={tw`h-6 w-6 rounded-full bg-gray-700 items-center justify-center mr-2`}>
      <Text style={tw`text-white font-[OutfitB] text-xs`}>{number}</Text>
    </View>
  );
  
  // Render template selection screen
  const renderTemplateSelection = () => {
    return (
      <View style={tw`mb-6`}>
        <Text style={tw`text-lg font-[OutfitB] text-gray-800 mb-4`}>
          Sélectionnez un cas type d'accident
        </Text>
        
        <Text style={tw`text-gray-600 mb-4`}>
          Choisissez parmi les cas types ci-dessous ou dessinez votre propre croquis.
        </Text>
        
        {/* Template categories */}
        {accidentScenarios.map((category, index) => (
          <View key={index} style={tw`mb-6`}>
            <Text style={tw`text-base font-[OutfitB] text-[#0a7ea4] mb-2`}>
              {category.title}
            </Text>
            
            {category.subtitle && (
              <Text style={tw`text-sm font-[OutfitM] text-gray-600 mb-2 italic`}>
                {category.subtitle}
              </Text>
            )}
            
            {/* Template cases */}
            <View style={tw`flex-row flex-wrap`}>
              {category.cases.map((caseItem) => (
                <TouchableOpacity
                  key={caseItem.id}
                  style={tw`w-1/3 p-1`}
                  onPress={() => selectTemplate(category, caseItem)}
                >
                  <View style={tw`border border-gray-300 rounded-lg p-2 items-center`}>
                    <Image
                      source={caseImages[caseItem.id]}
                      style={tw`w-full h-20 mb-1`}
                      resizeMode="contain"
                    />
                    <Text style={tw`text-xs text-center font-[OutfitM]`}>
                      Cas {caseItem.id}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        <TouchableOpacity
          style={tw`bg-[#0a7ea4] py-3 px-5 rounded-lg flex-row items-center justify-center mt-4`}
          onPress={() => setShowTemplates(false)}
        >
          <Ionicons name="pencil" size={20} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-[OutfitM]`}>Dessiner mon propre croquis</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Render the template details modal
  const renderTemplateModal = () => {
    return (
      <Modal
        visible={showTemplateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center p-4`}>
          <View style={tw`bg-white rounded-lg p-4 w-full max-w-md`}>
            <Text style={tw`text-lg font-[OutfitB] mb-2`}>Détails du cas</Text>
            
            {selectedTemplate && (
              <>
                <Image
                  source={{ uri: `asset:/images/croquis/${selectedTemplate.caseId}.png` }}
                  style={tw`w-full h-40 mb-4`}
                  resizeMode="contain"
                />
                
                <Text style={tw`font-[OutfitM] mb-1`}>
                  Cas {selectedTemplate.caseId}
                </Text>
                
                <Text style={tw`text-gray-700 mb-2`}>
                  {selectedTemplate.description}
                </Text>
                
                <Text style={tw`font-[OutfitB] mb-4`}>
                  Responsabilité: {selectedTemplate.responsibility}
                </Text>
                
                <View style={tw`flex-row justify-end`}>
                  <TouchableOpacity
                    style={tw`bg-gray-200 py-2 px-4 rounded-lg mr-2`}
                    onPress={() => setShowTemplateModal(false)}
                  >
                    <Text style={tw`text-gray-700`}>Fermer</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={tw`bg-[#0a7ea4] py-2 px-4 rounded-lg`}
                    onPress={() => {
                      setShowTemplateModal(false);
                      setShowTemplates(false);
                    }}
                  >
                    <Text style={tw`text-white`}>Sélectionner</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <ScrollView 
      ref={scrollViewRef}
      style={tw`bg-white rounded-lg shadow-sm`} 
      contentContainerStyle={tw`p-6`}
      scrollEnabled={!isDrawing}
    >
      <Text style={tw`text-xl font-[OutfitB] mb-6 text-center`}>
        Croquis de l'accident
      </Text>
      
      {showTemplates ? (
        renderTemplateSelection()
      ) : (
        <View style={tw`mb-6`}>
          <View style={tw`flex-row items-center mb-2`}>
            <FieldBubble number="13" />
            <Text style={tw`text-lg font-[OutfitB] text-gray-800`}>Croquis de l'accident</Text>
          </View>
          
          {selectedTemplate ? (
            <View style={tw`mb-4 p-3 bg-gray-100 rounded-lg`}>
              <View style={tw`flex-row items-center mb-2`}>
                <Text style={tw`font-[OutfitB] text-gray-800`}>Cas sélectionné: </Text>
                <Text style={tw`text-gray-700`}>Cas {selectedTemplate.caseId}</Text>
              </View>
              
              <Text style={tw`text-gray-700 mb-2`}>{selectedTemplate.description}</Text>
              
              <View style={tw`flex-row justify-between`}>
                <Text style={tw`text-gray-700`}>Responsabilité: {selectedTemplate.responsibility}</Text>
                
                <TouchableOpacity
                  onPress={() => setShowTemplates(true)}
                  style={tw`flex-row items-center`}
                >
                  <Text style={tw`text-[#0a7ea4] mr-1`}>Changer</Text>
                  <Ionicons name="refresh" size={16} color="#0a7ea4" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={tw`text-gray-500 mb-4 font-[OutfitR]`}>
              Dessinez un croquis de l'accident en indiquant la position des véhicules, 
              la direction, les panneaux de signalisation, etc.
            </Text>
          )}
          
          {/* Canvas container */}
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
            <View 
              style={tw`w-full h-80 border-2 border-gray-300 rounded-lg overflow-hidden bg-white`}
            >
              <Canvas style={tw`flex-1`} ref={canvasRef}>
                {showGrid && renderGrid()}
                
                {paths.map((p, index) => (
                  <Path
                    key={index}
                    path={p.path}
                    color={p.color}
                    style="stroke"
                    strokeWidth={p.strokeWidth}
                  />
                ))}
                
                {currentPoints.length > 1 && (
                  <Path
                    path={getCurrentPath()}
                    color={currentColor}
                    style="stroke"
                    strokeWidth={strokeWidth}
                  />
                )}
              </Canvas>
              
              {/* Transparent overlay for touch events */}
              <View 
                style={tw`absolute top-0 left-0 right-0 bottom-0`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchCancel}
              />
            </View>
          </ViewShot>
          
          {/* Drawing tools */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-700 font-[OutfitM] mb-2`}>Outils de dessin:</Text>
            
            {/* Color selection */}
            <View style={tw`flex-row mb-3`}>
              {colors.map((item) => (
                <TouchableOpacity
                  key={item.color}
                  style={tw`mr-3 items-center`}
                  onPress={() => setCurrentColor(item.color)}
                >
                  <View 
                    style={[
                      tw`w-8 h-8 rounded-full mb-1`,
                      { backgroundColor: item.color },
                      currentColor === item.color ? tw`border-2 border-gray-500` : null
                    ]}
                  />
                  <Text style={tw`text-xs text-gray-600`}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Stroke width selection */}
            <View style={tw`flex-row mb-4`}>
              {strokeWidths.map((item) => (
                <TouchableOpacity
                  key={item.width}
                  style={tw`mr-4 items-center`}
                  onPress={() => setStrokeWidth(item.width)}
                >
                  <View 
                    style={[
                      tw`h-${item.width} bg-black rounded-full mb-1`,
                      { width: 30 },
                      strokeWidth === item.width ? tw`bg-[#0a7ea4]` : null
                    ]}
                  />
                  <Text style={tw`text-xs text-gray-600`}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Action buttons */}
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`bg-gray-200 py-2 px-4 rounded-lg flex-row items-center`}
                onPress={() => setShowGrid(!showGrid)}
              >
                <Ionicons 
                  name={showGrid ? "grid" : "grid-outline"} 
                  size={18} 
                  color="#0a7ea4" 
                  style={tw`mr-1`} 
                />
                <Text style={tw`text-[#0a7ea4] font-[OutfitM] text-sm`}>
                  {showGrid ? "Masquer grille" : "Afficher grille"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={tw`bg-red-100 py-2 px-4 rounded-lg flex-row items-center`}
                onPress={clearCanvas}
              >
                <Ionicons name="trash-outline" size={18} color="red" style={tw`mr-1`} />
                <Text style={tw`text-red-500 font-[OutfitM] text-sm`}>Effacer tout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {!showTemplates && (
        <>
          {/* Notes section */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-gray-700 font-[OutfitM] mb-2`}>Légende / Notes:</Text>
            <View style={tw`flex-row items-center mb-2`}>
              <View style={tw`w-6 h-6 bg-red-500 rounded-full mr-2`} />
              <Text style={tw`text-gray-700`}>Véhicule A</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <View style={tw`w-6 h-6 bg-blue-500 rounded-full mr-2`} />
              <Text style={tw`text-gray-700`}>Véhicule B</Text>
            </View>
            <View style={tw`flex-row items-center mb-4`}>
              <Ionicons name="arrow-forward" size={24} color="black" style={tw`mr-2`} />
              <Text style={tw`text-gray-700`}>Direction</Text>
            </View>
          </View>
          
          {/* Save button */}
          <TouchableOpacity
            style={tw`bg-[#0a7ea4] py-3 px-5 rounded-lg flex-row items-center justify-center mb-4`}
            onPress={saveSketch}
          >
            <Ionicons name="save-outline" size={20} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-[OutfitM]`}>Enregistrer le croquis</Text>
          </TouchableOpacity>
          
          {/* Return to templates button */}
          <TouchableOpacity
            style={tw`bg-gray-200 py-3 px-5 rounded-lg flex-row items-center justify-center mb-4`}
            onPress={() => setShowTemplates(true)}
          >
            <Ionicons name="grid-outline" size={20} color="#555" style={tw`mr-2`} />
            <Text style={tw`text-gray-700 font-[OutfitM]`}>Voir les cas types</Text>
          </TouchableOpacity>
        </>
      )}
      
      {renderTemplateModal()}
    </ScrollView>
  );
} 