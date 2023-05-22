import {
  View,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  TextInput
} from "react-native";
import { useState, useContext, useCallback, useRef, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import theme from "../../styles/theme.style";
import { AuthContext } from "../../context";
import { useFocusEffect } from "@react-navigation/native";
import Popup from "../components/Popup/Popup";
import SwipeCard from "../components/Swipe/SwipeCard";
import axios from 'axios';
import { API } from "../../backendGlobal";

const CalanderApi = API
const isWeb = Platform.OS === 'web'
function CalendarScreen() {
  const [visible, setVisible] = useState(false);
  const [currentMonth, setMonth] = useState(
    parseInt(new Date().toISOString().slice(5, 7))
  );
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(null);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [success, setSuccess] = useState(false);
  const { token } = useContext(AuthContext);
  const [reminders, setReminders] = useState([]);
  const [remindersTemp, setRemindersTemp] = useState([]);
  const [editEvent, seteEditEvent] = useState(false)
  const [editindex, setEditedIndex] = useState(null);
  const [editID, setEditId] = useState(null)
  const [bgColor, setBgcolor] = useState(null)
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().slice(0, 10));
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [isAM, setIsAM] = useState();

  console.log("+++>", reminders);
  const [selectedTab, setSelectedTab] = useState('reminders');
  const { width } = useWindowDimensions();
  const isLandscape = width > 700

  const handleDayPress = (date) => {
    setSelectedDay(date.dateString)
    setDueDate(date.dateString);

    openPopup()

  };
  const handleAMPress = () => {
    setIsAM(true);
  };

  const handlePMPress = () => {
    setIsAM(false);
  };

  const openPopup = () => {
    setVisible(true);

  }

  const generateColor = () => {
    const minBrightness = 120; // Minimum brightness value for light colors
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 3; i++) {
      // Generate a random RGB value within the range [minBrightness, 255]
      const randomValue = Math.floor(Math.random() * (255 - minBrightness + 1)) + minBrightness;
      const hexValue = randomValue.toString(16).padStart(2, '0');
      color += hexValue;
    }

    return color;
  };


  const shouldUseWhiteText = (color) => {
    // Convert color to RGB values
    const red = parseInt(color.substr(1, 2), 16);
    const green = parseInt(color.substr(3, 2), 16);
    const blue = parseInt(color.substr(5, 2), 16);

    // Calculate brightness using W3C formula
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

    // Use white text for dark colors, black text for light colors
    return brightness < 128;
  };


  const closePopup = () => {
    setVisible(false);
  }
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };
  const ReminderCreation = async () => {

    // axios.put('https://ef7b-49-36-83-215.ngrok-free.app/newreminders/edit/645cf1f25389ea38afc005e9', {
    //   title: title,
    //   description: 'New Description',
    //   dueDate: '2023-05-20',
    //   time: '10:30 AM'
    // })
    //   .then(response => {
    //     console.log(response.data);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    const formattedTime = time + (isAM ? ' AM' : ' PM');
    if (editEvent) {
      const updatedItems = [...remindersTemp];
      try {
        // `${process.env.BACKEND_IP_PORT}/reminders/edit`, 
        const response = await axios.put(`${CalanderApi}/newreminders/edit/${editID}`, {
          title: title,
          description: description,
          dueDate: dueDate,
          time: formattedTime
        })
        console.log("ResponseEdit", response);
        if (response.status == 200) {
          seteEditEvent(false)
          closePopup()
          setSuccess(true)
          setEditId("")
          setDueDate("");
          setTitle("");
          setTime("")
          setDescription("");
          setEditedIndex("")
          setBgcolor("")
          return alert(' Success');
          // setSuccess(true);//Tem Disabled due to api
        }
      } catch (error) {
        console.log(error.message);
      }
      // Replace the object at the index with the new object
      // updatedItems[editindex] = {
      //   _id: editID,
      //   dueDate: dueDate,
      //   title: title,
      //   description: description,
      //   time: time,
      //   bgcolor: bgColor
      // };

    }
    else {
      closePopup()
      // const generateNumber = () => {
      //   return Math.floor(Math.random() * 90000) + 10000;
      // }
      const color = generateColor();
      // const id = generateNumber();
      // remindersTemp.push({
      //   _id: id,
      //   dueDate: dueDate,
      //   time: time,
      //   title: title,
      //   description: description,
      //   bgcolor: color
      // })
      //Temp solution
      try {
        const response = await axios.post(`${CalanderApi}/newreminders/add`, {
          title: title,
          description: description,
          dueDate: dueDate,
          bgcolor: color,
          time: time,
        }).then((result) => {

          setEditId("")
          setDueDate("");
          setTitle("");
          setTime("")
          setDescription("");
          setEditedIndex("")
          setBgcolor("")
          return result
        }).catch((error) => {
          return error
        });
        if (response.status === 200) {
          setSuccess(true)
          getAllReminders()
          console.log("newRemonder=>", response)

        }

      } catch (error) {
        console.log("Error=>", error.message);
      }
    }


  };
  const clearInputs = () => {
    setTitle("");
    setTime("")
    setDescription("");
  };

  useEffect(() => {
    getAllReminders()
  }, [bgColor])


  const getAllReminders = async () => {

    try {
      const response = await axios.get(`${CalanderApi}/newreminders/get`);

      if (response.status === 200) {
        setReminders(
          response.data.sort((a, b) =>
            a.dueDate > b.dueDate ? 1 : b.dueDate > a.dueDate ? -1 : 0
          )
        );
      } else {
        console.log("Error occurred getting reminders test 1");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const getReminders = async () => {

        try {
          const res = await fetch(
            process.env.BACKEND_IP_PORT + "/reminders/my_reminders_day",
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: token,
                selectedDay: selectedDay
              }),
              https: process.env.HTTP,
            }
          );
          const data = await res.json();
          if (res.status == 200) {
            setReminders(data.reminders);
          } else {
            console.log("Error occured getting reminders test");

          }
        } catch (error) {
          console.log(error);
        }
      };
      getReminders();
    }, [selectedDay, success])
  );

  const renderDay = (date, now) => {
    const isCurrentMonth = date.month === currentMonth;
    const event = reminders.find((reminder) => reminder.dueDate.substring(0, 10) === date.dateString);
    if (!isCurrentMonth) {
      // Return an empty view for days outside the current month
      return <View style={styles.emptyDayContainer} />;
    }

    return (
      <TouchableOpacity
        onPress={() => handleDayPress(date)}
        opacity={isCurrentMonth ? 1 : 0}
        style={{
          backgroundColor:
            date.dateString === now ? '#AFD2FF' : theme.CONTENT_MODULE_COLOR,
          width: 45,
          height: 45,
          borderRadius: 100,
          borderWidth: 2,
          borderColor: event ? event.bgcolor : theme.CONTENT_MODULE_COLOR,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: isCurrentMonth ? theme.TEXT_COLOR : 'black' }}>{date.day}</Text>
        {event && (
          <View
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: event.bgcolor,
            }}
          />
        )}
        {event && <Text numberOfLines={1} style={{ fontSize: 10, position: "absolute", bottom: 0 }}>{event.title}</Text>}
      </TouchableOpacity>
    );
  };

  const handleEditPress = (id) => {
    const item = reminders.find((item) => item._id === id);
    const index = reminders.findIndex((item) => item._id === id);
    setEditedIndex(index)
    console.log(`Edit button pressed for item with id ${id}`);
    seteEditEvent(true)
    openPopup()
    setDueDate(item?.dueDate.substring(0, 10));
    setTitle(item?.title);
    setTime(item?.time)
    setDescription(item?.description);
    setEditId(item?._id)
    setBgcolor(item?.bgcolor)

  };

  const handleDeletePress = async (id) => {
    const updatedData = reminders.filter(item => item._id !== id);
    setRemindersTemp(updatedData)
    console.log(`Delete button pressed for item with id ${id}`);
    try {
      const response = await axios.delete(`${CalanderApi}/newreminders/delete/${id}`);
      console.log("Delete Resss=>", response);
      if (response.status === 200) {


        getAllReminders()
      } else {
        console.log("Error occurred getting reminders test 1");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{
      width: '100%',
      marginTop: 25
    }}>
      <Calendar
        style={styles.calendar}
        onDayPress={handleDayPress}
        onMonthChange={(date) =>
          setMonth(parseInt(date.dateString.slice(5, 7)))
        }
        renderArrow={(direction) => {
          if (direction == "left")
            return <Ionicons name="chevron-back-outline" size={30} />;
          if (direction == "right")
            return <Ionicons name="chevron-forward-outline" size={30} />;
        }}
        dayComponent={({ date }) =>
          renderDay(date, new Date().toISOString().slice(0, 10))
        }
        theme={{
          monthTextColor: theme.TEXT_COLOR,
          calendarBackground: theme.CONTAINER_COLOR,
        }}
        current={new Date().toISOString().slice(0, 10)}
        monthFormat={"MMMM yyyy"}
        monthOnly={true}
      />

      <Popup
        visible={visible}
        transparent={true}
        dismiss={closePopup}
      >
        <View
          style={{
            alignSelf: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            borderColor: "#000",
            borderWidth: 1,
            height: 360,
            width: 250,
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            marginBottom: 300
          }}
        >
          <Text style={[styles.textHead, { marginVertical: 15 }]}>Create Reminder</Text>
          <TouchableOpacity style={{ position: "absolute", top: -10, right: -10, backgroundColor: "white", borderRadius: 20 }} onPress={() => { closePopup(), clearInputs() }}>
            <MaterialIcons size={25} name="cancel" />
          </TouchableOpacity>
          <TextInput
            placeholder={"Date Format: YYYY-MM-DD"}
            value={dueDate}
            onChangeText={setDueDate}
            style={styles.TextInput}
          />
          <View>
            <TextInput
              placeholder={"Time: 00:00:AM"}
              value={time}
              onChangeText={setTime}
              style={styles.TextInput}
            />
            <View style={{ flexDirection: 'row', position: "absolute", right: 3, top: 6 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: isAM ? '#ccc' : '#fff',
                  padding: 5,
                  marginRight: 10,
                }}
                onPress={handleAMPress}
              >
                <Text>AM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: !isAM ? '#ccc' : '#fff',
                  padding: 5,
                }}
                onPress={handlePMPress}
              >
                <Text>PM</Text>
              </TouchableOpacity>
            </View>
          </View>


          <TextInput
            placeholder={"Title"}
            value={title}
            onChangeText={setTitle}
            style={styles.TextInput}
          />
          <TextInput
            multiline={true}
            placeholder={"Description"}
            value={description}
            onChangeText={setDescription}
            style={[styles.TextInput, { height: 100 }]}
          />

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Button
              title="Save"
              onPress={ReminderCreation}
            />
            <Button title="Clear" onPress={clearInputs} />
          </View>
        </View>
      </Popup>
      <View style={{
        height: 5,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: "#AFD2FF",
        borderRadius: 5,
      }}
      >
      </View>
      <View style={{
        flexDirection: "column",
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: '100%',
          justifyContent: 'center',
        }}>
          <Text style={styles.textHead}>Reminders</Text>
          <SwipeCard Data={reminders} handleEditPress={handleEditPress}
            handleDeletePress={handleDeletePress}
            desableSwipe={true}
          />
        </View>
      </View>
    </View>
  );
}

export default CalendarScreen;

const styles = StyleSheet.create({
  button: {

  },
  modal: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.CONTAINER_COLOR,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: theme.CONTAINER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: {
    borderRadius: 10,
    borderWidth: 5,
    borderColor: theme.CONTAINER_COLOR,
  },
  TextInput: {
    height: 40,
    width: 220,
    marginBottom: 10,
    fontSize: 15,
    color: "black",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 5
  },
  ContentModule: {
    flexBasis: isWeb ? undefined : "100%",
    marginHorizontal: 10,
    marginBottom: 8.8,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: theme.CONTENT_MODULE_COLOR,
    borderRadius: 10,
    padding: 8.8,
  },
  tile: {
    width: "100%",
    height: 400,
  },
  text: {
    color: theme.TEXT_COLOR,
    fontSize: 15,
  },
  textHead: {
    fontSize: 20,
    alignSelf: "center",
  }
});
