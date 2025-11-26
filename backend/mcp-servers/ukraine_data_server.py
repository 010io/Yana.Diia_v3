"""
Ukraine Data MCP Server
Інтеграція з Opendatabot, data.gov.ua, NAIS, Stat.gov.ua
"""
import os
import httpx
from typing import Optional, Dict, List, Any
from mcp.server import Server
from mcp.types import Tool, TextContent

# Initialize MCP Server
server = Server("ukraine-data-service")

# HTTP Client
client = httpx.AsyncClient(timeout=30.0)


@server.list_tools()
async def list_tools() -> List[Tool]:
    """List all available tools"""
    return [
        Tool(
            name="search_company",
            description="Пошук компанії через Opendatabot за ЄДРПОУ або назвою",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "Код ЄДРПОУ компанії"
                    },
                    "name": {
                        "type": "string",
                        "description": "Назва компанії для пошуку"
                    }
                }
            }
        ),
        Tool(
            name="get_gov_dataset",
            description="Отримання набору даних з data.gov.ua",
            inputSchema={
                "type": "object",
                "properties": {
                    "dataset_id": {
                        "type": "string",
                        "description": "ID набору даних"
                    },
                    "query": {
                        "type": "string",
                        "description": "Пошуковий запит"
                    }
                }
            }
        ),
        Tool(
            name="verify_person_kyc",
            description="KYC перевірка особи через NAIS",
            inputSchema={
                "type": "object",
                "properties": {
                    "full_name": {
                        "type": "string",
                        "description": "ПІБ особи"
                    },
                    "rnokpp": {
                        "type": "string",
                        "description": "РНОКПП (ІПН)"
                    }
                },
                "required": ["full_name", "rnokpp"]
            }
        ),
        Tool(
            name="get_statistics",
            description="Отримання статистики з stat.gov.ua",
            inputSchema={
                "type": "object",
                "properties": {
                    "indicator": {
                        "type": "string",
                        "description": "Тип показника (DEMOGRAPHIC, ECONOMY, etc.)"
                    },
                    "region": {
                        "type": "string",
                        "description": "Регіон (опціонально)"
                    },
                    "from_date": {
                        "type": "string",
                        "description": "Дата початку (YYYY-MM-DD)"
                    },
                    "to_date": {
                        "type": "string",
                        "description": "Дата кінця (YYYY-MM-DD)"
                    }
                },
                "required": ["indicator"]
            }
        ),
        Tool(
            name="search_diia_services",
            description="Пошук послуг на diia.data.gov.ua",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Пошуковий запит"
                    },
                    "category": {
                        "type": "string",
                        "description": "Категорія послуги"
                    }
                }
            }
        )
    ]


@server.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
    """Handle tool calls"""
    
    if name == "search_company":
        return await search_company(**arguments)
    elif name == "get_gov_dataset":
        return await get_gov_dataset(**arguments)
    elif name == "verify_person_kyc":
        return await verify_person_kyc(**arguments)
    elif name == "get_statistics":
        return await get_statistics(**arguments)
    elif name == "search_diia_services":
        return await search_diia_services(**arguments)
    else:
        raise ValueError(f"Unknown tool: {name}")


async def search_company(
    code: Optional[str] = None,
    name: Optional[str] = None
) -> List[TextContent]:
    """Пошук компанії через Opendatabot"""
    api_key = os.getenv("OPENDATABOT_API_KEY")
    
    if not api_key:
        return [TextContent(
            type="text",
            text="❌ OPENDATABOT_API_KEY not set. Using mock data."
        )]
    
    try:
        if code:
            # Пошук за кодом ЄДРПОУ
            response = await client.get(
                f"https://api.opendatabot.ua/api/v2/company/{code}",
                params={"apiKey": api_key}
            )
        elif name:
            # Пошук за назвою
            response = await client.get(
                "https://api.opendatabot.ua/api/company/search",
                params={"query": name, "limit": 10},
                headers={"Authorization": f"Bearer {api_key}"}
            )
        else:
            return [TextContent(
                type="text",
                text="❌ Потрібен code або name"
            )]
        
        data = response.json()
        
        return [TextContent(
            type="text",
            text=f"✅ Знайдено компанію:\n{data}"
        )]
    
    except Exception as e:
        return [TextContent(
            type="text",
            text=f"❌ Помилка: {str(e)}"
        )]


