// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title YanaDiia Transparent Audit Contract
 * @author Be Transparent Team
 * @notice Смарт-контракт для аудиту AI-генерованих flow у державних послугах
 * @dev Використовується для запису хешів BRD та flow в незмінний реєстр
 */
contract YanaDiiaAudit {
    // Структура запису про згенерований flow
    struct FlowRecord {
        string flowId;          // Унікальний ID flow (наприклад, "flow-2025-001")
        string brdHash;         // SHA256 хеш BRD документу
        address generator;      // Адреса, яка викликала генерацію
        uint256 timestamp;      // Час генерації (Unix timestamp)
        string ipfsCid;         // CID на IPFS з повними даними
        string description;     // Короткий опис (наприклад, "Виплата 1000 грн для ВПО")
    }
    
    // Мапа flowId → FlowRecord
    mapping(string => FlowRecord) public flows;
    
    // Подія для відстеження генерації
    event FlowGenerated(
        string indexed flowId,
        string brdHash,
        address indexed generator,
        uint256 timestamp
    );
    
    // Подія для відстеження пакетної генерації
    event FlowsBatchGenerated(
        string[] flowIds,
        string batchHash,
        address indexed generator,
        uint256 timestamp
    );
    
    // Адреса власника (Мінцифра)
    address public owner;
    
    // Чи можна генерувати нові flow
    bool public paused;
    
    // Модифікатор: тільки власник
    modifier onlyOwner() {
        require(msg.sender == owner, "Тільки власник може виконати цю операцію");
        _;
    }
    
    // Модифікатор: контракт не на паузі
    modifier whenNotPaused() {
        require(!paused, "Контракт на паузі");
        _;
    }
    
    /**
     * @dev Конструктор встановлює власника
     */
    constructor() {
        owner = msg.sender;
        paused = false;
    }
    
    /**
     * @notice Записати новий згенерований flow
     * @param _flowId Унікальний ID flow
     * @param _brdHash SHA256 хеш BRD документу
     * @param _ipfsCid CID на IPFS з повними даними
     * @param _description Короткий опис flow
     */
    function recordFlow(
        string memory _flowId,
        string memory _brdHash,
        string memory _ipfsCid,
        string memory _description
    ) public whenNotPaused {
        require(bytes(flows[_flowId].flowId).length == 0, "Flow з таким ID вже існує");
        require(bytes(_flowId).length > 0, "Flow ID не може бути порожнім");
        require(bytes(_brdHash).length > 0, "BRD hash не може бути порожнім");
        
        flows[_flowId] = FlowRecord({
            flowId: _flowId,
            brdHash: _brdHash,
            generator: msg.sender,
            timestamp: block.timestamp,
            ipfsCid: _ipfsCid,
            description: _description
        });
        
        emit FlowGenerated(_flowId, _brdHash, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Пакетна генерація flow (дешевше, ніж окремі транзакції)
     * @param _flowIds Масив ID flow
     * @param _brdHashes Масив хешів BRD
     * @param _ipfsCids Масив CID на IPFS
     * @param _descriptions Масив описів
     * @param _batchHash Загальний хеш пакету (для верифікації цілості)
     */
    function recordFlowsBatch(
        string[] memory _flowIds,
        string[] memory _brdHashes,
        string[] memory _ipfsCids,
        string[] memory _descriptions,
        string memory _batchHash
    ) public whenNotPaused {
        require(_flowIds.length > 0, "Масив flowIds не може бути порожнім");
        require(
            _flowIds.length == _brdHashes.length && 
            _flowIds.length == _ipfsCids.length && 
            _flowIds.length == _descriptions.length,
            "Масиви мають бути однакової довжини"
        );
        
        // Записуємо кожен flow
        for (uint i = 0; i < _flowIds.length; i++) {
            require(bytes(flows[_flowIds[i]].flowId).length == 0, "Flow вже існує");
            
            flows[_flowIds[i]] = FlowRecord({
                flowId: _flowIds[i],
                brdHash: _brdHashes[i],
                generator: msg.sender,
                timestamp: block.timestamp,
                ipfsCid: _ipfsCids[i],
                description: _descriptions[i]
            });
        }
        
        emit FlowsBatchGenerated(_flowIds, _batchHash, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Перевірити, чи існує flow
     * @param _flowId ID flow для перевірки
     * @return true якщо flow існує, false якщо ні
     */
    function verifyFlow(string memory _flowId) public view returns (bool) {
        return flows[_flowId].timestamp != 0;
    }
    
    /**
     * @notice Отримати запис flow
     * @param _flowId ID flow
     * @return Повний запис FlowRecord
     */
    function getFlow(string memory _flowId) public view returns (FlowRecord memory) {
        require(flows[_flowId].timestamp != 0, "Flow не існує");
        return flows[_flowId];
    }
    
    /**
     * @notice Пауза генерації (на випадок атаки)
     */
    function pause() public onlyOwner {
        paused = true;
    }
    
    /**
     * @notice Відновлення генерації
     */
    function unpause() public onlyOwner {
        paused = false;
    }
    
    /**
     * @notice Зміна власника (наприклад, передача Мінцифрі)
     * @param _newOwner Нова адреса власника
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Нова адреса не може бути нульовою");
        owner = _newOwner;
    }
}
