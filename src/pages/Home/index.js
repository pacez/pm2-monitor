import React, { PureComponent } from 'react';
import { Layout, Button, Table, Input, message, Popconfirm, Tooltip } from 'antd';
import Request from '../../util/request';
import { defaultData } from '../../util/constants';
import Loading from '../../components/Loading';
import Log from '../../components/Log';
import Immutable from 'immutable';
import { DeleteOutlined, CoffeeOutlined, ReloadOutlined, StopOutlined, PlayCircleOutlined, BranchesOutlined, LogoutOutlined, RetweetOutlined, SyncOutlined, CheckOutlined, UnorderedListOutlined, BellOutlined, CloudServerOutlined } from '@ant-design/icons';
import './style.scss';
const { Header, Footer, Content, Sider } = Layout;
const defaultLog = Immutable.Map({
    visible: false,
    id: null,
    type: 'process', // 获取日志类型，process进程  | build 构建
});

export default class extends PureComponent {

    state = {
        loading: false,
        log: defaultLog,
        gitlibList: defaultData,
        porcessList: defaultData,
        buildTasks: defaultData,
        systemInfo: defaultData,
    }

    gitlibCols = [
        {
            width: 30,
            title: 'Index',
            dataIndex: 'name',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Client',
            dataIndex: 'client',
        },
        {
            title: 'Branch',
            dataIndex: 'branch',
            render: (text, record, index) => <Input onChange={(e) => { this.onChangeBranch(e.target.value, index) }} value={text} />
        },
        {
            title: 'Desc',
            dataIndex: 'desc',
        },
        {
            title: 'Action',
            dataIndex: 'name',
            render: (text) => {
                return <Tooltip
                    title="Switch Branch"
                    mouseEnterDelay={1}
                >
                    <span onClick={this.switchBranch} className="action-btn">
                        <BranchesOutlined />
                    </span>
                </Tooltip>
            }
        },
    ]
    
