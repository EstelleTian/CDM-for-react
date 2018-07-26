import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateGenerateTime } from './Redux';
import TableHeader from './TableHeader';
// 格式化数据生成时间
const formatGenerateTime =(generateTime) => {
     const { time } = generateTime;
     if(time && 12 == time.length){
         const year = time.substring(0,4);
         const month = time.substring(4,6);
         const date = time.substring(6,8);
         const hour = time.substring(8,10);
         const minute = time.substring(10,12);
         const result = `${year}年${month}月${date}日 ${hour}:${minute} `
         return {
             ...generateTime,
             time :result,
         }
     }
}

const mapStateToProps = ( state ) => ({
    generateTime: formatGenerateTime(state.generateTime),
    subTableDatas: state.subTableDatas
});

const mapDispatchToProps = {
    updateGenerateTime,
};

const TableHeaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TableHeader);

export default withRouter( TableHeaderContainer );