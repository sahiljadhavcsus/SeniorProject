import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';

/**

The content area is a wrapped row of content that 

*/
export default function ContentAreaHeaderBar(props){
	const {height, width} = useWindowDimensions();
	
	return (
		<View style={
			Object.assign
			(
				{
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center',
					alignSelf: 'stretch',
					overflow: 'hidden',
					width: '100%',
					height: 60
				}, 
				props.style
			)
		}>
			{props.children}
		</View>
	);
}