    processCols = [
        {
            width: 30,
            title: 'Index',
            dataIndex: 'name',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Task ID',
            dataIndex: 'pm_id',
        },
        {
            title: 'PID',
            dataIndex: 'pid',
            key: 'pid',
        },
        {
            title: 'Status',
            dataIndex: 'pm2_env',
            render: (pm2_env) => <span className={`col-status status-${pm2_env.status}`}>{pm2_env.status}</span>
        },
        {
            title: 'Uptime',
            dataIndex: 'pm2_env',
            render: (pm2_env) => {
                const date = new Date(pm2_env.pm_uptime);
                return `
                        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
                        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
                    `
            }
        },
        {
            title: 'CPU',
            dataIndex: 'monit',
            render: (monit) => `${monit.cpu}%`
        },
        {
            title: 'Memory',
            dataIndex: 'monit',
            render: (monit) => `${(monit.memory / (1024 * 1024)).toFixed(2)}MB`
        },
        {
            title: 'Action',
            width: 140,
            dataIndex: 'pm_id',
            render: (pm_id, record) => {
                return <>
                    {
                        record.pm2_env.status === 'online'
                        && record.name !== 'monitor'
                        && <Tooltip
                            title="Stop"
                            mouseEnterDelay={1}
                        >
                            <span
                                onClick={() => { this.processAction('stop', pm_id) }}
                                className="action-btn">
                                <StopOutlined />
                            </span>
                        </Tooltip>
                    }
                    {
                        record.pm2_env.status !== 'online' && record.name !== 'monitor'
                        && <Tooltip
                            title="Start"
                            mouseEnterDelay={1}
                        >
                            <span
                                onClick={() => { this.processAction('start', pm_id) }}
                                className="action-btn">
                                <PlayCircleOutlined />
                            </span>
                        </Tooltip>
                    }
                    <Tooltip
                        title="Restart"
                        mouseEnterDelay={1}
                    >
                        <span
                            onClick={() => { this.processAction('restart', pm_id) }}
                            className="action-btn">
                            <ReloadOutlined />
                        </span>
                    </Tooltip>
                    {
                        record.name !== 'monitor'
                        && <Tooltip
                            title="Delete"
                            mouseEnterDelay={1}
                        >
                            <Popconfirm
                                title="Are you sure delete this task?"
                                onConfirm={() => { this.processAction('delete', pm_id) }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <span className="action-btn"> <DeleteOutlined /> </span>
                            </Popconfirm>
                        </Tooltip>
                    }
                    <Tooltip
                        title="Log"
                        mouseEnterDelay={1}
                    >
                        <span
                            onClick={() => { this.onLogVisible(true, pm_id) }}
                            className="action-btn">
                            <CoffeeOutlined />
                        </span>
                    </Tooltip>
                </>
            }
        }
    ]

    componentDidMount() {
        this.refresh();
        window.setInterval(()=>{
            this.buildTasks(true)
        },7000)
    }

    // 刷新页面所有数据
    refresh = () => {
        this.fetchSystemInfo();
        this.fetchProcess();
        this.fetchGitlib();
        this.buildTasks();
    }

    // 重启服务器
    restart = () => {
        Request.get('/reboot');
        const key = 'restartMessage'
        message.loading({
            key,
            duration: 30,
            content: 'Restarting... It takes about 30 seconds。',
        });
        setTimeout(() => {
            window.location.reload();
        }, 30000);;
    }

    // 退出登陆
    logout = () => {
        this.setState({
            loading: true
        },()=>{
            Request.get('/logout').finally(() => {
                this.setState({
                    loading: false
                });
            });
        })
        
    }

    // 执行进行操作
    processAction = (action, id) => {
        this.setState({
            loading: true
        }, () => {
            Request.get(`/${action}`, { params: { id } }).then(data => {
                message.success('Operate Successfully!');
                this.fetchProcess();
            }).finally(() => {
                this.setState({
                    loading: false
                })
            })
        });
    }

    // 修改分支
    onChangeBranch = (value, index) => {
        const { gitlibList } = this.state;
        this.setState({
            gitlibList: gitlibList.setIn(['data', index, 'branch'], value)
        })
    }

    // 切换分支 
    switchBranch = () => {
        this.setState({
            loading: true
        }, () => {
            Request.post('/updateGitConfig', this.state.gitlibList.get('data').toJS()).then(data => {
                message.success('Switch Branch Success!')
                this.fetchGitlib();
            }).finally(() => {
                this.setState({
                    loading: false
                });
            })
        });
    }

    // 获取服务系统信息
    fetchSystemInfo = () => {
        const { systemInfo } = this.state;
        this.setState({
            systemInfo: systemInfo.set('loading', true)
        }, () => {
            Request.get('/getSystemInfo').then(data => {
                this.setState({
                    systemInfo: systemInfo.set('data', eval(data)).set('loaded', true).set('loading', false)
                })
            })
        });
    }

    // 获取进程信息
    fetchProcess = () => {
        const { porcessList } = this.state;
        this.setState({
            porcessList: porcessList.set('loading', true)
        }, () => {
            Request.get('/getProccess').then(data => {
                this.setState({
                    porcessList: porcessList.set('data', data || Immutable.List()).set('loaded', true).set('loading', false)
                })
            })
        });
    }

    // 获取构建列表
    buildTasks = (silence=false) => {
        const { buildTasks } = this.state;
        this.setState({
            buildTasks: buildTasks.set('loading', !silence)
        }, () => {
                Request.get('/buildTasks').then(data => {
                this.setState({
                    buildTasks: buildTasks.set('data', data).set('loaded', true).set('loading', false)
                })
            })
        });
    }

    // 获取gitlib仓库信息
    fetchGitlib = () => {
        const { gitlibList } = this.state;
        this.setState({
            gitlibList: gitlibList.set('loading', true)
        }, () => {
            Request.get('/getGitConfig').then(data => {
                this.setState({
                    gitlibList: gitlibList.set('data', data).set('loaded', true).set('loading', false)
                })
            })
        });
    }

    // 控制日志组件显示状态
    onLogVisible = (visible = false, id = null, type ='process') => {
        console.log(visible, id)
        const { log } = this.state;
        this.setState({
            log: log.set('visible', visible).set('id', id).set('type', type)
        })
    }

    render() {
        const { systemInfo, porcessList, buildTasks, gitlibList, loading, log } = this.state;

        return (
            <>
                {
                    (
                        loading
                        || systemInfo.get('loading')
                        || buildTasks.get('loading')
                        || porcessList.get('loading')
                    )
                    && <Loading
                    />
                }

                {
                    log.get('visible') && <Log
                        id={log.get('id')}
                        type={log.get('type')}
                        onClose={() => { this.onLogVisible(false) }}
                    />
                }
                <Layout>
                    <Header>
                        <h1 className="header-title">Welcome To E-learning FE CI Monitor</h1>
                        <div className="header-command">
                            <Button type="link" href="//10.99.110.115:8080/admin.html#whistle" target="_blank">
                                Proxy Server
                            </Button>

                            <Button icon={<RetweetOutlined />} type="primary" onClick={this.refresh}>Refresh</Button>

                            <Popconfirm
                                title="Are you sure restart server?"
                                onConfirm={this.restart}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button icon={<ReloadOutlined />} type="primary" danger>Restart</Button>
                            </Popconfirm>

                            <Button onClick={this.logout} icon={<LogoutOutlined />}>Logout</Button>

                        </div>
                    </Header>
                    <Layout className="site-layout-background">
                        <Sider className="silder" width={280}>
                            {
                                buildTasks.get('loaded') && <>
                                    <h1><BellOutlined style={{ marginRight: 10 }} />Build Log</h1>
                                    <div className="build-list">
                                        {
                                            buildTasks.get('data', Immutable.List()).map(task => {
                                                const status = task.get('status');
                                                const pid = task.get('pid');
                                                return <div className="task" key={task.get('pid')}>
                                                    <div className="task-row-1">
                                                        <span className="pid">{pid}</span>
                                                        <span className="branch">{task.get('branch')}</span>
                                                        {

                                                            status === 'running' && <span className="status running"> <SyncOutlined spin /></span>
                                                        }
                                                        {

                                                            status === 'end' && <span className="status"> <CheckOutlined /></span>
                                                        }
                                                        {

                                                            status === 'error' && <span className="status error"> <StopOutlined /></span>
                                                        }
                                                    </div>
                                                    <div className="task-row-2">
                                                        <span className="name">{task.get('name')}</span>
                                                        {
                                                            ['end', 'error'].includes(status) && <CoffeeOutlined
                                                                onClick={() => { 
                                                                    this.onLogVisible(true, pid,'build') 
                                                                }} 
                                                                className="build-log"
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </>
                            }
                        </Sider>
                        <Content className={'content'}>

                            {
                                systemInfo.get('loaded') && <div
                                    id="systemInfo"
                                    className="system-info"
                                >
                                    {
                                        systemInfo.get('data', []).map((item,index) => {
                                            return <span className="system-item" key={index}>
                                                <CloudServerOutlined />
                                                <span className="system-item-name">{item.name}</span>
                                                <span>{item.value}</span>
                                            </span>
                                        })
                                    }
                                </div>
                            }
                            {
                                porcessList.get('loaded') && <>
                                    <h1><UnorderedListOutlined style={{ marginRight: 10 }} /> Process List</h1>
                                    <Table
                                        rowKey="pid"
                                        pagination={false}
                                        columns={this.processCols}
                                        dataSource={porcessList.get('data', Immutable.List()).toJS()}
                                    />
                                </>
                            }

                            {
                                gitlibList.get('loaded') && <>
                                    <h1><UnorderedListOutlined style={{marginRight: 10}} />Gitlab Repositories</h1>
                                    <Table
                                        rowKey="name"
                                        pagination={false}
                                        columns={this.gitlibCols}
                                        dataSource={gitlibList.get('data', Immutable.List()).toJS()}
                                    />
                                </>
                            }
                        </Content>
                    </Layout>
                    <Footer>
                        E-learning FE CI Monitor copyright © 2020   |    zhongpeizhi@beisen.com
                    </Footer>
                </Layout>
            </>
        )
    }
}