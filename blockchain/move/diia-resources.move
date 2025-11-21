// blockchain/
module diia::yana_flows {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct FlowResource has key {
        id: UID,
        flow_id: String,
        brd_hash: String,
        timestamp: u64,
    }

    public fun create_flow(
        flow_id: String,
        brd_hash: String,
        ctx: &mut TxContext
    ) {
        let flow = FlowResource {
            id: object::new(ctx),
            flow_id,
            brd_hash,
            timestamp: tx_context::epoch(ctx),
        };
        // Ресурс передається власнику — не можна скопіювати
        transfer::public_transfer(flow, tx_context::sender(ctx));
    }
}
