import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Picker, Alert, Button } from 'react-native'
import MapView, { Marker, AnimatedRegion, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modalbox';
import { FloatingAction } from "react-native-floating-action";
import Icon from 'react-native-vector-icons/FontAwesome';
import TimerMixin from 'react-timer-mixin';
import { getDistance, findNearest } from 'geolib';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.008;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LATITUDE = 14.0224792;
const LONGITUDE = 99.9739081;
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
class Line2 extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitude2: LATITUDE,
      longitude2: LONGITUDE,
      latitudenear: "",
      longitudenear: "",
      latitudenear2: "",
      longitudenear2: "",
      metertokilocar1: "",
      mark1: "",
      mark2: "",
      metertokilocar2: "",
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
      coordinate2: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
      error: null,
      busline: "สายรถบัส",
      token: "",
      latcal: "",
      longcal: "",
      latcal2: "",
      longcal2: "",
    };
  }

  componentDidMount() {
    TimerMixin.setTimeout(() => {
      this.getCurrentLocation();
    }, 3000);
    this.getCurrentLocation();


    // TimerMixin.setInterval(() => {
    //   this.getCurrentLocation();
    // }, 10000);
  }

  // componentDidMount() {
  //   // Interval
  //   TimerMixin.setTimeout(
  //     () => { console.log('I do not leak!'); },
  //     5000
  //   );
  //   // delay
  //   // clearTimeout(this.regionTimeout);
  //   // this.regionTimeout = setTimeout(() => {
  //   //   this.getCurrentLocation();
  //   // }, 5000);
  // }

  async getCurrentLocation() {
    //console.log("getCurrentLocation");
    var deviceId = "d0a75e10-07c6-11ea-b9c6-791cedf64181";
    var deviceId2 = "ce6b3f50-39cf-11ea-b9c6-791cedf64181";
    var carLatLong = "";
    var carLatLong2 = "";
    if (this.state.token === "") {
      carLatLong = await this.getPositionCarWithToken(deviceId);
      carLatLong2 = await this.getPositionCar2(deviceId2);
    }
    else {
      carLatLong = await this.getPositionCar(deviceId);
      carLatLong2 = await this.getPositionCar2(deviceId2);
      if (carLatLong === "Token is expired") {
        carLatLong = await this.getPositionCarWithToken(deviceId);
        carLatLong2 = await this.getPositionCar2(deviceId2);
      }
    }
    // console.log(carLatLong.latitude[0].value + "lat car1");
    // console.log(carLatLong.longitude[0].value + "lat car1");
    // console.log(carLatLong2.latitude[0].value + "lat car2");
    // console.log(carLatLong2.longitude[0].value + "lat car2");
    //console.log("getCurrentLocation2");
    //console.log(carLatLong);
    // setLatLong
    const latitude = parseFloat(carLatLong.latitude[0].value);
    const longitude = parseFloat(carLatLong.longitude[0].value);
    const latitude2 = parseFloat(carLatLong2.latitude[0].value);
    const longitude2 = parseFloat(carLatLong2.longitude[0].value);
    this.setState({
      latcal: carLatLong.latitude[0].value,
      longcal: carLatLong.longitude[0].value,
      latcal2: carLatLong2.latitude[0].value,
      longcal2: carLatLong2.longitude[0].value
    });
    const newCoordinate = {
      latitude,
      longitude
    };
    const newCoordinate2 = {
      latitude: parseFloat(carLatLong2.latitude[0].value),
      longitude: parseFloat(carLatLong2.longitude[0].value)
    };
    if (Platform.OS === "android") {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(
          newCoordinate,
          500
        );
      }
      if (this.marker2) {
        this.marker2._component.animateMarkerToCoordinate(
          newCoordinate2,
          500
        );
      }
    } else {
      coordinate.timing(newCoordinate).start();
      coordinate2.timing(newCoordinate2).start();
    }
    this.setState({ latitude, longitude });
    this.setState({ latitude2, longitude2 });

    // this.setState({
    //   latcal2: carLatLong.latitude[0].value,
    //   longcal2: carLatLong.longitude[0].value
    // });

    // console.log("setstate change already");
    TimerMixin.setTimeout(() => {
      this.getCurrentLocation();
    }, 3000);
  }

  getPositionCar = async (deviceId) => {
    // console.log("getPositionCar:" + this.state.token);
    var authToken = 'Bearer ' + this.state.token;
    var req = await fetch("http://103.86.49.130:8080/api/plugins/telemetry/DEVICE/" + deviceId + "/values/timeseries",
      {
        method: 'GET',
        headers: {
          'X-Authorization': authToken
        }
      });

    const json = await req.json();
    // console.log(json)    
    return json;
  }

  getPositionCar2 = async (deviceId2) => {
    // console.log("getPositionCar:" + this.state.token);
    var authToken = 'Bearer ' + this.state.token;
    var req = await fetch("http://103.86.49.130:8080/api/plugins/telemetry/DEVICE/" + deviceId2 + "/values/timeseries",
      {
        method: 'GET',
        headers: {
          'X-Authorization': authToken
        }
      });

    const json = await req.json();
    // console.log(json)
    return json;
  }

  getPositionCarWithToken = async (deviceId) => {
    //console.log("getPositionCarWithToken");
    var req = await fetch("http://103.86.49.130:8080/api/auth/login",
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": "admin@cloud.io",
          "password": "admin"
        })
      });
    const json = await req.json();
    this.setState({ token: await json.token });
    //console.log("1")
    return this.getPositionCar(deviceId);
  }

  //อาคารปชสพ.
  mark1 = () => {
    const latitudeforcal = this.state.latcal; //ค่าจากรถ
    const longitudeforcal = this.state.longcal;
    parseFloat(latitudeforcal);
    parseFloat(longitudeforcal);
    // console.log(latitudeforcal, longitudeforcal)
    const nearest = findNearest({ latitude: latitudeforcal, longitude: longitudeforcal },
      [
        { latitude: 14.021920, longitude: 99.989126 }, //อาคารปชสพ.
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.021040, longitude: 99.973327 }, //รพ.
        { latitude: 14.021214, longitude: 99.972134 }, //วิศวะ
        { latitude: 14.024585, longitude: 99.972128 }, //เกษตรกล
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest = nearest.latitude;
    const longitudenearest = nearest.longitude;
    this.setState({
      latitudenear: latitudenearest,
      longitudenear: longitudenearest
    });
    const dist = getDistance(
      { latitude: latitudenearest, longitude: longitudenearest }, { latitude: latitudeforcal, longitude: longitudeforcal }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;

    if (latitudenearest ==  14.021920 && longitudenearest == 99.989126) {
      this.setState({ mark1: Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest == 14.023595 && longitudenearest == 99.977131) {
      var minn = min + 9.13;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.022205 && longitudenearest == 99.975986) {
      var minn = min + 8.13;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021016 && longitudenearest == 99.975332) {
      var minn = min + 7;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.0210287 && longitudenearest == 99.9745637) {
      var minn = min + 6.5;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021040 && longitudenearest == 99.973327) {
      var minn = min + 6.3;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021214 && longitudenearest == 99.972128) {
      var minn = min + 6;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.024585 && longitudenearest == 99.972134) {
      var minn = min + 5.5;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.024751 && longitudenearest ==  99.974894) {
      var minn = min + 5;
      this.setState({ mark1:Math.ceil(minn)});
    }
  }
  //คอนเวน1
  mark2 = () => {
    const latitudeforcal = this.state.latcal; //ค่าจากรถ
    const longitudeforcal = this.state.longcal;
    parseFloat(latitudeforcal);
    parseFloat(longitudeforcal);
    // console.log(latitudeforcal, longitudeforcal)
    const nearest = findNearest({ latitude: latitudeforcal, longitude: longitudeforcal },
      [
        { latitude: 14.021920, longitude: 99.989126 }, //อาคารปชสพ.
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.021040, longitude: 99.973327 }, //รพ.
        { latitude: 14.021214, longitude: 99.972134 }, //วิศวะ
        { latitude: 14.024585, longitude: 99.972128 }, //เกษตรกล
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest = nearest.latitude;
    const longitudenearest = nearest.longitude;
    this.setState({
      latitudenear: latitudenearest,
      longitudenear: longitudenearest
    });
    const dist = getDistance(
      { latitude: latitudenearest, longitude: longitudenearest }, { latitude: latitudeforcal, longitude: longitudeforcal }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest ==  14.021920 && longitudenearest == 99.989126) {
      var minn = min + 3;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.023595 && longitudenearest == 99.977131) {
      this.setState({ mark1:Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest == 14.022205 && longitudenearest == 99.975986) {
      var minn = min + 11.13;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021016 && longitudenearest == 99.975332) {
      var minn = min + 11;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.0210287 && longitudenearest == 99.9745637) {
      var minn = min + 10;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021040 && longitudenearest == 99.973327) {
      var minn = min + 9.3;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.021214 && longitudenearest == 99.972128) {
      var minn = min + 9.2;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.024585 && longitudenearest == 99.972134) {
      var minn = min + 8.5;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.024751 && longitudenearest ==  99.974894) {
      var minn = min + 8;
      this.setState({ mark1: Math.ceil(minn)});
    }
  }
  //โรงกลาง1
  mark3 = () => {
    const latitudeforcal = this.state.latcal; //ค่าจากรถ
    const longitudeforcal = this.state.longcal;
    parseFloat(latitudeforcal);
    parseFloat(longitudeforcal);
    // console.log(latitudeforcal, longitudeforcal)
    const nearest = findNearest({ latitude: latitudeforcal, longitude: longitudeforcal },
      [
        { latitude: 14.021920, longitude: 99.989126 }, //อาคารปชสพ.
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.021040, longitude: 99.973327 }, //รพ.
        { latitude: 14.021214, longitude: 99.972134 }, //วิศวะ
        { latitude: 14.024585, longitude: 99.972128 }, //เกษตรกล
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest = nearest.latitude;
    const longitudenearest = nearest.longitude;
    this.setState({
      latitudenear: latitudenearest,
      longitudenear: longitudenearest
    });
    const dist = getDistance(
      { latitude: latitudenearest, longitude: longitudenearest }, { latitude: latitudeforcal, longitude: longitudeforcal }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest ==  14.021920 && longitudenearest == 99.989126) {
      var minn = min + 4;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.023595 && longitudenearest == 99.977131) {
      var minn = min + 1;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.022205 && longitudenearest == 99.975986) {
      this.setState({ mark1: Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest == 14.021016 && longitudenearest == 99.975332) {
      var minn = min + 11;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.0210287 && longitudenearest == 99.9745637) {
      var minn = min + 10.59;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.021040 && longitudenearest == 99.973327) {
      var minn = min + 10.3;
      this.setState({ mark1:Math.ceil(minn)});
    }
    else if (latitudenearest == 14.021214 && longitudenearest == 99.972128) {
      var minn = min + 10.2;
      this.setState({ mark1:Math.ceil(minn)});
    }
    else if (latitudenearest == 14.024585 && longitudenearest == 99.972134) {
      var minn = min + 9.5;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.024751 && longitudenearest ==  99.974894) {
      var minn = min + 9;
      this.setState({ mark1: Math.ceil(minn) });
    }
  }
  //ศึกษา1
  mark4 = () => {
    const latitudeforcal = this.state.latcal; //ค่าจากรถ
    const longitudeforcal = this.state.longcal;
    parseFloat(latitudeforcal);
    parseFloat(longitudeforcal);
    // console.log(latitudeforcal, longitudeforcal)
    const nearest = findNearest({ latitude: latitudeforcal, longitude: longitudeforcal },
      [
        { latitude: 14.021920, longitude: 99.989126 }, //อาคารปชสพ.
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.021040, longitude: 99.973327 }, //รพ.
        { latitude: 14.021214, longitude: 99.972134 }, //วิศวะ
        { latitude: 14.024585, longitude: 99.972128 }, //เกษตรกล
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest = nearest.latitude;
    const longitudenearest = nearest.longitude;
    this.setState({
      latitudenear: latitudenearest,
      longitudenear: longitudenearest
    });
    const dist = getDistance(
      { latitude: latitudenearest, longitude: longitudenearest }, { latitude: latitudeforcal, longitude: longitudeforcal }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest ==  14.021920 && longitudenearest == 99.989126) {
      var minn = min + 5.13;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.023595 && longitudenearest == 99.977131) {
      var minn = min + 2.13;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.022205 && longitudenearest == 99.975986) {
      var minn = min + 1.13;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.021016 && longitudenearest == 99.975332) {
      this.setState({ mark1: Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest == 14.0210287 && longitudenearest == 99.9745637) {
      var minn = min + 12.33;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.021040 && longitudenearest == 99.973327) {
      var minn = min + 11.43;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.021214 && longitudenearest == 99.972128) {
      var minn = min + 11.08;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.024585 && longitudenearest == 99.972134) {
      var minn = min + 11.00;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.024751 && longitudenearest ==  99.974894) {
      var minn = min + 10.13;
      this.setState({ mark1: Math.ceil(minn)});
    }
  }
  //วิทย์กี1
  mark5 = () => {
    const latitudeforcal = this.state.latcal; //ค่าจากรถ
    const longitudeforcal = this.state.longcal;
    parseFloat(latitudeforcal);
    parseFloat(longitudeforcal);
    // console.log(latitudeforcal, longitudeforcal)
    const nearest = findNearest({ latitude: latitudeforcal, longitude: longitudeforcal },
      [
        { latitude: 14.021920, longitude: 99.989126 }, //อาคารปชสพ.
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.021040, longitude: 99.973327 }, //รพ.
        { latitude: 14.021214, longitude: 99.972134 }, //วิศวะ
        { latitude: 14.024585, longitude: 99.972128 }, //เกษตรกล
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest = nearest.latitude;
    const longitudenearest = nearest.longitude;
    this.setState({
      latitudenear: latitudenearest,
      longitudenear: longitudenearest
    });
    const dist = getDistance(
      { latitude: latitudenearest, longitude: longitudenearest }, { latitude: latitudeforcal, longitude: longitudeforcal }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest ==  14.021920 && longitudenearest == 99.989126) {
      var minn = min + 5.33;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.023595 && longitudenearest == 99.977131) {
      var minn = min + 2.33;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.022205 && longitudenearest == 99.975986) {
      var minn = min + 1.33;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021016 && longitudenearest == 99.975332) {
      var minn = min + 0.20;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.0210287 && longitudenearest == 99.9745637) {
      this.setState({ mark1: Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest == 14.021040 && longitudenearest == 99.973327) {
      var minn = min + 12.03;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021214 && longitudenearest == 99.972128) {
      var minn = min + 11.28;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.024585 && longitudenearest == 99.972134) {
      var minn = min + 11.20;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.024751 && longitudenearest ==  99.974894) {
      var minn = min + 10.33;
      this.setState({ mark1: Math.ceil(minn) });
    }
  }
  //รพ.
  mark6 = () => {
    const latitudeforcal = this.state.latcal; //ค่าจากรถ
    const longitudeforcal = this.state.longcal;
    parseFloat(latitudeforcal);
    parseFloat(longitudeforcal);
    // console.log(latitudeforcal, longitudeforcal)
    const nearest = findNearest({ latitude: latitudeforcal, longitude: longitudeforcal },
      [
        { latitude: 14.021920, longitude: 99.989126 }, //อาคารปชสพ.
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.021040, longitude: 99.973327 }, //รพ.
        { latitude: 14.021214, longitude: 99.972134 }, //วิศวะ
        { latitude: 14.024585, longitude: 99.972128 }, //เกษตรกล
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest = nearest.latitude;
    const longitudenearest = nearest.longitude;
    this.setState({
      latitudenear: latitudenearest,
      longitudenear: longitudenearest
    });
    const dist = getDistance(
      { latitude: latitudenearest, longitude: longitudenearest }, { latitude: latitudeforcal, longitude: longitudeforcal }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest ==  14.021920 && longitudenearest == 99.989126) {
      var minn = min + 6.23;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.023595 && longitudenearest == 99.977131) {
      var minn = min + 3.23;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.022205 && longitudenearest == 99.975986) {
      var minn = min + 2.23;
      this.setState({ mark1:Math.ceil(minn)});
    }
    else if (latitudenearest == 14.021016 && longitudenearest == 99.975332) {
      var minn = min + 1.1;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.0210287 && longitudenearest == 99.9745637) {
      var minn = min + 0.5;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.021040 && longitudenearest == 99.973327) {
      this.setState({ mark1: Math.ceil(min.toFixed(2)) });
    }
    else if (latitudenearest == 14.021214 && longitudenearest == 99.972128) {
      var minn = min + 12.18;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.024585 && longitudenearest == 99.972134) {
      var minn = min + 11.33;
      this.setState({ mark1: Math.ceil(minn)});
    }
    else if (latitudenearest == 14.024751 && longitudenearest ==  99.974894) {
      var minn = min + 11.23;
      this.setState({ mark1: Math.ceil(minn) });
    }
  }
  //วิศวะ
  mark7 = () => {
    const latitudeforcal = this.state.latcal; //ค่าจากรถ
    const longitudeforcal = this.state.longcal;
    parseFloat(latitudeforcal);
    parseFloat(longitudeforcal);
    // console.log(latitudeforcal, longitudeforcal)
    const nearest = findNearest({ latitude: latitudeforcal, longitude: longitudeforcal },
      [
        { latitude: 14.021920, longitude: 99.989126 }, //อาคารปชสพ.
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.021040, longitude: 99.973327 }, //รพ.
        { latitude: 14.021214, longitude: 99.972134 }, //วิศวะ
        { latitude: 14.024585, longitude: 99.972128 }, //เกษตรกล
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest = nearest.latitude;
    const longitudenearest = nearest.longitude;
    this.setState({
      latitudenear: latitudenearest,
      longitudenear: longitudenearest
    });
    const dist = getDistance(
      { latitude: latitudenearest, longitude: longitudenearest }, { latitude: latitudeforcal, longitude: longitudeforcal }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest ==  14.021920 && longitudenearest == 99.989126) {
      var minn = min + 6.18;
      this.setState({ mark1:Math.ceil(minn)});
    }
    else if (latitudenearest == 14.023595 && longitudenearest == 99.977131) {
      var minn = min + 3.18;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.022205 && longitudenearest == 99.975986) {
      var minn = min + 2.13;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021016 && longitudenearest == 99.975332) {
      var minn = min + 1.05;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.0210287 && longitudenearest == 99.9745637) {
      var minn = min + 1;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021040 && longitudenearest == 99.973327) {
      var minn = min + 0.35;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021214 && longitudenearest == 99.972128) {
      this.setState({ mark1: Math.ceil(min.toFixed(2)) });
    }
    else if (latitudenearest == 14.024585 && longitudenearest == 99.972134) {
      var minn = min + 12.08;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.024751 && longitudenearest ==  99.974894) {
      var minn = min + 11.18;
      this.setState({ mark1: Math.ceil(minn) });
    }
  }
  //เกษตรกล
  mark8 = () => {
    const latitudeforcal = this.state.latcal; //ค่าจากรถ
    const longitudeforcal = this.state.longcal;
    parseFloat(latitudeforcal);
    parseFloat(longitudeforcal);
    // console.log(latitudeforcal, longitudeforcal)
    const nearest = findNearest({ latitude: latitudeforcal, longitude: longitudeforcal },
      [
        { latitude: 14.021920, longitude: 99.989126 }, //อาคารปชสพ.
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.021040, longitude: 99.973327 }, //รพ.
        { latitude: 14.021214, longitude: 99.972134 }, //วิศวะ
        { latitude: 14.024585, longitude: 99.972128 }, //เกษตรกล
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest = nearest.latitude;
    const longitudenearest = nearest.longitude;
    this.setState({
      latitudenear: latitudenearest,
      longitudenear: longitudenearest
    });
    const dist = getDistance(
      { latitude: latitudenearest, longitude: longitudenearest }, { latitude: latitudeforcal, longitude: longitudeforcal }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest ==  14.021920 && longitudenearest == 99.989126) {
      var minn = min + 7.03;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.023595 && longitudenearest == 99.977131) {
      var minn = min + 4.03;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.022205 && longitudenearest == 99.975986) {
      var minn = min + 3.03;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021016 && longitudenearest == 99.975332) {
      var minn = min + 1.5;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.0210287 && longitudenearest == 99.9745637) {
      var minn = min + 1.3;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021040 && longitudenearest == 99.973327) {
      var minn = min + 1.2;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021214 && longitudenearest == 99.972128) {
      var minn = min + 0.45;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.024585 && longitudenearest == 99.972134) {
      this.setState({ mark1: Math.ceil(min.toFixed(2)) });
    }
    else if (latitudenearest == 14.024751 && longitudenearest ==  99.974894) {
      var minn = min + 12.23;
      this.setState({ mark1: Math.ceil(minn) });
    }
  }
  //หอสมุด1
  mark9 = () => {
    const latitudeforcal = this.state.latcal; //ค่าจากรถ
    const longitudeforcal = this.state.longcal;
    parseFloat(latitudeforcal);
    parseFloat(longitudeforcal);
    // console.log(latitudeforcal, longitudeforcal)
    const nearest = findNearest({ latitude: latitudeforcal, longitude: longitudeforcal },
      [
        { latitude: 14.021920, longitude: 99.989126 }, //อาคารปชสพ.
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.021040, longitude: 99.973327 }, //รพ.
        { latitude: 14.021214, longitude: 99.972134 }, //วิศวะ
        { latitude: 14.024585, longitude: 99.972128 }, //เกษตรกล
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest = nearest.latitude;
    const longitudenearest = nearest.longitude;
    this.setState({
      latitudenear: latitudenearest,
      longitudenear: longitudenearest
    });
    const dist = getDistance(
      { latitude: latitudenearest, longitude: longitudenearest }, { latitude: latitudeforcal, longitude: longitudeforcal }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest ==  14.021920 && longitudenearest == 99.989126) {
      var minn = min + 7.13;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.023595 && longitudenearest == 99.977131) {
      var minn = min + 4.13;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.022205 && longitudenearest == 99.975986) {
      var minn = min + 3.13;
      this.setState({ mark1:Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021016 && longitudenearest == 99.975332) {
      var minn = min + 2;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.0210287 && longitudenearest == 99.9745637) {
      var minn = min + 1.57;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021040 && longitudenearest == 99.973327) {
      var minn = min + 1.3;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.021214 && longitudenearest == 99.972128) {
      var minn = min + 1;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.024585 && longitudenearest == 99.972134) {
      var minn = min + 0.50;
      this.setState({ mark1: Math.ceil(minn) });
    }
    else if (latitudenearest == 14.024751 && longitudenearest ==  99.974894) {
      this.setState({ mark1: Math.ceil(min.toFixed(2)) });
    }
  }
  //หอ
  mark10 = () => {
    const latitudeforcal2 = this.state.latcal2; //ค่าจากรถ
    const longitudeforcal2 = this.state.longcal2;
    parseFloat(latitudeforcal2);
    parseFloat(longitudeforcal2);
    console.log(latitudeforcal2, longitudeforcal2)
    const nearest2 = findNearest({ latitude: latitudeforcal2, longitude: longitudeforcal2 },
      [
        { latitude: 14.026440, longitude: 99.983792 }, //หอ
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.0215904, longitude: 99.9737479 }, //สัตวแพทย์
        { latitude: 14.023648, longitude: 99.973767 }, //เกษตร
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest2 = nearest2.latitude;
    const longitudenearest2 = nearest2.longitude;
    this.setState({
      latitudenear2: latitudenearest2,
      longitudenear2: longitudenearest2
    });
    const dist = getDistance(
      { latitude: latitudenearest2, longitude: longitudenearest2 }, { latitude: latitudeforcal2, longitude: longitudeforcal2 }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest2 == 14.026440 && longitudenearest2 == 99.983792) {
      this.setState({ mark2:Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest2 == 14.023595 && longitudenearest2 == 99.977131) {
      var minn = min + 10.38;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.022205 && longitudenearest2 == 99.975986) {
      var minn = min + 9.38;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.021016 && longitudenearest2 == 99.975332) {
      var minn = min + 8.25;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0210287 && longitudenearest2 == 99.9745637) {
      var minn = min + 8.05;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0215904 && longitudenearest2 == 99.9737479) {
      var minn = min + 8;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023648 && longitudenearest2 == 99.973767) {
      var minn = min + 6.05;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.024751 && longitudenearest2 ==  99.974894) {
      var minn = min + 5.4;
      this.setState({ mark2: Math.ceil(minn) });
    }
  }
  //คอนเวน2
  mark22 = () => {
    const latitudeforcal2 = this.state.latcal2; //ค่าจากรถ
    const longitudeforcal2 = this.state.longcal2;
    parseFloat(latitudeforcal2);
    parseFloat(longitudeforcal2);
    console.log(latitudeforcal2, longitudeforcal2)
    const nearest2 = findNearest({ latitude: latitudeforcal2, longitude: longitudeforcal2 },
      [
        { latitude: 14.026440, longitude: 99.983792 }, //หอ
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.0215904, longitude: 99.9737479 }, //สัตวแพทย์
        { latitude: 14.023648, longitude: 99.973767 }, //เกษตร
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest2 = nearest2.latitude;
    const longitudenearest2 = nearest2.longitude;
    this.setState({
      latitudenear2: latitudenearest2,
      longitudenear2: longitudenearest2
    });
    const dist = getDistance(
      { latitude: latitudenearest2, longitude: longitudenearest2 }, { latitude: latitudeforcal2, longitude: longitudeforcal2 }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest2 == 14.026440 && longitudenearest2 == 99.983792) {
      var minn = min + 3;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023595 && longitudenearest2 == 99.977131) {
      this.setState({ mark2: Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest2 == 14.022205 && longitudenearest2 == 99.975986) {
      var minn = min + 12.38;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.021016 && longitudenearest2 == 99.975332) {
      var minn = min + 11.25;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0210287 && longitudenearest2 == 99.9745637) {
      var minn = min + 11.05;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0215904 && longitudenearest2 == 99.9737479) {
      var minn = min + 10.58;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023648 && longitudenearest2 == 99.973767) {
      var minn = min + 10.05;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.024751 && longitudenearest2 ==  99.974894) {
      var minn = min + 8.4;
      this.setState({ mark2: Math.ceil(minn) });
    }
  }
  //โรงกลาง2
  mark33 = () => {
    const latitudeforcal2 = this.state.latcal2; //ค่าจากรถ
    const longitudeforcal2 = this.state.longcal2;
    parseFloat(latitudeforcal2);
    parseFloat(longitudeforcal2);
    console.log(latitudeforcal2, longitudeforcal2)
    const nearest2 = findNearest({ latitude: latitudeforcal2, longitude: longitudeforcal2 },
      [
        { latitude: 14.026440, longitude: 99.983792 }, //หอ
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.0215904, longitude: 99.9737479 }, //สัตวแพทย์
        { latitude: 14.023648, longitude: 99.973767 }, //เกษตร
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest2 = nearest2.latitude;
    const longitudenearest2 = nearest2.longitude;
    this.setState({
      latitudenear2: latitudenearest2,
      longitudenear2: longitudenearest2
    });
    const dist = getDistance(
      { latitude: latitudenearest2, longitude: longitudenearest2 }, { latitude: latitudeforcal2, longitude: longitudeforcal2 }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest2 == 14.026440 && longitudenearest2 == 99.983792) {
      var minn = min + 4;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023595 && longitudenearest2 == 99.977131) {
      var minn = min + 1;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.022205 && longitudenearest2 == 99.975986) {
      this.setState({ mark2: Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest2 == 14.021016 && longitudenearest2 == 99.975332) {
      var minn = min + 12.25;
      this.setState({ mark2:Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0210287 && longitudenearest2 == 99.9745637) {
      var minn = min + 12.05;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0215904 && longitudenearest2 == 99.9737479) {
      var minn = min + 12;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023648 && longitudenearest2 == 99.973767) {
      var minn = min + 11.05;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.024751 && longitudenearest2 ==  99.974894) {
      var minn = min + 9.4;
      this.setState({ mark2: Math.ceil(minn) });
    }
  }
  //ศึกษา2
  mark44 = () => {
    const latitudeforcal2 = this.state.latcal2; //ค่าจากรถ
    const longitudeforcal2 = this.state.longcal2;
    parseFloat(latitudeforcal2);
    parseFloat(longitudeforcal2);
    console.log(latitudeforcal2, longitudeforcal2)
    const nearest2 = findNearest({ latitude: latitudeforcal2, longitude: longitudeforcal2 },
      [
        { latitude: 14.026440, longitude: 99.983792 }, //หอ
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.0215904, longitude: 99.9737479 }, //สัตวแพทย์
        { latitude: 14.023648, longitude: 99.973767 }, //เกษตร
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest2 = nearest2.latitude;
    const longitudenearest2 = nearest2.longitude;
    this.setState({
      latitudenear2: latitudenearest2,
      longitudenear2: longitudenearest2
    });
    const dist = getDistance(
      { latitude: latitudenearest2, longitude: longitudenearest2 }, { latitude: latitudeforcal2, longitude: longitudeforcal2 }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest2 == 14.026440 && longitudenearest2 == 99.983792) {
      var minn = min + 5.13;
      this.setState({ mark2:Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023595 && longitudenearest2 == 99.977131) {
      var minn = min + 2.13;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.022205 && longitudenearest2 == 99.975986) {
      var minn = min + 1.13;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.021016 && longitudenearest2 == 99.975332) {
      this.setState({ mark2: Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest2 == 14.0210287 && longitudenearest2 == 99.9745637) {
      var minn = min + 13.18;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0215904 && longitudenearest2 == 99.9737479) {
      var minn = min + 13;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023648 && longitudenearest2 == 99.973767) {
      var minn = min + 12.18;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.024751 && longitudenearest2 ==  99.974894) {
      var minn = min + 10.53;
      this.setState({ mark2: Math.ceil(minn) });
    }
  }
   //วิทย์กี2
   mark55 = () => {
    const latitudeforcal2 = this.state.latcal2; //ค่าจากรถ
    const longitudeforcal2 = this.state.longcal2;
    parseFloat(latitudeforcal2);
    parseFloat(longitudeforcal2);
    console.log(latitudeforcal2, longitudeforcal2)
    const nearest2 = findNearest({ latitude: latitudeforcal2, longitude: longitudeforcal2 },
      [
        { latitude: 14.026440, longitude: 99.983792 }, //หอ
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.0215904, longitude: 99.9737479 }, //สัตวแพทย์
        { latitude: 14.023648, longitude: 99.973767 }, //เกษตร
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest2 = nearest2.latitude;
    const longitudenearest2 = nearest2.longitude;
    this.setState({
      latitudenear2: latitudenearest2,
      longitudenear2: longitudenearest2
    });
    const dist = getDistance(
      { latitude: latitudenearest2, longitude: longitudenearest2 }, { latitude: latitudeforcal2, longitude: longitudeforcal2 }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest2 == 14.026440 && longitudenearest2 == 99.983792) {
      var minn = min + 5.33;
      this.setState({ mark2: Math.ceil(minn)});
    }
    else if (latitudenearest2 == 14.023595 && longitudenearest2 == 99.977131) {
      var minn = min + 2.33;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.022205 && longitudenearest2 == 99.975986) {
      var minn = min + 1.13;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.021016 && longitudenearest2 == 99.975332) {
      var minn = min + 13.58;
      this.setState({ mark2:Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0210287 && longitudenearest2 == 99.9745637) {
      this.setState({ mark2: Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest2 == 14.0215904 && longitudenearest2 == 99.9737479) {
      var minn = min + 13.08;
      this.setState({ mark2:Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023648 && longitudenearest2 == 99.973767) {
      var minn = min + 12.38;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.024751 && longitudenearest2 ==  99.974894) {
      var minn = min + 11.13;
      this.setState({ mark2: Math.ceil(minn) });
    }
  }
  //สัตวแพทย์
  mark11 = () => {
    const latitudeforcal2 = this.state.latcal2; //ค่าจากรถ
    const longitudeforcal2 = this.state.longcal2;
    parseFloat(latitudeforcal2);
    parseFloat(longitudeforcal2);
    console.log(latitudeforcal2, longitudeforcal2)
    const nearest2 = findNearest({ latitude: latitudeforcal2, longitude: longitudeforcal2 },
      [
        { latitude: 14.026440, longitude: 99.983792 }, //หอ
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.0215904, longitude: 99.9737479 }, //สัตวแพทย์
        { latitude: 14.023648, longitude: 99.973767 }, //เกษตร
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest2 = nearest2.latitude;
    const longitudenearest2 = nearest2.longitude;
    this.setState({
      latitudenear2: latitudenearest2,
      longitudenear2: longitudenearest2
    });
    const dist = getDistance(
      { latitude: latitudenearest2, longitude: longitudenearest2 }, { latitude: latitudeforcal2, longitude: longitudeforcal2 }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest2 == 14.026440 && longitudenearest2 == 99.983792) {
      var minn = min + 6.03;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023595 && longitudenearest2 == 99.977131) {
      var minn = min + 3.03;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.022205 && longitudenearest2 == 99.975986) {
      var minn = min + 2.03;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.021016 && longitudenearest2 == 99.975332) {
      var minn = min + 0.5;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0210287 && longitudenearest2 == 99.9745637) {
      var minn = min + 0.3;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0215904 && longitudenearest2 == 99.9737479) {
      this.setState({ mark2: Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest2 == 14.023648 && longitudenearest2 == 99.973767) {
      var minn = min + 12.28;
      this.setState({ mark2:Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.024751 && longitudenearest2 ==  99.974894) {
      var minn = min + 11.03;
      this.setState({ mark2: Math.ceil(minn)});
    }
  }
   //เกษตร
   mark12 = () => {
    const latitudeforcal2 = this.state.latcal2; //ค่าจากรถ
    const longitudeforcal2 = this.state.longcal2;
    parseFloat(latitudeforcal2);
    parseFloat(longitudeforcal2);
    console.log(latitudeforcal2, longitudeforcal2)
    const nearest2 = findNearest({ latitude: latitudeforcal2, longitude: longitudeforcal2 },
      [
        { latitude: 14.026440, longitude: 99.983792 }, //หอ
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.0215904, longitude: 99.9737479 }, //สัตวแพทย์
        { latitude: 14.023648, longitude: 99.973767 }, //เกษตร
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest2 = nearest2.latitude;
    const longitudenearest2 = nearest2.longitude;
    this.setState({
      latitudenear2: latitudenearest2,
      longitudenear2: longitudenearest2
    });
    const dist = getDistance(
      { latitude: latitudenearest2, longitude: longitudenearest2 }, { latitude: latitudeforcal2, longitude: longitudeforcal2 }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest2 == 14.026440 && longitudenearest2 == 99.983792) {
      var minn = min + 7.13;
      this.setState({ mark2:Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023595 && longitudenearest2 == 99.977131) {
      var minn = min + 4.13;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.022205 && longitudenearest2 == 99.975986) {
      var minn = min + 3.13;
      this.setState({ mark2: Math.ceil(minn)});
    }
    else if (latitudenearest2 == 14.021016 && longitudenearest2 == 99.975332) {
      var minn = min + 2;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0210287 && longitudenearest2 == 99.9745637) {
      var minn = min + 1.4;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0215904 && longitudenearest2 == 99.9737479) {
      var minn = min + 1.1;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023648 && longitudenearest2 == 99.973767) {
      this.setState({ mark2: Math.ceil(min.toFixed(2)) })
    }
    else if (latitudenearest2 == 14.024751 && longitudenearest2 ==  99.974894) {
      var minn = min + 12.13;
      this.setState({ mark2: Math.ceil(minn) });
    }
  }
  //หอสมุด2
  mark99 = () => {
    const latitudeforcal2 = this.state.latcal2; //ค่าจากรถ
    const longitudeforcal2 = this.state.longcal2;
    parseFloat(latitudeforcal2);
    parseFloat(longitudeforcal2);
    console.log(latitudeforcal2, longitudeforcal2)
    const nearest2 = findNearest({ latitude: latitudeforcal2, longitude: longitudeforcal2 },
      [
        { latitude: 14.026440, longitude: 99.983792 }, //หอ
        { latitude: 14.023595, longitude: 99.977131 }, //คอนเวน
        { latitude: 14.022205, longitude: 99.975986 }, //โรงกลาง
        { latitude: 14.021016, longitude: 99.975332 }, //ศึกษา
        { latitude: 14.0210287, longitude: 99.9745637 }, //วิทกี
        { latitude: 14.0215904, longitude: 99.9737479 }, //สัตวแพทย์
        { latitude: 14.023648, longitude: 99.973767 }, //เกษตร
        { latitude: 14.024751, longitude:  99.974894 }, //หอสมุด
      ]);
    const latitudenearest2 = nearest2.latitude;
    const longitudenearest2 = nearest2.longitude;
    this.setState({
      latitudenear2: latitudenearest2,
      longitudenear2: longitudenearest2
    });
    const dist = getDistance(
      { latitude: latitudenearest2, longitude: longitudenearest2 }, { latitude: latitudeforcal2, longitude: longitudeforcal2 }
    );
    var metertokilo = dist / 1000;
    var min = (metertokilo / 30) * 60;
    if (latitudenearest2 == 14.026440 && longitudenearest2 == 99.983792) {
      var minn = min + 8.38;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023595 && longitudenearest2 == 99.977131) {
      var minn = min + 5.38;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.022205 && longitudenearest2 == 99.975986) {
      var minn = min + 4.38;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.021016 && longitudenearest2 == 99.975332) {
      var minn = min + 3.25;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0210287 && longitudenearest2 == 99.9745637) {
      var minn = min + 3.05;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.0215904 && longitudenearest2 == 99.9737479) {
      var minn = min + 2.35;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.023648 && longitudenearest2 == 99.973767) {
      var minn = min + 1.25;
      this.setState({ mark2: Math.ceil(minn) });
    }
    else if (latitudenearest2 == 14.024751 && longitudenearest2 ==  99.974894) {
      this.setState({ mark2: Math.ceil(minn) })
    }
  }

  getMapRegion = () => ({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  selectedValue(index, value) { }
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ padding: 5 }}>
          
          <Image style={styles.banner} source={require('./img/kulogo2.jpg')} />
        
        </View>

        <MapView style={styles.maps}
          // region={this.getMapRegion()} >
          initialRegion={this.getMapRegion()} >
          <Polyline
            coordinates={[
              { latitude: 14.021920, longitude: 99.989126 },
              { latitude: 14.021935, longitude: 99.988338 },
              { latitude: 14.021936, longitude: 99.986966 },
              { latitude: 14.021958, longitude: 99.986138 },
              { latitude: 14.022001, longitude: 99.985710 },
              { latitude: 14.022030, longitude: 99.985541 },
              { latitude: 14.022197, longitude: 99.984916 },
              { latitude: 14.022610, longitude: 99.983982 }, 
              { latitude: 14.023163, longitude: 99.982733 },
              { latitude: 14.023449, longitude: 99.981797 },
              { latitude: 14.023526, longitude: 99.981247 },
              { latitude: 14.023545, longitude: 99.981034 },
              { latitude: 14.023614, longitude: 99.976004 },//สระพระ
              { latitude: 14.022565, longitude: 99.975998 },
              { latitude: 14.020977, longitude: 99.975978 },
              { latitude: 14.021023, longitude: 99.974894 },
              { latitude: 14.021024, longitude: 99.973744 },
              { latitude: 14.021044, longitude: 99.972777 },//
              { latitude: 14.021090, longitude: 99.972130 },
              { latitude: 14.022104, longitude: 99.972105 },
              { latitude: 14.022635, longitude: 99.972124 },
              { latitude: 14.023321, longitude: 99.972139 },
              { latitude: 14.023442, longitude: 99.972143 },
              { latitude: 14.023655, longitude: 99.972164 },
              { latitude: 14.023842, longitude: 99.972156 },
              // { latitude: 14.023832, longitude: 99.972158 },
              { latitude: 14.023907, longitude: 99.972146 },
              { latitude: 14.024809, longitude: 99.972121 },
              { latitude: 14.024796, longitude: 99.973793 }, //ปฐพี
              { latitude: 14.024769, longitude: 99.974890 },//ห้องสมุด
              { latitude: 14.024754, longitude: 99.975991 },
              { latitude: 14.024662, longitude: 99.976058 },
              { latitude: 14.024209, longitude: 99.976027 }, //อบน
              { latitude: 14.023754, longitude: 99.976001 },//ออกสระ
              { latitude: 14.023747, longitude: 99.976418 },
              { latitude: 14.023725, longitude: 99.977234 },
              { latitude: 14.023708, longitude: 99.977801 },
              { latitude: 14.023707, longitude: 99.978419 },
              { latitude: 14.023711, longitude: 99.979196 },
              { latitude: 14.023706, longitude: 99.979483 },
              { latitude: 14.023683, longitude: 99.981015 },
              { latitude: 14.023664, longitude: 99.981306 },
              { latitude: 14.023649, longitude: 99.981425 },
              { latitude: 14.023596, longitude: 99.981757 },
              { latitude: 14.023594, longitude: 99.981789 },
              { latitude: 14.023516, longitude: 99.982108 },
              { latitude: 14.023416, longitude: 99.982434 },
              { latitude: 14.023301, longitude: 99.982782 },
              { latitude: 14.023148, longitude: 99.983146 },
              { latitude: 14.022312, longitude: 99.984970 },
              { latitude: 14.022199, longitude: 99.985354 },
              { latitude: 14.022147, longitude: 99.985557 },
              { latitude: 14.022093, longitude: 99.985854 },
              { latitude: 14.022077, longitude: 99.986028 },
              { latitude: 14.022070, longitude: 99.986356 },
              { latitude: 14.022031, longitude: 99.989125 },
              { latitude: 14.022021, longitude: 99.989334 },
              { latitude: 14.022008, longitude: 99.989507 },
              { latitude: 14.021898, longitude: 99.990092 },
              { latitude: 14.021778, longitude: 99.990051 },//กลับรถเข้าท่า
              { latitude: 14.021862, longitude: 99.989677 },
              { latitude: 14.021895, longitude: 99.989492 },
              // { latitude: 14.021913,  longitude: 99.989311 },
              //{ latitude: 14.021932,  longitude: 99.989057 },
              { latitude: 14.021920, longitude: 99.989126 }
            ]}
            strokeColor="#F08080"
            strokeWidth={4.5}
          />

          <Polyline
            coordinates={[
              { latitude: 14.026473, longitude: 99.983792 },
              { latitude: 14.026501, longitude: 99.982941 },
              { latitude: 14.026436, longitude: 99.982938 }, //แยกหออ้วน
              { latitude: 14.026446, longitude: 99.982404 }, //เว่นหอในญเอก
              { latitude: 14.026473, longitude: 99.982350 },
              { latitude: 14.026614, longitude: 99.982263 },
              { latitude: 14.026633, longitude: 99.982245 },
              { latitude: 14.026656, longitude: 99.982201 },
              { latitude: 14.026668, longitude: 99.982137 },
              { latitude: 14.026672, longitude: 99.982091 },
              { latitude: 14.026693, longitude: 99.981104 }, //เลี้ยวเข้าเส้นทางหอพัก
              { latitude: 14.026782, longitude: 99.981130 },
              { latitude: 14.026805, longitude: 99.981214 },
              { latitude: 14.027008, longitude: 99.981399 },
              { latitude: 14.027091, longitude: 99.981452 },
              { latitude: 14.027193, longitude: 99.981490 },
              { latitude: 14.027331, longitude: 99.981471 },
              { latitude: 14.027335, longitude: 99.981478 },
              { latitude: 14.027335, longitude: 99.981183 },
              { latitude: 14.027491, longitude: 99.981024 },
              { latitude: 14.027439, longitude: 99.980877 },
              { latitude: 14.027423, longitude: 99.980783 },
              { latitude: 14.027459, longitude: 99.980299 },
              { latitude: 14.027475, longitude: 99.980165 },
              { latitude: 14.027519, longitude: 99.980106 },
              { latitude: 14.027498, longitude: 99.980009 }, //ร้านแช่มคาเฟ่
              { latitude: 14.027495, longitude: 99.979940 },
              { latitude: 14.027503, longitude: 99.979911 },
              { latitude: 14.027644, longitude: 99.979557 },
              { latitude: 14.027695, longitude: 99.979444 },
              { latitude: 14.027768, longitude: 99.979324 },
              { latitude: 14.027806, longitude: 99.979280 },
              { latitude: 14.028123, longitude: 99.979543 },
              { latitude: 14.028222, longitude: 99.979386 },
              { latitude: 14.028338, longitude: 99.979237 },
              { latitude: 14.028500, longitude: 99.979082 },
              { latitude: 14.028715, longitude: 99.978886 },
              { latitude: 14.028867, longitude: 99.978763 },
              { latitude: 14.028611, longitude: 99.978429 },
              { latitude: 14.028529, longitude: 99.978300 },
              { latitude: 14.028450, longitude: 99.978199 },
              { latitude: 14.028327, longitude: 99.978080 },
              { latitude: 14.028189, longitude: 99.977983 },
              { latitude: 14.027866, longitude: 99.977750 },
              { latitude: 14.027549, longitude: 99.977536 }, //เลี้ยวออกแยกสถานพยาบาล
              { latitude: 14.027395, longitude: 99.977718 },
              { latitude: 14.027218, longitude: 99.977966 },
              { latitude: 14.026922, longitude: 99.978269 },
              { latitude: 14.026833, longitude: 99.978368 },
              { latitude: 14.026656, longitude: 99.978520 },
              { latitude: 14.026656, longitude: 99.978520 },
              { latitude: 14.026343, longitude: 99.978733 },
              { latitude: 14.026258, longitude: 99.978808 },
              { latitude: 14.026188, longitude: 99.978828 },
              { latitude: 14.026177, longitude: 99.978839 },
              { latitude: 14.026059, longitude: 99.978912 },
              { latitude: 14.025881, longitude: 99.979014 },
              { latitude: 14.025548, longitude: 99.979142 },
              { latitude: 14.025423, longitude: 99.979169 },
              { latitude: 14.025259, longitude: 99.979208 },
              { latitude: 14.024998, longitude: 99.979230 },
              { latitude: 14.024121, longitude: 99.979202 },
              { latitude: 14.023689, longitude: 99.979168 },
              { latitude: 14.023682, longitude: 99.979655 },
              { latitude: 14.023672, longitude: 99.980127 }, //กลับรถถนนใหญ่
              { latitude: 14.023570, longitude: 99.980114 },
              { latitude: 14.023596, longitude: 99.979118 },
              { latitude: 14.023607, longitude: 99.977395 },
              { latitude: 14.023621, longitude: 99.975985 }, //สระพระ
              { latitude: 14.022619, longitude: 99.975977 },
              { latitude: 14.021010, longitude: 99.975963 },
              { latitude: 14.021049, longitude: 99.974866 },
              { latitude: 14.021048, longitude: 99.973743 },
              { latitude: 14.021169, longitude: 99.973742 },
              { latitude: 14.022033, longitude: 99.973753 },
              { latitude: 14.022617, longitude: 99.973765 },
              { latitude: 14.022646, longitude: 99.973768 },
              { latitude: 14.024775, longitude: 99.973786 },
              { latitude: 14.024733, longitude: 99.975982 },
              { latitude: 14.024662, longitude: 99.976042 },
              { latitude: 14.024319, longitude: 99.976008 },
              { latitude: 14.023735, longitude: 99.975976 }, //ออกจากสระพระ
              { latitude: 14.023693, longitude: 99.977588 },
              { latitude: 14.023682, longitude: 99.977942 },
              { latitude: 14.023677, longitude: 99.978582 },
              { latitude: 14.023685, longitude: 99.979148 },
              { latitude: 14.024052, longitude: 99.979137 }, //เลี้ยวเข้าซอยเล็กเกือบเข้าหอ
              { latitude: 14.024984, longitude: 99.979169 },
              { latitude: 14.025247, longitude: 99.979143 },
              { latitude: 14.025415, longitude: 99.979127 },
              { latitude: 14.025539, longitude: 99.979093 },
              { latitude: 14.025704, longitude: 99.979042 },
              { latitude: 14.025878, longitude: 99.978966 },
              { latitude: 14.026041, longitude: 99.978883 },
              { latitude: 14.026173, longitude: 99.978805 },
              { latitude: 14.026209, longitude: 99.978753 },
              { latitude: 14.026486, longitude: 99.978519 },
              { latitude: 14.026693, longitude: 99.978336 },
              { latitude: 14.026776, longitude: 99.978257 },
              { latitude: 14.026822, longitude: 99.978209 },
              { latitude: 14.026875, longitude: 99.978154 },
              { latitude: 14.027129, longitude: 99.977891 },
              { latitude: 14.027309, longitude: 99.977666 },
              { latitude: 14.027457, longitude: 99.977438 },
              { latitude: 14.027493, longitude: 99.977395 },//เลี้ยวเข้าซอยหอญปก
              { latitude: 14.027559, longitude: 99.977480 },
              { latitude: 14.027902, longitude: 99.977687 },
              { latitude: 14.028224, longitude: 99.977927 },
              { latitude: 14.028360, longitude: 99.978041 },
              { latitude: 14.028475, longitude: 99.978168 },
              { latitude: 14.028567, longitude: 99.978275 },
              { latitude: 14.028659, longitude: 99.978393 },
              { latitude: 14.028921, longitude: 99.978761 },
              { latitude: 14.029140, longitude: 99.979087 },
              { latitude: 14.029295, longitude: 99.979297 },
              { latitude: 14.029361, longitude: 99.979375 },
              { latitude: 14.029422, longitude: 99.979418 },
              { latitude: 14.029399, longitude: 99.979447 }, //หอญรัฐ
              { latitude: 14.029341, longitude: 99.979397 },
              { latitude: 14.029256, longitude: 99.979300 },
              { latitude: 14.029118, longitude: 99.979105 },
              { latitude: 14.028901, longitude: 99.978785 },
              { latitude: 14.028661, longitude: 99.978994 },
              { latitude: 14.028525, longitude: 99.979110 },
              { latitude: 14.028364, longitude: 99.979263 }, //14.028250, 99.979405
              { latitude: 14.028250, longitude: 99.979405 },
              { latitude: 14.028147, longitude: 99.979585 },
              { latitude: 14.028095, longitude: 99.979698 },
              { latitude: 14.027970, longitude: 99.980027 },
              { latitude: 14.027917, longitude: 99.980181 },
              { latitude: 14.027916, longitude: 99.980197 },
              { latitude: 14.027636, longitude: 99.980114 },
              { latitude: 14.027599, longitude: 99.980108 },
              { latitude: 14.027561, longitude: 99.980129 },
              { latitude: 14.027538, longitude: 99.980154 },
              { latitude: 14.027528, longitude: 99.980180 },
              { latitude: 14.027503, longitude: 99.980303 },
              { latitude: 14.027473, longitude: 99.980780 },
              { latitude: 14.027489, longitude: 99.980863 },
              { latitude: 14.027543, longitude: 99.981038 },
              { latitude: 14.027599, longitude: 99.981111 },
              { latitude: 14.027636, longitude: 99.981139 },
              { latitude: 14.027683, longitude: 99.981157 },
              { latitude: 14.027742, longitude: 99.981166 },
              { latitude: 14.028073, longitude: 99.981172 },//กองกิจ
              { latitude: 14.028305, longitude: 99.981177 },
              { latitude: 14.028384, longitude: 99.981195 },
              { latitude: 14.028434, longitude: 99.981233 },
              { latitude: 14.028745, longitude: 99.981590 },
              { latitude: 14.028710, longitude: 99.981663 },
              { latitude: 14.028677, longitude: 99.981624 },
              { latitude: 14.028668, longitude: 99.981622 },
              { latitude: 14.028482, longitude: 99.981668 },
              { latitude: 14.028345, longitude: 99.981690 },
              { latitude: 14.028045, longitude: 99.981699 },
              { latitude: 14.028017, longitude: 99.981695 },
              { latitude: 14.027875, longitude: 99.981669 },
              { latitude: 14.027533, longitude: 99.981570 },
              { latitude: 14.027367, longitude: 99.981525 },
              { latitude: 14.027324, longitude: 99.981516 },
              { latitude: 14.027244, longitude: 99.981531 },
              { latitude: 14.027187, longitude: 99.981530 },
              { latitude: 14.027127, longitude: 99.981516 },
              { latitude: 14.027067, longitude: 99.981492 },
              { latitude: 14.026977, longitude: 99.981440 },
              { latitude: 14.026802, longitude: 99.981285 },
              { latitude: 14.026772, longitude: 99.981250 },
              { latitude: 14.026759, longitude: 99.981220 },
              { latitude: 14.026739, longitude: 99.981167 },
              { latitude: 14.026716, longitude: 99.981164 },
              { latitude: 14.026718, longitude: 99.982089 },
              { latitude: 14.026713, longitude: 99.982151 },
              { latitude: 14.026694, longitude: 99.982215 },
              { latitude: 14.026661, longitude: 99.982272 },
              { latitude: 14.026637, longitude: 99.982295 },
              { latitude: 14.026502, longitude: 99.982383 },
              { latitude: 14.026485, longitude: 99.982410 },
              { latitude: 14.026473, longitude: 99.982903 },
              { latitude: 14.026542, longitude: 99.982904 },
              { latitude: 14.026500, longitude: 99.983811 },
              { latitude: 14.026473, longitude: 99.983792 }
            ]}
            strokeColor="#A2CD5A"
            strokeWidth={4}
          />

          <Marker.Animated ref={marker => {
            this.marker = marker;
          }}
            coordinate={this.state.coordinate}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.bus}
                source={require('./img/bus_pink.png')}
              />
            </View>
          </Marker.Animated>

          <Marker.Animated
            ref={marker2 => {
              this.marker2 = marker2;

            }}

            coordinate={this.state.coordinate2}

          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.bus}
                source={require('./img/bus_green.png')}
              />
            </View>
          </Marker.Animated>


          <Marker
            coordinate={{ latitude: 14.021920, longitude: 99.989126}}
            onPress={() => { this.mark1(); this.refs.modal4.open(); }}
          //title="อาคารประชาสัมพันธ์"
          >
            <View>
              <Image
                style={styles.busstart}
                source={require('./img/start.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.023595,  longitude: 99.977131 }}
            //title="ศูนย์มหาวิทยาลัย"
            onPress={() => { this.mark2(); this.mark22(); this.refs.modal5.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.buslogo}
                source={require('./img/stop.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.022205, longitude: 99.975986 }}
            // title="โรงอาหารกลาง"
            onPress={() => { this.mark3(); this.mark33(); this.refs.modal6.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.buslogo}
                source={require('./img/stop.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.021016, longitude: 99.975332 }}
            // title="คณะศึกษาศาสตร์และพัฒนศาสตร์"
            onPress={() => { this.mark4(); this.mark44(); this.refs.modal7.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.buslogo}
                source={require('./img/stop.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.0210287, longitude: 99.9745637 }}
            // title="คณะวิทยาศาสตร์การกีฬา"
            onPress={() => { this.mark5(); this.mark55(); this.refs.modal8.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.buslogo}
                source={require('./img/stop.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.0215904, longitude: 99.9737479 }}
            // title="คณะสัตวแพทยศาสตร์ กำแพงแสน"
            onPress={() => { this.mark11(); this.refs.modal9.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.buslogo}
                source={require('./img/stop.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.023648, longitude: 99.973767 }}
            // title="คณะเกษตร กำแพงแสน"
            onPress={() => {this.mark12(); this.refs.modal10.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.buslogo}
                source={require('./img/stop.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.024751, longitude:  99.974894 }}
            // title="สำนักหอสมุดกำแพงแสน"
            onPress={() => {this.mark9(); this.mark99();this.refs.modal11.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.buslogo}
                source={require('./img/stop.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.021040, longitude: 99.973327 }}
            // title="โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน"
            onPress={() => { this.mark6(); this.refs.modal13.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.buslogo}
                source={require('./img/stop.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.021214, longitude: 99.972134 }}
            // title="คณะวิศวกรรมศาสตร์ กำแพงแสน"
            onPress={() => { this.mark7(); this.refs.modal14.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.buslogo}
                source={require('./img/stop.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.024585, longitude: 99.972128 }}
            // title="ภาควิชาเกษตรกลวิธาน"
            onPress={() => {this.mark8(); this.refs.modal15.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.buslogo}
                source={require('./img/stop.png')}
              />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: 14.026440, longitude: 99.983792 }}
            // title="หอพักนิสิตชายและหญิง"
            onPress={() => { this.mark10(); this.refs.modal16.open() }}
          >
            <View style={{ backgroundColor: "blank", padding: 10 }}>
              <Image
                style={styles.busstart}
                source={require('./img/start.png')}
              />
            </View>
          </Marker>
        </MapView>

        <FloatingAction
          actions={actions}
          onPressItem={name => {
            if (name == "bt_busstop") {
              this.props.navigation.navigate('Bus')
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
        ></FloatingAction>

        <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled}>
          <Text style={styles.text1}>INFORMATION</Text>
          <Image
            style={{ height: 275, width: 300, textAlign: 'center', marginTop: 20, marginLeft: 20 }}
            source={require('./img/PSbus.png')} />
        </Modal>

        <Modal style={styles.modal4} position={"bottom"} ref={"modal4"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={[styles.text2]}>อาคารประชาสัมพันธ์</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={[styles.circle_car]}
                source={require('./img/circle_red.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark1} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal5} position={"bottom"} ref={"modal5"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>ศูนย์มหาวิทยาลัย</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={[styles.circle_car]}
                source={require('./img/circle_red.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark1} นาที </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={[styles.circle_car, styles.ro]}
                source={require('./img/circle_green.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark2} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal6} position={"bottom"} ref={"modal6"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>โรงอาหารกลาง</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_red.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark1} นาที </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_green.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark2} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal7} position={"bottom"} ref={"modal7"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>คณะศึกษาศาสตร์และพัฒนศาสตร์</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_red.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark1} นาที </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_green.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark2} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal8} position={"bottom"} ref={"modal8"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>คณะวิทยาศาสตร์การกีฬา</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_red.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark1} นาที </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_green.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark2} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal9} position={"bottom"} ref={"modal9"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>คณะสัตวแพทยศาสตร์ กำแพงแสน</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_green.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark2} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal10} position={"bottom"} ref={"modal10"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>คณะเกษตร กำแพงแสน</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_green.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark2} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal11} position={"bottom"} ref={"modal11"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>สำนักหอสมุดกำแพงแสน</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_red.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark1} นาที </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_green.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark2} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal13} position={"bottom"} ref={"modal13"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_red.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark1} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal14} position={"bottom"} ref={"modal14"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>คณะวิศวกรรมศาสตร์ กำแพงแสน</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_red.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark1} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal15} position={"bottom"} ref={"modal15"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>ภาควิชาเกษตรกลวิธาน</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_red.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark1} นาที </Text>
            </View>
          </View>
        </Modal>

        <Modal style={styles.modal16} position={"bottom"} ref={"modal16"} isDisabled={this.state.isDisabled}>
          <View>
            <Text style={styles.text2}>หอพักนิสิตชายและหญิง</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.circle_car}
                source={require('./img/circle_green.png')} />
              <Text style={{ marginLeft: 20, fontFamily: "FC Ekaluck Regular ver 1.01", fontSize: 25, marginTop: 7 }}>{this.state.mark2} นาที </Text>
            </View>
          </View>
        </Modal>
      </View >
    );
  };
}
const styles = StyleSheet.create({

  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    //alignItems: 'center',
  },

  banner: {
    width: 400,
    height: 100,
  },
bus:{
  width: 30,
    height: 30,
},
  buslogo: {
    width: 25,
    height: 25,
  },
  busstart: {
    width: 20,
    height: 20,
  },

  maps: {
    width: '100%',
    height: '100%',
  },

  footer: {
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },

  fab: {
    height: 50,
    width: 50,
    borderRadius: 200,
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#686cc3',
  },

  fab2: {
    height: 50,
    width: 130,
    borderRadius: 200,
    position: 'absolute',
    bottom: 20,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    color: 'white',
  },
  text: {
    fontSize: 30,
    color: 'white'
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  modal4: {
    height: 90,
  },
  modal5: {
    height: 110,
  },
  modal6: {
    height: 110,
  },
  modal7: {
    height: 110,
  },
  modal8: {
    height: 110,
  },
  modal9: {
    height: 90,
  },
  modal10: {
    height: 90,
  },
  modal11: {
    height: 110,
  },
  modal12: {
    height: 110,
  },
  modal13: {
    height: 110,
  },
  modal14: {
    height: 90,
  },
  modal15: {
    height: 90,
  },
  modal16: {
    height: 90
  },
  modal3: {
    height: 250,
    width: 300,
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

  text1: {
    color: "black",
    fontSize: 30,
    fontFamily: "FC Ekaluck Bold ver 1.01",
    textAlign: 'center',
    marginTop: 100,
  },
  text2: {
    color: "black",
    fontSize: 30,
    fontFamily: "FC Ekaluck Bold ver 1.01",
    textAlign: 'center',
    marginTop: 7,
  },
  circle_car: {
    width: 20,
    height: 20,
    marginLeft: 50,
    marginTop: 7
  },

});

export default Line2;
