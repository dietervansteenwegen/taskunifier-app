import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form, InputNumber, Radio } from 'antd';
import { onCommitForm } from 'utils/FormUtils';
import { getDaysOfWeek } from 'utils/RepeatUtils';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';

function RepeatWeeklyForm(props) {
    const { getFieldDecorator } = props.form;

    const radioStyle = {
        display: 'block',
        height: '50px',
        lineHeight: '50px'
    };

    const onCommit = () => onCommitForm(props.form, props.repeat, props.updateRepeat, { force: true });

    return (
        <Form>
            {getFieldDecorator('type', {
                initialValue: props.repeat ? props.repeat.type : undefined
            })(
                <Radio.Group onChange={onCommit}>
                    <Radio style={radioStyle} value='everyXWeeks'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('nbWeeks', {
                            initialValue: props.repeat ? props.repeat.nbWeeks : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of weeks is required'
                                }
                            ]
                        })(
                            <InputNumber
                                onChange={onCommit}
                                min={1}
                                disabled={props.repeat.type !== 'everyXWeeks'} />
                        )}
                        <span style={{ marginLeft: 10 }}>week(s)</span>
                    </Radio>
                    <Radio style={radioStyle} value='everyXWeeksOnDaysY'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('nbWeeks', {
                            initialValue: props.repeat ? props.repeat.nbWeeks : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of weeks is required'
                                }
                            ]
                        })(
                            <InputNumber
                                onChange={onCommit}
                                min={1}
                                disabled={props.repeat.type !== 'everyXWeeksOnDaysY'} />
                        )}
                        <span style={{ marginLeft: 10 }}>week(s) on</span>
                        <div style={{ marginLeft: 40 }}>
                            {getFieldDecorator('daysOfWeek', {
                                initialValue: props.repeat ? props.repeat.daysOfWeek : undefined
                            })(
                                <Checkbox.Group
                                    onChange={onCommit}
                                    disabled={props.repeat.type !== 'everyXWeeksOnDaysY'}
                                    options={getDaysOfWeek()} />
                            )}
                        </div>
                    </Radio>
                </Radio.Group>
            )}
        </Form>
    );
}

RepeatWeeklyForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: RepeatPropType,
    updateRepeat: PropTypes.func.isRequired
};

export default Form.create({ name: 'repeat' })(RepeatWeeklyForm);