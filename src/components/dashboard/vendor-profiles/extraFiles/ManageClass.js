import React from 'react';
import { connect } from 'react-redux';
import { Layout, Card, Typography, Button, Tabs, Table, Avatar, Row, Col } from 'antd';
import AppSidebar from '../../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import PostAdPermission from '../../../classified-templates/PostAdPermission'
import { getDashBoardDetails, getTraderProfile } from '../../../../actions'
import { convertISOToUtcDateformate, displayDateTimeFormate } from '../../../common';
import { Pie, yuan } from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';
import { DEFAULT_IMAGE_TYPE } from '../../../../config/Config';
// import './calender.less'
import { displayCalenderDate, displayDate } from '../../../common'

const { TabPane } = Tabs;

const salesPieData = [
  {
    x: 'Ab',
    y: 4544,
  },
  {
    x: 'cd',
    y: 3321,
  },
  {
    x: 'ef',
    y: 3113,
  },
];


const { Title, Text } = Typography;
let today = Date.now()
class ManageClass extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: false, index: ''
    };
  }

  componentDidMount() {
    const { id } = this.props.userDetails
    this.props.getTraderProfile({ user_id: id })
    this.getDashBoardDetails()

    function days(current) {
      var week = new Array();
      // Starting Monday not Sunday 
      var first = ((current.getDate() - current.getDay()) + 1);
      for (var i = 0; i < 7; i++) {
        week.push(
          new Date(current.setDate(first++))
        );
      }
      return week;
    }

    var input = new Date();
    

    var result = days(input);
    let date = result.map(d => d.toString());
    this.setState({ dates: date })
  }

  /**
   * @method  get DashBoard Details
   * @description get classified   
   */
  getDashBoardDetails = () => {
    
    const { id } = this.props.loggedInUser;
    let reqData = {
      // user_id: 54,
      // page_size: 10,
      // page: 1
      user_id: "54",
      page_size: 10,
      page: 1,
      created_date: "2019-09-13"
    }
    this.props.getDashBoardDetails(reqData, (res) => {
      if (res.success && res.success.status == 1) {
        // 

        this.setState({ dashboardDetails: res.success.data })
      }
    })
  }

  renderDates = (dates) => {
    const { selectedDate, index } = this.state
    return dates.map((el, i) => {
      let currentDate = displayDate(el) == displayDate(Date.now()) ? 'active' : ''
      return (
        <li key={i} onClick={() => this.setState({ index: i, selectedDate: el })} style={{ cursor: 'pointer' }}>
          <span className={index == i ? 'active' : currentDate}>{displayDate(el)}</span>
        </li>
      )
    })
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { dashboardDetails } = this.state
    

    const columns = [
      {
        title: '',
        dataIndex: 'name',
        // key: 'name'
        render: (cell, row, index) => {
          return (
            <span className='user-icon mr-13'>
              <Avatar src={(row.image !== undefined) ? row.image : DEFAULT_IMAGE_TYPE
              } />
              {row.name}
            </span>
          )
        }
      },
      {
        title: '',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '',
        dataIndex: 'application_status',
        // key: 'application_status'
        render: (cell, row, index) => {
          return (
            <div>
              <Button onClick={(e) => this.changeStatus(0, cell)} type="primary" >
                {row.application_status}
              </Button>

              <Text>{displayDateTimeFormate(row.created_at)}
              </Text>
            </div>
          )
        }
      }
    ]


    return (
      <Layout>
        <Layout>
          <div className='my-profile-box' style={{ minHeight: 800 }} >
            <div className='card-container signup-tab'>
              <Tabs type='card' onChange={this.onTabChange}>
                <TabPane tab='View Class' key='1'>

                  <Tabs onTabClick={(tab) => {
                    this.getApplicationList(tab)
                    this.setState({ activeFlag: 1 })

                  }} type='card' >
                    <TabPane tab={`All (10)`} key={'0'}>
                      {/* <Table dataSource={currentList} columns={columns} />; */}
                    </TabPane>
                    <TabPane tab={`Active (3)`} key='1'>
                      {/* <Table dataSource={currentList} columns={columns} />; */}
                    </TabPane>
                    <TabPane tab={`Inactive (2)`} key='2'>
                      {/* <Table dataSource={currentList} columns={columns} />; */}
                    </TabPane>

                  </Tabs>





                </TabPane>
                <TabPane tab='View Membership' key='2'>
                </TabPane>
              </Tabs>

            </div>
          </div>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {}
  };
};
export default connect(
  mapStateToProps,
  { getDashBoardDetails, getTraderProfile }
)(ManageClass)