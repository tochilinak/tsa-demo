const OP_WITHDRAW = stringCrc32("op::withdraw");
const OP_PAYOUT = stringCrc32("op::payout");

global ctxOwner: address;
global ctxNonce: int;

fun loadData() {
    var ds = contract.getData().beginParse();

    ctxOwner = ds.loadAddress();
    ctxNonce = ds.loadUint(64);

    ds.assertEnd();
}

fun checkOwner(sender: address) {
    assert(sender.bitsEqual(ctxOwner)) throw 501;
}

fun onInternalMessage(myBalance: int, msgValue: int, inMsgFull: cell, inMsgBody: slice) {
    if (inMsgBody.isEmpty()) { // ignore all empty messages
        return;
    }

    var cs: slice = inMsgFull.beginParse();
    val flags: int = cs.loadUint(4);
    if (flags & 1) { // ignore all bounced messages
        return;
    }
    val senderAddress: address = cs.loadAddress();

    loadData(); 

    val op: int = inMsgBody.loadUint(32); 

    if (op == OP_WITHDRAW) {
        checkOwner(senderAddress);
        
        val msgBody = beginCell()
            .storeUint(OP_PAYOUT, 32)
            .endCell();

        val msg: builder = beginCell()
            .storeUint(0x18, 6)
            .storeAddress(senderAddress)
            .storeCoins(0)
            .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .storeRef(msgBody);

        sendRawMessage(msg.endCell(), 128);

        return;
    }
}

get fun owner(): address {
    loadData();
    return ctxOwner;
}

get fun nonce(): int {
    loadData();
    return ctxNonce;
}
