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

export type VulnerableContractConfig = {};

export function vulnerableContractConfigToCell(config: VulnerableContractConfig): Cell {
    return beginCell().endCell();
}

export class VulnerableContract implements Contract {
    abi: ContractABI = { name: 'VulnerableContract' }

    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new VulnerableContract(address);
    }

    static createFromConfig(config: VulnerableContractConfig, code: Cell, workchain = 0) {
        const data = vulnerableContractConfigToCell(config);
        const init = { code, data };
        return new VulnerableContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
