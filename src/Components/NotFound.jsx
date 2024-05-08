const NotFound = () => {
    const style = {
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        fontSize: '2rem'
    };

    return (
        <div style={style}>
            <h1>404</h1>
            <p>Ohh! 🙁 Page Not Found</p>
        </div>
    );
};

export default NotFound;