async def get_gov_dataset(
    dataset_id: Optional[str] = None,
    query: Optional[str] = None
) -> List[TextContent]:
    """Отримання набору даних з data.gov.ua"""
    try:
        if dataset_id:
            # Деталі конкретного набору
            response = await client.get(
                f"https://data.gov.ua/api/3/action/package_show?id={dataset_id}"
            )
        elif query:
            # Пошук наборів
            response = await client.get(
                f"https://data.gov.ua/api/3/action/package_search?q={query}"
            )
        else:
            return [TextContent(
                type="text",
                text="❌ Потрібен dataset_id або query"
            )]
        
        data = response.json()
        
        if data.get("success"):
            return [TextContent(
                type="text",
                text=f"✅ Знайдено дані:\n{data['result']}"
            )]
        else:
            return [TextContent(
                type="text",
                text=f"❌ Помилка API: {data}"
            )]
    
    except Exception as e:
        return [TextContent(
            type="text",
            text=f"❌ Помилка: {str(e)}"
        )]


async def verify_person_kyc(
    full_name: str,
    rnokpp: str
) -> List[TextContent]:
    """KYC перевірка особи через NAIS"""
    api_key = os.getenv("NAIS_API_KEY")
    
    if not api_key:
        return [TextContent(
            type="text",
            text="❌ NAIS_API_KEY not set. Using mock data."
        )]
    
    try:
        response = await client.post(
            "https://api.nais.gov.ua/api/public/v1/person/verify",
            headers={"X-API-Key": api_key},
            json={"rnokpp": rnokpp, "fullName": full_name}
        )
        
        data = response.json()
        
        return [TextContent(
            type="text",
            text=f"✅ KYC перевірка:\n{data}"
        )]
    
    except Exception as e:
        return [TextContent(
            type="text",
            text=f"❌ Помилка: {str(e)}"
        )]


async def get_statistics(
    indicator: str,
    region: Optional[str] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None
) -> List[TextContent]:
    """Отримання статистики з stat.gov.ua"""
    try:
        params = {}
        if region:
            params["region"] = region
        if from_date:
            params["fromdate"] = from_date
        if to_date:
            params["todate"] = to_date
        
        response = await client.get(
            f"https://api.stat.gov.ua/api/v1/data/{indicator}",
            params=params
        )
        
        data = response.json()
        
        return [TextContent(
            type="text",
            text=f"✅ Статистика:\n{data}"
        )]
    
    except Exception as e:
        return [TextContent(
            type="text",
            text=f"❌ Помилка: {str(e)}"
        )]


async def search_diia_services(
    query: Optional[str] = None,
    category: Optional[str] = None
) -> List[TextContent]:
    """Пошук послуг на diia.data.gov.ua"""
    try:
        params = {}
        if query:
            params["q"] = query
        if category:
            params["category"] = category
        
        response = await client.get(
            "https://diia.data.gov.ua/api/services",
            params=params
        )
        
        data = response.json()
        
        return [TextContent(
            type="text",
            text=f"✅ Знайдено послуги:\n{data}"
        )]
    
    except Exception as e:
        return [TextContent(
            type="text",
            text=f"❌ Помилка: {str(e)}"
        )]


if __name__ == "__main__":
    # Run MCP server
    import asyncio
    from mcp.server.stdio import stdio_server
    
    async def main():
        async with stdio_server() as (read_stream, write_stream):
            await server.run(
                read_stream,
                write_stream,
                server.create_initialization_options()
            )
    
    asyncio.run(main())
