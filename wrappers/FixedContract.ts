import {
    Address,
    beginCell,
    Cell,
    Contract,
    ContractABI,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode
} from '@ton/core';

export type FixedContractConfig = {};

export function fixedContractConfigToCell(config: FixedContractConfig): Cell {
    return beginCell().endCell();
}

export class FixedContract implements Contract {
    abi: ContractABI = { name: 'FixedContract' }

    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new FixedContract(address);
    }

    static createFromConfig(config: FixedContractConfig, code: Cell, workchain = 0) {
        const data = fixedContractConfigToCell(config);
        const init = { code, data };
        return new FixedContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
