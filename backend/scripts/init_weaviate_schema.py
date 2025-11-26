"""
Weaviate Schema Initialization для Yana.Diia.AI
3 критичні схеми для RAG-системи
"""
import weaviate
from weaviate.classes.config import Configure, Property, DataType
import os
from dotenv import load_dotenv

load_dotenv()

def init_weaviate_client():
    """Initialize Weaviate client"""
    client = weaviate.connect_to_local(
        host=os.getenv("WEAVIATE_URL", "http://127.0.0.1:8080")
    )
    print(f"✅ Connected to Weaviate: {client.is_ready()}")
    return client


def create_diia_flows_schema(client):
    """
    Schema 1: DiiaFlows
    Зберігання структур послуг Дія (з flow_data.json)
    """
    
    if client.collections.exists("DiiaFlows"):
        client.collections.delete("DiiaFlows")
        print("🗑️ Deleted existing DiiaFlows collection")
    
    client.collections.create(
        name="DiiaFlows",
        description="Diia service flow structures from flow_data.json",
        properties=[
            Property(
                name="service_name",
                data_type=DataType.TEXT,
                description="Назва послуги (напр. 'fop_registration')"
            ),
            Property(
                name="service_name_ua",
                data_type=DataType.TEXT,
                description="Українська назва послуги"
            ),
            Property(
                name="goal",
                data_type=DataType.TEXT,
                description="Ціль послуги (goal field)"
            ),
            Property(
                name="entry_point",
                data_type=DataType.TEXT,
                description="Точка входу (entry_point field)"
            ),
            Property(
                name="steps",
                data_type=DataType.TEXT,
                description="JSON-структура кроків флоу"
            ),
            Property(
                name="total_steps",
                data_type=DataType.INT,
                description="Кількість кроків"
            ),
            Property(
                name="required_apis",
                data_type=DataType.TEXT_ARRAY,
                description="Список необхідних API (напр. ['edr', 'tax'])"
            ),
        ],
        vectorizer_config=Configure.Vectorizer.none()  # Ми використовуємо власні embeddings
    )
    
    print("✅ Created DiiaFlows schema")


def create_diia_components_schema(client):
    """
    Schema 2: DiiaComponents
    Зберігання метаданих компонентів Diia Design System
    """
    
    if client.collections.exists("DiiaComponents"):
        client.collections.delete("DiiaComponents")
        print("🗑️ Deleted existing DiiaComponents collection")
    
    client.collections.create(
        name="DiiaComponents",
        description="Diia Design System UI components metadata",
        properties=[
            Property(
                name="component_name",
                data_type=DataType.TEXT,
                description="Назва компонента (role field, напр. 'eligibility_banner')"
            ),
            Property(
                name="display_name",
                data_type=DataType.TEXT,
                description="Українська назва для відображення"
            ),
            Property(
                name="category",
                data_type=DataType.TEXT,
                description="Категорія (banner, form, modal, card, navigation)"
            ),
            Property(
                name="usage_context",
                data_type=DataType.TEXT,
                description="Коли використовувати цей компонент (UX guidelines)"
            ),
            Property(
                name="props_schema",
                data_type=DataType.TEXT,
                description="JSON schema пропсів компонента"
            ),
            Property(
                name="accessibility_level",
                data_type=DataType.TEXT,
                description="WCAG level (A, AA, AAA)"
            ),
            Property(
                name="example_code",
                data_type=DataType.TEXT,
                description="Приклад використання (React/TypeScript)"
            ),
            Property(
                name="diia_kit_url",
                data_type=DataType.TEXT,
                description="Посилання на diia-ui-kit documentation"
            ),
        ],
        vectorizer_config=Configure.Vectorizer.none()
    )
    
    print("✅ Created DiiaComponents schema")


