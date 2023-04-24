import { LiveObject, Spec, Property, Address, Timestamp, OnEvent, Event } from '@spec.dev/core'

/**
 * A Lens Collect NFT.
 */
@Spec({
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
    @Property({ canUpdate: false })
    createdAt: Timestamp

    // ==== Event Handlers ===================

    @OnEvent('lens.LensHubProxy.CollectNFTTransferred')
    onCollect(event: Event) {
        this.profileId = event.data.profileId
        this.pubId = event.data.pubId
        this.collectNftId = event.data.collectNFTId
        this.collectorAddress = event.data.to
        this.createdAt = event.data.blockTimestamp
    }
}

export default Collect