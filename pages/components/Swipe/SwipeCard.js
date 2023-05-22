
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import themeStyle from '../../../styles/theme.style';
import Ionicons from "react-native-vector-icons/Ionicons";

const Item = ({ title, eventDate, description, onEditPress, onDeletePress, bgColor, time, desableSwipe }) => {
    // const textColor = shouldUseWhiteText(color) ? 'white' : 'black';
    const formattedDate = new Date(eventDate).toISOString().slice(0, 10);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    let dateFormated = convertdate(eventDate)
    const [isChecked, setIsChecked] = useState(false);

    const handlePress = () => {
        setIsChecked(!isChecked);
    }
    const renderRightActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [100, 0],
        });

        return (
            <View style={styles.rightActions}>
                <TouchableOpacity onPress={onDeletePress}>
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 100],
        });

        return (
            <View style={styles.leftActions}>
                <TouchableOpacity onPress={onEditPress}>
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <>
            {desableSwipe === true ? <Swipeable
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                swipeThreshold={0.25} // set the swipe threshold to 25%
                useNativeAnimations={true}
            >
                <View style={styles.cardBox}>
                    <View style={[styles.dotView, { backgroundColor: bgColor }]} />
                    <View style={{ alignSelf: "center", marginRight: 10 }}>
                        <Text style={styles.titleday}>{dateFormated.day}</Text>
                        <Text style={styles.titleMonth}>{dateFormated.month}</Text>
                    </View>
                    <View style={[styles.cardView, { backgroundColor: bgColor }]}>
                        <View style={styles.cardHeder}>
                            <Text style={styles.titleMonth}>{title}</Text>
                            <Text style={styles.titleMonth}>{time}</Text>
                        </View>
                        {/* <Text numberOfLines={1} style={[styles.textDescription,{width:200}]}>{description}</Text> */}
                        {isExpanded ? (
                            <Text style={[styles.textDescription, { width: 200 }]}>{description}</Text>
                        ) : (
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.textDescription, { width: 200 }]}>{description}</Text>
                        )}
                        <TouchableOpacity onPress={toggleExpand}>
                            <Text style={styles.endtext}>{isExpanded ? 'Show Less' : 'See More'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handlePress}>
                        <View style={styles.checkMarkView}>
                            {isChecked && (
                                <View style={styles.checkMark}>
                                    <Ionicons name="checkmark-done" size={18} color="white" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </Swipeable> :
                <View style={styles.cardBox}>
                    <View style={[styles.dotView, { backgroundColor: bgColor }]} />
                    <View style={{ alignSelf: "center", marginRight: 10 }}>
                        <Text style={styles.titleday}>{dateFormated.day}</Text>
                        <Text style={styles.titleMonth}>{dateFormated.month}</Text>
                    </View>
                    <View style={[styles.cardView, { backgroundColor: bgColor }]}>
                        <View style={styles.cardHeder}>
                            <Text style={styles.titleMonth}>{title}</Text>
                            <Text style={styles.titleMonth}>{time}</Text>
                        </View>
                        {/* <Text numberOfLines={1} style={[styles.textDescription,{width:200}]}>{description}</Text> */}
                        {isExpanded ? (
                            <Text style={[styles.textDescription, { width: 200 }]}>{description}</Text>
                        ) : (
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.textDescription, { width: 200 }]}>{description}</Text>
                        )}
                        <TouchableOpacity onPress={toggleExpand}>
                            <Text style={styles.endtext}>{isExpanded ? 'Show Less' : 'See More'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handlePress}>
                        <View style={styles.checkMarkView}>
                            {isChecked && (
                                <View style={styles.checkMark}>
                                    <Ionicons name="checkmark-done" size={18} color="white" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            }

        </>
    );
};

const convertdate = (dateString) => {
    console.log("DateString", dateString);
    if (dateString) {
        const date = new Date(dateString);
        const dayOfMonth = date.getDate();
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
        const formattedDate = `${dayOfMonth} ${monthName}`;
        return { day: dayOfMonth, month: monthName };
    }

}

const SwipeCard = ({ Data, handleEditPress, handleDeletePress, desableSwipe }) => {


    return (
        <View style={{ height: 300 }}>
            <FlatList
                data={Data}
                nestedScrollEnabled
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <Item
                        eventDate={item?.dueDate}
                        title={item?.title}
                        description={item?.description}
                        bgColor={item?.bgcolor}
                        time={item?.time}
                        onEditPress={() => handleEditPress(item._id)}
                        onDeletePress={() => handleDeletePress(item._id)}
                        desableSwipe={desableSwipe}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 10,
    },
    title: {
        fontSize: 12,
    },
    rightActions: {
        // flexDirection: 'row',
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        // flex: 1,
    },
    actionText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: "red",
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    cardBox: {
        backgroundColor: themeStyle.CONTAINER_COLOR,

        padding: 10,
        marginVertical: 2,
        // marginHorizontal: 16,
        flexDirection: "row",
        // justifyContent: "space-around"
        // alignSelf:"center"

    },
    dotView: {
        height: 10,
        width: 10,
        backgroundColor: "red",
        borderRadius: 100,
        alignSelf: "center",
        marginRight: 15
    },
    titleMonth: {
        fontSize: 16,
    },
    titleday: {
        fontSize: 20,
    },
    cardView: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff',
        // height: 45,
        width: 250,
        borderRadius: 10,
        marginLeft: 10

    }, cardHeder: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 15,
        marginTop: 5
    }, textDescription: {
        fontSize: 14,
        marginLeft: 15,
        marginTop: 8,
        marginBottom: 5
    }, checkMarkView: {
        height: 20,
        width: 20,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        bottom: 0,
        right: 5,
        top: 30,
        position: "absolute",
        marginBottom: 10,
    },
    checkMark: {
        position: 'absolute',
        top: -5,
        right: -8,
        height: 25,
        width: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    endtext: {
        fontSize: 14,
        marginLeft: 15,
        marginTop: 1,
        marginBottom: 2
    }

});

export default SwipeCard;
