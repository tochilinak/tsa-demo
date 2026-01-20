import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { VulnerableContract } from '../wrappers/VulnerableContract';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('VulnerableContract', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('VulnerableContract');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let vulnerableContract: SandboxContract<VulnerableContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        vulnerableContract = blockchain.openContract(VulnerableContract.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await vulnerableContract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: vulnerableContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and vulnerableContract are ready to use
    });
});
