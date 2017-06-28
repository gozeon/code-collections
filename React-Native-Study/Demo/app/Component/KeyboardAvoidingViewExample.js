import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableHighlight,
	KeyboardAvoidingView, SegmentedControlIOS, TextInput, } from 'react-native';
import STYLE from '../Style/Style';

class KeyboardAvoidingViewExample extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			modalOpen: false,
			behavior: 'padding',
		}
	}

	onSegmentChange = (segment: String) => {
		this.setState({ behavior: segment.toLowerCase() })
	}

	render() {
		return (
			<View style={[styles.outerContainer, { paddingTop: 70, }]}>
				<Modal animationType='fade' visible={this.state.modalOpen}>
					<KeyboardAvoidingView behavior="padding" style={styles.container}>
						<SegmentedControlIOS
							onValueChange={this.onSegmentChange}
							selectedIndex={this.state.behavior === 'padding' ? 0 : 1}
							style={styles.segment}
							values={['Padding', 'Position']}
						/>
						<TextInput placeholder="<TextInput />" style={styles.textInput} />
					</KeyboardAvoidingView>
					<TouchableHighlight onPress={() => {
						this.setState({ modalOpen: false })
					}} style={styles.closeButton}>
						<Text>Close</Text>
					</TouchableHighlight>
				</Modal>
				<TouchableHighlight onPress={() => this.setState({modalOpen: true})}>
					<Text>Open Example</Text>
				</TouchableHighlight>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	outerContainer: {
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	segment: {
		marginBottom: 10,
	},
  textInput: {
		borderRadius: 5,
		borderWidth: 1,
		height: 44,
		paddingHorizontal: 10,
	},
  closeButton: {
		position: 'absolute',
		top: 30,
		left: 10,
	}
})

export { KeyboardAvoidingViewExample as default }