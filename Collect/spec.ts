import { LiveObject, Spec, Property, BlockHash, Address, BlockNumber, Timestamp, ChainId, SpecEvent } from 'https://esm.sh/@spec.dev/core@0.0.28'
import { OnLensHub } from '../shared/events.ts'

/**
 * A Lens Collect NFT.
 */
@Spec({
    namespace: 'lens',
    name: 'Collect',
    table: 'lens.collects',
    uniqueBy: ['profileId', 'pubId', 'collectNftId', 'chainId']
})
class Collect extends LiveObject {
    // The profile token id of the publication being collected.
    @Property()
    profileId: number

    // The id of the publication being collected.
    @Property()
    pubId: number

    // The token id of the collect NFT.
    @Property()
    collectNftId: number

    // The address of the collector.
    @Property()
    collectorAddress: Address
    
    // The block timestamp in which the collect NFT was created.
    @Property({ update: false })
    createdAt: Timestamp

    // The block hash in which the collect NFT was last updated.
    @Property()
    blockHash: BlockHash

    // The block number in which the collect NFT was last updated.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the collect NFT was last updated.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId

    //-----------------------------------------------------
    //  EVENT HANDLERS
    //-----------------------------------------------------

    @OnLensHub('CollectNFTTransferred')
    onCollect(event: SpecEvent) {
        this.profileId = event.data.profileId
        this.pubId = event.data.pubId
        this.collectNftId = event.data.collectNFTId
        this.collectorAddress = event.data.to
        this.createdAt = event.data.blockTimestamp
        this.blockHash = event.data.blockHash
        this.blockNumber = event.data.blockNumber
        this.blockTimestamp = event.data.blockTimestamp
        this.chainId = event.data.chainId
    }
}

export default Collect