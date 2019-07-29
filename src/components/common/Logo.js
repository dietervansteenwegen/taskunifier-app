import React from 'react';
import PropTypes from 'prop-types';

function Logo(props) {
    return (
        <img
            alt="Logo"
            src="resources/images/logo_alt.png"
            style={{
                ...props.style,
                width: props.size,
                height: props.size
            }} />
    );
}

Logo.propTypes = {
    size: PropTypes.number,
    style: PropTypes.object
};

export default Logo;