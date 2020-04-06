import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, Image, Button } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPicker from 'rn-modal-picker';
import Modal from 'react-native-modalbox';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0045;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LATITUDE = 14.015660;
const LONGITUDE = 99.989653;

const config = {
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height
}

const actions = [
  {
    text: <Text style={{ fontFamily: "FC Ekaluck Bold ver 1.01", fontSize: 20 }}>แผนที่</Text>,
    icon: <Icon name="map" size={20} color="white" />,
    color: "#18DC5B",
    name: "bt_map",
    position: 1
  },
  {
    text: <Text style={{ fontFamily: "FC Ekaluck Bold ver 1.01", fontSize: 20 }}>ป้ายหยุดรถ</Text>,
    icon: <Icon name="map-marker" size={30} color="white" />,
    color: "#18DC5B",
    name: "bt_busstop",
    position: 2
  },
  {
    text: <Text style={{ fontFamily: "FC Ekaluck Bold ver 1.01", fontSize: 20 }}>ข้อมูล</Text>,
    icon: <Icon name="info" size={30} color="white" />,
    color: "#18DC5B",
    name: "bt_infor",
    position: 3
  }
];

class BusStop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,

      dataSource: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 2,
          name: "ศูนย์มหาวิทยาลัย"
        },
        {
          id: 3,
          name: "โรงอาหารกลาง"
        },
        {
          id: 4,
          name: "คณะศึกษาศาสตร์และพัฒนศาสตร์"
        },
        {
          id: 5,
          name: "คณะวิทยาศาสตร์การกีฬา"
        },
        {
          id: 6,
          name: "คณะสัตวแพทยศาสตร์ กำแพงแสน"
        },
        {
          id: 7,
          name: "คณะเกษตร กำแพงแสน"
        },
        {
          id: 8,
          name: "คณะวิศวกรรมศาสตร์ กำแพงแสน"
        },
        {
          id: 9,
          name: "ภาควิชาเกษตรกลวิธาน"
        },
        {
          id: 10,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 11,
          name: "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน"
        },
        {
          id: 12,
          name: "หอพักนิสิตชายและหญิง"
        },

      ],
      placeHolderText: "โปรดเลือกป้ายต้นทาง",
      selectedText: "",
      dataSource2: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 2,
          name: "ศูนย์มหาวิทยาลัย"
        },
        {
          id: 3,
          name: "โรงอาหารกลาง"
        },
        {
          id: 4,
          name: "คณะศึกษาศาสตร์และพัฒนศาสตร์"
        },
        {
          id: 5,
          name: "คณะวิทยาศาสตร์การกีฬา"
        },
        {
          id: 6,
          name: "คณะสัตวแพทยศาสตร์ กำแพงแสน"
        },
        {
          id: 7,
          name: "คณะเกษตร กำแพงแสน"
        },
        {
          id: 8,
          name: "คณะวิศวกรรมศาสตร์ กำแพงแสน"
        },
        {
          id: 9,
          name: "ภาควิชาเกษตรกลวิธาน"
        },
        {
          id: 10,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 11,
          name: "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน"
        },
        {
          id: 12,
          name: "หอพักนิสิตชายและหญิง"
        },
      ],

      dataSource2: [
        {
          id: 1,
          name: "ศูนย์มหาวิทยาลัย"
        },
        {
          id: 2,
          name: "โรงอาหารกลาง"
        },
        {
          id: 3,
          name: "คณะศึกษาศาสตร์และพัฒนศาสตร์"
        },
        {
          id: 4,
          name: "คณะวิทยาศาสตร์การกีฬา"
        },
        {
          id: 5,
          name: "คณะสัตวแพทยศาสตร์ กำแพงแสน"
        },
        {
          id: 6,
          name: "คณะเกษตร กำแพงแสน"
        },
        {
          id: 7,
          name: "คณะวิศวกรรมศาสตร์ กำแพงแสน"
        },
        {
          id: 8,
          name: "ภาควิชาเกษตรกลวิธาน"
        },
        {
          id: 9,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 10,
          name: "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน"
        },
        {
          id: 11,
          name: "หอพักนิสิตชายและหญิง"
        },
      ],
      dataSource3: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 3,
          name: "โรงอาหารกลาง"
        },
        {
          id: 4,
          name: "คณะศึกษาศาสตร์และพัฒนศาสตร์"
        },
        {
          id: 5,
          name: "คณะวิทยาศาสตร์การกีฬา"
        },
        {
          id: 6,
          name: "คณะสัตวแพทยศาสตร์ กำแพงแสน"
        },
        {
          id: 7,
          name: "คณะเกษตร กำแพงแสน"
        },
        {
          id: 9,
          name: "คณะวิศวกรรมศาสตร์ กำแพงแสน"
        },
        {
          id: 10,
          name: "ภาควิชาเกษตรกลวิธาน"
        },
        {
          id: 11,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 12,
          name: "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน"
        },
        {
          id: 13,
          name: "หอพักนิสิตชายและหญิง"
        },
      ],
      dataSource4: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 2,
          name: "คณะศึกษาศาสตร์และพัฒนศาสตร์"
        },
        {
          id: 3,
          name: "คณะวิทยาศาสตร์การกีฬา"
        },
        {
          id: 4,
          name: "คณะสัตวแพทยศาสตร์ กำแพงแสน"
        },
        {
          id: 5,
          name: "คณะเกษตร กำแพงแสน"
        },
        {
          id: 7,
          name: "คณะวิศวกรรมศาสตร์ กำแพงแสน"
        },
        {
          id: 8,
          name: "ภาควิชาเกษตรกลวิธาน"
        },
        {
          id: 9,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 10,
          name: "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน"
        },
        {
          id: 11,
          name: "หอพักนิสิตชายและหญิง"
        },
      ],
      dataSource5: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 2,
          name: "คณะวิทยาศาสตร์การกีฬา"
        },
        {
          id: 3,
          name: "คณะสัตวแพทยศาสตร์ กำแพงแสน"
        },
        {
          id: 4,
          name: "คณะเกษตร กำแพงแสน"
        },
        {
          id: 6,
          name: "คณะวิศวกรรมศาสตร์ กำแพงแสน"
        },
        {
          id: 7,
          name: "ภาควิชาเกษตรกลวิธาน"
        },
        {
          id: 8,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 9,
          name: "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน"
        },
        {
          id: 10,
          name: "หอพักนิสิตชายและหญิง"
        },
      ],
      dataSource6: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 2,
          name: "คณะสัตวแพทยศาสตร์ กำแพงแสน"
        },
        {
          id: 3,
          name: "คณะเกษตร กำแพงแสน"
        },
        {
          id: 5,
          name: "คณะวิศวกรรมศาสตร์ กำแพงแสน"
        },
        {
          id: 6,
          name: "ภาควิชาเกษตรกลวิธาน"
        },
        {
          id: 7,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 8,
          name: "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน"
        },
        {
          id: 9,
          name: "หอพักนิสิตชายและหญิง"
        },
      ],
      dataSource7: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 3,
          name: "คณะวิศวกรรมศาสตร์ กำแพงแสน"
        },
        {
          id: 4,
          name: "ภาควิชาเกษตรกลวิธาน"
        },
        {
          id: 5,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 6,
          name: "หอพักนิสิตชายและหญิง"
        },
      ],
      dataSource8: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 3,
          name: "ภาควิชาเกษตรกลวิธาน"
        },
        {
          id: 4,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 5,
          name: "หอพักนิสิตชายและหญิง"
        },
      ],
      dataSource9: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 3,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 4,
          name: "หอพักนิสิตชายและหญิง"
        },
      ],
      dataSource10: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 3,
          name: "หอพักนิสิตชายและหญิง"
        },
      ],
      dataSource12: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 2,
          name: "ศูนย์มหาวิทยาลัย"
        },
        {
          id: 3,
          name: "โรงอาหารกลาง"
        },
        {
          id: 4,
          name: "คณะศึกษาศาสตร์และพัฒนศาสตร์"
        },
        {
          id: 5,
          name: "คณะวิทยาศาสตร์การกีฬา"
        },
        {
          id: 6,
          name: "คณะสัตวแพทยศาสตร์ กำแพงแสน"
        },
        {
          id: 7,
          name: "คณะเกษตร กำแพงแสน"
        },
        {
          id: 9,
          name: "คณะวิศวกรรมศาสตร์ กำแพงแสน"
        },
        {
          id: 10,
          name: "ภาควิชาเกษตรกลวิธาน"
        },
        {
          id: 11,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 12,
          name: "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน"
        },
      ],
      dataSource13: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 2,
          name: "คณะเกษตร กำแพงแสน"
        },
        {
          id: 4,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 5,
          name: "หอพักนิสิตชายและหญิง"
        }
      ],
      dataSource14: [
        {
          id: 1,
          name: "อาคารประชาสัมพันธ์"
        },
        {
          id: 4,
          name: "สำนักหอสมุดกำแพงแสน"
        },
        {
          id: 5,
          name: "หอพักนิสิตชายและหญิง"
        }
      ],
      placeHolderText2: "โปรดเลือกป้ายปลายทาง",
      selectedText2: "",
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudenow: 0,
      longitudenow: 0,
      gotoText: "",

    };
  }


  _selectedValue(index, item) {
    this.setState({ selectedText: item.name });
    this.setState({ gotoText: "เพื่อไป" });
  }

  _selectedValue2(index, item) {
    this.BusLine();
    this.setState({ selectedText2: item.name });
  }
  BusLine() {
    if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "ศูนย์มหาวิทยาลัย") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/1-2.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "โรงอาหารกลาง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/1-3.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "คณะศึกษาศาสตร์และพัฒนศาสตร์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/1-4.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "คณะวิทยาศาสตร์การกีฬา") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/1-5.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/1-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "คณะวิศวกรรมศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/1-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "ภาควิชาเกษตรกลวิธาน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/1-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/1-9.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "โรงอาหารกลาง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/2-3.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "คณะศึกษาศาสตร์และพัฒนศาสตร์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/2-4.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "คณะวิทยาศาสตร์การกีฬา") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/2-5.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/2-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "คณะวิศวกรรมศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/2-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "ภาควิชาเกษตรกลวิธาน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/2-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/2-9.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}> 
          <Image
            style={Styles.circle}
            source={require('./img/2-11.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "คณะศึกษาศาสตร์และพัฒนศาสตร์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/3-4.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "คณะวิทยาศาสตร์การกีฬา") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/3-5.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/3-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "คณะวิศวกรรมศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/3-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "ภาควิชาเกษตรกลวิธาน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/3-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/3-9.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/3-11.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์" && this.state.selectedText2 === "คณะวิทยาศาสตร์การกีฬา") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/4-5.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์" && this.state.selectedText2 === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/4-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์" && this.state.selectedText2 === "คณะวิศวกรรมศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/4-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์" && this.state.selectedText2 === "ภาควิชาเกษตรกลวิธาน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/4-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/4-9.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/4-11.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิทยาศาสตร์การกีฬา" && this.state.selectedText2 === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/5-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิทยาศาสตร์การกีฬา" && this.state.selectedText2 === "คณะวิศวกรรมศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}> 
          <Image
            style={Styles.circle}
            source={require('./img/5-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิทยาศาสตร์การกีฬา" && this.state.selectedText2 === "ภาควิชาเกษตรกลวิธาน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/5-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิทยาศาสตร์การกีฬา" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/5-9.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิทยาศาสตร์การกีฬา" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/5-11.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน" && this.state.selectedText2 === "คณะวิศวกรรมศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/6-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน" && this.state.selectedText2 === "ภาควิชาเกษตรกลวิธาน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/6-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/6-9.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/6-11.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิศวกรรมศาสตร์ กำแพงแสน" && this.state.selectedText2 === "ภาควิชาเกษตรกลวิธาน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/7-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิศวกรรมศาสตร์ กำแพงแสน" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/7-9.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิศวกรรมศาสตร์ กำแพงแสน" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/7-11.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ภาควิชาเกษตรกลวิธาน" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/8-9.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ภาควิชาเกษตรกลวิธาน" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/8-11.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "สำนักหอสมุดกำแพงแสน" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/9-11.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "ศูนย์มหาวิทยาลัย") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/11-2.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "โรงอาหารกลาง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/11-3.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "คณะศึกษาศาสตร์และพัฒนศาสตร์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/11-4.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "คณะวิทยาศาสตร์การกีฬา") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/11-5.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "คณะสัตวแพทยศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/11-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "คณะเกษตร กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/11-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/11-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "คณะสัตวแพทยศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/22-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "คณะเกษตร กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/22-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/22-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/22-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "คณะสัตวแพทยศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/33-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "คณะเกษตร กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/33-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/33-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงอาหารกลาง" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/33-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์" && this.state.selectedText2 === "คณะสัตวแพทยศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/44-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์" && this.state.selectedText2 === "คณะเกษตร กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/44-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/44-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/44-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิทยาศาสตร์การกีฬา" && this.state.selectedText2 === "คณะสัตวแพทยศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/55-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิทยาศาสตร์การกีฬา" && this.state.selectedText2 === "คณะเกษตร กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/55-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิทยาศาสตร์การกีฬา" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/55-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิทยาศาสตร์การกีฬา" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/55-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะสัตวแพทยศาสตร์ กำแพงแสน" && this.state.selectedText2 === "คณะเกษตร กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/66-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะสัตวแพทยศาสตร์ กำแพงแสน" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/66-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะสัตวแพทยศาสตร์ กำแพงแสน" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/66-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะเกษตร กำแพงแสน" && this.state.selectedText2 === "สำนักหอสมุดกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/77-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะเกษตร กำแพงแสน" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/77-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "สำนักหอสมุดกำแพงแสน" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.circle}
            source={require('./img/88-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "คณะสัตวแพทยศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/1-3-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "คณะเกษตร กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/1-3-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "อาคารประชาสัมพันธ์" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/1-3-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/6-9-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะวิศวกรรมศาสตร์ กำแพงแสน" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/7-9-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "ภาควิชาเกษตรกลวิธาน" && this.state.selectedText2 === "หอพักนิสิตชายและหญิง") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/8-9-10.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/11-3-11.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/11-3-6.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "คณะวิศวกรรมศาสตร์ กำแพงแสน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/11-3-7.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "หอพักนิสิตชายและหญิง" && this.state.selectedText2 === "ภาควิชาเกษตรกลวิธาน") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/11-3-8.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะสัตวแพทยศาสตร์ กำแพงแสน" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}> 
          <Image
            style={Styles.png}
            source={require('./img/66-8-11.png')} />
        </View>
      )
    }
    else if (this.state.selectedText === "คณะเกษตร กำแพงแสน" && this.state.selectedText2 === "อาคารประชาสัมพันธ์") {
      return (
        <View style={Styles.viewimage}>
          <Image
            style={Styles.png}
            source={require('./img/77-8-11.png')} />
        </View>
      )
    }
  }

  pickDestination() {
    if (this.state.selectedText != "") {
      if (this.state.selectedText === "อาคารประชาสัมพันธ์") {
        return <RNPicker
          dataSource={this.state.dataSource2}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "ศูนย์มหาวิทยาลัย") {
        return <RNPicker
          dataSource={this.state.dataSource3}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "โรงอาหารกลาง") {
        return <RNPicker
          dataSource={this.state.dataSource4}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "คณะศึกษาศาสตร์และพัฒนศาสตร์") {
        return <RNPicker
          dataSource={this.state.dataSource5}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "คณะวิทยาศาสตร์การกีฬา") {
        return <RNPicker
          dataSource={this.state.dataSource6}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน") {
        return <RNPicker
          dataSource={this.state.dataSource7}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "คณะวิศวกรรมศาสตร์ กำแพงแสน") {
        return <RNPicker
          dataSource={this.state.dataSource8}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "ภาควิชาเกษตรกลวิธาน") {
        return <RNPicker
          dataSource={this.state.dataSource9}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "สำนักหอสมุดกำแพงแสน") {
        return <RNPicker
          dataSource={this.state.dataSource10}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "หอพักนิสิตชายและหญิง") {
        return <RNPicker
          dataSource={this.state.dataSource12}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "คณะสัตวแพทยศาสตร์ กำแพงแสน") {
        return <RNPicker
          dataSource={this.state.dataSource13}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
      else if (this.state.selectedText === "คณะเกษตร กำแพงแสน") {
        return <RNPicker
          dataSource={this.state.dataSource3}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText2}
          placeHolderLabel={this.state.placeHolderText2}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue2(index, item)}
        />
      }
    }
  }

  render() {
    return (
      <View style={Styles.container}>
        <View style={{ padding: 5 }}>
          <Image
            style={Styles.banner}
            source={require('./img/kulogo2.jpg')}
          />
        </View>

        <Text style={{ marginTop: 5, fontSize: 40, fontFamily: "FC Ekaluck Bold ver 1.01" }}>โปรดเลือกสถานที่</Text>
        <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: "FC Ekaluck Regular ver 1.01" }}>{this.state.selectedText} {this.state.gotoText} {this.state.selectedText2}</Text>
        <RNPicker
          dataSource={this.state.dataSource}
          defaultValue={false}
          showSearchBar={false}
          disablePicker={false}
          changeAnimation={"none"}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={this.state.selectedText}
          placeHolderLabel={this.state.placeHolderText}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require("../src/img/ic_drop_down.png")}
          selectedValue={(index, item) => this._selectedValue(index, item)}
        />
        {this.pickDestination()}
        <View>{this.BusLine()}</View>

        <FloatingAction
          actions={actions}
          onPressItem={name => {
            if (name == "bt_busstop") {
              this.props.navigation.navigate('Bus')
            }
            else if (name == "bt_map") {
              this.props.navigation.navigate('Line2')
            }
            else if (name == "bt_map") {
              this.props.navigation.navigate('Line2')
            }
            else if (name == "bt_infor") {
              this.refs.modal3.open()
            }
          }}

          floatingIcon={<Icon name="bars" size={30} color="white" />}
          color={color = "#18DC5B"}
        />
        <Modal style={[Styles.modal, Styles.modal3]} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled}>
          <Text style={Styles.text}>INFORMATION</Text>
          <Image
            style={{ height: 275, width: 300, textAlign: 'center', marginTop: 20, marginLeft: 20 }}
            source={require('./img/PSbus.png')} />
        </Modal>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  viewimage: {
    marginLeft: config.deviceWidth * 0.15,
    marginRight: config.deviceWidth * 0.15,
    width: config.deviceWidth,
    height: config.deviceHeight,
  },


  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: "row",
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1
    },
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10
  },

  selectLabelTextStyle: {
    color: "#000",
    textAlign: "left",
    width: "99%",
    padding: 10,
    flexDirection: "row",
    fontFamily: "FC Ekaluck Regular ver 1.01",
    fontSize: 20

  },
  placeHolderTextStyle: {
    color: "#D3D3D3",
    padding: 10,
    textAlign: "left",
    width: "99%",
    flexDirection: "row",
    fontFamily: "FC Ekaluck Regular ver 1.01",
    fontSize: 20
  },
  dropDownImageStyle: {
    marginLeft: 10,
    width: 10,
    height: 10,
    alignSelf: "center"
  },
  listTextViewStyle: {
    color: "black",
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: "left",
    fontFamily: "FC Ekaluck Regular ver 1.01",
    fontSize: 20
  },
  pickerStyle: {
    marginLeft: 18,
    elevation: 3,
    paddingRight: 25,
    marginRight: 10,
    marginBottom: 2,
    marginTop: 5,
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 1,
      height: 1
    },
    borderWidth: 1,
    shadowRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 5,
    flexDirection: "row"
  },
  busstopStyle: {
    width: 20,
    height: 20
  },
  banner: {
    width: 400,
    height: 100,
  },
  circle: {
    width: 390,
    height: 400,
    resizeMode:"stretch"
  },
  textStyle: {
    fontFamily: "FC Ekaluck Regular ver 1.01"
  },
  png: {
    width: 320,
    height: 350,
    marginLeft: config.deviceWidth * 0.05,
    marginRight: config.deviceWidth * 0.05,
    resizeMode: 'stretch'
  },
  wrapper: {
    paddingTop: 50,
    flex: 1
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal3: {
    height: 250,
    width: 300
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },

  text: {
    color: "black",
    fontSize: 30,
    fontFamily: "FC Ekaluck Bold ver 1.01",
    textAlign: 'center',
    marginTop: 100,
    

  }

});


export default BusStop;
