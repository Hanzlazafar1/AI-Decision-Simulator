"""FastAPI application entry point."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import DecisionRequest, DecisionResponse
from app.graph import analyze_decision

app = FastAPI(
    title="AI Decision Simulator",
    description="Simulate life and business decisions with AI-powered analysis",
    version="1.0.0",
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "ai-decision-simulator"}


@app.post("/api/analyze", response_model=DecisionResponse)
async def analyze(request: DecisionRequest):
    """Analyze a decision using the LangGraph pipeline."""
    try:
        result = await analyze_decision(
            question=request.question,
            context=request.context,
            priorities=request.priorities,
        )
        return DecisionResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}. Ensure your API key is valid.",
        )


@app.get("/api/examples")
async def get_examples():
    """Return example decision questions for the UI."""
    return {
        "examples": [
            {
                "question": "Should I learn React or AI/Machine Learning?",
                "context": "I'm a junior developer with 1 year of experience in Python",
                "priorities": ["career growth", "salary", "job market demand"],
                "category": "career",
                "icon": "💻",
            },
            {
                "question": "Should I invest in cryptocurrency or start freelancing?",
                "context": "I have $5000 in savings and work a full-time job",
                "priorities": ["financial security", "passive income", "risk management"],
                "category": "finance",
                "icon": "💰",
            },
            {
                "question": "Should I pursue a Master's degree or gain work experience?",
                "context": "I just graduated with a CS degree and have a job offer",
                "priorities": ["long-term career", "learning", "networking"],
                "category": "education",
                "icon": "🎓",
            },
            {
                "question": "Should I build a SaaS product or join a startup as a co-founder?",
                "context": "I have a product idea and a friend offered me a CTO role",
                "priorities": ["equity", "control", "speed to market"],
                "category": "business",
                "icon": "🚀",
            },
            {
                "question": "Should I relocate to a tech hub or work remotely?",
                "context": "I live in a small city with low cost of living",
                "priorities": ["quality of life", "career opportunities", "cost of living"],
                "category": "lifestyle",
                "icon": "🌍",
            },
            {
                "question": "Should I switch to a management role or stay technical?",
                "context": "I'm a senior engineer with 8 years of experience",
                "priorities": ["income growth", "job satisfaction", "impact"],
                "category": "career",
                "icon": "📊",
            },
        ]
    }
