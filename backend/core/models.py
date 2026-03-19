from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class StoryOptionLLM(BaseModel):
    text:str = Field(description="The text of the option to show to the user")
    nextNode:Dict[str, Any] = Field(description="The next node content and  this option is")

class StoryNodeLLM(BaseModel):
    content: str = Field(description="The content of the node")
    isEnding: bool = Field(description="Whether the node is an ending node")
    isWinningEnding: bool = Field(description="Whether the node is a winning ending node")
    options: Optional[List[StoryOptionLLM]] = Field(default=None, description="The options available from this node")

class StoryLLM(BaseModel):
    title: str = Field(description="The title of the story")
    rootNode: StoryNodeLLM = Field(description="The root node of the story")