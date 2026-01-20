import { toNano } from '@ton/core';
import { VulnerableContract } from '../wrappers/VulnerableContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const vulnerableContract = provider.open(VulnerableContract.createFromConfig({}, await compile('VulnerableContract')));

    await vulnerableContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(vulnerableContract.address);

    // run methods on `vulnerableContract`
}
