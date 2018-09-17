import $ from 'jquery';
import {isValidVariable} from "utils/basic-verify";
//重置冻结表样式
const resetFrozenTableStyle = () => {
    const $fixedLeft = $(".ant-table-fixed-left");
    const $fixedRight = $(".ant-table-fixed-right");

    const handleOverflow = ( $dom ) => {
        if( $dom.length > 0 ){
            $dom.addClass('overflow');
            const $scroll = $(".ant-table-scroll");

            const antScroll = $scroll.height() || 0;
            const antBody = $(".ant-table-body", $scroll).height() || 0;
            const antHead = $(".ant-table-header", $scroll).height() || 0;
            if( antBody + antHead + 5 < antScroll ){
                $dom.removeClass('overflow');
            }
        }
    }
    handleOverflow( $fixedLeft );
    handleOverflow( $fixedRight );
};
//表格数据排序
const sortDataMap = function( dataMap ){
    //默认排序队列
    const sortArr = ["ATOT", "CTOT", "TOBT", "EOBT", "SOBT", "ID"];
    let tableDatas = Object.values( dataMap ); //转为数组
    //排序
    tableDatas = tableDatas.sort((d1, d2) => {
        for (let index in sortArr) {
            let sortColumnName = sortArr[index];
            let data1 = d1[sortColumnName] + "";
            let data2 = d2[sortColumnName] + "";
            if (isValidVariable(data1) && isValidVariable(data2)) {
                let res = data1.localeCompare(data2);
                if (0 != res) {
                    return res;
                }
            } else if (isValidVariable(data1)) {
                return -1;
            } else if (isValidVariable(data2)) {
                return 1;
            } else {
                continue;
            }
        }
    });
    return tableDatas;
};

export { resetFrozenTableStyle, sortDataMap };