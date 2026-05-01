"""LangGraph-based decision analysis engine with multi-step reasoning."""

import json
import operator
from typing import Annotated, TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END

from app.config import settings
from app.prompts import (
    EXTRACT_OPTIONS_PROMPT,
    ANALYZE_OPTION_PROMPT,
    GENERATE_ALTERNATIVES_PROMPT,
    SYNTHESIZE_DECISION_PROMPT,
)


def get_llm():
    """Initialize the LLM based on configuration."""
    if settings.LLM_PROVIDER == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=settings.active_model,
            api_key=settings.active_api_key,
            temperature=0.7,
        )
    else:
        from langchain_groq import ChatGroq
        return ChatGroq(
            model=settings.active_model,
            api_key=settings.active_api_key,
            temperature=0.7,
        )


# ── State definition ──────────────────────────────────────────────

class DecisionState(TypedDict):
    """State that flows through the decision analysis graph."""

    question: str
    context: str
    priorities: str
    options: list[str]
    option_analyses: Annotated[list[dict], operator.add]
    alternatives: list[dict]
    synthesis: dict
    error: str


# ── Node functions ─────────────────────────────────────────────────

def extract_options(state: DecisionState) -> dict:
    """Step 1: Extract decision options from the question."""
    llm = get_llm()
    try:
        prompt = EXTRACT_OPTIONS_PROMPT.format(
            question=state["question"],
            context=state.get("context", "None provided"),
            priorities=state.get("priorities", "None specified"),
        )
        response = llm.invoke([
            SystemMessage(content="You are a decision analysis expert. Always respond with valid JSON only, no markdown."),
            HumanMessage(content=prompt),
        ])
        content = response.content.strip()
        # Clean markdown code fences if present
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

        result = json.loads(content)
        return {"options": result.get("options", [])}
    except Exception as e:
        return {"error": f"Failed to extract options: {str(e)}"}


def analyze_option(state: DecisionState) -> dict:
    """Step 2: Analyze each option individually."""
    llm = get_llm()
    analyses = []

    for option in state.get("options", []):
        try:
            prompt = ANALYZE_OPTION_PROMPT.format(
                question=state["question"],
                context=state.get("context", "None provided"),
                priorities=state.get("priorities", "None specified"),
                option=option,
            )
            response = llm.invoke([
                SystemMessage(content="You are a strategic advisor. Always respond with valid JSON only, no markdown."),
                HumanMessage(content=prompt),
            ])
            content = response.content.strip()
            if content.startswith("```"):
                content = content.split("\n", 1)[1] if "\n" in content else content[3:]
                if content.endswith("```"):
                    content = content[:-3]
                content = content.strip()

            analysis = json.loads(content)
            analyses.append(analysis)
        except Exception as e:
            analyses.append({
                "name": option,
                "score": 50,
                "pros": ["Analysis unavailable"],
                "cons": ["Analysis unavailable"],
                "risk_level": "medium",
                "timeline": "Unknown",
                "expected_outcome": f"Error analyzing: {str(e)}",
            })

    return {"option_analyses": analyses}


def generate_alternatives(state: DecisionState) -> dict:
    """Step 3: Generate creative alternative scenarios."""
    llm = get_llm()
    try:
        options_str = ", ".join(state.get("options", []))
        prompt = GENERATE_ALTERNATIVES_PROMPT.format(
            question=state["question"],
            context=state.get("context", "None provided"),
            priorities=state.get("priorities", "None specified"),
            options=options_str,
        )
        response = llm.invoke([
            SystemMessage(content="You are a creative strategic advisor. Always respond with valid JSON only, no markdown."),
            HumanMessage(content=prompt),
        ])
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

        result = json.loads(content)
        return {"alternatives": result.get("alternatives", [])}
    except Exception as e:
        return {"alternatives": []}


def synthesize_decision(state: DecisionState) -> dict:
    """Step 4: Final synthesis and recommendation."""
    llm = get_llm()
    try:
        option_analyses_str = json.dumps(state.get("option_analyses", []), indent=2)
        alternatives_str = json.dumps(state.get("alternatives", []), indent=2)

        prompt = SYNTHESIZE_DECISION_PROMPT.format(
            question=state["question"],
            context=state.get("context", "None provided"),
            priorities=state.get("priorities", "None specified"),
            option_analyses=option_analyses_str,
            alternatives=alternatives_str,
        )
        response = llm.invoke([
            SystemMessage(content="You are a master decision strategist. Always respond with valid JSON only, no markdown."),
            HumanMessage(content=prompt),
        ])
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

        synthesis = json.loads(content)
        return {"synthesis": synthesis}
    except Exception as e:
        return {
            "synthesis": {
                "best_choice": state.get("options", ["Unknown"])[0],
                "best_choice_reasoning": f"Synthesis failed: {str(e)}",
                "confidence": 50,
                "overall_risk": "medium",
                "key_factors": ["Analysis incomplete"],
                "recommendation_summary": "Unable to fully synthesize. Please try again.",
                "decision_framework": "Error in analysis",
            }
        }


def should_continue(state: DecisionState) -> str:
    """Check if we should continue or stop due to an error."""
    if state.get("error"):
        return "error"
    return "continue"


# ── Build the graph ────────────────────────────────────────────────

def build_decision_graph():
    """Build and compile the LangGraph decision analysis workflow."""
    workflow = StateGraph(DecisionState)

    # Add nodes
    workflow.add_node("extract_options", extract_options)
    workflow.add_node("analyze_options", analyze_option)
    workflow.add_node("generate_alternatives", generate_alternatives)
    workflow.add_node("synthesize", synthesize_decision)

    # Define the flow
    workflow.set_entry_point("extract_options")

    workflow.add_conditional_edges(
        "extract_options",
        should_continue,
        {
            "continue": "analyze_options",
            "error": END,
        },
    )

    workflow.add_edge("analyze_options", "generate_alternatives")
    workflow.add_edge("generate_alternatives", "synthesize")
    workflow.add_edge("synthesize", END)

    return workflow.compile()


# Compile the graph once at module level
decision_graph = build_decision_graph()


async def analyze_decision(question: str, context: str | None = None, priorities: list[str] | None = None) -> dict:
    """Run the full decision analysis pipeline."""
    initial_state = {
        "question": question,
        "context": context or "None provided",
        "priorities": ", ".join(priorities) if priorities else "None specified",
        "options": [],
        "option_analyses": [],
        "alternatives": [],
        "synthesis": {},
        "error": "",
    }

    # Run the graph
    final_state = await decision_graph.ainvoke(initial_state)

    if final_state.get("error"):
        raise ValueError(final_state["error"])

    # Assemble the response
    synthesis = final_state.get("synthesis", {})
    return {
        "question": question,
        "best_choice": synthesis.get("best_choice", ""),
        "best_choice_reasoning": synthesis.get("best_choice_reasoning", ""),
        "confidence": synthesis.get("confidence", 50),
        "overall_risk": synthesis.get("overall_risk", "medium"),
        "options": final_state.get("option_analyses", []),
        "alternatives": final_state.get("alternatives", []),
        "key_factors": synthesis.get("key_factors", []),
        "recommendation_summary": synthesis.get("recommendation_summary", ""),
        "decision_framework": synthesis.get("decision_framework", ""),
    }
