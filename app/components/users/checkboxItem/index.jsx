import React from 'react'
import {Checkbox, Col} from 'antd'

const checkboxItem = ({obj, active, onChoose}) => {
    const description = obj.description;
    const id = obj.id;

    const clickCheckbox = (e) => {
        onChoose(id)
    }
    return (
        <Col key={id} span={8} >
            <Checkbox value={id} checked={active} onChange={clickCheckbox}>
                <span title={description}>{description}</span>
            </Checkbox>
        </Col>
    )
}


export default checkboxItem