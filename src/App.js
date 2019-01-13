import React, { Component } from 'react';
import './App.css';
import BarChart from './components/BarChart';
import Title from './components/Title';
import FloodInfo from './components/FloodInfo';
import {XML_URL} from './constants';
import {formatDate} from './lib/utils'
import xml2js from 'xml2js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth - 40,
      height: 400,
      title: '',
      warning: '',
      chartData: [],
      isLoading: false,
      floodInfo: [],
      data: []
    };

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
      isLoading: false,
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

    // console.log(data.site.sigstages[0]);

  }

  _getData = (url) => {
    console.log(url);
    this.setState({ isLoading: true });
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

  componentDidMount() {
    this._getData(XML_URL);
  }

  render() {
    return (
      <div className="App">

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

export default App;
