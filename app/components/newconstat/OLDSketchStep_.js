import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Canvas } from 'react-native-canvas';
import { useConstatStore } from '../../../store/constatStore';

export default function SketchStep() {
  const { sketchNotes, setSketchNotes, sketchImage, setSketchImage } = useConstatStore();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const handleCanvas = (canvas) => {
    if (!canvas) return;
    
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 300;
    canvas.height = 300;
    
    // Set up canvas for drawing
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };
  
  const startDrawing = (event) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const { locationX, locationY } = event.nativeEvent;
    
    ctx.beginPath();
    ctx.moveTo(locationX, locationY);
    setIsDrawing(true);
  };
  
  const draw = (event) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const { locationX, locationY } = event.nativeEvent;
    
    ctx.lineTo(locationX, locationY);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
    
    // Save the sketch as an image
    canvasRef.current.toDataURL('image/png', (base64) => {
      setSketchImage({ uri: `data:image/png;base64,${base64}`, base64 });
    });
  };
  
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSketchImage(null);
  };
  
  return (
    <View style={tw`bg-white rounded-lg p-6 shadow-sm`}>
      <Text style={tw`text-xl font-[OutfitB] mb-6 text-center`}>
        Croquis de l'accident
      </Text>
      
      <Text style={tw`text-gray-600 mb-4 font-[OutfitR]`}>
        Dessinez un croquis simple de l'accident pour illustrer les circonstances.
      </Text>
      
      <View 
        style={tw`border-2 border-gray-300 rounded-lg mb-4 h-80 overflow-hidden`}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      >
        <Canvas ref={handleCanvas} />
      </View>
      
      <View style={tw`flex-row justify-end mb-4`}>
        <TouchableOpacity 
          style={tw`bg-gray-200 p-2 rounded-lg flex-row items-center`}
          onPress={clearCanvas}
        >
          <Ionicons name="trash-outline" size={20} color="#0a7ea4" style={tw`mr-2`} />
          <Text style={tw`text-[#0a7ea4] font-[OutfitM]`}>Effacer</Text>
        </TouchableOpacity>
      </View>
      
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Notes sur le croquis</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 h-24 font-[OutfitR]`}
          placeholder="Ajoutez des notes explicatives sur le croquis"
          value={sketchNotes}
          onChangeText={setSketchNotes}
          multiline
        />
      </View>
    </View>
  );
}