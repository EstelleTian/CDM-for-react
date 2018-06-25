import React from 'react'
import {Checkbox, Col} from 'antd'
import './checkboxItem.less'

const checkboxItem = ({obj, active, onChoose, span=8}) => {
    const description = obj.description;
    const id = obj.id;
    const clickCheckbox = (e) => {
        onChoose(id)
    }
    return (
        <Col
            key={id}
            span={span}
        >
            <Checkbox value={id} className="auth-checkbox" checked={active} onChange={clickCheckbox} style={{fontSize: '14px'}}>
                <span title={description}>{description}</span>
            </Checkbox>
        </Col>
    )
}


export default checkboxItem