import React from 'react'
import {Button} from 'antd'

const aBtn = ({ type, text, onClick, isLoading}) => (
    <Button type={type} onClick={onClick} loading={isLoading} >{text}</Button>
)
export default aBtn