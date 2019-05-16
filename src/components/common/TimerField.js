import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import MaskTextField from 'components/common/MaskTextField';
import Spacer from 'components/common/Spacer';
import { TimerPropType } from 'proptypes/TimerPropTypes';

class TimerField extends React.Component {
    constructor(props) {
        super(props);

        this.maskTextFieldRef = React.createRef();

        this.focus = this.focus.bind(this);
        this.formatTime = this.formatTime.bind(this);
        this.parseTime = this.parseTime.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    focus() {
        this.maskTextFieldRef.current.focus();
    }

    formatTime(value) {
        const minutes = Math.floor(value / 60).toString().padStart(2, '0');
        const seconds = (value % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    parseTime(value) {
        const tokens = value.split(':');
        return (Number(tokens[0]) * 60) + Number(tokens[1]);
    }

    onClick() {
        const { timer } = this.props;
        const value = timer ? timer.value : 0;
        const startDate = timer ? timer.startDate : null;
        const newTimer = {};

        if (startDate) {
            newTimer.value = value + moment().diff(moment(startDate), 'seconds');
            newTimer.startDate = null;
        } else {
            newTimer.value = value;
            newTimer.startDate = moment().toJSON();
        }

        if (this.props.onChange) {
            this.props.onChange(newTimer);
        }
    }

    onChange(value) {
        if (!value.match(/^[0-9]{2}:[0-9]{2}$/)) {
            return;
        }

        const timer = {
            value: this.parseTime(value),
            startDate: this.props.timer && this.props.timer.startDate ? moment().toJSON() : null
        };

        if (this.props.onChange) {
            this.props.onChange(timer);
        }
    }

    render() {
        const timer = this.props.timer || {
            value: 0,
            startDate: null
        };

        const restProps = { ...this.props };
        delete restProps.timer;
        delete restProps.onStartStop;
        delete restProps.onChange;
        delete restProps.readOnly;

        const { readOnly } = this.props;

        return (
            <React.Fragment>
                <Icon
                    icon={timer.startDate ? 'pause' : 'play'}
                    style={{ cursor: 'pointer' }}
                    onIconClick={this.onClick}
                    text={readOnly ? this.formatTime(timer.value) : null} />
                {!readOnly && (
                    <React.Fragment>
                        <Spacer />
                        <MaskTextField
                            ref={this.maskTextFieldRef}
                            mask="11:11"
                            value={this.formatTime(timer.value)}
                            onChange={e => this.onChange(e.target.value)}
                            style={{ width: 100 }}
                            {...restProps} />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

TimerField.propTypes = {
    timer: TimerPropType,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool
};

export default TimerField;