import React, { Component } from 'react';
import './App.css';
import BarChart from './BarChart';
import Title from './Title';
import {XML_URL} from './constants';
import {formatDate} from './lib/utils'
import xml2js from 'xml2js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      width: 1200,
      height: 500,
      id: 'chart',
      title: '',
      warning: '',
      chartData: [],
      isLoading: false,
      floodInfo: {},
      data: []
    };

  }

  _applyData = (result) => {
    let data = result;
    let len = data.site.observed[0].datum.length;
    let newChartData = [];
    for (let i = 0; i < len; i++) {
      var obj = {};
      obj['date'] = formatDate(data.site.observed[0].datum[i].valid[0]['_']);
      obj['waterHeight'] = data.site.observed[0].datum[i].primary[0]['_'];
      obj['flowSpeed'] = data.site.observed[0].datum[i].secondary[0]['_'];
      newChartData.push(obj);
    }

    console.log(newChartData);

    this.setState({
      isLoading: false,
      title: data.site.$.name,
      warning: data.site.standing,
      data: newChartData,
      floodInfo: {
        action: {
          unit: data.site.sigstages[0].action[0]['$'].units,
          amount: data.site.sigstages[0].action[0]['_']
        },
        bankfull: {
          unit: data.site.sigstages[0].bankfull[0]['$'].units,
        },
        flood: data.site.sigstages[0].flood,
        low: data.site.sigstages[0].low,
        major: data.site.sigstages[0].major,
        moderate: data.site.sigstages[0].moderate,
        record: data.site.sigstages[0].record
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
      { this.state.chartData &&
        <BarChart data={this.state.data} width={this.state.width} height={this.state.height} id={this.state.id} />
      }
      </div>
    );
  }
}

export default App;
