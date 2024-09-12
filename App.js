import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Vibration } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('');
  const [lastNumber, setLastNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // New state for modal visibility

  const buttons = [
    ['C', 'DEL', 'MODE', '/'],
    [7, 8, 9, '*'],
    [4, 5, 6, '-'],
    [1, 2, 3, '+'],
    ['+/-', 0, '.', '=']
  ];

  function calculator() {
    if (currentNumber === '') {
      setCurrentNumber('0');
      return;
    }
    
    if (['/', '*', '-', '+', '.'].includes(currentNumber[currentNumber.length - 1])) {
      setCurrentNumber(currentNumber + '0');
    }

    let sanitizedExpression = currentNumber.replace(/--/g, '+');

    try {
      let result = eval(sanitizedExpression).toString();
      setCurrentNumber(result);
    } catch (error) {
      console.error('Invalid expression:', error);
      setCurrentNumber('Error');
    }
  }

  function handleInput(buttonPressed) {
    Vibration.vibrate(35);
    
    if (buttonPressed === '+/-') {
      if (currentNumber !== '') {
        const operatorRegex = /[+\-*/]/;
        if (operatorRegex.test(currentNumber)) {
          setLastNumber("(" + currentNumber + ")" + "*-1" + '=');
          let result = eval("(" + currentNumber + ")" + "*-1").toString();
          setCurrentNumber(result);
        } else {
          setCurrentNumber((currentNumber * -1).toString());
        }
      }
      return;
    }

    if (lastNumber && (!isNaN(buttonPressed) || buttonPressed === '.')) {
      setCurrentNumber(buttonPressed);  // Start fresh with the new number
      setLastNumber('');  // Clear the lastNumber
      return;
    }

    if (lastNumber && ['+', '-', '*', '/', '.'].includes(buttonPressed)) {
      setCurrentNumber(currentNumber + buttonPressed);
      setLastNumber('');  // Clear the lastNumber after appending operator
      return;
    }

    if (['+', '-', '*', '/'].includes(buttonPressed)) {
      setCurrentNumber(currentNumber + buttonPressed);
      return;
    } else if (!isNaN(buttonPressed) || buttonPressed === '.') {
      setCurrentNumber(currentNumber + buttonPressed);
    }

    switch (buttonPressed) {
      case 'DEL':
        setCurrentNumber(currentNumber.slice(0, -1));
        return;
      case 'C':
        setLastNumber('');
        setCurrentNumber('');
        return;
      case '=':
        if (['/', '*', '-', '+', '.'].includes(currentNumber[currentNumber.length - 1])) {
          setLastNumber(currentNumber + '0' + '=');
        } else {
          setLastNumber(currentNumber + '=');
        }
        calculator();
        return;
    }
  }

  // Function to handle advanced calculations
  function handleAdvancedFunction(func) {
    let result;
let number = parseFloat(currentNumber);

    switch (func) {
      case 'sqrt':
        result = Math.sqrt(number).toString();
        break;
      case 'cbrt':
        result = Math.cbrt(number).toString();
        break;
      case 'abs':
        result = Math.abs(number).toString();
        break;
      case 'square':
        result = Math.pow(number, 2).toString();
        break;
      case 'cube':
        result = Math.pow(number, 3).toString();
        break;
      case 'log':
        result = Math.log10(number).toString();
        break;
      case 'ln':
        result = Math.log(number).toString();
        break;
      case 'percent':
        result = (number / 100).toString();
        break;
      case 'sin':
          result = Math.sin(number).toString();
          break;
      case 'cos':
          result = Math.cos(number).toString();
          break;
      case 'tan':
          result = Math.tan(number).toString();
          break;
      case 'cot':
          result = (1 / Math.tan(number)).toString();
          break;
      case 'x^y':
        setCurrentNumber(currentNumber + '^');
        setModalVisible(false);
        return;
      default:
        result = number.toString();
    }

    setCurrentNumber(result);
    setLastNumber(func + '(' + number + ')=');
    setModalVisible(false);
  }

  const dynamicStyles = StyleSheet.create({
    result: {
      backgroundColor: darkMode ? '#282f3b' : '#f5f5f5',
      width: '100%',
      height: '75%',
      flex: 2,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      paddingTop: 20,
      paddingRight: 20,
    },
    historyText: {
      color: darkMode ? '#B5B7BB' : '#7c7c7c',
      fontSize: 20,
      marginRight: 10,
      alignSelf: 'flex-end',
    },
    themeButton: {
      position: 'absolute',
      top: 30,
      right: 20,
      backgroundColor: darkMode ? '#6699CC' : '#e5e5e5',
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
      zIndex: 1,
    },
    button: {
      borderColor: darkMode ? '#FF6600' : '#e5e5e5',
      alignItems: 'center',
      justifyContent: 'center',
      height: 80,
      flex: 1,
      margin: 5,
      borderRadius: 20,
    },
    operatorButton: {
      backgroundColor: darkMode ? '#9933CC' : '#FF6600',
      flex: 1,
      height: 80,
      margin: 5,
      borderRadius: 20,
    },
    numberButton: {
      backgroundColor: darkMode ? '#006666' : '#66FF00',
      flex: 1,
      height: 80,
      margin: 5,
      borderRadius: 20,
    },
    textButton: {
      color: darkMode ? '#b5b7bb' : '#7c7c7c',
      fontSize: 28,
    },
    textOperatorButton: {
      color: 'white',
      fontSize: 28,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: darkMode ? '#3f4d5b' : '#CC6600',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalButton: {
      width: '100%',
      padding: 15,
      marginVertical: 5,
      alignItems: 'center',
      backgroundColor: darkMode ? '#4a5b6a' : '#e5e5e5',
      borderRadius: 10,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    gridItem: {
      width: '40%',
      margin: 10,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      backgroundColor: darkMode ? '#4a5b6a' : '#e5e5e5',
      borderRadius: 10,
    },
    modalButtonText: {
      fontSize: 14,
      color: darkMode ? '#fff' : '#000',
      textAlign: 'center',
    },
    buttonsContainer: {
      width: '100%',
      flex: 3,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 20,
      backgroundColor: darkMode ? '#336699' : '#fff',
    },
  });
  

  return (
    <View style={styles.container}>
<TouchableOpacity style={dynamicStyles.themeButton}>
        <Entypo
          name={darkMode ? 'light-up' : 'moon'}
          size={24}
          color={darkMode ? 'white' : 'black'}
          onPress={() => setDarkMode(!darkMode)}
        />
      </TouchableOpacity>

      <View style={dynamicStyles.result}>
        <Text style={dynamicStyles.historyText}>{lastNumber}</Text>
        <Text style={dynamicStyles.historyText}>{currentNumber}</Text>
      </View>
      
      <View style={dynamicStyles.buttonsContainer}>
  {buttons.map((row, rowIndex) => (
    <View key={rowIndex} style={styles.buttonsRow}>
      {row.map((button) => (
        <TouchableOpacity
          key={button}
          style={[
            dynamicStyles.button,
            ['/', '*', '-', '+', '='].includes(button)
              ? dynamicStyles.operatorButton
              : dynamicStyles.numberButton
          ]}
          onPress={() => button === 'MODE' ? setModalVisible(true) : handleInput(button)}
        >
          <Text style={[
            ['/', '*', '-', '+', '='].includes(button)
              ? dynamicStyles.textOperatorButton
              : dynamicStyles.textButton
          ]}>
            {button}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  ))}
</View>


      {/* Modal for advanced functions */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={dynamicStyles.modalBackground}>
    <View style={dynamicStyles.modalContainer}>
      {}
      <View style={dynamicStyles.gridContainer}>
    
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('square')}>
          <Text style={dynamicStyles.modalButtonText}>x² (Square)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('cube')}>
          <Text style={dynamicStyles.modalButtonText}>x³ (Cube)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('sqrt')}>
          <Text style={dynamicStyles.modalButtonText}>√ (Square Root)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('cbrt')}>
          <Text style={dynamicStyles.modalButtonText}>∛ (Cube Root)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('abs')}>
          <Text style={dynamicStyles.modalButtonText}>|x| (Absolute Value)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('log')}>
          <Text style={dynamicStyles.modalButtonText}>log (Logarithm)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('x^y')}>
          <Text style={dynamicStyles.modalButtonText}>xʸ (Power)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('percent')}>
          <Text style={dynamicStyles.modalButtonText}>% (Percentage)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('sin')}>
          <Text style={dynamicStyles.modalButtonText}>sin(x)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('cos')}>
          <Text style={dynamicStyles.modalButtonText}>cos(x)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('tan')}>
          <Text style={dynamicStyles.modalButtonText}>tan(x)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.gridItem} onPress={() => handleAdvancedFunction('cot')}>
          <Text style={dynamicStyles.modalButtonText}>cot(x)</Text>
        </TouchableOpacity>
      </View>
      
      {/* Nút Close */}
      <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => setModalVisible(false)}>
        <Text style={dynamicStyles.modalButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonsContainer: {
    width: '100%',
    flex: 3, 
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
});