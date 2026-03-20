import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import LoadingStatus from './LoadingStatus';
import ThemeInput from './ThemeInput';

const API_BASE_URL = "/api";






const StoryGenerator = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('');
    const [jobId, setJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        let pollInterval;
     
        if(jobId && jobStatus === "processing"){
         pollInterval = setInterval(() => {
             pollJobStatus(jobId);
         }, 5000);
        }
        return () => {
         if(pollInterval){
             clearInterval(pollInterval);
         }
        }
     }, [jobId, jobStatus]);

    const generateStory = async (theme) => {
        setLoading(true);
        setError(null);
        setTheme(theme);
        try{
            const response = await axios.post(`${API_BASE_URL}/stories/create`, {theme});
            const {job_id,status} = response.data;
            setJobId(job_id);
            setJobStatus(status);
            pollJobStatus(job_id);
        }
        catch(error){
            setLoading(false);
            console.error('Error generating story:', error);
            setError('An error occurred while generating the story' + error.message);
         
        }
    }







    const pollJobStatus = async (id) => {
        try{
            const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
            const {status, story_id ,error} = response.data;
            setJobStatus(status);
            if(status === "completed" && story_id){
                fetchStory(story_id);
            }else if(status === "failed" || error){
                setError('An error occurred while generating the story' + error);
                setLoading(false);
            }
        }catch(error){
            if(error.response && error.response.status !== 404){
                setError('An error occurred while fetching the job status' + error.message);
                setLoading(false);
            }
        }
    }


    const fetchStory = async (id) => {
        try{
            setLoading(true);
            setJobStatus("complete");
            navigate(`/story/${id}`);
        }catch(error){
            console.error('Error fetching story:', error);
            setError('An error occurred while fetching the story' + error.message);
            setLoading(false);
        }finally{
            setLoading(false);
        }
    }

    const reset = () => {
        setJobId(null);
        setJobStatus(null);
        setLoading(false);
        setError(null);
        setTheme('');
    }


    return (
        <div className="story-generator">
            
        {
            error && <div className="error-message"> 
            <p>{error} </p>
            <button onClick={reset} className="reset-btn"> Reset </button>            
            </div> 
        }
        {
            !jobId && !loading && !error && <ThemeInput onSubmit={generateStory} />
        }
        {
            loading && <LoadingStatus theme={"theme"} />
        }
        </div>
    )    
}

export default StoryGenerator;