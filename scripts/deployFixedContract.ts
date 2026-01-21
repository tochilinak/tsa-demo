import { toNano } from '@ton/core';
import { FixedContract } from '../wrappers/FixedContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const fixedContract = provider.open(FixedContract.createFromConfig({}, await compile('FixedContract')));
    console.log((await compile('FixedContract')).toBoc({ idx: false }).toString('hex'));

    await fixedContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(fixedContract.address);

    // run methods on `fixedContract`
}
