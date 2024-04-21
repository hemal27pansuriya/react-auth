import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const AlertMessage = ({ message, duration = 2000 }) => {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)
        }, duration)

        return () => clearTimeout(timer)
    }, [message, duration])
    useEffect(() => {
        if (message) {
            setVisible(true)
        }
    }, [message])
    if (!visible) return null
    return (
        <div
            className={`fixed top-0 right-0 m-4 p-4 rounded-lg shadow-md transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'
                }`}
            style={{ backgroundColor: 'green' }}
        >
            {message}
        </div>
    );
}

AlertMessage.propTypes = {
    message: PropTypes.string.isRequired,
    duration: PropTypes.number
}

export default AlertMessage