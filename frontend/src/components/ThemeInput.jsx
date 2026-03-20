import { useState } from 'react';

const ThemeInput = ({onSubmit}) => {
    const [theme, setTheme] = useState('');
    const [error, setError] = useState(null);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!theme.trim() === '') {
            setError('Please enter a theme');
            return;
        }
        onSubmit(theme);
    }

    return (
        <div className='theme-input-container'>
            <h2>Enter a theme for your story:</h2>
            <p>This will be used to generate a story for you.</p>
            <form onSubmit={handleSubmit} className='theme-input-form'>
                <div className='input-group'>
                    <input type='text' id='theme' value={theme} onChange={(e) => setTheme(e.target.value)} placeholder='e.g. Adventure, Fantasy, Mystery' required  className={error ? 'error' : ''} />
                    {error && <p className='error-text'>{error}</p>}
                </div>
                <button type='submit' className='generate-btn'>Generate Story</button>
            </form>
        </div>
    )
}

export default ThemeInput;