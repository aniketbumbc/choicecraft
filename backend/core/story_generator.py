from sqlalchemy.orm import Session
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from core.prompts import STORY_PROMPT
from models.story import Story, StoryNode
from core.models import StoryLLM, StoryNodeLLM
import dotenv

dotenv.load_dotenv()



class StoryGenerator:
    @classmethod
    def _get_llm(cls):
        return ChatOpenAI(model="gpt-4o-mini", temperature=0.0)

    @classmethod
    def generate_story(cls, session_id: str, db: Session, theme: str = "fantasy"):
        llm = cls._get_llm()
        story_parser = PydanticOutputParser(pydantic_object=StoryLLM)
        story_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", STORY_PROMPT + "\n{format_instructions}"),
                ("human", "Generate a story with the following theme: {theme}"),
            ]
        ).partial(format_instructions=story_parser.get_format_instructions())

        chain = story_prompt | llm
        raw_response = chain.invoke({"theme": theme})
        response_text = raw_response.content if hasattr(raw_response, "content") else raw_response
        story_structure = story_parser.parse(response_text)

        story_db = Story(title=story_structure.title, session_id=session_id)
        db.add(story_db)
        db.flush()

        cls._process_story_node(db, story_db.id, story_structure.rootNode, is_root=True)

        db.commit()
        return story_db

    @classmethod
    def _process_story_node(
        cls,
        db: Session,
        story_id: int,
        node_data: StoryNodeLLM,
        is_root: bool = False,
    ) -> StoryNode:
        node = StoryNode(
            story_id=story_id,
            content=node_data.content,
            is_ending=node_data.isEnding,
            is_winning_ending=node_data.isWinningEnding,
            is_root=is_root,
            options=[],
        )
        db.add(node)
        db.flush()

        if not node_data.isEnding and node_data.options:
            options_list = []
            for option_data in node_data.options:
                next_node_data = option_data.nextNode
                if isinstance(next_node_data, dict):
                    next_node_data = StoryNodeLLM.model_validate(next_node_data)

                child_node = cls._process_story_node(
                    db, story_id, next_node_data, is_root=False
                )
                options_list.append({"text": option_data.text, "node_id": child_node.id})

            node.options = options_list

        db.flush()
        return node