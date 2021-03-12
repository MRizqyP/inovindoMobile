import React, {Component} from 'react';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  mapElement: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  keyboardType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  label: PropTypes.string,
};

const defaultProps = {
  mapElement: (n) => {},
  onSubmitEditing: () => {},
  onChangeText: () => {},
  value: '',
  placeholder: '',
  maxLength: 200,
  keyboardType: 'default',
  secureTextEntry: false,
  label: '',
};

export default class InputTexts extends Component {
  state = {
    value: '',
  };
  componentDidMount() {
    this.setState({
      value: this.props.value,
    });
  }
  onChangeText = (value) => {
    this.setState(
      {
        value,
      },
      () => {
        this.props.onChangeText(value);
      },
    );
  };

  render() {
    const {
      placeholder,
      secureTextEntry,
      keyboardType,
      maxLength,
      value,
      onChangeText,
      onSubmitEditing,
    } = this.props;
    return (
      <View style={this.props.style}>
        <Text style={style.inputTitle}> {this.props.label} </Text>
        <TextInput
          keyboardType={keyboardType}
          maxLength={maxLength}
          returnKeyType="next"
          value={this.state.value}
          onSubmitEditing={onSubmitEditing}
          onChangeText={this.onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          style={style.input}
        />
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#D8D8D8',
            marginBottom: 10,
          }}></View>
      </View>
    );
  }
}
InputTexts.propTypes = propTypes;
InputTexts.defaultProps = defaultProps;

const style = StyleSheet.create({
  inputTitle: {
    color: '#ABB4BD',
    fontSize: 14,
  },
  input: {
    paddingVertical: 12,
    color: '#1D2029',
    fontSize: 14,
    fontFamily: 'Avenir Next',
  },
});
