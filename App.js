import { createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './src/HomeScreen';
import BusStop from './src/BusStop';
import Line1 from './src/Line1';
import Line2 from './src/Line2';

const navigator = createStackNavigator(
{

  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
    }
  },

  Bus: {
    screen: BusStop,
    navigationOptions: {
      header: null,
    }
  },

  Line1: {
    screen: Line1,
    navigationOptions: {
      header: null,
    }
  },
  Line2: {
    screen: Line2,
    navigationOptions: {
      header: null,
    }
  },

},
{

  initialRouteName: 'Line2'

}
);
export default createAppContainer(navigator);
