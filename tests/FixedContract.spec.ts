import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { FixedContract } from '../wrappers/FixedContract';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('FixedContract', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('FixedContract');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let fixedContract: SandboxContract<FixedContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        fixedContract = blockchain.openContract(FixedContract.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await fixedContract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fixedContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and fixedContract are ready to use
    });
});
