import React, { Component } from 'react';
import '../App.css';
import BarChart from './BarChart';
import Title from './Title';
import FloodInfo from './FloodInfo';
import * as XML_URLs from '../constants';
import {formatDate} from '../lib/utils'
import xml2js from 'xml2js';

class RiverConditions extends Component {

  constructor(props) {
    super(props);

    this.state = {
      location: window.location.pathname.replace(/\//g,''),
      width: window.innerWidth - 40,
      height: 400,
      title: '',
      warning: '',
      chartData: [],
      floodInfo: [],
      data: []
    };

  }

  getDerivedStateFromProps(props, state) {
    console.log(props);
    console.log(state);
  }

  _applyData = (result) => {
    let data = result;
    let newChartData = [];

    let observedLen = data.site.observed[0].datum.length;
    for (let i = 0; i < observedLen; i++) {
      var obj = {};
      obj['date'] = formatDate(data.site.observed[0].datum[i].valid[0]['_']);
      obj['waterHeight'] = data.site.observed[0].datum[i].primary[0]['_'];
      obj['flowSpeed'] = data.site.observed[0].datum[i].secondary[0]['_'];
      newChartData.push(obj);
    }

    // let forecastLen = data.site.forecast[0].datum.length;
    // for (let j = 0; j < forecastLen; j++) {
    //   var obj = {};
    //   obj['date'] = formatDate(data.site.observed[0].datum[j].valid[0]['_']);
    //   obj['waterHeight'] = data.site.observed[0].datum[j].primary[0]['_'];
    //   obj['flowSpeed'] = data.site.observed[0].datum[j].secondary[0]['_'];
    //   newChartData.push(obj);
    // }

    newChartData.reverse();

    console.log(newChartData);

    this.setState({
      title: data.site.$.name,
      warning: data.site.disclaimers[0].standing[0]['_'],
      data: newChartData,
      floodInfo: {
        action: {
          unit: data.site.sigstages[0].action[0]['$'].units,
          amount: data.site.sigstages[0].action[0]['_']
        },
        bankfull: {
          unit: data.site.sigstages[0].bankfull[0]['$'].units,
          amount: data.site.sigstages[0].bankfull[0]['_']
        },
        flood: {
          unit: data.site.sigstages[0].flood[0]['$'].units,
          amount: data.site.sigstages[0].flood[0]['_']
        },
        low: {
          unit: data.site.sigstages[0].low[0]['$'].units,
          amount: data.site.sigstages[0].low[0]['_']
        },
        major: {
          unit: data.site.sigstages[0].major[0]['$'].units,
          amount: data.site.sigstages[0].major[0]['_']
        },
        moderate: {
          unit: data.site.sigstages[0].moderate[0]['$'].units,
          amount: data.site.sigstages[0].moderate[0]['_']
        },
        record: {
          unit: data.site.sigstages[0].record[0]['$'].units,
          amount: data.site.sigstages[0].record[0]['_']
        }
      }
    });

  }

  _getData = (url) => {
    console.log(url);
    var self = this;
    fetch(url).then(response => {
      response.text().then(xmlText => {
        xml2js.parseString(xmlText, function (err, result) {
          console.log(result);
          self._applyData(result);
        });
      });
    })
  }

  componentDidUpdate(prev) {
    console.log('componentDidUpdate');
    const newLocation = this.props.match.params.place;
    console.log(newLocation);

    if (newLocation === undefined || newLocation === prev.match.params.place) {
      return false;
    }

    if (newLocation !== this.state.location) {
      console.log(newLocation + ' !== ' + this.state.location);
      const locationURL = XML_URLs[newLocation];
      console.log(locationURL);
      this._getData(locationURL);
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    console.log('>> props', this.props);
    const location = this.props.match.params.place;
    this.setState({ location: location });
    const locationURL = XML_URLs[location];
    console.log(locationURL);
    this._getData(locationURL);
  }

  render() {
    return (
      <div className="conditions-wrapper">
        { this.state.title &&
          <Title title={this.state.title} warning={this.state.warning} />
        }
        { this.state.floodInfo &&
          <FloodInfo floodInfo={this.state.floodInfo} />
        }
        { this.state.chartData &&
          <BarChart data={this.state.data} width={this.state.width} height={this.state.height} />
        }
      </div>
    );
  }
}

export default RiverConditions;
