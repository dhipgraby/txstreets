export const aboutOptimisticRollup = {
    html: `<div class="ta-l">Optimistic Rollups (ORs) are one type of layer 2 constructions that do not run on Ethereum's base layer but on top of it. This enables running smart contracts at scale while still being secured by Ethereum. These constructions resemble Plasma, but trade the almost infinite scalability of Plasma to run an EVM compatible Virtual Machine called OVM (Optimistic Virtual Machine) which enables ORs to run anything Ethereum can.
    The name Optimistic Rollups originates from how the solution works. 'Optimistic' is used because aggregators publish only the bare minimum information needed with no proofs, assuming the aggregators run without commiting frauds, and only providing proofs in case of fraud. 'Rollups' is used because transactions are commited to main chain in bundles (that is, they are rolled-up).
    </div>`,
    title: 'Optimistic Rollups',
    link: 'https://blog.thirdweb.com/what-is-an-optimistic-rollup/',
    name: 'rollup',
}

export const aboutBlockchain = {
    html: `<div class="ta-l">
    A blockchain is a public ledger of transactions that is maintained and verified by a decentralized, peer-to-peer network of computers that adhere to a consensus mechanism to confirm data. Each computer in a blockchain network maintains its own copy of the shared record, making it nearly impossible for a single computer to alter any past transactions or for malicious actors to overwhelm the network. Sufficiently decentralized blockchains do not rely on centralized authorities or intermediaries to transact globally, securely, verifiably, and quickly, making technology like cryptocurrency possible.
    </div>`,
    title: 'Blockchain',
    link: 'https://en.wikipedia.org/wiki/Blockchain',
    name: 'blockchain',
}

export const aboutSegWit = {
    html: `<div class="ta-l">
    Segregated Witness (SegWit) is the name of a soft fork that was carried out on the Bitcoin network which changed the transaction format of the protocol. Segwit separates signature data from transaction data within the blockchain to increase the total amount of data within a specific block. By rearranging the data contained in each block more efficiently, more space is freed up which allows for the inclusion of additional data. SegWit is capable of increasing Bitcoin's block size limit from 1MB to 2MB and was designed to mitigate the blockchain size limitation issues that periodically slow down transaction speeds on the Bitcoin network. This is accomplished by 'segregating' the transaction into two segments by removing the unlocking signature's 'witness' data from the original portion and appending it as a separate structure at the end of the block.
    </div>`,
    title: 'SegWit (Segregated Witness)',
    link: 'https://en.wikipedia.org/wiki/SegWit',
    name: 'blockchain',
}


