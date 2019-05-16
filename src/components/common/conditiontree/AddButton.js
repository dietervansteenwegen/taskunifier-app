import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, Popover } from 'antd';

function AddButton(props) {
    const [menuVisible, setMenuVisible] = useState(false);

    const onMenuClick = event => {
        onMenuVisibleChange(false);
        props.onClick(event.key);
    };

    const onMenuVisibleChange = visible => {
        setMenuVisible(visible);
    };

    return (
        <Popover
            content={(
                <Menu onClick={onMenuClick} style={{ width: 240 }} mode="vertical" theme="light">
                    <Menu.SubMenu key="conditionGroup" title='Condition Group'>
                        <Menu.Item key="conditionGroupAnd">AND</Menu.Item>
                        <Menu.Item key="conditionGroupOr">OR</Menu.Item>
                        <Menu.Item key="conditionGroupNot">NOT</Menu.Item>
                    </Menu.SubMenu>
                    {props.children}
                </Menu>
            )}
            title="Add Condition"
            trigger="click"
            visible={menuVisible}
            onVisibleChange={onMenuVisibleChange}>
            <Button
                shape="circle"
                icon="plus"
                size="small" />
        </Popover>
    );
}

AddButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
};

export default AddButton;