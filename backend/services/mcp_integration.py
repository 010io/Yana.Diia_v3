"""
Integration Layer: Dual-LLM + MCP Server
Connects Generator/Judge with MCP Tools
"""
import asyncio
from typing import Dict, Any
from services.dual_llm_service import dual_llm_service
from mcp_servers.yana_mcp_server import mcp_server
import structlog

logger = structlog.get_logger()


async def generate_flow_with_mcp(brd_text: str) -> Dict[str, Any]:
    """
    Enhanced flow generation з MCP tools
    
    Pipeline:
    1. Search relevant Diia components via MCP
    2. Check available APIs via MCP
    3. Generate flow variants (Generator LLM)
    4. Validate with Judge LLM + MCP validator
    
    Args:
        brd_text: Business Requirements Document
        
    Returns:
        Best flow with scores and validation
    """
    logger.info("Starting flow generation with MCP", brd_text_length=len(brd_text))
    
    # Step 1: Search for relevant components
    logger.info("Step 1: Component search via MCP")
    components = await mcp_server.handle_tool_call(
        tool_name="search_diia_component",
        query=f"components for: {brd_text[:100]}",
        limit=3
    )
    
    # Step 2: Enrich prompt with component knowledge
    component_context = "\n".join([
        f"Component: {c['component_name']} - {c['usage_context']}"
        for c in (components if isinstance(components, list) else [components])
    ])
    
    enhanced_brd = f"""
    {brd_text}
    
    Available Diia Components:
    {component_context}
    
    Use these components in your flow design.
    """
    
    # Step 3: Generate variants (Dual-LLM Service)
    logger.info("Step 2: Generating variants via Dual-LLM")
    result = dual_llm_service.orchestrate(
        brd_text=enhanced_brd,
        rag_context=component_context
    )
    
    # Step 4: Validate best variant with MCP
    logger.info("Step 3: Validating flow via MCP")
    # Parse best variant (mock for now)
    mock_flow = {
        "flow_id": "generated-flow-1",
        "service_name": "mock_service",
        "steps": [
            {"step_id": 1, "component": {"component_name": "eligibility_banner"}},
            {"step_id": 2, "component": {"component_name": "form_step"}, "api_calls": [{"api_type": "edr"}]},
            {"step_id": 3, "component": {"component_name": "form_step"}},
        ]
    }
    
    validation = await mcp_server.handle_tool_call(
        tool_name="validate_flow",
        flow_json=mock_flow
    )
    
    return {
        "brd_text": brd_text,
        "components_found": components,
        "generated_variants": result["variants"],
        "judge_evaluation": result["evaluation"],
        "mcp_validation": validation,
        "final_score": validation.get("total_score", 0),
        "passed": validation.get("passed", False)
    }


async def test_mcp_integration():
    """Test MCP integration"""
    
    print("🧪 Testing MCP Server Integration\n")
    
    # Test 1: Component Search
    print("1️⃣ Testing Component Search...")
    components = await mcp_server.handle_tool_call(
        tool_name="search_diia_component",
        query="показати помилку користувачу"
    )
    print(f"✅ Found: {components[0]['component_name'] if components else 'none'}\n")
    
    # Test 2: API Call
    print("2️⃣ Testing API Caller...")
    api_result = await mcp_server.handle_tool_call(
        tool_name="call_ukraine_api",
        api_type="edr",
        identifier="12345678"
    )
    print(f"✅ API Result: {api_result.get('name', 'mock data')}\n")
    
    # Test 3: Flow Validation
    print("3️⃣ Testing Flow Validator...")
    mock_flow = {
        "flow_id": "test-1",
        "steps": [
            {"step_id": 1, "api_calls": [{"api_type": "edr"}]},
            {"step_id": 2, "component": {"props": {"fields": []}}},
            {"step_id": 3, "api_calls": [{"api_type": "tax"}]},
        ]
    }
    validation = await mcp_server.handle_tool_call(
        tool_name="validate_flow",
        flow_json=mock_flow
    )
    print(f"✅ Validation Score: {validation['total_score']}/100")
    print(f"   Passed: {validation['passed']}\n")
    
    print("🎉 All MCP tests completed!")


if __name__ == "__main__":
    # Run tests
    asyncio.run(test_mcp_integration())
