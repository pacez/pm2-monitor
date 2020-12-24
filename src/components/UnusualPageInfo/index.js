import React, { PureComponent } from 'react';
import { Modal, Input, Button, message } from 'antd';
import Loading from '../Loading';
import Request from '../../util/request';
import './style.scss';

export default class extends PureComponent {

    state ={
        visible: false,
        loading: false,
        data: ''
    }

    fetchData = (silence = false) => {
        this.setState({
            loading: !silence
        }, () => {
            Request.get(`/getUnusualPageInfo`).then(data => {
                this.setState({
                    data:JSON.stringify(data,null,4)
                })
            }).finally(() => {
                this.setState({
                    loading: false
                });
            })
        });
    }

    onChange = (e) => {
        this.setState({
            data: e.target.value
        });
    }

    onClose = () => {
        this.setState({
            visible: false,
        })
    }

    onOpen = () => {
        this.setState({
            visible: true
        },() => {
            this.fetchData()
        })
    }


    onOK = () => {
        let { data } = this.state;

        if (!data || data.trim === '') {
            message.error('请输入内容');
            return 
        }

        let saveData = null;
        try {
            saveData = JSON.parse(data);
        }catch(e) {
            console.log(e);
            message.error('数据格式错误');
        }


        if (saveData) {
            console.log(saveData)
            Request.post(`/updateUnusualPageInfo`,{
                data: saveData
            }).then(data => {
                message.success('保存成功');
                this.onClose();
            }).finally(() => {
                this.setState({
                    loading: false
                });
            })
        }

    }

    render() {
        const { loading, data, visible } = this.state;
        return <>
            <Button onClick={this.onOpen} type="primary" >Page Settings</Button>
            <Modal
                title = 'Page settings'
                width="80%"
                visible={visible}
                onOk = {this.onOK}
                onCancel={this.onClose}
            >
                {
                    loading && <Loading />
                }
                <Input.TextArea style={{height: 300}} value={data} onChange = {this.onChange}/>
            </Modal>
        </>
    }
}
