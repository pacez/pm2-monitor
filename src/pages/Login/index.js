import React, { useState} from 'react';
import { Form, Input, Layout, Button } from 'antd';
import Loading from '../../components/Loading';
import Request from '../../util/request';
import './style.scss';
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
};



const Login = () => {

    const [username, setUsername] = useState('');
    const [passwd, setPasswd] = useState('');

    const login = () => {
        
        Request.post('/loginCheck', {
            username,
            passwd,
        }).then(data=>{
            window.location.href='/'
        });
    };

    return (
        <div className="login">
            {/* <Loading /> */}
            <Layout.Header>
                <h1>Welcome To E-learning FE Services</h1>
            </Layout.Header>
            <div className="form">
                <Form>
                    <FormItem {...formItemLayout} label={"Username"}>
                        <Input 
                            placeholder="Username" 
                            onChange = {(e)=>{
                                setUsername(e.target.value)
                            }} 
                            value={username}  
                        />
                    </FormItem>
                    <FormItem {...formItemLayout} label={"Password"}>
                        <Input 
                            placeholder="Password" 
                            type="password"
                            onChange={(e) => {
                                setPasswd(e.target.value)
                            }}
                            value={passwd}  
                        />
                    </FormItem>
                </Form>
                {/* <button onClick={login} type="button" class="ant-btn SignIn ant-btn-primary"><span>Sign In</span></button>
             */}
                <Button onClick={login}>Sign In</Button>
            </div>
        </div>
    ) 
}
export default Login