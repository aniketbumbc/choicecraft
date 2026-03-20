import { useState, useEffect } from 'react';


const StoryGame = ({story,onNewStory}) => {
const [currentNodeId, setCurrentNodeId] = useState(null);
const[currentNode, setCurrentNode] = useState(null);
const[options, setOptions] = useState([]);
const [isEnding, setIsEnding] = useState(false);
const[isWinningEnding, setIsWinningEnding] = useState(false);

useEffect(()=>{
    if(story && story.root_node){
        const rootNodeId = story.root_node.id;
        setCurrentNodeId(rootNodeId);
        setCurrentNode(story.root_node);
    }
},[story]);

useEffect(()=> {
    if(currentNodeId && story && story.all_nodes){
        const node = story.all_nodes[currentNodeId];
        setCurrentNode(node);
        setIsEnding(node.is_ending);
        setIsWinningEnding(node.is_winning_ending);

        if(!node.is_ending && node.options && node.options.length > 0){
            setOptions(node.options);
        } else {
            setOptions([]);
        }
    }
},[currentNodeId,story]);


const chooseOption = (optionId) => {
    setCurrentNodeId(optionId);
}


const restartStory = () => {
if(story && story.root_node){
    setCurrentNodeId(story.root_node.id);
}
};


return(
    <div className="story-game">
        <header className="story-header">
            <h2> {story.title}</h2>
        </header>


        <div className="story-content">
            {
                currentNode && (
                    <div className="story-node">
                        <p> {currentNode.content} </p>

                        {
                            isEnding ? <div className="story-ending"> 
                            <h3>{isWinningEnding ? "Congratulations! You won the story." : "Game Over"}</h3>
                            {isWinningEnding ? <p>You have successfully completed the story.</p> : <p>You have failed to adventure end the story.</p>}
                            
                            </div> : 
                            <div className="story-options"> 
                            <h3> Choose Your Adventure What Happens Next? </h3>
                            <div className="options-list">
                                {options.map((option,index) =>{
                                    return <button key={index} className="option-btn" onClick={() => chooseOption(option.node_id)}> {option.text} </button>
                                })}
                            </div>
                            </div>
                        }
                    </div>
                )
            }
            <div className="story-controls">
                <button className="restart-btn" onClick={restartStory}> Restart Story </button>
              {
                onNewStory && <button className="new-story-btn" onClick={onNewStory}> Create New Story </button>
              }
            </div>
        </div>
    </div>)
}

export default StoryGame;