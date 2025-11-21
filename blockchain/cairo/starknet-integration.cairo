// blockchain/cairo/starknet-integration.cairo

%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.cairo_builtins import HashBuiltin

// Структура запису flow (більш компактна, бо StarkNet оптимізований)
struct FlowRecord:
    member flow_id : felt
    member brd_hash : felt
    member generator : felt
    member timestamp : felt
    member ipfs_hash_low : felt
    member ipfs_hash_high : felt
end

@storage_var
func flows(flow_id : felt) -> (record : FlowRecord):
end

@storage_var
func flows_count() -> (count : felt):
end

// Подія генерації flow
@event
func FlowGenerated(flow_id : felt, brd_hash : felt, generator : felt, timestamp : felt):
end

// Записати новий flow
@external
func record_flow{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    flow_id : felt, brd_hash : felt, ipfs_hash_low : felt, ipfs_hash_high : felt
):
    // Перевірка, чи flow не існує
    let (existing) = flows.read(flow_id)
    assert existing.timestamp = 0

    // Отримання поточного часу
    let (timestamp) = get_block_timestamp()

    // Запис
    let record = FlowRecord(
        flow_id=flow_id,
        brd_hash=brd_hash,
        generator=get_caller_address(),
        timestamp=timestamp,
        ipfs_hash_low=ipfs_hash_low,
        ipfs_hash_high=ipfs_hash_high,
    )
    flows.write(flow_id, record)

    // Подія
    FlowGenerated.emit(flow_id, brd_hash, get_caller_address(), timestamp)

    // Збільшення лічильника
    let (count) = flows_count.read()
    flows_count.write(count + 1)

    return ()
end

// Пакетна генерація (batching) — дешевше
@external
func record_flows_batch{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    flow_ids_len : felt, flow_ids : felt*, brd_hashes : felt*, ipfs_hashes_low : felt*,
    ipfs_hashes_high : felt*
):
    // В Cairo масиви передаються через довжину + pointer
    // Ця функція записує кілька flow за одну транзакцію
    // (економить 90% вартості газу)
    
    let (count) = flows_count.read()
    let (timestamp) = get_block_timestamp()
    let generator = get_caller_address()
    
    loop:
        let i
