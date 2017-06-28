import * as React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import * as moment from 'moment';
import {FaSearch, FaSliders, FaPaintBrush, FaThumbTack} from 'react-icons/lib/fa';
import * as insertCSS from 'insert-css';
const style = require('./style.css');
insertCSS(style);

import SearchTabPanel from '../SearchTabPanel';

export interface PanelTabsProps {
  map: any
}

class PanelTabs extends React.Component<PanelTabsProps, {}> {
  constructor(props?: any, context?: any) {
    super(props, context);
  }

  render() {
    return (
      <Tabs className="tabs">
        <TabList className="tab-list" activeTabClassName="tab-select">
          <Tab className="tab"><FaSearch size={15} />Search</Tab>
          <Tab className="tab"><FaSliders size={15} />Result</Tab>
          <Tab className="tab"><FaPaintBrush size={15} />Visualization</Tab>
          <Tab className="tab"><FaThumbTack size={15} />My Pins</Tab>
        </TabList>
        <TabPanel>
          <SearchTabPanel map={this.props.map} />
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 3</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 4</h2>
        </TabPanel>
      </Tabs>
    );
  }
}

export default PanelTabs;
