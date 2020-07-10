import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import Loading from '../Loading';
import Request from '../../util/request';
import './style.scss';

export default class extends PureComponent {

    state ={
        loading: false,
        log: ''
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.fetchLog();
        window.logInterval = window.setInterval(()=>{
            console.log('fetch log...')
            this.fetchLog(true)
        },5000)
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
        window.clearInterval(window.logInterval);
    }

    fetchLog = (silence = false) => {
        const { id }=this.props;
        console.log(id)
        this.setState({
            loading: !silence
        }, () => {
            Request.get(`/log2`, { params: { id } }).then(data => {
                this.setState({
                    log: data
                })
            }).finally(() => {
                this.setState({
                    loading: false
                });
            })
        });
    }

    render() {
        const { log,loading } = this.state;
        return <Modal
            width="80%"
            visible={true}
            footer={null}
            onCancel = { this.props.onClose }
        >   
            {
                loading && <Loading />
            }
            <div className="code">
                <pre>
                    {log}
                </pre>
            </div>
        </Modal>
    }
}