def create_api_mock_schema(client):
    """
    Schema 3: APIMock
    Зберігання переліку даних доступних через державні API
    Для реалізації API Dependency Checking (Judge штрафує за ручне введення)
    """
    
    if client.collections.exists("APIMock"):
        client.collections.delete("APIMock")
        print("🗑️ Deleted existing APIMock collection")
    
    client.collections.create(
        name="APIMock",
        description="Available data from government APIs (for dependency checking)",
        properties=[
            Property(
                name="api_name",
                data_type=DataType.TEXT,
                description="Назва API (edr, tax, vehicle, social, land)"
            ),
            Property(
                name="api_name_ua",
                data_type=DataType.TEXT,
                description="Українська назва реєстру"
            ),
            Property(
                name="available_fields",
                data_type=DataType.TEXT_ARRAY,
                description="Поля доступні автоматично (напр. ['inn', 'fop_status', 'registration_date'])"
            ),
            Property(
                name="field_descriptions",
                data_type=DataType.TEXT,
                description="JSON словник описів полів"
            ),
            Property(
                name="endpoint",
                data_type=DataType.TEXT,
                description="Mock endpoint (напр. '/api/mock/edr/{edrpou}')"
            ),
            Property(
                name="requires_auth",
                data_type=DataType.BOOL,
                description="Чи потрібна авторизація (Diia.Signature)"
            ),
        ],
        vectorizer_config=Configure.Vectorizer.none()
    )
    
    print("✅ Created APIMock schema")


def seed_critical_components(client):
    """
    Завантажити 5 критичних компонентів Diia Design System
    """
    collection = client.collections.get("DiiaComponents")
    
    critical_components = [
        {
            "component_name": "eligibility_banner",
            "display_name": "Банер Перевірки Права",
            "category": "banner",
            "usage_context": "Показати результат автоматичної перевірки права на послугу через API. Використовувати замість ручного введення даних для підтвердження права.",
            "props_schema": '{"eligible": "boolean", "title": "string", "message": "string", "actionLabel": "string"}',
            "accessibility_level": "AA",
            "example_code": "<EligibilityBanner eligible={true} title='Ви маєте право' message='Перевірка через ЄДР пройдена' actionLabel='Продовжити' />",
            "diia_kit_url": "https://github.com/diia-open-source/diia-ui-kit"
        },
        {
            "component_name": "error_modal",
            "display_name": "Модальне Вікно Помилки",
            "category": "modal",
            "usage_context": "Показати критичну помилку або блокуючу ситуацію. Вимагає дії користувача. НЕ використовувати для warning або info повідомлень.",
            "props_schema": '{"title": "string (required)", "description": "string", "primaryAction": "object", "secondaryAction": "object"}',
            "accessibility_level": "AA",
            "example_code": "<ErrorModal title='Помилка' description='Сервіс недоступний' primaryAction={{label: 'Спробувати ще', onClick: retry}} />",
            "diia_kit_url": "https://github.com/diia-open-source/diia-ui-kit"
        },
        {
            "component_name": "form_step",
            "display_name": "Крок Форми",
            "category": "form",
            "usage_context": "Багатокроковий флоу з формами. Містить поля, валідацію, навігацію. Використовувати для збору даних які НЕ доступні через API.",
            "props_schema": '{"stepNumber": "number", "totalSteps": "number", "fields": "array", "onNext": "function", "onBack": "function"}',
            "accessibility_level": "AA",
            "example_code": "<FormStep stepNumber={1} totalSteps={4} fields={[{name: 'kved', type: 'select'}]} onNext={handleNext} />",
            "diia_kit_url": "https://github.com/diia-open-source/diia-ui-kit"
        },
        {
            "component_name": "recipient_card_single",
            "display_name": "Картка Отримувача",
            "category": "card",
            "usage_context": "Відобразити дані отримувача послуги, попередньо завантажені через API (ПІБ, РНОКПП, адреса). НЕ дозволяти редагування якщо дані з реєстру.",
            "props_schema": '{"fullName": "string", "inn": "string", "address": "string", "editable": "boolean (default: false)"}',
            "accessibility_level": "AA",
            "example_code": "<RecipientCardSingle fullName='Шевченко Т.Г.' inn='1234567890' address='Київ, вул. Хрещатик, 1' editable={false} />",
            "diia_kit_url": "https://github.com/diia-open-source/diia-ui-kit"
        },
        {
            "component_name": "unavailable_banner",
            "display_name": "Банер Недоступності",
            "category": "banner",
            "usage_context": "Показати що послуга тимчасово недоступна через технічні причини або відсутність даних в реєстрі. Використовувати коли API повертає помилку.",
            "props_schema": '{"title": "string", "reason": "string", "estimatedRestore": "string"}',
            "accessibility_level": "AA",
            "example_code": "<UnavailableBanner title='Послуга недоступна' reason='Технічні роботи в реєстрі ЄДР' estimatedRestore='12:00' />",
            "diia_kit_url": "https://github.com/diia-open-source/diia-ui-kit"
        }
    ]
    
    for component in critical_components:
        collection.data.insert(component)
    
    print(f"✅ Seeded {len(critical_components)} critical Diia components")


