import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateNoticeDatas, updateNoticeGenerateTime } from './Redux';

import NoticeList from './NoticeList';
import { isValidVariable, isValidObject } from 'utils/basic-verify';

/**
 * 过滤通告信息
 *
 * */

const filterNoticeDatas = (data) => {
    let noticeDatas = Object.values( data ); //转为数组
    // 屏蔽已经终止的通告
    noticeDatas = noticeDatas.filter((item) =>{

        if(isValidVariable(item.status) && "TERMINATED" == item.status){
            return false;
        }else {
            return true;
        }
    });
    // 排序

    // 按lastModifyTime降序排序

    noticeDatas.sort((d1,d2) =>{
        if(isValidObject(d1) && isValidObject(d2)){
            const d1Time = d1.lastModifyTime || '';
            const d2Time = d2.lastModifyTime || '';
            return (d1Time * 1 > d2Time *1) ? -1 : 1 ;
        }
    });

    return noticeDatas
}


const mapStateToProps = ( state ) => {
    const { noticeDataMap } = state.noticeDatas;
    // 通告数据生成时间
    const {time:noticeGenerateTime} = state.noticeGenerateTime;
    // 用户id
    const { userId } = state.loginUserInfo;
    return(
        {
            noticeDataMap , // 通告信息数据
            noticeViewMap: filterNoticeDatas(noticeDataMap),
            noticeGenerateTime, // 通告信息数据生成时间
            userId, // 用户id
        }
    )
};
const mapDispatchToProps = {
    updateNoticeDatas,
    updateNoticeGenerateTime
};

const NoticeListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NoticeList);

export default withRouter( NoticeListContainer );