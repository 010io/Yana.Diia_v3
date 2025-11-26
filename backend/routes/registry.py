"""
Mock Registry API Routes
Державні реєстри України (Mock Mode для Demo Day)
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from pydantic import BaseModel
import structlog

logger = structlog.get_logger()

router = APIRouter()

# ==================== Mock Data ====================

# ЄДР (Єдиний Державний Реєстр)
MOCK_EDR_DATA = {
    "12345678": {
        "edrpou": "12345678",
        "name": "ФОП Іваненко Іван Петрович",
        "type": "fop",
        "status": "active",
        "registration_date": "2020-01-15",
        "kved": [{"code": "62.01", "description": "Комп'ютерне програмування"}],
        "address": {"region": "Київська область", "city": "Київ", "street": "вул. Хрещатик, 1"}
    },
    "87654321": {
        "edrpou": "87654321",
        "name": "ТОВ 'Діджитал Солюшнс'",
        "type": "tov",
        "status": "active",
        "registration_date": "2018-03-20",
        "kved": [{"code": "62.01", "description": "Комп'ютерне програмування"}],
        "authorized_capital": 500000
    }
}

# Податкова
MOCK_TAX_DATA = {
    "1234567890": {
        "inn": "1234567890",
        "taxpayer_type": "fop",
        "registration_date": "2020-01-15",
        "tax_status": "active",
        "debts": {"has_debt": False, "total_amount": 0},
        "last_declaration": {"period": "2024-Q3", "submitted_at": "2024-10-15", "tax_paid": 15000},
        "privileges": {"simplified_tax": True, "group": 2, "rate": 5}
    }
}

# Транспорт
MOCK_VEHICLE_DATA = {
    "AA1234BB": {
        "license_plate": "AA1234BB",
        "vin": "WBADT43452G123456",
        "vehicle": {"brand": "BMW", "model": "X5", "year": 2019, "color": "Чорний"},
        "owner": {"inn": "1234567890", "name": "Шевченко Тарас Григорович"},
        "technical_inspection": {"valid_until": "2025-05-09"}
    }
}

# Diia Documents
MOCK_DIIA_DOCS = {
    "passport": {
        "1234567890": {
            "document_type": "passport",
            "data": {
                "series": "ЕН",
                "number": "123456",
                "issued_by": "Дніпровським РВ ГУ ДМС України",
                "issued_date": "2022-03-15",
                "valid_until": "2032-03-15",
                "full_name": "Шевченко Тарас Григорович",
                "birth_date": "1990-05-20",
                "gender": "Ч",
                "inn": "1234567890"
            }
        }
    }
}

# ==================== API Routes ====================

@router.get("/mock/edr/{edrpou}")
async def get_edr_data(edrpou: str) -> Dict[str, Any]:
    """Mock ЄДР API - Дані про ФОП/Компанії"""
    logger.info("EDR mock API called", edrpou=edrpou)
    
    if edrpou not in MOCK_EDR_DATA:
        raise HTTPException(status_code=404, detail="ЄДРПОУ не знайдено в реєстрі")
    
    return MOCK_EDR_DATA[edrpou]


@router.get("/mock/tax/{inn}")
async def get_tax_data(inn: str) -> Dict[str, Any]:
    """Mock Tax API - Податкові дані"""
    logger.info("Tax mock API called", inn=inn)
    
    if inn not in MOCK_TAX_DATA:
        raise HTTPException(status_code=404, detail="РНОКПП не знайдено")
    
    return MOCK_TAX_DATA[inn]


@router.get("/mock/vehicle/{plate}")
async def get_vehicle_data(plate: str) -> Dict[str, Any]:
    """Mock Vehicle Registry - Дані про транспорт"""
    logger.info("Vehicle mock API called", plate=plate)
    
    if plate not in MOCK_VEHICLE_DATA:
        # Default mock для demo
        return {
            "license_plate": plate,
            "vin": "MOCK" + plate.replace(" ", ""),
            "vehicle": {"brand": "Mock Brand", "model": "Mock Model", "year": 2020},
            "owner": {"inn": "0000000000", "name": "Mock Owner"}
        }
    
    return MOCK_VEHICLE_DATA[plate]


@router.get("/mock/diia/documents/{doc_type}")
async def get_diia_document(doc_type: str, inn: str) -> Dict[str, Any]:
    """Mock Diia Documents API"""
    logger.info("Diia docs mock API called", doc_type=doc_type, inn=inn)
    
    if doc_type not in MOCK_DIIA_DOCS:
        raise HTTPException(status_code=400, detail=f"Тип документу '{doc_type}' не підтримується")
    
    if inn not in MOCK_DIIA_DOCS[doc_type]:
        raise HTTPException(status_code=404, detail="Документ не знайдено")
    
    return MOCK_DIIA_DOCS[doc_type][inn]


# ==================== Subsidy Check ====================

class SubsidyRequest(BaseModel):
    inn: str
    full_name: str
    family_size: int
    total_monthly_income: float
    utilities_cost: float


@router.post("/mock/subsidies/check")
async def check_subsidy_eligibility(request: SubsidyRequest) -> Dict[str, Any]:
    """Mock Subsidy API - Перевірка права на субсидію"""
    logger.info("Subsidy check called", inn=request.inn)
    
    # Simple mock calculation
    income_threshold = 10000
    coverage_percentage = 35
    
    eligible = request.utilities_cost > (request.total_monthly_income * 0.15)
    subsidy_amount = (request.utilities_cost - request.total_monthly_income * 0.15) * (coverage_percentage / 100) if eligible else 0
    
    return {
        "eligible": eligible,
        "subsidy_amount": round(subsidy_amount, 2),
        "coverage_percentage": coverage_percentage,
        "calculation": {
            "total_utilities": request.utilities_cost,
            "income_threshold": income_threshold,
            "formula": f"({request.utilities_cost} - {request.total_monthly_income} * 0.15) * 0.{coverage_percentage}"
        },
        "next_steps": [
            {"step": "submit_application", "deeplink": "/services/subsidies/apply"},
            {"step": "upload_documents", "required_docs": ["utility_bills", "income_statement"]}
        ]
    }


# ==================== Land Cadastre ====================

@router.get("/mock/land/{cadastral_number}")
async def get_land_data(cadastral_number: str) -> Dict[str, Any]:
    """Mock Land Cadastre API"""
    logger.info("Land cadastre called", cadastral_number=cadastral_number)
    
    # Default mock response
    return {
        "cadastral_number": cadastral_number,
        "area": 0.25,
        "area_unit": "га",
        "location": {"region": "Київська область", "district": "Бориспільський район"},
        "purpose": "Для індивідуального садівництва",
        "ownership": {
            "type": "private",
            "owner": {"inn": "1234567890", "name": "Mock Owner"},
            "acquisition_date": "2018-06-12"
        },
        "valuation": {"normative_value": 250000, "currency": "UAH"}
    }