def seed_api_mocks(client):
    """
    Завантажити інформацію про доступні державні API
    """
    collection = client.collections.get("APIMock")
    
    api_mocks = [
        {
            "api_name": "edr",
            "api_name_ua": "Єдиний Державний Реєстр",
            "available_fields": ["edrpou", "name", "type", "status", "registration_date", "kved", "address"],
            "field_descriptions": '{"edrpou": "ЄДРПОУ код", "name": "Повна назва", "type": "fop/tov", "status": "active/closed"}',
            "endpoint": "/api/mock/edr/{edrpou}",
            "requires_auth": False
        },
        {
            "api_name": "tax",
            "api_name_ua": "Державна Податкова Служба",
            "available_fields": ["inn", "taxpayer_type", "has_debt", "last_declaration", "simplified_tax"],
            "field_descriptions": '{"inn": "РНОКПП", "has_debt": "Наявність боргів", "simplified_tax": "Спрощена система"}',
            "endpoint": "/api/mock/tax/{inn}",
            "requires_auth": True
        },
        {
            "api_name": "vehicle",
            "api_name_ua": "Реєстр Транспортних Засобів",
            "available_fields": ["license_plate", "vin", "brand", "model", "year", "owner_inn"],
            "field_descriptions": '{"license_plate": "Номерний знак", "vin": "VIN код", "owner_inn": "РНОКПП власника"}',
            "endpoint": "/api/mock/vehicle/{plate}",
            "requires_auth": False
        },
        {
            "api_name": "diia_docs",
            "api_name_ua": "Документи Дія",
            "available_fields": ["full_name", "inn", "birth_date", "passport_series", "passport_number"],
            "field_descriptions": '{"full_name": "ПІБ громадянина", "inn": "РНОКПП", "birth_date": "Дата народження"}',
            "endpoint": "/api/mock/diia/documents/{type}",
            "requires_auth": True
        },
        {
            "api_name": "subsidies",
            "api_name_ua": "Реєстр Субсидій",
            "available_fields": ["inn", "family_size", "monthly_income", "utilities_cost", "eligible"],
            "field_descriptions": '{"eligible": "Право на субсидію", "monthly_income": "Дохід на місяць"}',
            "endpoint": "/api/mock/subsidies/check",
            "requires_auth": True
        }
    ]
    
    for api_mock in api_mocks:
        collection.data.insert(api_mock)
    
    print(f"✅ Seeded {len(api_mocks)} government API mocks")


def main():
    """Initialize all Weaviate schemas for Yana RAG system"""
    print("🚀 Initializing Weaviate schemas for Yana.Diia.AI RAG\n")
    
    client = init_weaviate_client()
    
    try:
        # Create schemas
        create_diia_flows_schema(client)
        create_diia_components_schema(client)
        create_api_mock_schema(client)
        
        print("\n" + "="*60)
        print("📦 Seeding initial data...")
        print("="*60 + "\n")
        
        # Seed initial data
        seed_critical_components(client)
        seed_api_mocks(client)
        
        print("\n" + "="*60)
        print("✅ Weaviate RAG initialization complete!")
        print("="*60)
        print(f"\nRAG is ready at: {os.getenv('WEAVIATE_URL', 'http://127.0.0.1:8080')}")
        print("\nCollections created:")
        print("  • DiiaFlows (service flow structures)")
        print("  • DiiaComponents (5 critical UI components)")
        print("  • APIMock (5 government API specs)")
        
    finally:
        client.close()


if __name__ == "__main__":
    main()
