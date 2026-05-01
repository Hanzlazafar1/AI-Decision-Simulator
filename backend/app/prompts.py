"""Prompt templates for the LangGraph decision analysis pipeline."""

EXTRACT_OPTIONS_PROMPT = """You are an expert decision analyst. Given a user's decision question and optional context, extract the distinct options being considered.

DECISION QUESTION: {question}
CONTEXT: {context}
USER PRIORITIES: {priorities}

Extract all options mentioned or implied. If the question is "Should I do X or Y?", extract both X and Y.
If only one option is mentioned, infer the alternative (e.g., "Should I learn React?" implies "Learn React" vs "Don't learn React / Learn something else").

Respond in this exact JSON format:
{{
    "options": ["Option A", "Option B", ...],
    "rephrased_question": "A clearer version of the decision question"
}}
"""

ANALYZE_OPTION_PROMPT = """You are a world-class strategic advisor with expertise in career planning, business strategy, technology trends, and life decisions.

DECISION QUESTION: {question}
CONTEXT: {context}
USER PRIORITIES: {priorities}

Analyze this specific option in depth:
OPTION: {option}

Provide a thorough analysis considering:
1. Short-term and long-term benefits
2. Potential risks and downsides
3. Required time investment and learning curve
4. Market demand and future outlook
5. Financial implications
6. Impact on the user's stated priorities

Respond in this exact JSON format:
{{
    "name": "{option}",
    "score": <0-100 overall score>,
    "pros": ["pro1", "pro2", "pro3", "pro4"],
    "cons": ["con1", "con2", "con3"],
    "risk_level": "<low|medium|high>",
    "timeline": "Expected timeline to see results (e.g., '3-6 months')",
    "expected_outcome": "What the user can realistically expect if they choose this option"
}}
"""

GENERATE_ALTERNATIVES_PROMPT = """You are a creative strategic advisor who thinks beyond conventional options.

DECISION QUESTION: {question}
CONTEXT: {context}
USER PRIORITIES: {priorities}
OPTIONS ALREADY ANALYZED: {options}

Think creatively about alternative approaches the user may not have considered. These could be:
- Hybrid approaches combining multiple options
- Completely different paths that address the same underlying goals
- Unconventional or emerging opportunities

Generate 2-3 creative alternative scenarios.

Respond in this exact JSON format:
{{
    "alternatives": [
        {{
            "title": "Alternative name",
            "description": "Detailed description of this alternative",
            "feasibility": "<high|medium|low>",
            "potential_impact": "What impact this could have"
        }}
    ]
}}
"""

SYNTHESIZE_DECISION_PROMPT = """You are a master decision strategist. Based on the following complete analysis, provide a final synthesis and recommendation.

DECISION QUESTION: {question}
CONTEXT: {context}
USER PRIORITIES: {priorities}

OPTION ANALYSES:
{option_analyses}

ALTERNATIVE SCENARIOS:
{alternatives}

Synthesize all this information and provide your final recommendation.

Respond in this exact JSON format:
{{
    "best_choice": "The recommended option name",
    "best_choice_reasoning": "2-3 sentence explanation of why this is the best choice",
    "confidence": <0-100 confidence in this recommendation>,
    "overall_risk": "<low|medium|high>",
    "key_factors": ["factor1", "factor2", "factor3", "factor4", "factor5"],
    "recommendation_summary": "A compelling 3-4 sentence summary paragraph of the complete recommendation",
    "decision_framework": "A brief description of the decision-making framework used (e.g., 'Weighted scoring with risk-adjusted analysis based on market trends and personal priorities')"
}}
"""
