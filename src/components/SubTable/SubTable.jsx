//航班起飞排序---菜单操作功能
import React from 'react';
import { Row, Table } from 'antd';
import DraggableModule from '../DraggableModule/DraggableModule';
import './SubTable.less';

class SubTable extends React.Component{
    constructor( props ){
        super(props);
        this.state = {
            expired: {
                show: false,
                x: 0,
                y:0
            },
            special: {
                show: false,
                x: 0,
                y:0
            },
            pool: {
                show: false,
                x: 0,
                y:0
            },
            alarm: {
                show: false,
                x: 0,
                y:0
            },
            todo: {
                show: false,
                x: 0,
                y:0
            },
        }

    }
    componentWillUnmount(){
        console.log('componentWillUnmount')
    }


    render(){
        const { titleName, tableDatas, tableColumnsObj, scrollX, x, y} = this.props;
        const { width } = tableColumnsObj;
        return (
            <DraggableModule
                x = {x}
                y = {y}
            >
            <div className="box no-cursor">
                <div className="sub-table expired-table">
                    <Row className="title drag-target">
                        <span className="cursor">{ titleName }</span>
                    </Row>
                    <Row className="content">
                        <Table
                            columns={ tableColumnsObj.column }
                            dataSource={ tableDatas }
                            rowKey="ID"
                            size="small"
                            scroll={{
                                x: scrollX,
                                y: width
                            }}
                            bordered
                            pagination = { false }
                            onRow = {(record, index) =>{
                                const id = record["ID"] || "";
                                return {
                                    flightid: id,
                                    rowid: index*1+1
                                }
                            }}
                        />
                    </Row>
                </div>
            </div>
            </DraggableModule>
        )
    }
};

export default SubTable;