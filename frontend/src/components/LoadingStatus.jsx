const LoadingStatus = ({theme}) => {

    return (
        <div className='loading-container'>
            <h2> Generating your {theme} Story...</h2>
            <div className='loading-animation'>
                <div className="spinner"></div>
            </div>
            <p className="loading-info">This may take a few minutes we are working on it...</p>
        </div>
    )
}

export default LoadingStatus;