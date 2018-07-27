//航班表格上右键协调对话框
import React from 'react';
import { Drawer } from 'antd';
import './DetailModule.less';

class DetailModule extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        const { detailModalDatas, updateDetailModalDatasVisible, name } = this.props;
        const show = detailModalDatas[name].show || false;
        const orgData = detailModalDatas[name].orgData || {};

        return (
            <Drawer
                title={orgData["FLIGHTID"]}
                placement="bottom"
                closable={ false }
                visible={ show }
                onClose = {() =>{
                    updateDetailModalDatasVisible(name, false);
                }}
            >
                <p>{orgData["ID"]}</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        )
    }

};

export default DetailModule;